import {z} from 'zod';

const unidadeSchema = z.object({
    idGerente: z.number(),
    tipo: z.enum(['venda','producao']),
    produtos: z.string(),
    fundacao: z.date(),
    status: z.enum(['ativo','inativo']),
    renda: z.number(),
})

export {unidadeSchema};