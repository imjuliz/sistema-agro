import {z} from "zod";

export const registroSanitarioSchema = z.object({
    tipo: z.enum(["VACINA", "MEDICACAO", "RACAO", "OUTRO"]),
    produto: z.string(),
    dataAplicacao: z.string().datetime(),
    quantidade: z.number().optional(),
    observacoes: z.string().optional()
})