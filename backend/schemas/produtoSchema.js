import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().max(150),
  sku: z.string().max(50),
  categoria: z.string().max(100).nullable().optional(),
  descricao: z.string().nullable().optional(),

  preco: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"), // Decimals como string

  dataFabricacao: z.coerce.date(),
  dataValidade: z.coerce.date(),

  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),

  unidadeMedida: z.string().nullable().optional(),

  codigoBarras: z.string().nullable().optional(),
  ncm: z.string().nullable().optional(),

  pesoUnidade: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, "Peso inválido")
    .nullable()
    .optional(),

  tags: z.any().optional(),
  impostos: z.any().optional(),

  isForSale: z.boolean().optional()
});

export const IdsSchema = z.object({
  id: z.coerce.number().int().positive(),
  unidadeId: z.coerce.number().int().positive(),
  origemUnidadeId: z.coerce.number().int().positive().nullable().optional(),
  fornecedorId: z.coerce.number().int().positive().nullable().optional(),
  criadoPorId: z.coerce.number().int().positive().nullable().optional(),
  loteId: z.coerce.number().int().positive().nullable().optional()
})
