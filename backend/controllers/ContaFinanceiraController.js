import {
  criarContaFinanceira,
  listarContasFinanceirasComFiltros,
  obterContaFinanceiraPorId,
  atualizarContaFinanceira,
  marcarComoPaga,
  marcarComoRecebida,
  deletarContaFinanceira,
  obterResumoFinanceiroPorPeriodo,
  obterSaldoPorCategoria
} from '../models/contaFinanceira.js';

// ============ CONTAS FINANCEIRAS ============

export const criarContaController = async (req, res) => {
  try {
    const criadoPorId = req.session?.usuario?.id;
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Sessão inválida'
      });
    }

    const {
      descricao,
      tipoMovimento,
      categoriaId,
      subcategoriaId,
      formaPagamento,
      valor,
      competencia,
      vencimento,
      documento,
      observacao
    } = req.body;

    if (!descricao || !tipoMovimento || !valor || !vencimento) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios faltando: descricao, tipoMovimento, valor, vencimento'
      });
    }

    const conta = await criarContaFinanceira({
      unidadeId,
      criadoPorId,
      descricao,
      tipoMovimento,
      categoriaId,
      subcategoriaId,
      formaPagamento,
      valor,
      competencia,
      vencimento,
      documento,
      observacao
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar conta',
      detalhes: error.message
    });
  }
};

export const listarContasController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    const {
      mes,
      ano,
      tipoMovimento,
      status,
      categoriaId,
      subcategoriaId
    } = req.query;

    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);
    if (tipoMovimento) filtros.tipoMovimento = tipoMovimento;
    if (status) filtros.status = status;
    if (categoriaId) filtros.categoriaId = categoriaId;
    if (subcategoriaId) filtros.subcategoriaId = subcategoriaId;

    const contas = await listarContasFinanceirasComFiltros(unidadeId, filtros);

    return res.status(200).json({
      sucesso: true,
      dados: contas
    });
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar contas',
      detalhes: error.message
    });
  }
};

export const obterContaController = async (req, res) => {
  try {
    const { contaId } = req.params;

    const conta = await obterContaFinanceiraPorId(contaId);

    if (!conta) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Conta não encontrada'
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao obter conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter conta',
      detalhes: error.message
    });
  }
};

export const atualizarContaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const dados = req.body;

    const conta = await atualizarContaFinanceira(contaId, dados);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta atualizada com sucesso',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar conta',
      detalhes: error.message
    });
  }
};

export const marcarComoPagaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const { dataPagamento } = req.body;

    const conta = await marcarComoPaga(contaId, dataPagamento);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta marcada como paga',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao marcar como paga:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao marcar como paga',
      detalhes: error.message
    });
  }
};

export const marcarComoRecebidaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const { dataRecebimento } = req.body;

    const conta = await marcarComoRecebida(contaId, dataRecebimento);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta marcada como recebida',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao marcar como recebida:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao marcar como recebida',
      detalhes: error.message
    });
  }
};

export const deletarContaController = async (req, res) => {
  try {
    const { contaId } = req.params;

    const conta = await deletarContaFinanceira(contaId);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar conta',
      detalhes: error.message
    });
  }
};

// ============ RELATÓRIOS ============

export const obterResumoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;
    const { mes, ano } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    if (!mes || !ano) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Mês e ano são obrigatórios'
      });
    }

    const resumo = await obterResumoFinanceiroPorPeriodo(unidadeId, parseInt(mes), parseInt(ano));

    return res.status(200).json({
      sucesso: true,
      dados: resumo
    });
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter resumo',
      detalhes: error.message
    });
  }
};

export const obterSaldoPorCategoriaController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;
    const { mes, ano, tipoMovimento } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    if (!mes || !ano || !tipoMovimento) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Mês, ano e tipo de movimento são obrigatórios'
      });
    }

    const saldo = await obterSaldoPorCategoria(
      unidadeId,
      parseInt(mes),
      parseInt(ano),
      tipoMovimento
    );

    return res.status(200).json({
      sucesso: true,
      dados: saldo
    });
  } catch (error) {
    console.error('Erro ao obter saldo por categoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter saldo por categoria',
      detalhes: error.message
    });
  }
};
