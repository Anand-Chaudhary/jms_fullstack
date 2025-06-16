import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        const user = await UserModel.findOne({ email: session.user?.email });
        if (!user || user.role !== "Admin") {
            return NextResponse.json(
                { error: "Only admins can mark attendance" },
                { status: 403 }
            );
        }

        await dbConnect();
        const { sessionId, volunteerId, isPresent } = await req.json();

        if (!sessionId || !volunteerId || typeof isPresent !== 'boolean') {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // First, find the session
        const existingSession = await SessionModel.findById(sessionId);
        if (!existingSession) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Check if volunteer already exists in the session
        const volunteerIndex = existingSession.volunteers.findIndex(
            (v: { volunteer: mongoose.Types.ObjectId }) => v.volunteer.toString() === volunteerId
        );

        if (volunteerIndex === -1) {
            // Add new volunteer to the session
            existingSession.volunteers.push({
                volunteer: volunteerId,
                isPresent
            });
        } else {
            // Update existing volunteer's presence
            existingSession.volunteers[volunteerIndex].isPresent = isPresent;
        }

        // Save the updated session
        await existingSession.save();

        // If volunteer is present, add session to their attended list
        if (isPresent) {
            await UserModel.findByIdAndUpdate(
                volunteerId,
                { $addToSet: { attended: sessionId } }
            );
        }

        // Return the updated session with populated volunteer data
        const updatedSession = await SessionModel.findById(sessionId)
            .populate('volunteers.volunteer', 'username email');

        return NextResponse.json({
            message: "Attendance marked successfully",
            session: updatedSession
        });

    } catch (error) {
        console.error("Error marking attendance:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 