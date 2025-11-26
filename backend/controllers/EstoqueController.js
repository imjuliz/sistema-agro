import { getEstoques, getEstoqueAcimaMinimo, getEstoqueAbaixoMinimo, getValorEstoque, getEstoqueProximoValorMin, getEstoquePorCategoria, getEstoquePorId, createEstoque, updateEstoque, deleteEstoque } from "../models/estoque.js";
import { getProdutos } from "../models/produtos.js";
import { estoqueSchema } from "../schemas/estoqueSchema.js";

export async function getEstoquesController(req, res) {
  try {
    const estoques = await getEstoques();
    return res.status(200).json({
      sucesso: true,
      estoques,
      message: "Estoques listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoques.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getEstoqueAcimaMinimoController(req, res) {
  try {
    const { estoques } = await getEstoques();
    const itens_acima_minimo = estoques.quantidade - estoques.estoqueMinimo;
    const estoque_acimaMin = await getEstoqueAcimaMinimo(itens_acima_minimo);
    return res.status(200).json({
      sucesso: true,
      estoque_acimaMin,
      message: "Estoque listado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoque acima do minimo.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getEstoqueAbaixoMinimoController(req, res) {
  try {
    const { quantidade, estoqueMinimo } = req.query;

    // Validações
    if(isNaN(quantidade) || isNaN(estoqueMinimo)) {
      return res.status(400).json({
        sucesso: false,
        erro: "Quantidade precisa ser um numero.",
      })
    }

    const valor_abaixo_minimo = estoqueMinimo - quantidade;
    const itens_abaixo_minimo = Math.abs(valor_abaixo_minimo); // Math.abs() retorna o valor positivo
    const estoque = await getEstoqueAbaixoMinimo(itens_abaixo_minimo);
    return res.status(200).json({
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoque abaixo do minimo.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getValorEstoqueController(req, res) { 
  const { produtoId } = req.query;
  try {
    if (!produtoId) {
      return res.status(400).json({
        sucesso: false,
        erro: "Informe o produtoId!"
      });
    }

    const resultado = await getValorEstoquePorProduto(produtoId);
    
    if (!resultado) {
      return res.status(404).json({
        sucesso: false,
        erro: "Produto não encontrado."
      });
    }

    return res.status(200).json({
      sucesso: true,
      message: "Valor total de estoque calculado.",
      dados: resultado
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar valor do estoque.",
      detalhes: error.message // opcional, para debug
    })
  }
}

export async function getEstoqueProximoValorMinController(req, res) {
  try {
    const { quantidade } = req.params;

    // Validações 
    if(isNaN(quantidade)) {
      return res.status(400).json({
        sucesso: false,
        erro: "Informe um número válido."
      });
    }
    if(!quantidade) {
      return res.status(400).json({
        sucesso: false,
        erro: "Informe a quantidade."
      });
    }
    const estoque = await getEstoqueProximoValorMin(quantidade);
    return res.status(200).json({
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoque próximo do minimo.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getEstoquePorProdutoController(req, res) { 
  try {
    const { categoria } = req.query;

    if (!categoria) {
      return res.status(400).json({
        sucesso: false,
        erro: "Informe a categoria do produto."
      });
    }

    const resultado = await getEstoquePorCategoria(categoria);

    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }

    if (!resultado.estoque || resultado.estoque.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: "Nenhum estoque encontrado para essa categoria."
      });
    }

    return res.status(200).json({ mensagem: "Estoque listado com sucesso.", resultado });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao buscar estoque.",
      detalhes: error.message,
    })
  }
}

export async function getEstoquePorIdController(req, res) {
  try {
    const { id } = req.params;
    const estoque = await getEstoquePorId(id);
    return res.status(200).json({
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoque por id.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function createEstoqueController(req, res) {
  try {
    const data = estoqueSchema.parse(req.body);
    const novoEstoque = await createEstoque(data);
    return res.status(201).json({
      sucesso: true,
      novoEstoque,
      message: "Estoque criado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar estoque.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function updateEstoqueController(req, res) {
  try {
    const { id } = req.params;
    const data = await updateEstoque(id, data);
    return res.status(200).json({
      sucesso: true,
      data,
      message: "Estoque atualizado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar estoque.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function deleteEstoqueController(req, res) {
  try {
    const { id } = req.params;
    await deleteEstoque(id);
    return res.status(200).json({
      sucesso: true,
      message: "Estoque deletado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar estoque.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
