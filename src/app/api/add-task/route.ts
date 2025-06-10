import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, title, description } = await request.json()
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        if (user?.role !== "Volunteer") {
            return Response.json({
                success: false,
                message: "Task cannot be assigned to admin"
            }, { status: 405 })
        }

        user.tasks.push({title, description, assignedTo: user._id as mongoose.Types.ObjectId})

        await user.save();

        // Save the updated user document
        await user.save();

        return Response.json({
            success: true,
            message: "Task assigned successfully"
        });

    } catch (err) {
        console.log("Error posting task: ", err);
        return Response.json({
            success: false,
            message: "Assigning task failed"
        }, { status: 500 })
    }
}