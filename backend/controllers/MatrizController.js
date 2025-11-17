import { deleteUnidade, getUnidadePorId, getUnidades, updateStatusUnidade, createUnidade, getFazendas, getLoja, getMatriz, UnidadeService } from "../models/Matriz.js";
import { unidadeSchema } from "../schemas/unidadeSchema.js";

// BUSCA ---------------------------------------------------------------------------
export async function getUnidadesController(req, res) {
    try {
        const unidades = await getUnidades();
        return {
            sucesso: true,
            unidades,
            message: "Unidades listadas com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidades.",
            detalhes: error.message
        }
    }
};

export async function getUnidadePorIdController(req, res) {
    try {
        const { id } = req.params;
        const unidade = await getUnidadePorId(id);
        return {
            sucesso: true,
            unidade,
            message: "Unidade listada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidade por id.",
            detalhes: error.message 
        }
    }
};

export async function getFazendasController(req, res) {
    try {
        const resultado = await getFazendas();
        if (!resultado.sucesso) {return res.status(500).json(resultado);}
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
        if (!resultado.sucesso) {return res.status(500).json(resultado);}
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
        if (!resultado.sucesso) {return res.status(500).json(resultado);}
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
        const total = await UnidadeService.contarFazendas();
        const ativas = await UnidadeService.contarFazendasAtivas();
        const inativas = await UnidadeService.contarFazendasInativas();

        res.json({total,ativas,inativas,});
    } catch (error) {
        console.error('Erro ao obter contagem das fazendas:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

// CRIAR ---------------------------------------------------------------------------
export async function createUnidadeController(req, res) {
    try {
        const { data } = unidadeSchema.parse(req.body);
        const unidade = await createUnidade(data);
        return {
            sucesso: true,
            unidade,
            message: "Unidade criada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

// ATUALIZAR ---------------------------------------------------------------------------
export async function updateUnidadeController(req, res) {
    try {
        const { id } = req.params;
        const { data } = unidadeSchema.parse(req.body);
        const unidade = await updateUnidade(id, data);
        return {
            sucesso: true,
            unidade,
            message: "Unidade atualizada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

// DELETAR ---------------------------------------------------------------------------
export async function deleteUnidadeController(req, res) {
    try {
        const { id } = req.params;
        const unidade = await deleteUnidade(id);
        return {
            sucesso: true,
            unidade,
            message: "Unidade deletada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export const updateStatusUnidadeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { novoStatus } = req.body;

    if (!id || isNaN(id)) {return res.status(400).json({sucesso: false,erro: "ID da unidade inválido."});}

    if (!novoStatus) {return res.status(400).json({sucesso: false,erro: "O campo 'novoStatus' é obrigatório."});}

    const resultado = await updateStatusUnidade(Number(id), novoStatus);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.message || "Erro ao atualizar status da unidade.",
        detalhes: resultado.error,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao atualizar status da unidade:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao atualizar status da unidade.",
      detalhes: error.message,
    });
  }
};