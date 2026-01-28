import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        cached.promise = null; // reset so next try can retry
        throw err; // 🔴 VERY IMPORTANT
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
