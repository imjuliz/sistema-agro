import prisma from "../../prisma/client.js";
import { somarQtdTotalEstoque, getEstoque, getProdutos, getProdutoPorId, createProduto, deleteProduto, buscarProdutoMaisVendido, listarProdutos, mostrarEstoque } from "../../models/estoque_produtos_lotes/estoque_produtos.js";
import { lotesPlantio } from "../../models/Fazendas.js";
import { verPedidos, contarSaidas } from "../../models/unidade-de-venda/Loja.js";

//BUSCAR PRODUTO MAIS VENDIDO
export const buscarProdutoMaisVendidoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        message: "Usuário não possui unidade vinculada à sessão."
      });
    }

    const resultado = await prisma.itemVenda.groupBy({
      by: ["produtoId"],
      _sum: { quantidade: true },
      where: { venda: { unidadeId: Number(unidadeId) } },
      orderBy: { _sum: { quantidade: "desc" } },
      take: 1,
    });

    if (resultado.length === 0) {
      return res.json({
        sucesso: false,
        message: "Nenhum item encontrado para esta unidade."
      });
    }

    const produtoMaisVendido = resultado[0];

    const produto = await prisma.produto.findUnique({
      where: { id: produtoMaisVendido.produtoId },
      select: { id: true, nome: true, descricao: true }
    });

    return res.json({
      sucesso: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        quantidadeVendida: produtoMaisVendido._sum.quantidade
      },
      message: "Produto mais vendido encontrado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar o produto mais vendido",
      detalhes: error.message
    });
  }
};


// LISTAR PRODUTOS DA UNIDADE -- rota feita
export const listarProdutosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) { return res.status(401).json({ sucesso: false, erro: "Usuário não possui unidade vinculada à sessão." }); }

    const resultado = await listarProdutos(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      produtos: resultado.fornecedores ?? [],
    });

  } catch (error) {
    console.error("Erro no controller ao listar produtos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao listar produtos.",
      detalhes: error.message,
    });
  }
};

//BUSCAR PRODUTO POR ID
export const getProdutoPorIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) { return res.status(400).json({ sucesso: false, erro: "ID do produto inválido." }) }

    const resultado = await getProdutoPorId(Number(id));

    if (!resultado.sucesso || !resultado.produto) {return res.status(404).json({ sucesso: false, erro: "Produto não encontrado." });}
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao buscar produto por ID:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar produto.",
      detalhes: error.message,
    });
  }
};

//CRIAR PRODUTO 
export const createProdutoController = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) { return res.status(400).json({ sucesso: false, erro: "Os dados do produto são obrigatórios.", }); }

    const resultado = await createProduto(data);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: "Erro ao criar produto.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao criar produto:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao criar produto.",
      detalhes: error.message,
    });
  }
};

//deletar produto
export const deleteProdutoController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) { return res.status(400).json({ sucesso: false, erro: "ID do produto inválido.", }); }

    const resultado = await deleteProduto(Number(id));

    if (!resultado.sucesso) {
      return res.status(404).json({
        sucesso: false,
        erro: "Erro ao deletar produto.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao deletar produto:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao deletar produto.",
      detalhes: error.message,
    });
  }
};

// SOMA TOTAL DE ITENS NO ESTOQUE -- rota feita
export const somarQtdTotalEstoqueController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await somarQtdTotalEstoque(unidadeId);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao somar estoque:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao somar itens no estoque.",
      detalhes: error.message,
    });
  }
};

// LISTA O ESTOQUE -- rota feita
export const listarEstoqueController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await getEstoque(unidadeId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao listar estoque:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar estoque.",
      detalhes: error.message,
    });
  }
};

export const mostrarEstoqueController = async (req, res) => {
  try {
    const unidadeId = req.user?.unidadeId;
    const estoque = await mostrarEstoque(unidadeId);
    res.status(200).json(estoque);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao mostrar estoque da unidade de venda.' })
  }
}

export const listarAtividadesLoteController = async(req, res) =>{
  try{
    const unidadeId = req.params.unidadeId;
    const atividades = await listarAtividadesLote(unidadeId);
    return res.status(200).json(atividades);
  } catch (error) {
    console.error(error);
    res.status(500).json({erro: "Erro ao listar atividades realizadas nos lotes."})
  }
}

export const consultarLoteController = async (req, res) =>{
  try{
    const unidadeId = req.params.unidadeId;
    const loteId = req.body.loteId;

    const atividadesLote = await consultarLote(unidadeId, loteId);
    return res.status(200).json(atividadesLote);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({erro: "Erro ao consultar atividades do lote."})
  }
}
//lotes
export const lotesPlantioController = async (req, res) => {
  try {
    const unidadeId = req.user?.unidadeId;
    const lotesP = await lotesPlantio(unidadeId);
    res.status(200).json(lotesP);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao mostrar lotes da unidade!' })
  }
};

//////////////////////
// Função de 17/11 //
////////////////////

//listar pedidos ---- Não testada
export const listarPedidosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) { return res.status(401).json({ sucesso: false, erro: "Usuário não possui unidade vinculada à sessão." }); }

    const resultado = await verPedidos(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      produtos: resultado
    });

  } catch (error) {
    console.error("Erro no controller ao listar os pedidos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao listar os pedidos.",
      detalhes: error.message,
    });
  }
};

export const contarSaidasController = async (req, res) => {
  const { unidadeId } = req.params;

  if (!unidadeId) {
    return res.status(400).json({
      sucesso: false,
      erro: "O parâmetro unidadeId é obrigatório.",
    });
  }

  const resultado = await contarSaidas(unidadeId);

  if (!resultado.sucesso) {
    return res.status(500).json(resultado);
  }

  return res.status(200).json({
    sucesso: true,
    quantidade: resultado.quantidade,
    mensagem: "Quantidade de saídas obtida com sucesso!",
  });
};