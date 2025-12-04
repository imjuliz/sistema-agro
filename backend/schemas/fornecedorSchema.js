import { z } from "zod";

// Schema para validação de dados de fornecedor
export const fornecedorSchema = z.object({
    nomeEmpresa: z.string().min(1),
    descricaoEmpresa: z.string().min(1).optional(),
    // suportamos variações de nome de campo usadas em diferentes pontos do código
    material: z.string().optional(),
    materail: z.string().optional(),
    cnpjCpf: z.string().optional(),
    cnpj: z.string().optional(),
    contato: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email().optional(),
    endereco: z.string().optional(),
});