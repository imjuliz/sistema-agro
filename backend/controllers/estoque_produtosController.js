import prisma from "../prisma/client.js";
import {
  somarQtdTotalEstoque,
  getEstoque,
  getProdutoPorId,
  createProduto,
  deleteProduto,
  listarProdutos,
  atualizarQntdMin,
} from "../models/estoque_produtos.js";
import { lotesPlantio } from "../models/Fazendas.js";
import {
  verPedidos,
  contarSaidas,
  listarPedidosEntrega,
  listarPedidosOrigem,
} from "../models/unidade-de-venda/Loja.js";

//BUSCAR PRODUTO MAIS VENDIDO
export const buscarProdutoMaisVendidoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        message: "Usuário não possui unidade vinculada à sessão.",
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
        message: "Nenhum item encontrado para esta unidade.",
      });
    }

    const produtoMaisVendido = resultado[0];

    const produto = await prisma.produto.findUnique({
      where: { id: produtoMaisVendido.produtoId },
      select: { id: true, nome: true, descricao: true },
    });

    return res.json({
      sucesso: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        quantidadeVendida: produtoMaisVendido._sum.quantidade,
      },
      message: "Produto mais vendido encontrado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar o produto mais vendido",
      detalhes: error.message,
    });
  }
};

// LISTAR PRODUTOS DA UNIDADE -- rota feita
export const listarProdutosController = async (req, res) => {
  try {
    console.log("usuaior oaosoodsajjdsajdioa:", req.usuario);
    const { unidadeId } = req.usuario;
    console.log("unidadeId:", unidadeId);

    if (!unidadeId) {
      return res
        .status(401)
        .json({
          sucesso: false,
          erro: "Usuário não possui unidade vinculada à sessão.",
        });
    }
    console.log("unidadeId:", unidadeId);
    const resultado = await listarProdutos(unidadeId);
   console.log("unidadeId:", unidadeId);
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

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "ID do produto inválido." });
    }

    const resultado = await getProdutoPorId(Number(id));

    if (!resultado.sucesso || !resultado.produto) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Produto não encontrado." });
    }
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

    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({
          sucesso: false,
          erro: "Os dados do produto são obrigatórios.",
        });
    }

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

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "ID do produto inválido." });
    }

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
      // Em vez de retornar 401 que pode causar refresh/loops no frontend,
      // devolvemos 200 com totalItens=0 para a UI lidar graciosamente.
      console.warn(
        "[somarQtdTotalEstoqueController] unidadeId não encontrado na sessão. retornando totalItens:0"
      );
      return res
        .status(200)
        .json({
          sucesso: true,
          totalItens: 0,
          message: "Nenhum estoque encontrado para a unidade.",
        });
    }

    const resultado = await somarQtdTotalEstoque(unidadeId);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(
      "Erro no controller ao somar estoque:",
      error && error.stack ? error.stack : error
    );
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao somar itens no estoque.",
      detalhes: error?.message ?? String(error),
    });
  }
};

export const listarEstoqueController = async (req, res) => {
  //FUNCIONANDO
  const unidadeId = req.usuario.unidadeId;

  const resultado = await getEstoque(unidadeId);
  // If model indicates no estoque found, return 200 with empty array
  if (!resultado.sucesso) {
    // Some model methods use sucesso=false for 'not found' cases but that's not an error for the UI.
    // If the controller received an empty estoque array, return 200 with empty result.
    if (Array.isArray(resultado.estoque) && resultado.estoque.length === 0) {
      return res
        .status(200)
        .json({
          sucesso: true,
          estoque: [],
          message: resultado.message ?? "Nenhum estoque encontrado.",
        });
    }
    // Otherwise treat as a real error
    return res.status(400).json(resultado);
  }

  return res.status(200).json(resultado);
};

export const AtividadesLoteAgricolaController = async (req, res) => {
  try {
    const loteId = req.body;
    const atividades = await listarAtividadesLote();
    return res.status(200).json(atividades);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ erro: "Erro ao listar atividades realizadas nos lotes." });
  }
};

export const consultarLoteController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const loteId = req.body.loteId;

    const atividadesLote = await consultarLote(unidadeId, loteId);
    return res.status(200).json(atividadesLote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao consultar atividades do lote." });
  }
};
//lotes
export const lotesPlantioController = async (req, res) => {
  try {
    const unidadeId = req.params?.unidadeId ?? req.user?.unidadeId;
    if (!unidadeId) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "unidadeId não informado." });
    }
    const lotesP = await lotesPlantio(unidadeId);
    res.status(200).json(lotesP);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao mostrar lotes da unidade!" });
  }
};

//////////////////////
// Função de 17/11 //
////////////////////
//listar pedidos ---- Não testada
export const listarPedidosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res
        .status(401)
        .json({
          sucesso: false,
          erro: "Usuário não possui unidade vinculada à sessão.",
        });
    }

    const resultado = await verPedidos(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      produtos: resultado,
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

//listar pedidos de entrega
export const listarPedidosEntregaController = async (req, res) => {
  try {
    const { unidadeId } = req.params;

    if (!unidadeId) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Unidade não informada." });
    }

    const resultado = await listarPedidosEntrega(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      pedidos: resultado.pedidos,
    });
  } catch (error) {
    console.error("Erro no controller ao listar os pedidos de entrega:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao listar os pedidos de entrega.",
      detalhes: error.message,
    });
  }
};

//listar pedidos de origem (para fazenda ver seus pedidos)
export const listarPedidosOrigemController = async (req, res) => {
  try {
    const { unidadeId } = req.params;

    if (!unidadeId) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Unidade não informada." });
    }

    const resultado = await listarPedidosOrigem(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      pedidos: resultado.pedidos,
    });
  } catch (error) {
    console.error("Erro no controller ao listar os pedidos de origem:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao listar os pedidos de origem.",
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

// Atualiza a quantidade mínima (qntdMin) de um EstoqueProduto
export const atualizarQntdMinController = async (req, res) => {
  try {
    const { id } = req.params;
    const { minimumStock, qntdMin } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ sucesso: false, erro: "ID inválido." });
    }

    const value = typeof minimumStock !== "undefined" ? minimumStock : qntdMin;

    if (
      typeof value === "undefined" ||
      value === null ||
      isNaN(Number(value))
    ) {
      return res
        .status(400)
        .json({
          sucesso: false,
          erro: "minimumStock (qntdMin) numérico obrigatório.",
        });
    }

    const resultado = await atualizarQntdMin(Number(id), Number(value));

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res
      .status(200)
      .json({
        sucesso: true,
        produto: resultado.produto,
        message: resultado.message,
      });
  } catch (error) {
    console.error("Erro ao atualizar qntdMin:", error);
    return res
      .status(500)
      .json({
        sucesso: false,
        erro: "Erro interno ao atualizar quantidade mínima.",
        detalhes: error.message,
      });
  }
};
