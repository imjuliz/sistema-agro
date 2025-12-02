import { z } from "zod";

export const loteSchema = z.object({
  responsavelId: z.coerce.number().int().positive(),
  nome: z.string(),
  tipo: z.enum(["GADO", "SOJA", "LEITE", "BOVINOS", "SUINOS", "OVINOS", "AVES", "EQUINO", "CAPRINOS", "PLANTIO", "OUTRO"]),
  qntdItens: z.number().int().nonnegative(),
  preco: z.preprocess(
  (val) => val !== undefined ? Number(val) : val,
  z.number()
  ),
  unidadeMedida: z.enum(["KG", "G", "T", "LOTE", "UNIDADE", "SACA", "CABECA", "ARROBA", "LITRO", "ML"]),
  observacoes: z.string().optional(),
  statusQualidade: z.enum(["PROPRIO", "ALERTA", "IMPROPRIO"]),
  bloqueadoParaVenda: z.boolean(),
  status: z.enum(["PENDENTE", "PRONTO", "ENVIADO"]).nullable().optional(),
  dataEnvioReferencia: z.iso.date().nullable().optional()
});

export const loteTipoVegetaisSchema = z.object({
  tipo: z.enum(["SOJA", "PLANTIO", "OUTRO"])
});

export const IdsSchema = z.object({
  unidadeId: z.coerce.number().int().positive(),
  contratoId: z.coerce.number().int().positive(),
});

export const IdSchema = z.object({
  id: z.coerce.number().int().positive(),
})