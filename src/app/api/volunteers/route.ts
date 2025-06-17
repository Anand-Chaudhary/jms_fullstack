import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import SessionModel from "@/models/Session.model";

export async function GET() {
    try {
        await dbConnect();

        // Get all volunteers
        const volunteers = await UserModel.find({ role: "Volunteer" })
            .select('username email phone')
            .lean();

        // Get session attendance count for each volunteer
        const volunteersWithSessions = await Promise.all(
            volunteers.map(async (volunteer) => {
                // Count sessions where the volunteer was marked as present
                const sessionCount = await SessionModel.countDocuments({
                    'volunteers.volunteer': volunteer._id,
                    'volunteers.isPresent': true
                });

                return {
                    ...volunteer,
                    sessionsAttended: sessionCount
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: volunteersWithSessions
        });
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching volunteers",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 