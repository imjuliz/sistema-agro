import prisma from '../prisma/client.js';
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) => {//tem controller
    try {
        const saidas = await prisma.financeiro.findMany({ where: { unidadeId: Number(unidadeId)}, })
        return ({
            sucesso: true,
            saidas,
            message: "Saidas do tipo especificado listadas com sucesso!!"
        })
    }
    catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar saidas do tipo especificado",
            detalhes: error.message
        }
    }
}

export const buscarProdutoMaisVendido = async (unidadeId) => {
    try {
        const resultado = await prisma.itemVenda.groupBy({ // Agrupa os itens de venda por produto e soma a quantidade vendida
            by: ["produtoId"],
            _sum: { quantidade: true, },
            where: { venda: { unidadeId: Number(unidadeId), }, },
            orderBy: { _sum: { quantidade: "desc", }, },
            take: 1, // pega apenas o produto mais vendido
        });

        console.log('🔍 Resultado do groupBy:', resultado);

        if (resultado.length === 0) {
            console.log('⚠️ Nenhum item vendido para unidade:', unidadeId);
            return {
                sucesso: false,
                message: "Nenhum item encontrado para esta unidade.",
            };
        }
        const produtoMaisVendido = resultado[0];
        console.log('📊 Produto mais vendido (agrupado):', produtoMaisVendido);
        
        // Nota: ItemVenda.produtoId aponta para EstoqueProduto.id (não Produto.id)
        // Então podemos buscar diretamente pelo ID do EstoqueProduto
        console.log('🔎 Buscando EstoqueProduto com ID:', produtoMaisVendido.produtoId, 'para unidadeId:', unidadeId);
        
        // Busca informações do EstoqueProduto (não do Produto)
        // O produtoId em ItemVenda é na verdade o ID do EstoqueProduto
        const estoqueProduto = await prisma.estoqueProduto.findUnique({
            where: { 
                id: produtoMaisVendido.produtoId,
            },
            select: {
                id: true,
                nome: true,
                sku: true,
                marca: true,
                qntdAtual: true,
                qntdMin: true,
                precoUnitario: true,
                estoqueId: true,
            },
        });

        console.log('📦 EstoqueProduto encontrado:', estoqueProduto);

        if (!estoqueProduto) {
            console.log('⚠️ EstoqueProduto não encontrado para ID:', produtoMaisVendido.produtoId);
            return {
                sucesso: false,
                message: "EstoqueProduto não encontrado.",
            };
        }

        // Verifica se o estoque pertence à unidade correta
        if (estoqueProduto.estoqueId) {
            const estoque = await prisma.estoque.findUnique({
                where: { id: estoqueProduto.estoqueId },
                select: { unidadeId: true }
            });

            if (!estoque || estoque.unidadeId !== Number(unidadeId)) {
                console.log('⚠️ EstoqueProduto não pertence a esta unidade');
                return {
                    sucesso: false,
                    message: "EstoqueProduto não pertence a esta unidade.",
                };
            }
        }

        return {
            sucesso: true,
            estoqueProduto: {
                id: estoqueProduto.id,
                nome: estoqueProduto.nome,
                sku: estoqueProduto.sku,
                marca: estoqueProduto.marca,
                qntdAtual: estoqueProduto.qntdAtual,
                qntdMin: estoqueProduto.qntdMin,
                precoUnitario: estoqueProduto.precoUnitario,
                quantidadeVendida: produtoMaisVendido._sum.quantidade,
            },
            message: "Produto mais vendido encontrado com sucesso!",
        };
    } catch (error) {
        console.error('❌ Erro ao buscar o produto mais vendido:', error);
        return {
            sucesso: false,
            erro: "Erro ao buscar o produto mais vendido",
            detalhes: error.message,
        };
    }
};

