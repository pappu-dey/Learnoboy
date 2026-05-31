/**
 * lib/mongodb.ts
 *
 * Production-ready MongoDB Atlas connection singleton for Next.js App Router.
 *
 * HOW CONNECTION CACHING WORKS
 * ─────────────────────────────
 * Next.js in development mode keeps the Node.js process alive between hot-reloads
 * but *re-executes* module code on every change. Without caching, each hot-reload
 * would open a fresh connection and exhaust the Atlas connection pool.
 *
 * The solution is to store the connection (and its in-flight promise) on the Node.js
 * `global` object, which persists across module re-evaluations. In production, the
 * module is only evaluated once per server instance, so the global cache is an
 * equally effective no-op guard.
 *
 * On Vercel (serverless), each function invocation may or may not reuse the same
 * Node.js sandbox. Caching on `global` maximises connection reuse within a warm
 * sandbox and avoids the overhead of reconnecting on every request.
 *
 * LIFECYCLE
 * ─────────
 *  1. First call  → no cached conn, no pending promise
 *                   → open a new mongoose.connect() and store the promise
 *                   → await the promise, store the resolved connection
 *  2. In-flight   → a connect() is already pending (concurrent requests at cold-start)
 *                   → all callers await the same promise — only ONE connection opens
 *  3. Warm        → `conn` is already set
 *                   → early-return immediately, zero overhead
 *  4. Error       → promise resets to null so the next call retries from scratch
 */

import mongoose, { type Mongoose } from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of the object we park on the Node.js global to survive hot-reloads. */
interface MongooseCache {
  /** The resolved Mongoose instance once connected; null before first connect. */
  conn: Mongoose | null;
  /**
   * The in-flight connect() promise. Allows concurrent cold-start requests to
   * share a single connection attempt instead of racing to open duplicates.
   */
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global namespace.
 *
 * We use a dedicated symbol-like key (`__mongooseCache`) rather than shadowing
 * a name that already exists (e.g. `mongoose`) to avoid accidental collisions.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}



// ─── Bootstrap the global cache ──────────────────────────────────────────────

/**
 * Initialise once. On subsequent hot-reloads the object already exists on
 * `global` so we reuse it (preserving `conn` and `promise`).
 */
const cache: MongooseCache = (global.__mongooseCache ??= {
  conn: null,
  promise: null,
});

// ─── Mongoose options ─────────────────────────────────────────────────────────

/**
 * Connection options tuned for MongoDB Atlas + Vercel serverless:
 *
 * • bufferCommands false  — fail fast if a query runs before connect() resolves;
 *                           avoids silent hangs in serverless cold starts.
 * • maxPoolSize 10        — Atlas M0 (free tier) allows ≤ 500 connections;
 *                           10 per Vercel function instance is a safe default.
 * • minPoolSize 0         — allow the pool to shrink to zero between requests
 *                           so idle functions don't hold Atlas connections.
 * • serverSelectionTimeoutMS 10 000 — give Atlas 10 s to elect a primary
 *                           before throwing (Vercel functions have a 10 s default
 *                           timeout; keep this ≤ that limit).
 * • socketTimeoutMS 45 000        — how long to wait for a query response.
 * • connectTimeoutMS 10 000       — how long to wait for the TCP handshake.
 * • family 4              — prefer IPv4 to avoid DNS lookup delays on Vercel's
 *                           network, where IPv6 may route differently.
 * • heartbeatFrequencyMS 30 000   — probe interval for SDAM; reduces Atlas
 *                           "connection closed" surprises on long-idle functions.
 */
const MONGOOSE_OPTS: mongoose.ConnectOptions = {
  dbName: "learno-boy",
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  connectTimeoutMS: 10_000,
  family: 4,
  heartbeatFrequencyMS: 30_000,
};

// ─── Event listeners (register once, warn on re-registration) ─────────────────

let _listenersRegistered = false;

function registerConnectionListeners() {
  if (_listenersRegistered) return;
  _listenersRegistered = true;

  const { connection } = mongoose;

  connection.on("connected", () => {
    // Avoid noisy logs in production; feel free to swap for your logger.
    if (process.env.NODE_ENV !== "production") {
      console.log("[mongodb] ✅ Connected to MongoDB Atlas");
    }
  });

  connection.on("disconnected", () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[mongodb] ⚠️  Disconnected from MongoDB Atlas");
    }
    // Reset cache so the next request triggers a fresh connect().
    cache.conn = null;
    cache.promise = null;
  });

  connection.on("error", (err: Error) => {
    console.error("[mongodb] ❌ Connection error:", err.message);
    // Reset so the next call retries instead of re-throwing a stale promise.
    cache.conn = null;
    cache.promise = null;
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * connectDB()
 *
 * Call this at the top of any Route Handler, Server Action, or async Server
 * Component that needs database access. It is safe to call concurrently —
 * multiple simultaneous invocations share a single connect() attempt.
 *
 * @returns The connected Mongoose instance.
 * @throws  If MONGODB_URI is missing (thrown at module load, not here) or if
 *          Mongoose cannot reach Atlas within the configured timeout.
 *
 * @example
 * ```ts
 * // app/api/articles/route.ts
 * import { NextResponse } from "next/server";
 * import connectDB from "@/lib/mongodb";
 * import Article from "@/lib/models/Article";
 *
 * export async function GET() {
 *   await connectDB();
 *   const articles = await Article.find({ status: "published" }).lean();
 *   return NextResponse.json({ data: articles });
 * }
 * ```
 */
export async function connectDB(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "[mongodb] MONGODB_URI is not defined.\n" +
      "  • Development : add it to .env.local\n" +
      "  • Production  : add it to your Vercel / hosting environment variables\n" +
      "  Expected format: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"
    );
  }

  // ── Fast path: already connected ──────────────────────────────────────────
  if (cache.conn) {
    return cache.conn;
  }

  // ── Register event listeners exactly once ─────────────────────────────────
  registerConnectionListeners();

  // ── Slow path: initiate a new connection (or join the in-flight one) ──────
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI!, MONGOOSE_OPTS)
      .then((mongooseInstance) => {
        cache.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err: unknown) => {
        // Reset so the next call retries from scratch.
        cache.promise = null;

        const message =
          err instanceof Error ? err.message : String(err);

        throw new Error(
          `[mongodb] Failed to connect to MongoDB Atlas: ${message}\n` +
          "  Check that your MONGODB_URI is correct and your Atlas cluster " +
          "is reachable from this environment."
        );
      });
  }

  // Await the shared promise (resolves immediately if connection succeeded,
  // or propagates the error thrown above to the caller).
  cache.conn = await cache.promise;
  return cache.conn;
}

// Default export for backwards-compatibility with existing service files.
export default connectDB;
