import mongoose, {Schema, Document} from "mongoose";

export interface School extends Document{
    name: string,
    address: string,
    dateOfSession: Date,
    numberOfVolunteer: number,
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
    numberOfVolunteer: {
        type: Number,
        required: [true, "Please specify the numbers of volunteer"],
    },
    numberOfStudents: {
        type: Number,
        required: [true, "Please specify the numbers of students expected"],
    }
})

const SchoolModel = mongoose.models.School as mongoose.Model<School> || mongoose.model<School>("School", SchoolSchema)
export default SchoolModel;