// Função que soma as vendas do dia atual
export const somarDiaria = async (unidadeId) => {//tem controller
    const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM("total"), 0) AS total
    FROM "venda"
    WHERE DATE("criado_em") = CURRENT_DATE
      AND "unidade_id" = ${unidadeId};
  `;
    return result[0]?.total ?? 0;
};

// Média por transação das vendas do dia
export const calcularMediaPorTransacaoDiaria = async (unidadeId) => {
  try {
    console.log("🔍 Rodando query com unidadeId:", unidadeId);

    const [res] = await prisma.$queryRaw`
      SELECT 
        COALESCE(SUM("total"), 0) AS total,
        COUNT(*) AS quantidade
      FROM "venda"
      WHERE DATE(("criado_em" AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo')
            = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
        AND "unidade_id" = ${unidadeId};
    `;

    console.log("📥 Resultado bruto SQL:", res);

    const total = Number(res.total || 0);
    const quantidade = Number(res.quantidade || 0);

    console.log("📊 Parsed:", { total, quantidade });

    const media = quantidade > 0 ? total / quantidade : 0;

    return {
      sucesso: true,
      total,
      quantidade,
      media: Number(media.toFixed(2)),
    };

  } catch (error) {
    console.error("❌ Erro na query:", error);
    return {
      sucesso: false,
      erro: "Erro ao calcular média por transação",
      detalhes: error.message,
    };
  }
};

// Soma das vendas do dia agrupadas por forma de pagamento
export const somarPorPagamentoDiario = async (unidadeId) => {
    try {
        const rows = await prisma.$queryRaw`
            SELECT "pagamento" as pagamento, COALESCE(SUM("total"),0) as total
            FROM "venda"
            WHERE DATE("criado_em") = CURRENT_DATE
              AND "unidade_id" = ${unidadeId}
            GROUP BY "pagamento";
        `;

        // transformar em objeto com chaves (ex: PIX, DINHEIRO, CARTAO)
        const resultado = {};
        for (const r of rows) {
            // alguns drivers retornam pagamento como enum ou string
            const chave = r.pagamento || 'DESCONHECIDO';
            resultado[chave] = Number(r.total || 0);
        }

        // garantir chaves padrão mesmo que zero
        const padrao = { PIX: 0, DINHEIRO: 0, CARTAO: 0 };
        return {
            sucesso: true,
            detalhamento: { ...padrao, ...resultado },
            message: 'Totais por forma de pagamento calculados com sucesso',
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: 'Erro ao somar por pagamento',
            detalhes: error.message,
        };
    }
};

export const somarEntradaMensal = async (unidadeId) => { // Acho q agora funciona(ajuda do chatgpt)
    const result = await prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "criado_em"), 'YYYY-MM') AS mes,
        SUM("total") AS total_vendas
      FROM "venda"
      WHERE "unidade_id" = ${unidadeId}
      GROUP BY DATE_TRUNC('month', "criado_em")
      ORDER BY mes DESC;
    `;
    return result[0]?.total_vendas ?? 0;
}
  
export const somarSaidas = async (unidadeId) => {
    try {
        const agora = new Date();
        const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

        const agg = await prisma.financeiro.aggregate({
            _sum: { valor: true },
            where: {
                unidadeId: Number(unidadeId),
                tipoMovimento: 'SAIDA',
                criadoEm: { gte: inicioDoDia, lte: fimDoDia },
            },
        });

        return Number(agg._sum.valor ?? 0);
    } catch (e) {
        console.error('Erro em somarSaidas:', e);
        return 0;
    }
};

export const calcularLucroDoMes = async (unidadeId) => { //TESTAR
  // Calcular soma de vendas e saídas do mês anterior usando aggregates Prisma
  try {
    const hoje = new Date();
    const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59, 999);

    const vendasAgg = await prisma.venda.aggregate({
      _sum: { total: true },
      where: { unidadeId: Number(unidadeId), criadoEm: { gte: primeiroDiaMesAnterior, lte: ultimoDiaMesAnterior } },
    });

    const saidasAgg = await prisma.financeiro.aggregate({
      _sum: { valor: true },
      where: { unidadeId: Number(unidadeId), tipoMovimento: 'SAIDA', criadoEm: { gte: primeiroDiaMesAnterior, lte: ultimoDiaMesAnterior } },
    });

    const totalVendas = Number(vendasAgg._sum.total ?? 0);
    const totalSaidas = Number(saidasAgg._sum.valor ?? 0);

    return {
      total_vendas: totalVendas,
      total_saidas: totalSaidas,
      lucro: totalVendas - totalSaidas,
    };
  } catch (e) {
    console.error('Erro em calcularLucroDoMes:', e);
    return { total_vendas: 0, total_saidas: 0, lucro: 0 };
  }
}

