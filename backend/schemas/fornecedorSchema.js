import {z} from "zod";

export const fornecedorSchema = z.object({
    nomeEmpresa: z.string(),
    descricaoEmpresa: z.string().text(),
    materail: z.string(),
    cnpjCpf: z.string(),
    contato: z.string(),
    email: z.string(),
    endereco: z.string().text(),
})