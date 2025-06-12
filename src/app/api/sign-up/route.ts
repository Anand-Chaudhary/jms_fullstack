import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, email, password, phone, address, role } = await request.json();
        
        // Validate required fields
        if (!username || !email || !password || !phone || !address || !role) {
            return Response.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return Response.json({
                success: false,
                message: "User already exists with this email"
            }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            role
        });
        
        await newUser.save();
        
        return Response.json({
            success: true,
            message: "User created successfully",
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json({
            success: false,
            message: "Error registering user",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}