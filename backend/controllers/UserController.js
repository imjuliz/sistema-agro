import { cadastrarSe, getUserByEmail, updateUsuario, deletarUsuario } from "../models/User.js";
import { createClient } from '@supabase/supabase-js';
import prisma from "../prisma/client.js";

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function cadastrarSeController(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    // Verifica se email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const user = await cadastrarSe({ nome, email, senha });

    res.status(201).json({ message: "Usuário criado com sucesso", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const updateUsuarioController = async (req, res) => {
  const { id } = req.params.id;
  const { nomeCompleto, email, funcao, setor, unidade, periodo } = req.body;

  try {
    // Validações basicas
    const domainEmailRegex = /^[\w.-]+@(gmail|hotmail|outlook|example)\.com$/;
      if (!domainEmailRegex.test(email)) {
          return res.status(400).json({ mensagem: "O email é inválido. Por favor, use @gmail, @hotmail, @outlook ou @exemplo." });
      }

    const funcao = [];

    const unidadeData = { 
      nomeCompleto,
      email,
      funcao,
      setor,
      unidade,
      periodo
    };

    const result = await updateUsuario(id, unidadeData);

      return res.status(200).json({ sucesso: true, mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar usuário' });
  }
}

export const deletarUsuarioController = async (req, res) => {
  const { userId } = req.params

  try {
    const resultado = await deletarUsuario(userId)

    if (!resultado.sucesso) {
      return res.status(400).json(resultado)
    }

    return res.status(200).json({ sucesso: true, mensagem: 'Usuário deletado com sucesso' })
  } catch (err) {
    return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
  }
}
