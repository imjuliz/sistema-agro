import { z } from "zod";

export const userSchema = z.object({
  nome: z.string(),
  email: z.email().regex(/@(gmail|hotmail|example|outlook)\.com$/),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  funcao: z.string(),
  setor: z.string(),
  unidade: z.number().int(),
  periodo: z.enum(["Manhã", "Tarde", "Noite", "Madrugada"]),
  status: z.enum(["Ativo", "Inativo"]),
  inicio: z.date().optional(),
  fim: z.date(),
  senha: z.string().min(6),
  confirmarSenha: z.string().min(6),
});
