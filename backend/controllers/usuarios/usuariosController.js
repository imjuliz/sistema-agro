import prisma from "../../prisma/client.js";
import { listarUsuariosPorUnidade, getPerfilIdByRole, listarGerentesDisponiveis, criarUsuario, updateUsuario } from "../../models/usuarios/usuarios.js";
import { deletarUsuario } from "../../models/User.js";

//listar funcionarios
export const listarFuncionariosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada.",});}

    const resultado = await listarFuncionarios(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar funcionários.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar funcionários:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar funcionários.",
      detalhes: error.message,
    });
  }
};

//  Listar Administradores
export const listarAdminsController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada."});}

    const resultado = await listarAdmins(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar administradores.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar administradores:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar administradores.",
      detalhes: error.message,
    });
  }
};

// ✅ LISTA USUÁRIOS DA UNIDADE
export const listarUsuariosPorUnidadeController = async (req, res) => {
  try {
    // Tenta obter unidadeId do middleware auth (mais confiável)
    const unidadeId = req.usuario?.unidadeId || req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      console.warn("[listarUsuariosPorUnidadeController] unidadeId não encontrado", {
        reqUsuario: req.usuario,
        reqSession: req.session
      });
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await listarUsuariosPorUnidade(unidadeId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao listar usuários da unidade:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar usuários da unidade.",
      detalhes: error.message,
    });
  }
};

export const listarGerentesDisponiveisController = async (req, res) => {
  try {
    const resultado = await listarGerentesDisponiveis();
    if (!resultado.sucesso) {
      return res.status(resultado.erro === "Perfil de GERENTE_FAZENDA não encontrado." ? 404 : 500).json(resultado);
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar gerentes disponíveis:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};

export const criarUsuarioController = async (req, res) => {
  try {
    const { nome, email, senha, telefone, role } = req.body;
    // For security, do not trust client-sent unidadeId. Prefer the unidadeId from the authenticated user (req.usuario)
    const unidadeIdFromReq = req.usuario?.unidadeId || req.session?.usuario?.unidadeId || null;

    if (!nome || !email || !senha || !telefone || !role) {
      return res.status(400).json({ sucesso: false, erro: "Nome, email, senha, telefone e papel são obrigatórios." });
    }

    const resultado = await criarUsuario({ nome, email, senha, telefone, role, unidadeId: unidadeIdFromReq });

    if (!resultado.sucesso) {
      // Se o service devolveu 'field', retorna também
      const status = 400;
      return res.status(status).json({
        sucesso: false,
        erro: resultado.erro || 'Erro ao criar usuário.',
        field: resultado.field || null,
        detalhes: resultado.detalhes || null
      });
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao criar usuário:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno no servidor.", detalhes: error.message });
  }
};

export const updateUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: "ID do usuário é obrigatório." });
    }

    // Se o body trouxer 'role' como nome da função (ex: GERENTE_LOJA), converte para perfilId
    if (data && data.role) {
      const perfilId = await getPerfilIdByRole(data.role);
      if (!perfilId) {
        return res.status(400).json({ sucesso: false, erro: `Papel inválido: ${data.role}` });
      }
      data.perfilId = perfilId;
      delete data.role;
    }

    const resultado = await updateUsuario(id, data);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao atualizar usuário:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};

export const deletarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: "ID do usuário é obrigatório." });
    }

    // Verifica se o usuário existe antes de deletar
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: Number(id) }
    });

    if (!usuarioExiste) {
      return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado." });
    }

    // Deleta o usuário do banco de dados
    await prisma.usuario.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      sucesso: true,
      message: "Usuário deletado com sucesso!"
    });

  } catch (error) {
    console.error("Erro no controller ao deletar usuário:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};