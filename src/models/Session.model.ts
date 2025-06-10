import mongoose, {Schema, Document} from "mongoose";

export interface School extends Document{
    name: string,
    address: string,
    dateOfSession: Date,
    volunteers: [],
    numberOfStudents: number,
    remarks?: string
}

const SchoolSchema: Schema<School> = new Schema({
    name: {
        type: String,
        required: [true, "School name is required"],
    },
    address:{
        type: String,
        required: [true, "School address is required"],
    },
    dateOfSession: {
        type: Date,
        required: [true, "Date of session is required"],
    },
    volunteers:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Volunteer",
        }
    ],
    numberOfStudents: {
        type: Number,
        required: [true, "Please specify the numbers of students expected"],
    }
})

const SessionModel = mongoose.models.School as mongoose.Model<School> || mongoose.model<School>("School", SchoolSchema)
export default SessionModel;