import { supabase } from "../config/supabase.js";
import bcrypt from 'bcryptjs'
import prisma from '../prisma/client.js'

// Criar usuário
export async function cadastrarSe({ nome, email, senha }) {
  // hash da senha
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(senha, salt)

  // busca o perfil gerente_fazenda
  const perfil = await prisma.perfis.findUnique({
    where: { nome: 'gerente_fazenda' }
  })

  if (!perfil) {
    throw new Error('Perfil gerente_fazenda não encontrado')
  }

  // cria usuário
  const usuario = await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha: hash,
      perfilId: perfil.id
    }
  })

  return usuario
}

// Buscar usuário por email
export async function getUserByEmail(email) {
  const usuario = await prisma.usuarios.findUnique({
    where: { email }
  })
  return usuario // pode ser null se não existir
}

// deletar usuario
export async function deletarUsuario(userId) {
  const { data, error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error('Erro ao deletar usuário:', error.message)
    return { sucesso: false, erro: error.message }
  }

  console.log('Usuário deletado com sucesso:', data)
  return { sucesso: true }
}

// editar informacoes do usuario
export async function updateUsuario(id, data) {
  try {
    const usuario = await prisma.usuarios.update({
      where: { id },
      data
    });

    return {
      sucesso: true,
      usuario,
      message: "Perfis atualizados com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar perfis",
      detalhes: error.message // opcional, para debug
    };
  }
};