import { listarSaidas, listarVendas, somarDiaria, somarSaidas, calcularSaldoLiquido, listarSaidasPorUnidade, mostrarSaldoF, buscarProdutoMaisVendido, contarVendasPorMesUltimos6Meses, criarVenda, calcularLucroDoMes, somarEntradaMensal, criarNotaFiscal, calcularMediaPorTransacaoDiaria, somarPorPagamentoDiario, listarDespesas, abrirCaixa } from '../models/Financeiro.js';
import fs from "fs";

// ABRIR CAIXA
export const abrirCaixaController = async (req, res) => {
  try {
    const usuario = req.usuario || req.session?.usuario;

    if (!usuario || !usuario.unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou usuário sem unidade associada."
      });
    }

    const { saldoInicial } = req.body;
    const resultado = await abrirCaixa(usuario.id, usuario.unidadeId, saldoInicial || 0);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao abrir caixa:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao abrir caixa.",
      detalhes: error.message,
    });
  }
};

// MOSTRAR SALDO FINAL DO CAIXA DE HOJE -- rota feita
export const mostrarSaldoFController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId || req.session?.usuario?.unidadeId;

    if (!unidadeId) { return res.status(401).json({ sucesso: false, erro: "Usuário não possui unidade vinculada." }); }
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

//CONTAR VENDAS DOS ULTIMOS 6 MESES -- rota feita
export const contarVendasPorMesUltimos6MesesController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId || req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada."
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
    console.log('🔍 criarVendaController chamado');
    console.log('req.usuario:', req.usuario);
    console.log('req.session?.usuario:', req.session?.usuario);
    
    const usuario = req.usuario || req.session?.usuario;
    
    console.log('✓ usuario após fallback:', usuario);

    if (!usuario || !usuario.unidadeId) {
      console.error('❌ Usuário inválido ou sem unidadeId:', usuario);
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou usuário sem unidade associada."
      });
    }

    console.log('✓ Atribuindo usuarioId e unidadeId ao req.body');
    req.body.unidadeId = usuario.unidadeId;
    req.body.usuarioId = usuario.id;
    
    console.log('req.body após atribuição:', req.body);

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

// CALCULA SALDO LÍQUIDO -- rota feita
export const calcularSaldoLiquidoController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId || req.session?.usuario?.unidadeId;

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

// LISTA SAÍDAS DA UNIDADE -- rota feita
export const listarSaidasPorUnidadeController = async (req, res) => { //FUNCIONANDO
  try {
    const unidadeId = req.params.unidadeId || req.usuario?.unidadeId || req.session?.usuario?.unidadeId;

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

// //listar saidas especificas
// export const listarSaidasController = async (req, res) => {
//     try {
//         // unidadeId vem da autenticação
//         const unidadeId = req.params.unidadeId; //quando implemetar mudar para  req.usuario.unidadeId ou sei la

//         // tipo e data vêm do front
//         // const { tipo, data } = req.body;

//         if (!unidadeId) {
//       return res.status(401).json({
//         sucesso: false,
//         erro: "Sessão inválida ou unidade não identificada.",
//       });
//     }

//         const resposta = await listarSaidas(unidadeId);

//         return res.status(200).json(resposta);

//     } catch (error) {
//         return res.status(500).json({
//             sucesso: false,
//             mensagem: "Erro no controller ao listar saídas",
//             detalhes: error.message
//         });
//     }
// };

export const somarDiariaController = async (req, res) => { //FUNCIONANDO
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (isNaN(unidadeId)) { return res.status(400).json({ error: 'ID da unidade inválido.' }); }

    const total = await somarDiaria(unidadeId);
    return res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular a soma diária.' });
  }
};

// MÉDIA POR TRANSAÇÃO (vendas do dia)
export const calcularMediaPorTransacaoController = async (req, res) => {
  try {
    const unidadeId = Number(req.params.unidadeId);

    console.log("🔎 Recebido unidadeId:", unidadeId);

    const resultado = await calcularMediaPorTransacaoDiaria(unidadeId);

    console.log("📘 Resultado da média:", resultado);

    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }

    return res.status(200).json({
      sucesso: true,
      total: resultado.total,
      quantidade: resultado.quantidade,
      media: resultado.media,
    });

  } catch (error) {
    console.error("❌ Erro inesperado no controller:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro inesperado no controller.",
      detalhes: error.message,
    });
  }
};