// Resumo simples para o dashboard financeiro
export const getDashboardStats = async (unidadeId) => {
  try {
    const [payableAgg, receivedAgg, paidAgg] = await Promise.all([
      prisma.financeiro.aggregate({
        _sum: { valor: true },
        where: {
          unidadeId: Number(unidadeId),
          tipoMovimento: 'SAIDA',
          status: 'PENDENTE',
          deletadoEm: null,
        },
      }),
      prisma.financeiro.aggregate({
        _sum: { valor: true },
        where: {
          unidadeId: Number(unidadeId),
          tipoMovimento: 'ENTRADA',
          status: 'PAGA',
          deletadoEm: null,
        },
      }),
      prisma.financeiro.aggregate({
        _sum: { valor: true },
        where: {
          unidadeId: Number(unidadeId),
          tipoMovimento: 'SAIDA',
          status: 'PAGA',
          deletadoEm: null,
        },
      }),
    ]);

    return {
      totalPayable: Number(payableAgg._sum.valor ?? 0),
      totalReceived: Number(receivedAgg._sum.valor ?? 0),
      totalPaid: Number(paidAgg._sum.valor ?? 0),
    };
  } catch (error) {
    console.error('[getDashboardStats] erro:', error);
    return { totalPayable: 0, totalReceived: 0, totalPaid: 0, erro: error.message };
  }
};

export const listarVendas = async (unidadeId) => { //FUNCIONA 
    try {
        const vendas = await prisma.venda.findMany({ where: { unidadeId: Number(unidadeId) },});
        return ({
            sucesso: true,
            vendas,
            message: "Vendas listadas com sucesso!!"
        })
    } catch (error) {
        return ({
            sucesso: false,
            erro: "Erro ao listar vendas",
            detalhes: error.message
        })
    }
}

export const listarDespesas = async (unidadeId) => {
    try {
      const despesas = await prisma.financeiro.findMany({
        where: { unidadeId: Number(unidadeId), tipoMovimento: 'SAIDA' },
        select: {
          categoria: true,
          valor: true
        }
      });
  
      // Agrupar as despesas por categoria
      const categorias = despesas.reduce((acc, despesa) => {
        const categoria = despesa.categoria || "Outros"; // Caso não tenha categoria, usar "Outros"
        if (acc[categoria]) {acc[categoria] += despesa.valor;}
        else {acc[categoria] = despesa.valor;}
        return acc;
      }, {});
  
      // Transformar em array para fácil consumo pelo gráfico
      const categoriaArray = Object.keys(categorias).map(categoria => ({
        browser: categoria,
        visitors: categorias[categoria], // Reutilizando a chave "visitors" para o valor
        fill: "var(--color-" + categoria.toLowerCase().replace(/ /g, "-") + ")" // Estilo para cores diferentes
      }));
  
      return {
        sucesso: true,
        categoriaArray,
        message: "Despesas listadas com sucesso!!"
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao listar despesas",
        detalhes: error.message
      };
    }
  };

const toNumber = (value) => Number(value ?? 0);

// Recupera o caixa aberto para a unidade (hoje)
export const statusCaixaHoje = async (unidadeId) => {
  try {
    const agora = new Date();
    const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

    const caixa = await prisma.caixa.findFirst({
      where: {
        unidadeId: Number(unidadeId),
        abertoEm: { gte: inicioDoDia, lte: fimDoDia },
        status: true,
      },
      include: { vendas: { select: { total: true } } },
      orderBy: { abertoEm: "desc" },
    });

    if (!caixa) return { aberto: false, caixa: null, totalVendas: 0 };

    const totalVendas = (caixa.vendas || []).reduce((acc, v) => acc + toNumber(v.total), 0);

    return {
      aberto: true,
      caixa: {
        id: caixa.id,
        unidadeId: caixa.unidadeId,
        usuarioId: caixa.usuarioId,
        abertoEm: caixa.abertoEm,
        saldoInicial: toNumber(caixa.saldoInicial),
        saldoFinal: caixa.saldoFinal != null ? toNumber(caixa.saldoFinal) : null,
        status: caixa.status,
        totalVendas,
      },
      totalVendas,
    };
  } catch (error) {
    return { aberto: false, erro: "Erro ao consultar caixa", detalhes: error.message };
  }
};

