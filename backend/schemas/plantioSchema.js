import { z } from "zod";
import { id } from "zod/v4/locales";

export const plantioSchema = z.object({
  categoria: z.string().min(1).max(100),
  areaHectares: z.number().positive(),
  dataPlantio: z.coerce.date().nullable().optional(),
  dataColheitaEstimativa: z.coerce.date().nullable().optional(),
  fornecedorId: z.coerce.number().int().positive().nullable().optional(),
  custo: z.number().positive().nullable().optional(),
});

export const IdsSchema = z.object({
  id: z.coerce.number().int().positive(),
  unidadeId: z.coerce.number().int().positive(),
  loteId: z.coerce.number().int().positive().nullable().optional(),
});