// DIVISÃO POR FORMAS DE PAGAMENTO (vendas do dia)
export const divisaoPagamentosController = async (req, res) => {
  try {
    const unidadeId = Number(req.params.unidadeId) || req.session?.usuario?.unidadeId;
    if (!unidadeId || isNaN(unidadeId)) { return res.status(401).json({ sucesso: false, erro: 'Usuário sem unidade na sessão ou ID inválido.' }); }

    const resultado = await somarPorPagamentoDiario(Number(unidadeId));
    if (!resultado.sucesso) { return res.status(500).json(resultado); }

    return res.status(200).json({ sucesso: true, detalhamento: resultado.detalhamento });
  } catch (error) {
    console.error('Erro ao obter divisão por pagamentos:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao obter divisão por pagamentos.', detalhes: error.message });
  }
};

// BUSCAR PRODUTO MAIS VENDIDO (usando o model já existente)
export const buscarProdutoMaisVendidoController = async (req, res) => {
  try {
    const unidadeId = Number(req.params.unidadeId) || req.session?.usuario?.unidadeId;
    console.log('🔍 buscarProdutoMaisVendidoController - unidadeId:', unidadeId);
    
    if (!unidadeId || isNaN(unidadeId)) { 
      return res.status(401).json({ sucesso: false, erro: 'Usuário sem unidade na sessão ou ID inválido.' }); 
    }

    const resultado = await buscarProdutoMaisVendido(Number(unidadeId));
    console.log('📦 Resultado da busca:', resultado);
    
    if (!resultado.sucesso) { 
      return res.status(404).json(resultado); 
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao buscar produto mais vendido:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar produto mais vendido.', detalhes: error.message });
  }
};

export const somarEntradaMensalController = async (req, res) => { //TESTAR
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (isNaN(unidadeId)) { return res.status(400).json({ error: 'ID da unidade inválido.' }); }

    const total = await somarEntradaMensal(unidadeId);
    return res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular a soma das entradas mensais.' });
  }

}

export const somarSaidasController = async (req, res) => { //FUNCIONANDO
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (isNaN(unidadeId)) { return res.status(400).json({ error: 'ID da unidade inválido.' }); }
    const total = await somarSaidas(unidadeId);
    return res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular a soma das saídas.' });
  }
}


export const calcularLucroController = async (req, res) => { //TEM Q TESTAR 👍
  try {
    // Pegamos a unidade logada (supondo que vem do middleware de autenticação)
    const unidadeId = Number(req.params.unidadeId); //acredito que na hora de implementar no sistema tem que colocar req.user?.unidadeId

    if (!unidadeId || isNaN(unidadeId)) { return res.status(400).json({ error: 'Unidade não encontrada para o usuário.' }); }

    // Chama o model que retorna o lucro
    const resultado = await calcularLucroDoMes(unidadeId);

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

export const listarVendasController = async (req, res) => { //FUNCIONANDO
  try {
    const unidadeId = req.params.unidadeId;
    const vendas = await listarVendas(unidadeId);
    return res.status(200).json(vendas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao listar vendas.' })
  }
}

export const listarDespesasController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const despesas = await listarDespesas(unidadeId);
    if (despesas.sucesso) {
      return res.status(200).json(despesas);
    } else {
      return res.status(500).json({ erro: despesas.erro });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao listar despesas.' });
  }
};


// ------ 18/11/25


export const criarNotaFiscalController = async (req, res) => {
  try {
    const resultado = await criarNotaFiscal(req.body);

    if (!resultado.sucesso) {return res.status(400).json(resultado);}
    // Ler PDF
    const buffer = fs.readFileSync(resultado.pdfPath);

    // Enviar PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=nota_fiscal_${resultado.venda.id}.pdf`
    );
    return res.send(buffer);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao processar nota fiscal",
      detalhes: error.message
    });
  }
};
