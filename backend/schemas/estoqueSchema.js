import { z } from "zod";

export const estoqueSchema = z.object({
  descricao: z.string(),
  qntdItens: z.number().min(1),
  criadoEm: z.date(),
  atualizadoEm: z.date()
});
