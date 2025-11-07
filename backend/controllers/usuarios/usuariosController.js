import prisma from "../../prisma/client.js";
import { mostrarSaldoF, buscarProdutoMaisVendido, listarProdutos,contarVendasPorMesUltimos6Meses, criarVenda } from "../../models/unidade-de-venda/Loja.js";
import { calcularFornecedores } from "../../models/unidade-de-venda/fornecedores.js";
import { somarQtdTotalEstoque, calcularSaldoLiquido, getEstoque, listarUsuariosPorUnidade, listarSaidasPorUnidade } from "../../models/estoque_produtos_lotes/estoque.js";

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