import mongoose from "mongoose";
import { env } from "@/config/env";

export async function dbConnect() {
  try {
    console.log("env.DATABASE_URL", env.DATABASE_URL);
    await mongoose.connect(env.DATABASE_URL);
    console.log("DB connected");
  } catch (error) {
    console.error("error while DB connection: ", error);
    process.exit(1);
  }
}
