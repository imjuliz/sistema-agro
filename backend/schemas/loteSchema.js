import { z } from "zod";

export const loteSchema = z.object({
  nome: z.string(),
  tipo: z.enum(["PRODUCAO", "REPRODUCAO", "ABATE"]),
  qntdItens: z.number().int().nonnegative(),
  observacoes: z.string().optional(),
  dataFabricacao: z.datetime(),
  dataValidade: z.datetime(),
});
