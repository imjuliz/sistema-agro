import { getEstoques, getEstoqueAcimaMinimo, getEstoqueAbaixoMinimo, getValorEstoque, getEstoqueProximoValorMin, getEstoquePorId, createEstoque, updateEstoque, deleteEstoque } from "../models/estoque.js";
import { getProdutos } from "../models/produtos.js";
import { estoqueSchema } from "../schemas/estoqueSchema.js";

export async function getEstoquesController(req, res) {
  try {
    const estoques = await getEstoques();
    return {
      sucesso: true,
      estoques,
      message: "Estoques listados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoques.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getEstoqueAcimaMinimoController(req, res) {
  try {
    const { estoques } = await getEstoques();
    const itens_acima_minimo = estoques.quantidade - estoques.estoqueMinimo;
    const estoque_acimaMin = await getEstoqueAcimaMinimo(itens_acima_minimo);
    return {
      sucesso: true,
      estoque_acimaMin,
      message: "Estoque listado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoque acima do minimo.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getEstoqueAbaixoMinimoController(req, res) {
  const { quantidade, estoqueMinimo } = req.query;
  try {
    const valor_abaixo_minimo = estoqueMinimo - quantidade;
    const itens_abaixo_minimo = Math.abs(valor_abaixo_minimo); // Math.abs() retorna o valor positivo
    const estoque = await getEstoqueAbaixoMinimo(itens_abaixo_minimo);
    return {
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoque abaixo do minimo.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getValorEstoqueController(req, res) {
  const { quantidade } = req.params;
  try {
    const produto = await getProdutos();
    const valor_estoque = quantidade * produto.preco;
    const estoque = await getValorEstoque(valor_estoque);
    return {
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso."
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar valor do estoque.",
      detalhes: error.message // opcional, para debug
    }
  }
}

export async function getEstoqueProximoValorMinController(req, res) {
  const { quantidade } = req.params;
  try {
    const estoque = await getEstoqueProximoValorMin(quantidade);
    return {
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoque próximo do minimo.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getEstoquePorIdController(req, res) {
  try {
    const { id } = req.params;
    const estoque = await getEstoquePorId(id);
    return {
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoque por id.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function createEstoqueController(req, res) {
  try {
    const data = estoqueSchema.parse(req.body);
    const novoEstoque = await createEstoque(data);
    return {
      sucesso: true,
      novoEstoque,
      message: "Estoque criado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar estoque.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function updateEstoqueController(req, res) {
  try {
    const { id } = req.params;
    const data = await updateEstoque(id, data);
    return {
      sucesso: true,
      data,
      message: "Estoque atualizado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar estoque.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function deleteEstoqueController(req, res) {
  try {
    const { id } = req.params;
    await deleteEstoque(id);
    return {
      sucesso: true,
      message: "Estoque deletado com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar estoque.",
      detalhes: error.message, // opcional, para debug
    }
  }
}
