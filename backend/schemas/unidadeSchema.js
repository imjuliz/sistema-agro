import { z } from "zod";

const unidadeSchema = z.object({
  nome: z.string().max(100, "Nome deve ter no máximo 100 caracteres"),
  endereco: z.string().max(500, "Endereço deve ter no máximo 500 caracteres"),
  cidade: z.string().max(100, "Cidade deve ter no máximo 100 caracteres").optional(),
  estado: z.string().max(100, "Estado deve ter no máximo 100 caracteres").optional(),
  cep: z.string().max(20, "CEP deve ter no máximo 20 caracteres").optional(),
  areaTotal: z.number().optional(),
  areaProdutiva: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  descricaoCurta: z.string().optional(),
  cultura: z.string().optional(),
  horarioAbertura: z.string().optional(),
  horarioFechamento: z.string().optional(),
  tipo: z.enum(["MATRIZ", "FAZENDA", "LOJA"]),
  status: z.enum(["ATIVA", "INATIVA", "MANUTENCAO"]),
  telefone: z.string().max(20, "Telefone deve ter no máximo 20 caracteres").optional(),
  email: z.string().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres").optional(),
  cnpj: z.string().max(20, "CNPJ deve ter no máximo 20 caracteres").optional(),
  imagemUrl: z.string().max(1000, "URL da imagem deve ter no máximo 1000 caracteres").optional(),
  imagemBase64: z.string().optional(), // Campo temporário para processamento
  focoProdutivo: z.string().max(50, "Foco produtivo deve ter no máximo 50 caracteres").optional()
});

export { unidadeSchema };