// Função para abrir o caixa do dia
export const abrirCaixa = async (usuarioId, unidadeId, saldoInicial = 0) => {
    try {
        const agora = new Date();
        const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

        // Verificar se já existe um caixa aberto hoje
        const caixaExistente = await prisma.caixa.findFirst({
            where: {
                unidadeId: Number(unidadeId),
                abertoEm: { gte: inicioDoDia, lte: fimDoDia },
                status: true
            }
        });

        if (caixaExistente) {
            return {
                sucesso: true,
                caixa: caixaExistente,
                message: 'Caixa já estava aberto para hoje.'
            };
        }

        // Criar novo caixa
        const novoCaixa = await prisma.caixa.create({
            data: {
                unidadeId: Number(unidadeId),
                usuarioId: Number(usuarioId),
                abertoEm: agora,
                saldoInicial: saldoInicial,
                status: true
            }
        });

        console.log('✓ Caixa aberto com sucesso:', novoCaixa.id);
        return {
            sucesso: true,
            caixa: novoCaixa,
            message: 'Caixa aberto com sucesso!'
        };
    } catch (error) {
        console.error('Erro ao abrir caixa:', error);
        return {
            sucesso: false,
            erro: 'Erro ao abrir caixa',
            detalhes: error.message
        };
    }
};

export const listarCaixas = async (unidadeId, dataInicio = null, dataFim = null) => {
    try {
        const where = {
            unidadeId: Number(unidadeId)
        };

        // Se dataInicio e dataFim foram fornecidos, filtrar por período
        if (dataInicio && dataFim) {
            where.abertoEm = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim)
            };
        }

        const caixas = await prisma.caixa.findMany({
            where,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                unidade: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                vendas: {
                    select: {
                        id: true,
                        total: true,
                        criadoEm: true
                    }
                }
            },
            orderBy: {
                abertoEm: 'desc'
            }
        });

        return {
            sucesso: true,
            caixas: caixas,
            total: caixas.length
        };
    } catch (error) {
        console.error('Erro ao listar caixas:', error);
        return {
            sucesso: false,
            erro: 'Erro ao listar caixas',
            detalhes: error.message
        };
    }
};

// Fecha o caixa aberto de hoje e calcula saldo final
export const fecharCaixa = async (usuarioId, unidadeId) => {
  try {
    const status = await statusCaixaHoje(unidadeId);
    if (!status.aberto || !status.caixa) {
      return { sucesso: false, erro: "Nenhum caixa aberto encontrado para hoje." };
    }

    const caixaAberto = status.caixa;
    const vendasAgg = await prisma.venda.aggregate({
      _sum: { total: true },
      where: { caixaId: caixaAberto.id },
    });

    const totalVendas = toNumber(vendasAgg._sum.total);
    const saldoFinal = toNumber(caixaAberto.saldoInicial) + totalVendas;

    const caixaAtualizado = await prisma.caixa.update({
      where: { id: caixaAberto.id },
      data: {
        status: false,
        saldoFinal,
        fechadoEm: new Date(),
        usuarioId: Number(usuarioId),
      },
      include: { vendas: true },
    });

    return {
      sucesso: true,
      caixa: {
        ...caixaAtualizado,
        saldoInicial: toNumber(caixaAtualizado.saldoInicial),
        saldoFinal: caixaAtualizado.saldoFinal != null ? toNumber(caixaAtualizado.saldoFinal) : saldoFinal,
      },
      totalVendas,
      saldoFinal,
    };
  } catch (error) {
    console.error("Erro ao fechar caixa:", error);
    return { sucesso: false, erro: "Erro ao fechar caixa", detalhes: error.message };
  }
};

//do arquivo Loja.js
export const mostrarSaldoF = async (unidadeId) => {//MOSTRA O SALDO FINAL DO DIA DA UNIDADE
    try {
        const agora = new Date();
        const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

        const caixaDeHoje = await prisma.caixa.findFirst({ // busca o caixa aberto hoje para a unidade informada
            where: {
                unidadeId: Number(unidadeId),
                abertoEm: { gte: inicioDoDia, lte: fimDoDia, },
            },
            select: {
                id: true,
                saldoFinal: true,
                abertoEm: true,
            },
            orderBy: { abertoEm: "desc" }, // se tiver mais de um caixa no dia, pega o mais recente
        });

        if (!caixaDeHoje) {
            return {
                sucesso: false,
                message: "Nenhum caixa encontrado para hoje.",
            };
        }
        return {
            sucesso: true,
            saldoFinal: caixaDeHoje.saldoFinal ?? 0,
            message: "Saldo final do caixa de hoje encontrado com sucesso!",
        };

    } catch (error) {
    console.error(`Erro em mostrarSaldoF para unidade ${unidadeId}:`, error);
    return {
      sucesso: false,
      erro: "Erro ao ver saldo final",
      detalhes: error.message,
    };
    }
};

