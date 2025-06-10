import mongoose, { Schema, Document } from "mongoose";

export interface Task{
    title: string,
    description: string,
    assignedTo: mongoose.Types.ObjectId,
    dateAssigned?: Date,
    state?: string,
    failed?: boolean,
}

const TaskSchema: Schema<Task> = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateAssigned: {
        type: Date,
        default: Date.now(),
    },
    state: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    failed: {
        type: Boolean,
        default: false,
    },
});

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    joinDate: Date,
    role: string,
    tasks: Task[],
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
        required: [true, "Join Date is required"],
    },
    role: {
        type: String,
        required: [true, "Your role is required"],
        enum: ["Admin", "Volunteer"],
        default: "Volunteer"
    },
    tasks: [TaskSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)
export default UserModel;
