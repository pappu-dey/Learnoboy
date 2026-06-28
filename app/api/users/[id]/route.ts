import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Author from "@/lib/models/Author";
import { getSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  await connectDB();
  const update: Record<string, unknown> = {};

  if (body.role) {
    update.role = body.role;
    
    if (body.role === "writer") {
      update.writerStatus = "approved";
    } else if (body.role === "reader") {
      update.writerStatus = "none";
    }
  }

  if (body.writerStatus) {
    update.writerStatus = body.writerStatus;
    
    if (body.writerStatus === "approved") {
      update.role = "writer";
    } else if (body.writerStatus === "rejected" || body.writerStatus === "needs-review") {
      
      update.role = "reader";
    }
  }

  
  if (typeof body.isVerified === "boolean") {
    update.isVerified = body.isVerified;
    update.verifiedAt = body.isVerified ? new Date() : null;
  }

  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
    select: "-passwordHash -resetToken -resetTokenExpiry",
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  
  if (user.writerStatus === "approved" || user.role === "writer") {
    try {
      const baseSlug = slugify(user.name);
      const existingAuthor = await Author.findOne({ email: user.email });

      if (!existingAuthor) {
        
        let slug = baseSlug;
        const slugTaken = await Author.findOne({ slug });
        if (slugTaken) {
          slug = `${baseSlug}-${Date.now().toString(36)}`;
        }

        
        const app = user.writerApplication;

        await Author.create({
          name: user.name,
          email: user.email,
          slug,
          bio: "",
          avatar: user.avatar || "",
          expertise: app?.expertise || [],
          qualification: app?.qualification || "",
          company: app?.company || "",
          experience: app?.experience || 0,
          social: {},
          articleCount: 0,
          totalViews: 0,
          userId: user._id,
        });
      } else {
        
        const authorUpdate: Record<string, unknown> = {};
        if (user.name && user.name !== existingAuthor.name) {
          authorUpdate.name = user.name;
        }
        if (user.avatar && user.avatar !== existingAuthor.avatar) {
          authorUpdate.avatar = user.avatar;
        }
        
        if (typeof body.isVerified === "boolean") {
          authorUpdate.isVerified = body.isVerified;
          authorUpdate.verifiedAt = body.isVerified ? new Date() : null;
        }
        if (!existingAuthor.userId) {
          authorUpdate.userId = user._id;
        }

        if (Object.keys(authorUpdate).length > 0) {
          await Author.findByIdAndUpdate(existingAuthor._id, authorUpdate);
        }
      }
    } catch (authorErr) {
      
      console.error("[PATCH /api/users/[id]] Author sync failed:", authorErr);
    }
  }

  
  if (typeof body.isVerified === "boolean" && user.role === "writer") {
    try {
      await Author.findOneAndUpdate(
        { email: user.email },
        { isVerified: body.isVerified, verifiedAt: body.isVerified ? new Date() : null }
      );
    } catch (err) {
      console.error("[PATCH /api/users/[id]] Author verification sync failed:", err);
    }
  }

  return NextResponse.json({ success: true, data: user });
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  
  if (id === session.userId) {
    return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
