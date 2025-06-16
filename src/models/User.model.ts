import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    joinDate: Date,
    role: string,
    isAvailable: boolean,
    attended: mongoose.Types.ObjectId[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email adress"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    joinDate: {
        type: Date,
        default: Date.now(),
    },
    role: {
        type: String,
        required: [true, "Your role is required"],
        enum: ["Admin", "Volunteer"],
        default: "Volunteer"
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    attended: [{
        type: mongoose.Types.ObjectId,
        ref: "School"
    }]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)
export default UserModel;
