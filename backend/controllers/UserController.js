import { cadastrarSe, getUserByEmail, deletarUsuario } from "../models/User.js";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

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
