import {z} from 'zod';

export const produtoSchema = z.object({
  id: z.number().int().optional(), // autoincrement
  unidadeId: z.number().int(),
  loteId: z.number().int(),
  nome: z.string().max(150),
  sku: z.string().max(50),
  categoria: z.string().max(100).nullable().optional(),
  descricao: z.string().nullable().optional(),
  preco: z.number().refine((v) => v >= 0, {
    message: "O preço deve ser um número positivo.",
  }),
  dataFabricacao: z.date(),
  dataValidade: z.date(),
  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),
});
