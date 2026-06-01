import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function inspect() {
  await mongoose.connect(MONGODB_URI!);
  try {
    const donors = await mongoose.connection.collection("donors").find().toArray();
    console.log("--- DONORS IN DB ---");
    console.log(JSON.stringify(donors, null, 2));
    console.log("--------------------");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

inspect().catch(console.error);
