import prisma from "../../prisma/client.js";
import { mostrarSaldoF, buscarProdutoMaisVendido, listarProdutos,contarVendasPorMesUltimos6Meses, criarVenda } from "../../models/unidade-de-venda/Loja.js";
import { calcularFornecedores } from "../../models/unidade-de-venda/fornecedores.js";
import { somarQtdTotalEstoque, calcularSaldoLiquido, getEstoque, listarUsuariosPorUnidade, listarSaidasPorUnidade } from "../../models/estoque_produtos_lotes/estoque.js";
 

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


//LISTAR PRODUTOS 
export const listarProdutosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        message: "Usuário não possui unidade vinculada à sessão."
      });
    }

    const produtos = await prisma.produto.findMany({
      where: { unidadeId: Number(unidadeId) },
      select: {
        id: true,
        nome: true,
        categoria: true,
        preco: true,
        descricao: true,
        dataFabricacao: true,
        dataValidade: true
      },
      orderBy: { nome: "asc" }
    });

    return res.json({
      sucesso: true,
      produtos,
      message: "Produtos da unidade listados com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar produtos",
      detalhes: error.message
    });
  }
};


// ✅ SOMA TOTAL DE ITENS NO ESTOQUE
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

// ✅ LISTA O ESTOQUE
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
