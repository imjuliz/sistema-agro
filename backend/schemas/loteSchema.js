import { z } from "zod";

export const loteSchema = z.object({
  nome: z.string(),
  tipo: z.enum(["GADO", "SOJA", "LEITE", "BOVINOS", "SUINOS", "OVINOS", "AVES", "EQUINO", "CAPRINOS", "PLANTIO", "OUTRO"]),
  qntdItens: z.number().int().nonnegative(),
  preco: z.number().nonnegative(),
  unidadeMedida: z.enum(["KG", "G", "T", "LOTE", "UNIDADE", "SACA", "CABECA", "ARROBA", "LITRO", "ML"]),
  observacoes: z.string().optional(),
  statusQualidade: z.enum(["PROPRIO", "ALERTA", "IMPROPRIO"]),
  bloqueadoParaVenda: z.boolean(),
  status: z.enum(["PENDENTE", "PRONTO", "ENVIADO"]).optional(),
  dataEnvioReferencia: z.iso.date().optional()
});

export const loteTipoVegetaisSchema = z.object({
  tipo: z.enum(["SOJA", "PLANTIO", "OUTRO"])
});
