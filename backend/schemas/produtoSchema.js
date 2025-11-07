import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().max(150),
  categoria: z.enum(["ANIMALIA", "PLANTIO"]),
  descricao: z.string().optional(),
  preco: z.number().refine((v) => v >= 0, {
    message: "O preço deve ser um número positivo.",
  }),
});
