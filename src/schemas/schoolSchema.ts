import {z} from 'zod'

export const SchoolSchema = z.object({
    name: z.string(),
    address: z.string(),
    numberOfVolunteer: z.number(),
    numberOfStudent: z.number(),
    dateOfSession: z.date()
})