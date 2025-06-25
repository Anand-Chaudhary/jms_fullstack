import mongoose, {Schema, Document} from "mongoose";

export interface School extends Document{
    name: string,
    address: string,
    dateOfSession: Date,
    volunteers: {
        volunteer: mongoose.Types.ObjectId,
        isPresent: boolean,
        isAvailable: boolean
    }[],
    class: string,
    expectedNumberOfStudents: number,
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
    class:{
        type: String,
        required: [true, "Class is required"],
    },
    expectedNumberOfStudents: {
        type: Number,
        required: [true, "Expected number of students is required"],
    },
    remarks: {
        type: String,
    },
    volunteers:[
        {
            volunteer: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true
            },
            isPresent: {
                type: Boolean,
                default: false
            },
            isAvailable: {
                type: Boolean,
                default: true
            }
        }
    ]
}, {
    timestamps: true
})

const SessionModel = mongoose.models.School || mongoose.model<School>("School", SchoolSchema)

export default SessionModel;