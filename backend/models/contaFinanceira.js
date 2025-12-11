import prisma from '../prisma/client.js';

// ============ FUNÇÃO AUXILIAR PARA VALIDAR E CONVERTER DATAS ============

/**
 * Valida e converte uma string de data para um objeto Date válido
 * @param {string|Date|null|undefined} dateValue - Valor da data a ser validado
 * @param {boolean} required - Se true, lança erro se a data for inválida
 * @returns {Date|null} - Objeto Date válido ou null
 */
const validarEConverterData = (dateValue, required = false) => {
  // Se for null ou undefined e não for obrigatório, retorna null
  if (!dateValue && !required) {
    return null;
  }

  // Se já for um objeto Date válido, retorna ele mesmo
  if (dateValue instanceof Date) {
    if (isNaN(dateValue.getTime())) {
      if (required) {
        throw new Error('Data inválida: objeto Date com valor inválido');
      }
      return null;
    }
    return dateValue;
  }

  // Se for string, valida e converte
  if (typeof dateValue === 'string') {
    // Remove espaços e caracteres estranhos
    const cleanDate = dateValue.trim();
    
    // Verifica se está vazio
    if (!cleanDate) {
      if (required) {
        throw new Error('Data é obrigatória');
      }
      return null;
    }

    // Tenta criar a data
    const date = new Date(cleanDate);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      if (required) {
        throw new Error(`Data inválida: "${cleanDate}"`);
      }
      return null;
    }

    // Verifica se a data não está em um range absurdo (anos muito grandes)
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      if (required) {
        throw new Error(`Data fora do range válido (1900-2100): "${cleanDate}"`);
      }
      return null;
    }

    return date;
  }

  // Se chegou aqui e é obrigatório, lança erro
  if (required) {
    throw new Error(`Tipo de data inválido: ${typeof dateValue}`);
  }

  return null;
};

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
      dataPagamento = null,
      parcela = null,
      totalParcelas = null,
      documento = null,
      observacao = null
    } = dados;

    // Validar e converter datas
    const competenciaDate = validarEConverterData(competencia, false);
    
    // Para ENTRADA, vencimento é opcional (usa competência se não informado)
    // Para SAIDA, vencimento é obrigatório
    let vencimentoDate = null;
    if (tipoMovimento === 'ENTRADA') {
      // Se não houver vencimento, usa a competência (vencimento é opcional para ENTRADA)
      vencimentoDate = validarEConverterData(vencimento, false) || competenciaDate;
    } else {
      // Para SAIDA, vencimento é obrigatório
      vencimentoDate = validarEConverterData(vencimento, true);
      if (!vencimentoDate) {
        throw new Error('Data de vencimento é obrigatória e deve ser válida para despesas');
      }
    }

    // Para ENTRADA, status é sempre RECEBIDA (não há pendência)
    // Para SAIDA, status é PENDENTE, mas se houver dataPagamento, é PAGA
    let statusInicial = tipoMovimento === 'ENTRADA' ? 'PAGA' : 'PENDENTE';
    
    // Validar e converter dataPagamento se fornecida
    let dataPagamentoDate = null;
    if (dataPagamento) {
      dataPagamentoDate = validarEConverterData(dataPagamento, false);
      if (dataPagamentoDate && tipoMovimento === 'SAIDA') {
        statusInicial = 'PAGA';
      }
    }

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
        competencia: competenciaDate,
        vencimento: vencimentoDate,
        dataPagamento: dataPagamentoDate,
        parcela,
        totalParcelas,
        documento,
        observacao,
        status: statusInicial
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

    console.log(`[listarContasFinanceirasComFiltros] unidadeId: ${unidadeId}, filtros:`, filtros);

    let where = {
      unidadeId: Number(unidadeId),
      deletadoEm: null
    };

    // Filtrar por mês e ano
    // Filtrar por competencia OU vencimento no período (qualquer um que estiver no período)
    if (mes && ano) {
      // Usar UTC para evitar problemas de fuso horário
      // dataInicio: primeiro dia do mês às 00:00:00 UTC
      const dataInicio = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0, 0));
      // dataFim: último dia do mês às 23:59:59.999 UTC
      const ultimoDiaDoMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
      const dataFim = new Date(Date.UTC(ano, mes - 1, ultimoDiaDoMes, 23, 59, 59, 999));
      
      console.log(`[listarContasFinanceirasComFiltros] Filtrando por mês ${mes}/${ano}`);
      console.log(`[listarContasFinanceirasComFiltros] dataInicio: ${dataInicio.toISOString()}`);
      console.log(`[listarContasFinanceirasComFiltros] dataFim: ${dataFim.toISOString()}`);
      
      // Usar OR para pegar contas onde:
      // 1. A competencia está no período, OU
      // 2. O vencimento está no período (independente de ter competencia ou não)
      where.OR = [
        // Contas com competencia no período
        {
          competencia: {
            gte: dataInicio,
            lte: dataFim
          }
        },
        // Contas com vencimento no período (inclui tanto as que têm quanto as que não têm competencia)
        {
          vencimento: {
            gte: dataInicio,
            lte: dataFim
          }
        }
      ];
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

    console.log(`[listarContasFinanceirasComFiltros] where clause:`, JSON.stringify(where, null, 2));
    
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

    console.log(`[listarContasFinanceirasComFiltros] Total de contas encontradas: ${contas.length}`);
    if (contas.length > 0) {
      console.log(`[listarContasFinanceirasComFiltros] Primeira conta:`, {
        id: contas[0].id,
        competencia: contas[0].competencia,
        vencimento: contas[0].vencimento,
        tipoMovimento: contas[0].tipoMovimento,
        unidadeId: contas[0].unidadeId
      });
    } else if (mes && ano) {
      // Se não encontrou nada e há filtro de mês/ano, verificar quais datas existem
      const contasSemFiltro = await prisma.financeiro.findMany({
        where: {
          unidadeId: Number(unidadeId),
          deletadoEm: null,
          ...(tipoMovimento ? { tipoMovimento } : {})
        },
        select: {
          id: true,
          competencia: true,
          vencimento: true,
          tipoMovimento: true
        },
        take: 5,
        orderBy: { competencia: 'desc' }
      });
      
      if (contasSemFiltro.length > 0) {
        console.log(`[listarContasFinanceirasComFiltros] Nenhuma conta encontrada para ${mes}/${ano}. Exemplos de datas disponíveis:`, 
          contasSemFiltro.map(c => ({
            competencia: c.competencia ? new Date(c.competencia).toLocaleDateString('pt-BR') : null,
            vencimento: c.vencimento ? new Date(c.vencimento).toLocaleDateString('pt-BR') : null,
            tipoMovimento: c.tipoMovimento
          }))
        );
      } else {
        console.log(`[listarContasFinanceirasComFiltros] Nenhuma conta financeira encontrada para esta unidade (unidadeId: ${unidadeId})`);
        
        // Verificar se há dados financeiros em outras unidades ou sem filtro de tipo
        const totalContas = await prisma.financeiro.count({
          where: { deletadoEm: null }
        });
        
        if (totalContas > 0) {
          // Verificar quais unidades têm dados
          const unidadesComDados = await prisma.financeiro.findMany({
            where: { deletadoEm: null },
            select: { unidadeId: true, competencia: true, vencimento: true },
            distinct: ['unidadeId'],
            take: 5
          });
          
          console.log(`[listarContasFinanceirasComFiltros] ⚠️ ATENÇÃO: Existem ${totalContas} contas no banco, mas nenhuma para unidadeId ${unidadeId}`);
          console.log(`[listarContasFinanceirasComFiltros] Unidades com dados:`, unidadesComDados.map(u => ({
            unidadeId: u.unidadeId,
            competencia: u.competencia ? new Date(u.competencia).toLocaleDateString('pt-BR') : null,
            vencimento: u.vencimento ? new Date(u.vencimento).toLocaleDateString('pt-BR') : null
          })));
        } else {
          console.log(`[listarContasFinanceirasComFiltros] ⚠️ ATENÇÃO: Não há nenhuma conta financeira no banco de dados. Execute o seed para criar dados de exemplo.`);
        }
      }
    }

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
    if (competencia) {
      const competenciaDate = validarEConverterData(competencia, false);
      if (competenciaDate) dataAtualizacao.competencia = competenciaDate;
    }
    if (vencimento) {
      const vencimentoDate = validarEConverterData(vencimento, true);
      if (vencimentoDate) dataAtualizacao.vencimento = vencimentoDate;
    }
    if (dataPagamento !== undefined) {
      if (dataPagamento === null || dataPagamento === '') {
        // Se dataPagamento for null ou string vazia, remover a data de pagamento
        dataAtualizacao.dataPagamento = null;
        // Se remover dataPagamento e status não foi explicitamente definido, voltar para PENDENTE
        if (!status) {
          dataAtualizacao.status = 'PENDENTE';
        }
      } else {
        const dataPagamentoDate = validarEConverterData(dataPagamento, false);
        if (dataPagamentoDate) {
          dataAtualizacao.dataPagamento = dataPagamentoDate;
          // Se há dataPagamento e status não foi explicitamente definido, marcar como PAGA
          if (!status) {
            dataAtualizacao.status = 'PAGA';
          }
        }
      }
    }
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
    const dataPagamentoDate = dataPagamento 
      ? validarEConverterData(dataPagamento, false) || new Date()
      : new Date();

    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: {
        status: 'PAGA',
        dataPagamento: dataPagamentoDate,
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
    const dataRecebimentoDate = dataRecebimento 
      ? validarEConverterData(dataRecebimento, false) || new Date()
      : new Date();

    const conta = await prisma.financeiro.update({
      where: { id: Number(contaId) },
      data: {
        status: 'PAGA',
        dataPagamento: dataRecebimentoDate,
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
