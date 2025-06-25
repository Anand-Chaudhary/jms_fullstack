import dbConnect from "@/lib/db";
import SessionModel from "@/models/Session.model";

export async function POST(request:Request) {
    await dbConnect();
    try{
        const body = await request.json();
        console.log("Received request body:", body);
        
        const { name, address, dateOfSession, numberOfVolunteer, class: className, expectedNumberOfStudents, remarks } = body;
        
        // Validate required fields
        if (!name || !address || !dateOfSession || numberOfVolunteer === undefined || !className || expectedNumberOfStudents === undefined) {
            return Response.json({
                success: false,
                message: "All fields are required"
            }, {status: 400})
        }

        const existingSchool = await SessionModel.findOne({ name });
        if(existingSchool){
            return Response.json({
                success: false,
                message: "School Exists"
            }, {status: 409})
        }

        const newSchool = new SessionModel({
            name,
            address,
            dateOfSession,
            numberOfVolunteer,
            class: className,
            expectedNumberOfStudents,
            remarks,
            volunteers: [] // Initialize empty volunteers array
        })
        
        await newSchool.save();
        
        return Response.json({
            success: true,
            message: "School added successfully",
            school: newSchool
        }, {status: 201})
    } catch(err){
        console.error("Error in registering school:", err);
        if (err instanceof Error) {
            console.error("Error details:", {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }
        return Response.json({
            success: false,
            message: "Failed to add school",
            error: err instanceof Error ? err.message : "Unknown error"
        }, {status: 500})
    }
}