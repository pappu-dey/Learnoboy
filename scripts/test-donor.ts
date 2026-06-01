import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Donor } from "../lib/models";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function test() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected");

  try {
    console.log("Attempting to save donor record...");
    const donor = await Donor.create({
      name: "Test Donor Name",
      email: "test-donor@example.com",
    });
    console.log("🎉 SUCCESS! Donor created:", donor);
  } catch (error: any) {
    console.error("❌ FAILURE! Error saving donor:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

test().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
