import prisma from '../prisma/client.js';

// ============ CONTAS FINANCEIRAS (Genérico - Entradas e Saídas) ============

export const criarContaFinanceira = async (dados) => {
  try {
    const {
      unidadeId,
      categoriaId,
      subcategoriaId,
      criadoPorId,
      descricao,
      tipoMovimento, // ENTRADA ou SAIDA
      formaPagamento,
      valor,
      competencia,
      vencimento,
      parcela = null,
      totalParcelas = null,
      documento = null,
      observacao = null
    } = dados;

    const conta = await prisma.financeiro.create({
      data: {
        unidadeId: Number(unidadeId),
        categoriaId: categoriaId ? Number(categoriaId) : null,
        subcategoriaId: subcategoriaId ? Number(subcategoriaId) : null,
        criadoPorId: criadoPorId ? Number(criadoPorId) : null,
        descricao,
        tipoMovimento,
        formaPagamento,
        valor: parseFloat(valor),
        competencia: competencia ? new Date(competencia) : null,
        vencimento: new Date(vencimento),
        parcela,
        totalParcelas,
        documento,
        observacao,
        status: 'PENDENTE'
      },
      include: {
        categoria: true,
        subcategoria: true,
        criadoPor: { select: { id: true, nome: true, email: true } },
        unidade: { select: { id: true, nome: true } }
      }
    });

    return conta;
  } catch (error) {
    throw new Error(`Erro ao criar conta financeira: ${error.message}`);
  }
};

export const listarContasFinanceirasComFiltros = async (unidadeId, filtros = {}) => {
  try {
    const {
      mes = null,
      ano = null,
      tipoMovimento = null,
      status = null,
      categoriaId = null,
      subcategoriaId = null
    } = filtros;

    let where = {
      unidadeId: Number(unidadeId),
      deletadoEm: null
    };

    // Filtrar por mês e ano
    if (mes && ano) {
      const dataInicio = new Date(ano, mes - 1, 1);
      const dataFim = new Date(ano, mes, 0, 23, 59, 59);
      where.competencia = {
        gte: dataInicio,
        lte: dataFim
      };
    }

    // Filtrar por tipo de movimento
    if (tipoMovimento) {
      where.tipoMovimento = tipoMovimento;
    }

    // Filtrar por status
    if (status) {
      where.status = status;
    }

    // Filtrar por categoria
    if (categoriaId) {
      where.categoriaId = Number(categoriaId);
    }

    // Filtrar por subcategoria
    if (subcategoriaId) {
      where.subcategoriaId = Number(subcategoriaId);
    }

    const contas = await prisma.financeiro.findMany({
      where,
      include: {
        categoria: true,
        subcategoria: true,
        criadoPor: { select: { id: true, nome: true } },
        unidade: { select: { id: true, nome: true } }
      },
      orderBy: [
        { vencimento: 'asc' },
        { criadoEm: 'desc' }
      ]
    });

    return contas;
  } catch (error) {
    throw new Error(`Erro ao listar contas financeiras: ${error.message}`);
  }
};

export const obterContaFinanceiraPorId = async (contaId) => {
  try {
    const conta = await prisma.financeiro.findUnique({
      where: { id: Number(contaId) },
      include: {
        categoria: true,
        subcategoria: true,
        criadoPor: { select: { id: true, nome: true, email: true } },
        unidade: { select: { id: true, nome: true } }
      }
    });
    return conta;
  } catch (error) {
    throw new Error(`Erro ao obter conta financeira: ${error.message}`);
  }
};

export const atualizarContaFinanceira = async (contaId, dados) => {
  try {
    const {
      descricao,
      categoriaId,
      subcategoriaId,
      formaPagamento,
      valor,
      competencia,
      vencimento,
      dataPagamento,
      status,
      documento,
      observacao
    } = dados;

    const dataAtualizacao = {
      atualizadoEm: new Date()
    };

    if (descricao) dataAtualizacao.descricao = descricao;
    if (categoriaId !== undefined) dataAtualizacao.categoriaId = categoriaId ? Number(categoriaId) : null;
    if (subcategoriaId !== undefined) dataAtualizacao.subcategoriaId = subcategoriaId ? Number(subcategoriaId) : null;
    if (formaPagamento) dataAtualizacao.formaPagamento = formaPagamento;
    if (valor) dataAtualizacao.valor = parseFloat(valor);
    if (competencia) dataAtualizacao.competencia = new Date(competencia);
    if (vencimento) dataAtualizacao.vencimento = new Date(vencimento);
    if (dataPagamento) dataAtualizacao.dataPagamento = new Date(dataPagamento);
    if (status) dataAtualizacao.status = status;
    if (documento) dataAtualizacao.documento = documento;
    if (observacao !== undefined) dataAtualizacao.observacao = observacao;

    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: dataAtualizacao,
      include: {
        categoria: true,
        subcategoria: true,
        criadoPor: { select: { id: true, nome: true } },
        unidade: { select: { id: true, nome: true } }
      }
    });

    return conta;
  } catch (error) {
    throw new Error(`Erro ao atualizar conta financeira: ${error.message}`);
  }
};

