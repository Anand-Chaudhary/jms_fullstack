import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export default async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already to connected to db");
        return;
    }
    try{
        const db = mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = (await db).connections[0].readyState
        console.log("DB connected succesfully");
    } catch(err){
        console.log("DB connection failed: ", err)

        process.exit(1)
    }
}