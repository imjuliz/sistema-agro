import { z } from "zod";

export const animaisSchema = z.object({
  animal: z.string(),
  raca: z.string(),
  sku: z.string(),
  dataEntrada: z.date().optional(),
  quantidade: z.number().positive(),
  tipo: z.enum(["ABATE", "VENDA", "REPRODUCAO", "ORDENHA"]),
  custo: z.number().positive().optional(),
});