export const marcarComoPaga = async (contaId, dataPagamento = null) => {
  try {
    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: {
        status: 'PAGA',
        dataPagamento: dataPagamento ? new Date(dataPagamento) : new Date(),
        atualizadoEm: new Date()
      },
      include: {
        categoria: true,
        subcategoria: true
      }
    });
    return conta;
  } catch (error) {
    throw new Error(`Erro ao marcar conta como paga: ${error.message}`);
  }
};

export const marcarComoRecebida = async (contaId, dataRecebimento = null) => {
  try {
    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: {
        status: 'PAGA',
        dataPagamento: dataRecebimento ? new Date(dataRecebimento) : new Date(),
        atualizadoEm: new Date()
      },
      include: {
        categoria: true,
        subcategoria: true
      }
    });
    return conta;
  } catch (error) {
    throw new Error(`Erro ao marcar conta como recebida: ${error.message}`);
  }
};

export const deletarContaFinanceira = async (contaId) => {
  try {
    // Soft delete
    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: {
        deletadoEm: new Date(),
        atualizadoEm: new Date()
      }
    });
    return conta;
  } catch (error) {
    throw new Error(`Erro ao deletar conta financeira: ${error.message}`);
  }
};

// ============ RELATÓRIOS E RESUMOS ============

export const obterResumoFinanceiroPorPeriodo = async (unidadeId, mes, ano) => {
  try {
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59);

    const contas = await prisma.financeiro.findMany({
      where: {
        unidadeId: Number(unidadeId),
        competencia: {
          gte: dataInicio,
          lte: dataFim
        },
        deletadoEm: null
      },
      include: {
        categoria: true,
        subcategoria: true
      }
    });

    // Separar entradas e saídas
    const entradas = contas.filter(c => c.tipoMovimento === 'ENTRADA');
    const saidas = contas.filter(c => c.tipoMovimento === 'SAIDA');

    // Calcular totais
    const totalEntradaPendente = entradas
      .filter(c => c.status === 'PENDENTE')
      .reduce((sum, c) => sum + parseFloat(c.valor), 0);

    const totalEntradaRecebida = entradas
      .filter(c => c.status === 'PAGA')
      .reduce((sum, c) => sum + parseFloat(c.valor), 0);

    const totalSaidaPendente = saidas
      .filter(c => c.status === 'PENDENTE')
      .reduce((sum, c) => sum + parseFloat(c.valor), 0);

    const totalSaidaPaga = saidas
      .filter(c => c.status === 'PAGA')
      .reduce((sum, c) => sum + parseFloat(c.valor), 0);

    return {
      periodo: { mes, ano },
      entradas: {
        pendente: totalEntradaPendente,
        recebida: totalEntradaRecebida,
        total: totalEntradaPendente + totalEntradaRecebida
      },
      saidas: {
        pendente: totalSaidaPendente,
        paga: totalSaidaPaga,
        total: totalSaidaPendente + totalSaidaPaga
      },
      resultado: (totalEntradaPendente + totalEntradaRecebida) - (totalSaidaPendente + totalSaidaPaga),
      contas
    };
  } catch (error) {
    throw new Error(`Erro ao obter resumo financeiro: ${error.message}`);
  }
};

export const obterSaldoPorCategoria = async (unidadeId, mes, ano, tipoMovimento) => {
  try {
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59);

    const contas = await prisma.financeiro.findMany({
      where: {
        unidadeId: Number(unidadeId),
        tipoMovimento,
        competencia: {
          gte: dataInicio,
          lte: dataFim
        },
        deletadoEm: null
      },
      include: {
        categoria: true,
        subcategoria: true
      }
    });

    // Agrupar por categoria
    const porCategoria = {};
    contas.forEach(conta => {
      const categoryKey = conta.categoria?.nome || 'Sem Categoria';
      if (!porCategoria[categoryKey]) {
        porCategoria[categoryKey] = {
          nome: categoryKey,
          categoriaId: conta.categoriaId,
          pendente: 0,
          paga: 0,
          total: 0,
          subcategorias: {}
        };
      }

      const valor = parseFloat(conta.valor);
      porCategoria[categoryKey].total += valor;

      if (conta.status === 'PENDENTE') {
        porCategoria[categoryKey].pendente += valor;
      } else if (conta.status === 'PAGA') {
        porCategoria[categoryKey].paga += valor;
      }

      // Agrupar por subcategoria também
      const subcategoryKey = conta.subcategoria?.nome || 'Geral';
      if (!porCategoria[categoryKey].subcategorias[subcategoryKey]) {
        porCategoria[categoryKey].subcategorias[subcategoryKey] = {
          nome: subcategoryKey,
          subcategoriaId: conta.subcategoriaId,
          pendente: 0,
          paga: 0,
          total: 0
        };
      }

      porCategoria[categoryKey].subcategorias[subcategoryKey].total += valor;
      if (conta.status === 'PENDENTE') {
        porCategoria[categoryKey].subcategorias[subcategoryKey].pendente += valor;
      } else if (conta.status === 'PAGA') {
        porCategoria[categoryKey].subcategorias[subcategoryKey].paga += valor;
      }
    });

    return porCategoria;
  } catch (error) {
    throw new Error(`Erro ao obter saldo por categoria: ${error.message}`);
  }
};
