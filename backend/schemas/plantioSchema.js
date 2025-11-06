import {z} from "zod";

export const plantioSchema = z.object({
    categoria: z.string().min(1).max(100),
    areaHectares: z.number().positive(),
    tipo: z.enum(["cultivo", "colheita", "producao"])
})