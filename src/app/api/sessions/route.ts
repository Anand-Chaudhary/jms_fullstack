import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
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

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'Admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { id, name, address, dateOfSession, class: className, expectedNumberOfStudents, remarks } = body;
        if (!id) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        const updated = await SessionModel.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(address && { address }),
                ...(dateOfSession && { dateOfSession }),
                ...(className && { class: className }),
                ...(expectedNumberOfStudents !== undefined && { expectedNumberOfStudents }),
                ...(remarks !== undefined && { remarks }),
            },
            { new: true }
        );
        if (!updated) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, session: updated });
    } catch (error) {
        console.error("Error updating session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 