import { prisma } from "../prisma/client.js";
import { mostrarSaldoF, buscarProdutoMaisVendido, listarProdutos,contarVendasPorMesUltimos6Meses, criarVenda } from "../models/Loja";
import { calcularFornecedores } from "../models/fornecedores";
import { somarQtdTotalEstoque, calcularSaldoLiquido, getEstoque, listarUsuariosPorUnidade, listarSaidasPorUnidade } from "../models/funcoes_gerais";

//SALDO FINAL
export const mostrarSaldoFController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;
    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        message: "Usuário não possui unidade vinculada à sessão."
      });
    }
    const agora = new Date();
    const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

    const caixaDeHoje = await prisma.caixa.findFirst({
      where: {
        unidadeId: Number(unidadeId),
        abertoEm: { gte: inicioDoDia, lte: fimDoDia },
      },
      select: { id: true, saldoFinal: true, abertoEm: true },
      orderBy: { abertoEm: "desc" },
    });

    if (!caixaDeHoje) {
      return res.json({
        sucesso: false,
        message: "Nenhum caixa encontrado para hoje."
      });
    }

    return res.json({
      sucesso: true,
      saldoFinal: caixaDeHoje.saldoFinal ?? 0,
      message: "Saldo final do caixa de hoje encontrado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao ver saldo final",
      detalhes: error.message
    });
  }
};


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

//CONTAR VENDAS DOS ULTIMOS 6 MESES
export const contarVendasPorMesUltimos6MesesController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada à sessão."
      });
    }
    const resultado = await contarVendasPorMesUltimos6Meses(Number(unidadeId));

    return res.status(200).json({
      sucesso: true,
      mensagem: "Totais de vendas por mês obtidos com sucesso.",
      dados: resultado,
    });
  } catch (error) {
    console.error("Erro no controller ao contar vendas por mês:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao contar vendas por mês.",
      detalhes: error.message,
    });
  }
};


//CRIAR VENDA
export const criarVendaController = async (req, res) => {
  try {
    const usuario = req.session?.usuario;

    if (!usuario || !usuario.unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou usuário sem unidade associada."
      });
    }

    req.body.unidadeId = usuario.unidadeId;
    req.body.usuarioId = usuario.id;

    await criarVenda(req, res);

  } catch (error) {
    console.error("Erro no controller ao criar venda:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao criar venda.",
      detalhes: error.message,
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

// ✅ CALCULA SALDO LÍQUIDO
export const calcularSaldoLiquidoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await calcularSaldoLiquido(unidadeId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao calcular saldo líquido:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao calcular saldo líquido.",
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

// ✅ LISTA USUÁRIOS DA UNIDADE
export const listarUsuariosPorUnidadeController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
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

// ✅ LISTA SAÍDAS DA UNIDADE
export const listarSaidasPorUnidadeController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await listarSaidasPorUnidade(unidadeId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao listar saídas:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar saídas da unidade.",
      detalhes: error.message,
    });
  }
};

