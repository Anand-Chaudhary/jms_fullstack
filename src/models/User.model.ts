import mongoose, {Schema, Document} from "mongoose";

export interface Task extends Document {
    title: string,
    description: string,
    dateAssigned: Date,
    dateComplete: Date,
    category: string,
    state: string,
    failed: boolean,
}

const TaskSchema: Schema<Task> = new Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    dateAssigned: {
        type: Date,
        required: true,
    },
    dateComplete: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: "Not started",
    },
    failed: {
        type: Boolean,
        default: false,
    },
});

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    role: string,
    tasks: Task[],
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"]
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/ , "Please use a valid email adress"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    role:{
        type: String,
        required: true,
        default: "Employee"
    },
    tasks: [TaskSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)
export default UserModel;
