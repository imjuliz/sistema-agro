import { z } from "zod";

export const plantioSchema = z.object({
  categoria: z.string().min(1).max(100),
  areaHectares: z.number().positive(),
  dataPlantio: z.date().optional(),
  dataColheitaEstimativa: z.date().optional(),
  custo: z.number().positive().optional(),
});
