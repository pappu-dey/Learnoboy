import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Upload } from "@/lib/models";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  // Enforce session check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Supported formats
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // Max Size: 5MB
    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let optimizedBuffer;
    try {
      optimizedBuffer = await sharp(buffer)
        .rotate() // rotate based on EXIF
        .resize(400, 400, {
          fit: "cover",
          position: "entropy", // Crop around interesting areas like faces
        })
        .webp({ quality: 80, effort: 5 })
        .toBuffer();
    } catch (err) {
      console.error("[sharp avatar optimization error]", err);
      return NextResponse.json(
        { success: false, error: "Failed to process profile photo." },
        { status: 500 }
      );
    }

    // Upload optimized WebP buffer to Cloudinary, overwriting and invalidating previous avatar
    const publicId = `user_${session.userId}`;
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "learno-boy/avatars",
            public_id: publicId,
            overwrite: true,
            invalidate: true,
            resource_type: "image",
            format: "webp",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed: no result"));
          }
        );
        uploadStream.end(optimizedBuffer);
      }
    );

    // Log avatar details in Upload database collection
    await connectDB();
    const query = { filePath: uploadResult.secure_url };
    const update = {
      originalFilename: file.name,
      optimizedFilename: `${publicId}.webp`,
      filePath: uploadResult.secure_url,
      width: 400,
      height: 400,
      mimeType: "image/webp",
      fileSize: optimizedBuffer.length,
      altText: `${session.name}'s avatar`,
      responsiveSizes: [],
      createdAt: new Date(),
    };
    
    await Upload.findOneAndUpdate(query, update, { upsert: true, new: true });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("[POST /api/upload/avatar]", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
