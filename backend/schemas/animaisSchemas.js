import { z } from "zod";

export const animaisSchema = z.object({
  animal: z.string(),
  raca: z.string(),
  quantidade: z.number().positive(),
  tipo: z.enum(["ABATE", "VENDA", "REPRODUCAO"]),
});
