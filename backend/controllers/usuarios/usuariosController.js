import prisma from "../../prisma/client.js";
import { listarUsuariosPorUnidade, getPerfilIdByRole, listarGerentesDisponiveis, criarUsuario, updateUsuario, atualizarFotoPerfil, removerFotoPerfil } from "../../models/usuarios/usuarios.js";
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
    const { nome, email, senha, telefone, role, unidadeId: bodyUnidadeId } = req.body;
    // Prioridade: unidadeId do body (útil ao criar usuários junto com unidade)
    // Se não vier no body, usa do usuário autenticado
    const unidadeIdFromReq = bodyUnidadeId || req.usuario?.unidadeId || req.session?.usuario?.unidadeId || null;

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
    const user = req.usuario; // Do middleware auth

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: "ID do usuário é obrigatório." });
    }

    // Verificar perfil do usuário autenticado
    // O middleware auth coloca funcao dentro de perfil.nome, também pode estar em roles ou raw.perfil.funcao
    const userPerfilFuncao = (
      user?.perfil?.nome || 
      user?.perfil?.funcao || 
      user?.roles?.[0] || 
      user?.raw?.perfil?.funcao || 
      ''
    ).toUpperCase();
    const isGerenteMatriz = userPerfilFuncao === 'GERENTE_MATRIZ';
    const isGerenteFazenda = userPerfilFuncao === 'GERENTE_FAZENDA';
    const isGerenteLoja = userPerfilFuncao === 'GERENTE_LOJA';
    const editandoASiMesmo = Number(user?.id) === Number(id);

    // Debug temporário
    console.log('[updateUsuarioController] Debug:', {
      userId: user?.id,
      editingUserId: id,
      userPerfilFuncao,
      isGerenteMatriz,
      isGerenteFazenda,
      isGerenteLoja,
      editandoASiMesmo,
      userUnidadeId: user?.unidadeId,
      userPerfil: user?.perfil,
      userRoles: user?.roles,
      userRaw: user?.raw
    });

    // Autorização:
    // - GERENTE_MATRIZ: pode editar qualquer usuário
    // - GERENTE_FAZENDA e GERENTE_LOJA: podem editar apenas usuários da mesma unidade
    // - Qualquer usuário pode editar a si mesmo
    if (isGerenteMatriz || editandoASiMesmo) {
      // Permitir edição
    } else if (isGerenteFazenda || isGerenteLoja) {
      // Verificar se o usuário sendo editado pertence à mesma unidade
      const usuarioParaEditar = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: { unidadeId: true }
      });

      if (!usuarioParaEditar) {
        return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado." });
      }

      if (Number(usuarioParaEditar.unidadeId) !== Number(user?.unidadeId)) {
        return res.status(403).json({ sucesso: false, erro: "Você não tem permissão para editar este usuário." });
      }
    } else {
      console.log('[updateUsuarioController] Acesso negado - perfil não autorizado:', {
        userPerfilFuncao,
        userId: user?.id,
        editingUserId: id
      });
      return res.status(403).json({ 
        sucesso: false, 
        erro: "Você não tem permissão para editar este usuário.",
        debug: { userPerfilFuncao, userId: user?.id, editingUserId: id }
      });
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
    const user = req.usuario; // Do middleware auth

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: "ID do usuário é obrigatório." });
    }

    // Verificar perfil do usuário autenticado
    // O middleware auth coloca funcao dentro de perfil.nome, também pode estar em roles ou raw.perfil.funcao
    const userPerfilFuncao = (
      user?.perfil?.nome || 
      user?.perfil?.funcao || 
      user?.roles?.[0] || 
      user?.raw?.perfil?.funcao || 
      ''
    ).toUpperCase();
    const isGerenteMatriz = userPerfilFuncao === 'GERENTE_MATRIZ';
    const isGerenteFazenda = userPerfilFuncao === 'GERENTE_FAZENDA';
    const isGerenteLoja = userPerfilFuncao === 'GERENTE_LOJA';

    // Verifica se o usuário existe antes de verificar permissões
    const usuarioParaDeletar = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: { unidadeId: true }
    });

    if (!usuarioParaDeletar) {
      return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado." });
    }

    // Autorização:
    // - GERENTE_MATRIZ: pode deletar qualquer usuário
    // - GERENTE_FAZENDA e GERENTE_LOJA: podem deletar apenas usuários da mesma unidade
    if (isGerenteMatriz) {
      // Permitir deleção
    } else if (isGerenteFazenda || isGerenteLoja) {
      // Verificar se o usuário sendo deletado pertence à mesma unidade
      if (Number(usuarioParaDeletar.unidadeId) !== Number(user?.unidadeId)) {
        return res.status(403).json({ sucesso: false, erro: "Você não tem permissão para deletar este usuário." });
      }
    } else {
      return res.status(403).json({ sucesso: false, erro: "Você não tem permissão para deletar usuários." });
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


// Atualizar foto de perfil
export const atualizarFotoPerfilController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhuma imagem enviada.' });
    }

    const usuarioId = req.usuario?.id; // vindo do middleware de autenticação

    if (!usuarioId) {
      return res.status(401).json({ sucesso: false, erro: 'Usuário não autenticado.' });
    }

    // Construir URL da foto (sem barra inicial, pois será concatenada com API_URL que já tem /)
    const fotoUrl = `uploads/${req.file.filename}`;

    const resultado = await atualizarFotoPerfil(usuarioId, fotoUrl);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar foto de perfil.',
      detalhes: error.message,
    });
  }
};

// Remover foto de perfil
export const removerFotoController = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id; // vindo do middleware de autenticação

    if (!usuarioId) {
      return res.status(401).json({ sucesso: false, erro: 'Usuário não autenticado.' });
    }

    const resultado = await removerFotoPerfil(usuarioId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao remover foto de perfil:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao remover foto de perfil.',
      detalhes: error.message,
    });
  }
}