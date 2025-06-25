import {z} from 'zod'

export const SchoolSchema = z.object({
    name: z.string(),
    address: z.string(),
    numberOfVolunteer: z.number(),
    dateOfSession: z.date(),
    class: z.string(),
    expectedNumberOfStudents: z.number(),
    remarks: z.string().optional(),
})