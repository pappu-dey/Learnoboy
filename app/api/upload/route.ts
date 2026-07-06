import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Upload } from "@/lib/models";
import { optimizeImageBuffer } from "@/lib/utils/imageOptimizer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
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
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/heic",
      "image/heif",
      "image/bmp",
      "image/tiff",
      "image/gif",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Allowed formats: JPG, JPEG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF.",
        },
        { status: 400 }
      );
    }

    // Configurable Max Upload Limit: 10MB
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse folder organization details
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    // Process image buffer in-memory using sharp utility
    let optimized;
    try {
      optimized = await optimizeImageBuffer(buffer);
    } catch (err) {
      console.error("[sharp optimization error]", err);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process image. The file may be corrupt or unsupported.",
        },
        { status: 500 }
      );
    }

    // Upload optimized WebP buffer to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "learno-boy/articles",
            resource_type: "image",
            format: "webp",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed: no result"));
          }
        );
        uploadStream.end(optimized.buffer);
      }
    );

    // Establish DB connection and log upload metadata record
    await connectDB();
    const uploadRecord = await Upload.create({
      originalFilename: file.name,
      optimizedFilename: `${uploadResult.public_id.split("/").pop()}.webp`,
      filePath: uploadResult.secure_url,
      width: optimized.width,
      height: optimized.height,
      mimeType: "image/webp",
      fileSize: optimized.buffer.length,
      altText: file.name.replace(/\.[^.]+$/, ""), // default alt text
      blurPlaceholder: optimized.blurPlaceholder,
      responsiveSizes: [], // Cloudinary handles resizing dynamically via URL params
      articleId: articleId || undefined,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadRecord._id, // Map database ID as unique reference identifier
      width: optimized.width,
      height: optimized.height,
      blurPlaceholder: optimized.blurPlaceholder,
    });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
