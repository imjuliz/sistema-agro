import { calcularFornecedores, verContratos } from "../../models/unidade-de-venda/fornecedores.js";

export const listarFornecedoresController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }
    const resultado = await listarFornecedores(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar fornecedores.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar fornecedores:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar fornecedores.",
      detalhes: error.message,
    });
  }
};

//calcular fornecedores -- rota feita
export const calcularFornecedoresController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada à sessão.",
      });
    }
    const resultado = await calcularFornecedores(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      qtdFornecedores: resultado.qtdFornecedores ?? 0,
    });

  } catch (error) {
    console.error("Erro no controller ao calcular quantidade de fornecedores:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao calcular quantidade de fornecedores.",
      detalhes: error.message,
    });
  }
};


export const verContratosController = async (req, res) => {//tem rota
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada!"
      })
    }
    const resultado = await verContratos(Number(unidadeId));
    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      verContratos: resultado.contratos ?? 0
    });
  } catch (error) {
    console.error("erro no controller ao ver contratos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "erro no controller ao ver contratos.",
      detalhes: error.message
    })
  }
};

export async function updateFornecedorController(req, res) {
    const { id } = req.params;
    const data = fornecedorSchema.parse(req.body);
    try {
        const fornecedor = await updateFornecedor(id, data);
        return {
            sucesso: true,
            fornecedor,
            message: "Fornecedor atualizado com sucesso!!",
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar fornecedor",
            detalhes: error.message
        }
    }
}