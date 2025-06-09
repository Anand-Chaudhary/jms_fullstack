import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password, phone, address, joinDate, role } = await request.json();
        const user = await UserModel.findOne({ email });
        if (user) {
            return Response.json({
                success: false,
                message: "User exists"
            }, { status: 401 })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new UserModel({
                username, email, password: hashedPassword, phone, address, joinDate, role
            })
            await newUser.save()
            return Response.json({
            success: true,
            message: "User Created"
        }, { status: 200 })
        }
    } catch (error) {
        console.log("Error registering user: ", error);
        return Response.json({
            success: false,
            message: "Error resgistering user"
        }, { status: 401 })
    }
}