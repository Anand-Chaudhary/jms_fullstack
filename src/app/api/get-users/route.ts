import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";

export async function GET() {
    await dbConnect();

    try {
        const users = await UserModel.find({}, "-password"); // Exclude password field for security

        return Response.json({
            success: true,
            users,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch users",
        }, { status: 500 });
    }
}
