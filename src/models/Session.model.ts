import mongoose, {Schema, Document} from "mongoose";

export interface School extends Document{
    name: string,
    address: string,
    dateOfSession: Date,
    volunteers: [],
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
    ]
}, {
    timestamps: true
})

// Delete the model if it exists to prevent the OverwriteModelError
mongoose.deleteModel("School");

const SessionModel = mongoose.model<School>("School", SchoolSchema)
export default SessionModel;