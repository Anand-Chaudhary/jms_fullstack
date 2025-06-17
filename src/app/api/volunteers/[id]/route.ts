import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import SessionModel from '@/models/Session.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

interface UpdateData {
  username: string;
  email: string;
  phone: string;
  updatedAt: Date;
  password?: string;
}

// DELETE Handler
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.url.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid volunteer ID" }, { status: 400 });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Delete the volunteer
        const result = await User.deleteOne(
          { _id: new ObjectId(id), role: 'Volunteer' },
          { session }
        );

        if (result.deletedCount === 0) {
          throw new Error("Volunteer not found");
        }

        // Remove volunteer from all sessions
        await SessionModel.updateMany(
          { 'volunteers.volunteer': new ObjectId(id) },
          { $pull: { volunteers: { volunteer: new ObjectId(id) } } },
          { session }
        );
      });

      return NextResponse.json({ success: true, message: "Volunteer and their session data deleted successfully" });
    } catch (error) {
      console.error('Error in transaction:', error);
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete volunteer" 
      }, { status: 404 });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json({ success: false, message: "Failed to delete volunteer" }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.url.split('/').pop();
    const body = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid volunteer ID" }, { status: 400 });
    }

    const updateData: UpdateData = {
      username: body.username,
      email: body.email,
      phone: body.phone,
      updatedAt: new Date()
    };

    if (body.newPassword) {
      updateData.password = await bcrypt.hash(body.newPassword, 10);
    }

    const result = await User.updateOne(
      { _id: new ObjectId(id), role: 'Volunteer' },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Volunteer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Volunteer updated successfully" });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json({ success: false, message: "Failed to update volunteer" }, { status: 500 });
  }
}
