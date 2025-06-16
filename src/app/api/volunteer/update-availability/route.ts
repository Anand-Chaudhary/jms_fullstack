import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/db";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { isAvailable } = await req.json();

        if (typeof isAvailable !== 'boolean') {
            return NextResponse.json(
                { error: "isAvailable must be a boolean" },
                { status: 400 }
            );
        }

        const user = await UserModel.findOneAndUpdate(
            { email: session.user?.email },
            { isAvailable },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Availability updated successfully",
            isAvailable: user.isAvailable
        });

    } catch (error) {
        console.error("Error updating availability:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 