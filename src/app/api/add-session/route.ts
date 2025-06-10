import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";

export async function POST(request:Request) {
    await dbConnect();
    try{
        const { name, address, dateOfSession, numberOfStudents } = await request.json();
        const existingSchool = await SessionModel.findOne({ name });
        if(existingSchool){
            return Response.json({
                success: false,
                message: "School Exists"
            }, {status: 204})
        }
        const newSchool = new SessionModel({
            name, address, dateOfSession, numberOfStudents
        })
        await newSchool.save();
        return Response.json({
            success: true,
            message: "School added"
        }, {status: 200})
    } catch(err){
        console.log("Error in registering school: ", err);
        return Response.json({
            success: false,
            message: "Failed to add school"
        }, {status: 500})
    }
}