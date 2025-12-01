import { z } from "zod";

const unidadeSchema = z.object({
  nome: z.string(),
  endereco: z.string(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  areaTotal: z.number().optional(),
  areaProdutiva: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  descricaoCurta: z.string().optional(),
  tipo: z.enum(["Matriz", "Fazenda", "Loja"]),
  status: z.enum(["ATIVA", "INATIVA", "MANUTENCAO"]),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  cnpj: z.string().optional(),
  imagemUrl: z.string().optional(),
  focoProdutivo: z.string().optional()
});

export { unidadeSchema };
