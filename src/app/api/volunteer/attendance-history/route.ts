import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import SessionModel from "@/models/Session.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Get user with populated attended sessions
        const user = await UserModel.findOne({ email: session.user?.email })
            .populate({
                path: 'attended',
                select: 'name address dateOfSession'
            });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get all sessions where the user was marked as present
        const sessions = await SessionModel.find({
            "volunteers.volunteer": user._id,
            "volunteers.isPresent": true
        }).select('name address dateOfSession');

        return NextResponse.json({
            user: {
                username: user.username,
                email: user.email,
                isAvailable: user.isAvailable
            },
            attendanceHistory: sessions
        });

    } catch (error) {
        console.error("Error fetching attendance history:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 