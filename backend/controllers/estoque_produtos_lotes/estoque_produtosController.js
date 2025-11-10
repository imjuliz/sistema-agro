import prisma from "../../prisma/client.js";
import { somarQtdTotalEstoque,  getEstoque,  getProdutos, getProdutoPorId, createProduto, deleteProduto, buscarProdutoMaisVendido, listarProdutos, mostrarEstoque } from "../../models/estoque_produtos_lotes/estoque_produtos.js";
 

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

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,erro: "Usuário não possui unidade vinculada à sessão."});
    }

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

export const mostrarEstoqueController = async(req, res) =>{
    try{
        const unidadeId = req.user?.unidadeId;
        const estoque = await mostrarEstoque(unidadeId);
        res.status(200).json(estoque);
    } catch (error) {
        console.error(error);
        res.status(500).json({erro: 'Erro ao mostrar estoque da unidade de venda.'})
    }
}
