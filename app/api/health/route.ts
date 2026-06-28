import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";


export async function GET() {
  const checks: Record<string, string> = {};

  
  const required = [
    "MONGODB_URI",
    "SESSION_SECRET",
    "SUPERADMIN_EMAIL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "NEXT_PUBLIC_BASE_URL",
  ];

  for (const key of required) {
    checks[key] = process.env[key] ? "✅ set" : "❌ MISSING";
  }

  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  if (process.env.NODE_ENV === "production" && baseUrl.includes("localhost")) {
    checks["NEXT_PUBLIC_BASE_URL"] = "⚠️ still set to localhost (change to your Vercel URL)";
  }

  
  let dbStatus = "⏳ not tested";
  let databaseName = "";
  let counts: Record<string, number> = {};

  try {
    const conn = await connectDB();
    dbStatus = "✅ connected";
    databaseName = conn.connection.name; 
    
    
    const [articles, categories, tags, users] = await Promise.all([
      conn.connection.db?.collection("articles").countDocuments() ?? 0,
      conn.connection.db?.collection("categories").countDocuments() ?? 0,
      conn.connection.db?.collection("tags").countDocuments() ?? 0,
      conn.connection.db?.collection("users").countDocuments() ?? 0,
    ]);
    counts = { articles, categories, tags, users };
  } catch (err) {
    dbStatus = `❌ FAILED — ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    status: "ok",
    env: process.env.NODE_ENV,
    checks,
    db: dbStatus,
    database: databaseName || undefined,
    counts: Object.keys(counts).length ? counts : undefined,
  });
}
