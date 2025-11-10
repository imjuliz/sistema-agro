import prisma from "../../prisma/client.js";
import { calcularLucro, listarSaidas, listarVendas, somarDiaria, somarSaidas, calcularSaldoLiquido, listarSaidasPorUnidade , mostrarSaldoF, buscarProdutoMaisVendido, contarVendasPorMesUltimos6Meses, criarVenda} from '../../models/financeiro/vendas_despesas.js'

// MOSTRAR SALDO FINAL DO CAIXA DE HOJE -- rota feita
export const mostrarSaldoFController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({ sucesso: false, erro: "Usuário não possui unidade vinculada à sessão." });
    }
    const resultado = await mostrarSaldoF(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      saldoFinal: resultado.saldoFinal ?? 0
    });

  } catch (error) {
    console.error("Erro no controller ao mostrar saldo final:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao mostrar saldo final.",
      detalhes: error.message,
    });
  }
};

// BUSCAR PRODUTO MAIS VENDIDO -- rota feita
export const buscarProdutoMaisVendidoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({ sucesso: false, erro: "Usuário não possui unidade vinculada à sessão." });
    }
    const resultado = await buscarProdutoMaisVendido(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      produto: resultado.produto ?? null,
    });

  } catch (error) {
    console.error("Erro no controller ao buscar produto mais vendido:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao buscar produto mais vendido.",
      detalhes: error.message,
    });
  }
};

//CONTAR VENDAS DOS ULTIMOS 6 MESES
// // LISTAR PRODUTOS DA UNIDADE -- rota feita
// export const listarProdutosController = async (req, res) => {
//   try {
//     const unidadeId = req.session?.usuario?.unidadeId;

//     if (!unidadeId) {
//       return res.status(401).json({sucesso: false,erro: "Usuário não possui unidade vinculada à sessão."});
//     }

//     const resultado = await listarProdutos(Number(unidadeId));

//     return res.status(200).json({
//       sucesso: resultado.sucesso,
//       message: resultado.message,
//       produtos: resultado.fornecedores ?? [],
//     });

//   } catch (error) {
//     console.error("Erro no controller ao listar produtos:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro no controller ao listar produtos.",
//       detalhes: error.message,
//     });
//   }
// };

//CONTAR VENDAS DOS ULTIMOS 6 MESES -- rota feita
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

//CRIAR VENDA --rota feita
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

// // SOMA TOTAL DE ITENS NO ESTOQUE -- rota feita
// export const somarQtdTotalEstoqueController = async (req, res) => {
//   try {
//     const unidadeId = req.session?.usuario?.unidadeId;

//     if (!unidadeId) {
//       return res.status(401).json({
//         sucesso: false,
//         erro: "Sessão inválida ou unidade não identificada.",
//       });
//     }

//     const resultado = await somarQtdTotalEstoque(unidadeId);

//     return res.status(200).json(resultado);
//   } catch (error) {
//     console.error("Erro no controller ao somar estoque:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao somar itens no estoque.",
//       detalhes: error.message,
//     });
//   }
// };

// CALCULA SALDO LÍQUIDO -- rota feita
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

// // LISTA O ESTOQUE -- rota feita
// export const listarEstoqueController = async (req, res) => {
//   try {
//     const unidadeId = req.session?.usuario?.unidadeId;

//     if (!unidadeId) {
//       return res.status(401).json({
//         sucesso: false,
//         erro: "Sessão inválida ou unidade não identificada.",
//       });
//     }

//     const resultado = await getEstoque(unidadeId);
//     return res.status(200).json(resultado);
//   } catch (error) {
//     console.error("Erro ao listar estoque:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao listar estoque.",
//       detalhes: error.message,
//     });
//   }
// };

// // LISTA USUÁRIOS DA UNIDADE -- rota feita
// export const listarUsuariosPorUnidadeController = async (req, res) => {
//   try {
//     const unidadeId = req.session?.usuario?.unidadeId;

//     if (!unidadeId) {
//       return res.status(401).json({
//         sucesso: false,
//         erro: "Sessão inválida ou unidade não identificada.",
//       });
//     }

//     const resultado = await listarUsuariosPorUnidade(unidadeId);
//     return res.status(200).json(resultado);
//   } catch (error) {
//     console.error("Erro ao listar usuários da unidade:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao listar usuários da unidade.",
//       detalhes: error.message,
//     });
//   }
// };

// LISTA SAÍDAS DA UNIDADE -- rota feita
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

// das funções que eu (lorena) fiz:

export const somarDiariaController = async (req, res) => {
    try {
        const unidadeId = Number(req.params.unidadeId);

        if (isNaN(unidadeId)) {
            return res.status(400).json({ error: 'ID da unidade inválido.' });
        }
        const total = await somarDiaria(unidadeId);
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao calcular a soma diária.' });
    }
};

export const somarSaidasController = async (req, res) =>{
    try{
        const unidadeId = Number(req.params.unidadeId);

        if (isNaN(unidadeId)) {
            return res.status(400).json({ error: 'ID da unidade inválido.' });
        }
        const total = await somarSaidas(unidadeId);
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao calcular a soma das saídas.' });
    }

    }


export const calcularLucroController = async (req, res) => { //funcao assincrona
      try {
    // Pegamos a unidade logada (supondo que vem do middleware de autenticação)
    const unidadeId = req.user?.unidadeId;

    if (!unidadeId) {
      return res.status(400).json({ error: 'Unidade não encontrada para o usuário.' });
    }

    // Chama o model que retorna o lucro
    const resultado = await calcularLucro(unidadeId);

    return res.status(200).json({
      unidadeId,
      total_vendas: resultado.total_vendas,
      total_saidas: resultado.total_saidas,
      lucro: resultado.lucro,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular lucro do último mês.' });
  }
}

export const listarVendasController = async(req, res) =>{
    try{
        const unidadeId = req.user?.unidadeId;
        const vendas = await listarVendas(unidadeId);
        res.status(200).json(vendas);
    } catch(error) {
        console.error(error);
        return res.status(500).json({erro: 'Erro ao listar vendas.'})
    }
}
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

