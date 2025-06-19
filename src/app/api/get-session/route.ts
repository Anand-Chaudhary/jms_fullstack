import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";

export async function GET() {
    await dbConnect();

    try {
        const sessions = await SessionModel.find({})
            .populate({
                path: 'volunteers.volunteer',
                select: 'username email phone address role',
            });

        return Response.json({
            success: true,
            sessions,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch sessions",
        }, { status: 500 });
    }
}
