import { channel } from "diagnostics_channel";
import mongoose from "mongoose";


const MONGO_URI = process.env.mongoId!;

if (!MONGO_URI) {
    throw new Error("Mongo Uri is not defined in environment variables")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}


export async function connect() {


    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        mongoose.connect(MONGO_URI)
    }
    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error;
    }
    return cached.conn
}