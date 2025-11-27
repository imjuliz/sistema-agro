import { deleteUnidade, getUnidadePorId, getUnidades, updateStatusUnidade, createUnidade, getFazendas, getLoja, getMatriz, FazendaService, LojaService, updateUnidade, getUsuariosPorUnidade, getUsuarioPorId, countUsuariosPorUnidade } from "../models/Unidades.js";
import { unidadeSchema } from "../schemas/unidadeSchema.js";

// BUSCA ---------------------------------------------------------------------------
export async function getUnidadesController(req, res) {
  try {
    const unidades = await getUnidades();
    return {
      sucesso: true,
      unidades,
      message: "Unidades listadas com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar unidades.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getUnidadePorIdController(req, res) {
  try {
    const { id } = req.params;
    const unidade = await getUnidadePorId(id);
    return {
      sucesso: true,
      unidade,
      message: "Unidade listada com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar unidade por id.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getFazendasController(req, res) {
  try {
    const resultado = await getFazendas();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar fazendas.",
      detalhes: error.message
    });
  }
}

export async function getLojaController(req, res) {
  try {
    const resultado = await getLoja();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lojas.",
      detalhes: error.message
    });
  }
}

export async function getMatrizController(req, res) {
  try {
    const resultado = await getMatriz();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar matriz.",
      detalhes: error.message
    });
  }
}

// CONTAGEM ---------------------------------------------------------------------------
export async function contarFazendasController(req, res) {
  try {
    const total = await FazendaService.contarFazendas();
    const ativas = await FazendaService.contarFazendasAtivas();
    const inativas = await FazendaService.contarFazendasInativas();

    res.json({
      total,
      ativas,
      inativas,
    });
  } catch (error) {
    console.error('Erro ao obter contagem das fazendas:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export async function contarLojasController(req, res) {
  try {
    const total = await LojaService.contarLojas();
    const ativas = await LojaService.contarLojasAtivas();
    const inativas = await LojaService.contarLojasInativas();
    return res.json({ total, ativas, inativas });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor', detalhes: error.message });
  }
}

// CRIAR ---------------------------------------------------------------------------
export async function createUnidadeController(req, res) {
  try {
    const data = unidadeSchema.parse(req.body);
    const unidade = await createUnidade(data);
    return {
      sucesso: true,
      unidade,
      message: "Unidade criada com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar unidade.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

// ATUALIZAR ---------------------------------------------------------------------------
export async function updateUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const data = unidadeSchema.parse(req.body);
    const unidade = await updateUnidade(id, data);
    return {
      sucesso: true,
      unidade,
      message: "Unidade atualizada com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar unidade.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

// DELETAR ---------------------------------------------------------------------------
export async function deleteUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const unidade = await deleteUnidade(id);
    return {
      sucesso: true,
      unidade,
      message: "Unidade deletada com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar unidade.",
      detalhes: error.message, // opcional, para debug
    };
  }
}


/**
 * GET /unidades/:unidadeId/usuarios
 * ou GET /unidades/usuarios?unidadeId=...
 */
export async function getUsuariosPorUnidadeController(req, res) {
  try {
    const unidadeId = req.params?.unidadeId ?? req.query?.unidadeId;
    if (!unidadeId) return res.status(400).json({ sucesso: false, erro: "unidadeId é obrigatório." });

    // autorização: req.user deve vir do seu middleware `auth`
    const user = req.user;
    if (!user) return res.status(401).json({ sucesso: false, erro: "Não autenticado." });

    const isGerenteMatriz = Array.isArray(user.roles) && user.roles.some(r => String(r).toLowerCase() === "gerente_matriz");

    // Se não for gerente_matriz, só pode acessar usuários da própria unidade
    if (!isGerenteMatriz && Number(user.unidadeId) !== Number(unidadeId)) {
      return res.status(403).json({ sucesso: false, erro: "Acesso negado a esta unidade." });
    }

    const q = req.query?.q ?? null;
    const perfilId = req.query?.perfilId ?? null;
    const status = req.query?.status ?? null;
    const page = Number(req.query?.page ?? 1);
    const perPage = Number(req.query?.perPage ?? 25);

    const result = await getUsuariosPorUnidade({ unidadeId, q, perfilId, status, page, perPage });
    if (!result.sucesso) return res.status(500).json(result);
    return res.json(result);
  } catch (error) {
    console.error("[getUsuariosPorUnidadeController] erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

/**
 * GET /unidades/usuarios/:id  (ou /usuarios/:id dependendo da sua organização)
 */
export async function getUsuarioPorIdController(req, res) {
  try {
    const id = req.params?.id;
    if (!id) return res.status(400).json({ sucesso: false, erro: "id do usuário é obrigatório." });

    const userReq = req.user;
    if (!userReq) return res.status(401).json({ sucesso: false, erro: "Não autenticado." });

    // você pode aplicar regras adicionais: ex., somente gerente_matriz ou gerente da unidade pode ver
    const result = await getUsuarioPorId(id);
    if (!result.sucesso) return res.status(404).json(result);

    const usuario = result.usuario;
    const isGerenteMatriz = Array.isArray(userReq.roles) && userReq.roles.some(r => String(r).toLowerCase() === "gerente_matriz");
    if (!isGerenteMatriz && Number(userReq.unidadeId) !== Number(usuario.unidadeId)) {
      return res.status(403).json({ sucesso: false, erro: "Acesso negado a este usuário." });
    }

    return res.json({ sucesso: true, usuario });
  } catch (error) {
    console.error("[getUsuarioPorIdController] erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}
