import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import SessionModel from "@/models/Session.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Get user details
        const user = await UserModel.findOne({ email: session.user?.email })
            .select('username email phone address role isAvailable')
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get session attendance count
        const sessionCount = await SessionModel.countDocuments({
            'volunteers.volunteer': user._id,
            'volunteers.isPresent': true
        });

        return NextResponse.json({
            success: true,
            data: {
                ...user,
                sessionsAttended: sessionCount
            }
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching profile",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { username, phone, address, currentPassword, newPassword, isAvailable } = body;

        const user = await UserModel.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update basic info if provided
        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (typeof isAvailable === 'boolean') user.isAvailable = isAvailable;

        // Update password if provided
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 400 }
                );
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                isAvailable: user.isAvailable
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error updating profile",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 