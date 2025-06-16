import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const sessions = await SessionModel.find()
            .populate({
                path: 'volunteers.volunteer',
                select: 'username email'
            })
            .sort({ dateOfSession: -1 });

        return NextResponse.json(sessions);

    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 