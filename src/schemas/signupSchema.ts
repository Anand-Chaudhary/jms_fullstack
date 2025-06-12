import { z } from "zod";

export const signupSchema = z.object({
    username: z
    .string()
    .min(3, "Username must have 3 letters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(5, "Password must have 5 letters"),
    phone: z.string().min(10).max(10),
    address: z.string(),
    role: z.string()
})