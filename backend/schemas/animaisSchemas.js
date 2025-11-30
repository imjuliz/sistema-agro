import { z } from "zod";

export const animaisSchema = z.object({
  animal: z.string(),
  raca: z.string(),
  sku: z.string(),
  dataEntrada: z.union([ z.string().transform(val => new Date(val)), z.date() ]).optional(),
  fornecedorId: z
    .union([z.coerce.number(), z.null()])
    .nullable()
    .optional(),
  quantidade: z.number().positive(),
  tipo: z.enum(["ABATE", "VENDA", "REPRODUCAO", "ORDENHA"]),
  custo: z.number().positive().optional(),
  unidadeId: z.coerce.number().min(1),
  loteId: z
    .union([z.coerce.number(), z.null()])
    .nullable()
    .optional(),
});
