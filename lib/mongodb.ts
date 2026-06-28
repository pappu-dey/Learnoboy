

import mongoose, { type Mongoose } from "mongoose";




interface MongooseCache {
  
  conn: Mongoose | null;
  
  promise: Promise<Mongoose> | null;
}


declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}






const cache: MongooseCache = (global.__mongooseCache ??= {
  conn: null,
  promise: null,
});




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



let _listenersRegistered = false;

function registerConnectionListeners() {
  if (_listenersRegistered) return;
  _listenersRegistered = true;

  const { connection } = mongoose;

  connection.on("connected", () => {
    
    if (process.env.NODE_ENV !== "production") {
      console.log("[mongodb] ✅ Connected to MongoDB Atlas");
    }
  });

  connection.on("disconnected", () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[mongodb] ⚠️  Disconnected from MongoDB Atlas");
    }
    
    cache.conn = null;
    cache.promise = null;
  });

  connection.on("error", (err: Error) => {
    console.error("[mongodb] ❌ Connection error:", err.message);
    
    cache.conn = null;
    cache.promise = null;
  });
}




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

  
  if (cache.conn) {
    return cache.conn;
  }

  
  registerConnectionListeners();

  
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI!, MONGOOSE_OPTS)
      .then((mongooseInstance) => {
        cache.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err: unknown) => {
        
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

  
  
  cache.conn = await cache.promise;
  return cache.conn;
}


export default connectDB;