//agrupado por mês
export async function contarVendasPorMesUltimos6Meses(unidadeId) {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - 6);

    const vendas = await prisma.venda.findMany({
        where: {
            criadoEm: { gte: dataLimite, lte: hoje, },
            unidadeId
        },
        select: { criadoEm: true, },
    });

    const meses = Array.from({ length: 6 }, (_, i) => {
        const data = new Date();
        data.setMonth(data.getMonth() - (5 - i)); // gera os últimos 6 meses
        return {
            chave: data.getMonth(),
            nome: data.toLocaleString("pt-BR", { month: "long" }),
            ano: data.getFullYear(),
            total: 0,
        };
    });

    vendas.forEach((venda) => {
        const data = new Date(venda.criadoEm);
        const mesVenda = data.getMonth();
        const anoVenda = data.getFullYear();
        const mesEncontrado = meses.find((m) => m.chave === mesVenda && m.ano === anoVenda);
        if (mesEncontrado) { mesEncontrado.total++; }
    });

    return meses.map((m) => ({
        mes: `${m.nome.charAt(0).toUpperCase() + m.nome.slice(1)}`,
        total: m.total,
    }));
}

//insert na tabela de venda
export async function criarVenda(req, res) {
    try {
  const { caixaId, usuarioId, unidadeId, pagamento, itens, nomeCliente, cpfCliente } = req.body;
  console.log('criarVenda payload:', { caixaId, usuarioId, unidadeId, pagamento, itensLength: Array.isArray(itens) ? itens.length : 0, nomeCliente, cpfCliente });
  console.log('req.body completo:', req.body);
  
  // Validate required fields with detailed error messages
  if (!usuarioId) {
    console.error('❌ usuarioId ausente ou inválido:', usuarioId);
    return res.status(400).json({ sucesso: false, erro: 'Campo usuarioId ausente ou inválido.' });
  }
  if (!unidadeId) {
    console.error('❌ unidadeId ausente ou inválido:', unidadeId);
    return res.status(400).json({ sucesso: false, erro: 'Campo unidadeId ausente ou inválido.' });
  }
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    console.error('❌ itens ausente, não é array ou está vazio:', itens);
    return res.status(400).json({ sucesso: false, erro: 'Campo itens ausente, deve ser um array não vazio.' });
  }

        let caixaIdToUse = caixaId ? Number(caixaId) : null;
        if (!caixaIdToUse) {
            const agora = new Date();
            const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
            const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);
            const caixa = await prisma.caixa.findFirst({
                where: { unidadeId: Number(unidadeId), abertoEm: { gte: inicioDoDia, lte: fimDoDia } },
                orderBy: { abertoEm: 'desc' }
            });
            if (caixa) caixaIdToUse = caixa.id;
        }

        if (!caixaIdToUse) {return res.status(400).json({ sucesso: false, erro: 'Caixa não informado e nenhum caixa aberto encontrado para a unidade hoje.' })}

        // Normalize payment method (accept frontend strings like 'cash','credit','debit','mobile')
        const normalizePagamento = (p) => {
            if (!p) return 'DINHEIRO';
            const s = String(p).toUpperCase();
            if (['CASH', 'DINHEIRO'].includes(s)) return 'DINHEIRO';
            if (['CREDIT', 'DEBIT', 'CARTAO', 'CARTÃO', 'CARD'].includes(s)) return 'CARTAO';
            if (['PIX'].includes(s)) return 'PIX';
            return s;
        };

        const pagamentoFinal = normalizePagamento(pagamento);
        const itensResolvidos = await Promise.all(itens.map(async (item) => {
            // item: { produtoId | produtoSku, quantidade, precoUnitario, desconto }
            let produtoIdNum = Number(item.produtoId);
            if (Number.isNaN(produtoIdNum)) {
                // try SKU from produtoId or produtoSku
                const sku = item.produtoSku || item.produtoId || item.sku || null;
                if (sku) {
                    const prod = await prisma.produto.findUnique({ where: { sku: String(sku) } });
                    if (prod) produtoIdNum = prod.id;
                }
            }

            if (!produtoIdNum || Number.isNaN(produtoIdNum)) {throw new Error(`Produto não encontrado ou id inválido para item: ${JSON.stringify(item)}`)}

            const quantidade = Number(item.quantidade || 0);
            const precoUnitario = Number(item.precoUnitario || 0);
            const desconto = Number(item.desconto || 0);
            const subtotal = (precoUnitario - desconto) * quantidade;

            return {
                produtoId: produtoIdNum,
                quantidade,
                precoUnitario,
                desconto,
                subtotal,
            };
        }));

        const totalVenda = itensResolvidos.reduce((acc, it) => acc + (it.subtotal || 0), 0);
        console.log('Itens resolvidos antes de criar venda:', itensResolvidos);
        console.log('Total calculado:', totalVenda);
      let novaVenda;
      try {
      novaVenda = await prisma.venda.create({
        data: {
          caixaId: Number(caixaIdToUse),
          usuarioId: Number(usuarioId),
          unidadeId: Number(unidadeId),
          pagamento: pagamentoFinal,
        total: totalVenda,
        status: 'OK',
        nomeCliente: nomeCliente ?? null,
        cpfCliente: cpfCliente ? String(cpfCliente) : null,
          itens: {
            create: itensResolvidos.map((item) => ({
              produtoId: Number(item.produtoId),
              quantidade: Number(item.quantidade),
              precoUnitario: Number(item.precoUnitario),
              desconto: Number(item.desconto || 0),
              subtotal: item.subtotal,
            }))
          }
        },
        include: { itens: { include: { produto: true } } }
      });
    } catch (prismaError) {
      console.error('Prisma error creating venda:', prismaError && prismaError.code ? prismaError.code : prismaError);
      console.error(prismaError && prismaError.meta ? prismaError.meta : prismaError.stack || prismaError);
      throw prismaError;
    }

        return res.status(201).json({ sucesso: true, message: 'Venda criada com sucesso!', venda: novaVenda });
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro ao criar venda.', detalhes: error.message });
    }
}

