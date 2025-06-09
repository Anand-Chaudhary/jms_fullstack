import dbConnect from "@/lib/db";
import SchoolModel from "@/models/cbwc.model";

export async function POST(request:Request) {
    await dbConnect();
    try{
        const { name, address, dateOfSession, numberOfStudents, numberOfVolunteer } = await request.json();
        const existingSchool = await SchoolModel.findOne({ name });
        if(existingSchool){
            return Response.json({
                success: false,
                message: "School Exists"
            }, {status: 204})
        }
        const newSchool = new SchoolModel({
            name, address, dateOfSession, numberOfStudents, numberOfVolunteer
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