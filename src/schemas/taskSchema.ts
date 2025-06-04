import { z } from "zod";

export const taskSchema = z.object({
    title: z.string(),
    description: z
        .string()
        .min(10, { message: "Content must be of atleast 10 characters" })
        .max(300, { message: "Content should not exceed 300 characters" })
})