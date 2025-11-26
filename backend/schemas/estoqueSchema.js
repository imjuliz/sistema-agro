import { z } from "zod";

export const estoqueSchema = z.object({
  quantidade: z.number().min(1, "Quantidade não pode ser negativa."),
  estoqueMinima: z.number().min(100, "Quantidade minima para dar alerta, não pode ser abaixo disso!"),
  atualizadoEm: z.date()
});