//obter o saldo geral
export const calcularSaldoLiquido = async (unidadeId) => {
    try {
        const totalCaixas = await prisma.caixa.aggregate({
            _sum: { saldoFinal: true, },
            where: {
                unidadeId: Number(unidadeId),
                saldoFinal: { not: null, },
            },
        });

    const totalSaidas = await prisma.financeiro.aggregate({ // soma dos valores das saídas
      _sum: { valor: true },
      where: { unidadeId: Number(unidadeId), tipoMovimento: 'SAIDA' },
    });

        const somaCaixas = Number(totalCaixas._sum.saldoFinal || 0);
        const somaSaidas = Number(totalSaidas._sum.valor || 0);
        const saldoLiquido = somaCaixas - somaSaidas; 

        return {
            sucesso: true,
            unidadeId: Number(unidadeId),
            saldoLiquido: saldoLiquido.toFixed(2),
            message: "Saldo líquido calculado com sucesso!",
        };
    } catch (error) {
    console.error(`Erro em calcularSaldoLiquido para unidade ${unidadeId}:`, error);
    return {
      sucesso: false,
      erro: "Erro ao calcular saldo líquido",
      detalhes: error.message,
    };
    }
};

export async function listarSaidasPorUnidade(unidadeId) {
    try {
      const saidas = await prisma.financeiro.findMany({
        where: {
          unidadeId: Number(unidadeId),
          tipoMovimento: "SAIDA",   
        },
      });
  
      return {
        sucesso: true,
        unidadeId: Number(unidadeId),
        saidas: saidas,
      };
    } catch (error) {
      console.error("Erro ao buscar saídas", error);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

// ----------- 18/11/2025
export const criarNotaFiscal = async (data) => {
  try {
    const vendaId = Number(data?.vendaId ?? data?.id ?? data?.venda?.id);
    const unidadeContext = data?.unidadeId ? Number(data.unidadeId) : null;
    const clienteCpf = data?.clienteCpf ? String(data.clienteCpf) : null;
    const clienteNomeExtra = data?.clienteNome ? String(data.clienteNome) : null;
    const atendenteCpf = data?.atendenteCpf ? String(data.atendenteCpf) : null;
    const valorPagoCliente = data?.valorPagoCliente != null ? toNumber(data.valorPagoCliente) : null;

    if (!vendaId) {
      return { sucesso: false, erro: "vendaId é obrigatório para emitir a nota." };
    }

    const venda = await prisma.venda.findUnique({
      where: { id: vendaId },
      include: {
        itens: { include: { produto: true } },
        unidade: true,
        usuario: true,
        caixa: true,
      },
    });

    if (!venda) {
      return { sucesso: false, erro: "Venda não encontrada." };
    }

    if (unidadeContext && venda.unidadeId !== unidadeContext) {
      return { sucesso: false, erro: "Venda não pertence à unidade informada." };
    }

    const itensCriados = venda.itens || [];
    const totalItens = itensCriados.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
    const totalDescontos = itensCriados.reduce((acc, item) => acc + toNumber(item.desconto), 0);
    const totalSubtotais = itensCriados.reduce((acc, item) => acc + toNumber(item.subtotal), 0);
    const totalVenda =
      totalSubtotais ||
      toNumber(venda.total);

    // imposto estimado (por enquanto 8% do total)
    const totalImpostos = Number((totalVenda * 0.08).toFixed(2));

    const pagoCliente = valorPagoCliente != null ? valorPagoCliente : totalVenda;

    const pdfDir = path.join(process.cwd(), "tmp_notas");
    await fs.promises.mkdir(pdfDir, { recursive: true });

    const filePath = path.join(pdfDir, `nota_fiscal_${venda.id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const formatDigits = (value = "") => String(value ?? "").replace(/\D/g, "");
    const formatCpf = (value) => {
      const digits = formatDigits(value).slice(0, 11);
      if (digits.length !== 11) return value ?? "";
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };
    const formatCnpj = (value) => {
      const digits = formatDigits(value).slice(0, 14);
      if (digits.length !== 14) return value ?? "";
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    };

    const marginLeft = 40;
    const marginRight = 550;
    const availableWidth = marginRight - marginLeft;
    const columnGap = 10;
    const headerFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';

    const hr = () => { doc.moveTo(marginLeft, doc.y).lineTo(marginRight, doc.y).stroke(); };

    const addRow = ({ sku, nome, qtde, unit, total }) => {
      // Larguras que somam ao espaço disponível (incluindo gaps iguais)
      const widths = { sku: 90, nome: 210, qtde: 60, unit: 55, total: 55 };
      const fontSize = doc._fontSize || 10;
      const lineHeight = fontSize * 1.15;
      
      // Preparar textos
      const texts = {
        sku: String(sku || ''),
        nome: String(nome || ''),
        qtde: String(qtde || ''),
        unit: String(unit || ''),
        total: String(total || '')
      };
      
      // Função para quebrar texto em linhas que cabem na largura
      const wrapText = (text, maxWidth) => {
        if (!text) return [''];
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = doc.widthOfString(testLine);
          
          if (testWidth <= maxWidth || currentLine === '') {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [''];
      };
      
      // Quebrar cada texto em linhas
      const lines = {
        sku: wrapText(texts.sku, widths.sku),
        nome: wrapText(texts.nome, widths.nome),
        qtde: wrapText(texts.qtde, widths.qtde),
        unit: wrapText(texts.unit, widths.unit),
        total: wrapText(texts.total, widths.total)
      };
      
      // Número máximo de linhas necessárias
      const maxLines = Math.max(
        lines.sku.length,
        lines.nome.length,
        lines.qtde.length,
        lines.unit.length,
        lines.total.length
      );
      
      const startY = doc.y;
      
      // Renderizar linha por linha
      for (let i = 0; i < maxLines; i++) {
        const currentY = startY + (i * lineHeight);
        let x = marginLeft;
        
        // SKU
        const skuLine = lines.sku[i] || '';
        doc.text(skuLine, x, currentY, { width: widths.sku });
        x += widths.sku + columnGap;
        
        // Nome
        const nomeLine = lines.nome[i] || '';
        doc.text(nomeLine, x, currentY, { width: widths.nome });
        x += widths.nome + columnGap;
        
        // Quantidade
        const qtdeLine = lines.qtde[i] || '';
        doc.text(qtdeLine, x, currentY, { width: widths.qtde, align: 'right' });
        x += widths.qtde + columnGap;
        
        // Valor Unitário
        const unitLine = lines.unit[i] || '';
        doc.text(unitLine, x, currentY, { width: widths.unit, align: 'right' });
        x += widths.unit + columnGap;
        
        // Valor Total
        const totalLine = lines.total[i] || '';
        doc.text(totalLine, x, currentY, { width: widths.total, align: 'right' });
      }
      
      // Mover para a próxima linha baseado no número de linhas renderizadas
      doc.y = startY + (maxLines * lineHeight) + 2;
    };

    // Cabeçalho estilo cupom NFC-e (limpo, alinhado)
    doc.font(headerFont).fontSize(12).text(venda.unidade?.nome ?? "LOJA", { align: "center" });
    doc.moveDown(0.2);
    const cnpjUnidade = venda.unidade?.cnpj ?? venda.unidade?.cnpjCnpj ?? null;
    const formattedCnpj = cnpjUnidade ? formatCnpj(cnpjUnidade) : null;
    if (formattedCnpj) {
      doc.font(normalFont).fontSize(11).text(`CNPJ: ${formattedCnpj}`, { align: "center" });
    }
    doc.moveDown(0.4);

    doc.font(normalFont).fontSize(11).text("DANFE NFC-e - Documento Auxiliar da Nota Fiscal de", { align: "center" });
    doc.text("Consumidor Eletrônica", { align: "center" });
    doc.moveDown(0.4);

    hr();
    doc.moveDown(0.2);

    // Tabela de itens
    doc.font(headerFont).fontSize(10);
    addRow({ sku: 'SKU', nome: 'Nome', qtde: 'Qtde', unit: 'Vlr Unit', total: 'Vlr Total' });
    hr();
    doc.moveDown(0.1);
    doc.font(normalFont).fontSize(10);

    itensCriados.forEach((i) => {
      const sku = i.produto?.sku ?? i.produtoId;
      const nome = i.produto?.nome ?? String(i.produtoId);
      const q = Number(i.quantidade || 0);
      const unit = `R$ ${toNumber(i.precoUnitario).toFixed(2)}`;
      const sub = `R$ ${toNumber(i.subtotal).toFixed(2)}`;
      addRow({ sku, nome, qtde: q, unit, total: sub });
    });

    doc.moveDown(0.2);
    hr();
    doc.moveDown(0.4);

    // Resumos
    doc.fontSize(10);
    doc.text(`Qtd. total de itens: ${totalItens}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Valor total da compra: R$ ${totalVenda.toFixed(2)}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Forma de pagamento: ${venda.pagamento}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Valor pago pelo cliente: R$ ${pagoCliente.toFixed(2)}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Total de descontos: R$ ${totalDescontos.toFixed(2)}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Total de impostos (aprox. 8%): R$ ${totalImpostos.toFixed(2)}`, marginLeft, doc.y, { width: availableWidth });
    doc.text(`Data de emissão: ${new Date(venda.criadoEm).toLocaleString("pt-BR")}`, marginLeft, doc.y, { width: availableWidth });

    doc.moveDown(0.8);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Dados do consumidor
    const nomeConsumidor = clienteNomeExtra || venda.nomeCliente || "CONSUMIDOR";
    doc.fontSize(10).text("DADOS DO CONSUMIDOR:");
    doc.text(`Nome: ${nomeConsumidor}`);
    const cpfConsumidor = clienteCpf || venda.cpfCliente || null;
    const formattedCpfConsumidor = cpfConsumidor ? formatCpf(cpfConsumidor) : null;
    if (formattedCpfConsumidor) {
      doc.text(`CPF: ${formattedCpfConsumidor}`);
    }

    doc.moveDown(0.8);
    hr();
    doc.moveDown(0.5);

    // Dados do atendente
    const nomeAtendente = venda.usuario?.nome ?? venda.usuarioId;
    doc.text("ATENDENTE:");
    doc.text(`Nome: ${nomeAtendente}`);
    if (atendenteCpf) {
      doc.text(`CPF: ${atendenteCpf}`);
    }

    doc.end();

    await new Promise((resolve) => stream.on("finish", resolve));

    return {
      sucesso: true,
      venda,
      itens: itensCriados,
      total: totalVenda,
      pdfPath: filePath,
      totalDescontos,
      totalImpostos,
      valorPagoCliente: pagoCliente,
      totalItens
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar nota fiscal",
      detalhes: error.message
    };
  }
};