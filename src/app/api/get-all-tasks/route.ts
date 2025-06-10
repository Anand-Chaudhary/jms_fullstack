import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return Response.json({
                success: false,
                message: "Username is required"
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User does not exist"
            }, { status: 404 });
        }

        const task = user.tasks;
        return Response.json({
            success: true,
            message: task
        }, { status: 200 });
    } catch (err) {
        console.error("Error fetching tasks: ", err);
        return Response.json({
            success: false,
            message: "Could not fetch tasks",
        }, { status: 500 });
    }
}
