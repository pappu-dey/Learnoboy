import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected");

  try {
    console.log("Migrating donor statuses to 'approved'...");
    
    // Update all records where status is 'verified', empty, or missing completely
    const result = await mongoose.connection.collection("donors").updateMany(
      {
        $or: [
          { status: "verified" },
          { status: { $exists: false } },
          { status: "" },
          { status: null }
        ]
      },
      { $set: { status: "approved" } }
    );

    console.log(`🎉 SUCCESS! Migrated ${result.modifiedCount} donor records to 'approved'.`);
  } catch (error: any) {
    console.error("❌ FAILURE during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

migrate().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
