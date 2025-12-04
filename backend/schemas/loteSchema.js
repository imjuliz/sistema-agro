import { z } from "zod";

export const loteSchema = z.object({
  responsavelId: z.coerce.number().int().positive().optional(),
  nome: z.string(),
  tipo: z.enum(["GADO", "SOJA", "LEITE", "BOVINOS", "SUINOS", "OVINOS", "AVES", "EQUINO", "CAPRINOS", "PLANTIO", "OUTRO"]).optional(),
  qntdItens: z.number().int().nonnegative().optional().default(0),
  preco: z.preprocess(
    (val) => val !== undefined && val !== null && val !== '' ? Number(val) : 0,
    z.number()
  ).optional().default(0),
  unidadeMedida: z.enum(["KG", "G", "T", "LOTE", "UNIDADE", "SACA", "CABECA", "ARROBA", "LITRO", "ML"]).optional().default("UNIDADE"),
  observacoes: z.string().optional(),
  statusQualidade: z.enum(["PROPRIO", "ALERTA", "IMPROPRIO"]).optional().default("PROPRIO"),
  bloqueadoParaVenda: z.boolean().optional().default(false),
  status: z.enum(["PENDENTE", "PRONTO", "ENVIADO"]).nullable().optional(),
  dataEnvioReferencia: z.string().nullable().optional(),
  contratoId: z.coerce.number().int().positive().optional(),
  unidadeId: z.coerce.number().int().positive().optional(),
  itens: z.array(z.object({
    itemId: z.coerce.number().int().positive(),
    nome: z.string(),
    quantidade: z.coerce.number().positive(),
    unidadeMedida: z.string(),
    precoUnitario: z.coerce.number().optional(),
    etapasProducao: z.array(z.object({
      nome: z.string(),
      descricao: z.string().nullable().optional(),
      duracao: z.coerce.number().int().optional()
    })).optional()
  })).optional()
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