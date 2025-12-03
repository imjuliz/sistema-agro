import prisma from '../prisma/client.js';
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) => {//tem controller
    try {
        const saidas = await prisma.financeiro.findMany({ 
            where: { unidadeId: Number(unidadeId)}, 
        })
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

        if (resultado.length === 0) {
            return {
                sucesso: false,
                message: "Nenhum item encontrado para esta unidade.",
            };
        }
        const produtoMaisVendido = resultado[0];
        const produto = await prisma.produto.findUnique({ // Busca informações do produto
            where: { id: produtoMaisVendido.produtoId, },
            select: {
                id: true,
                nome: true,
                descricao: true,
            },
        });
        return {
            sucesso: true,
            produto: {
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                quantidadeVendida: produtoMaisVendido._sum.quantidade,
            },
            message: "Produto mais vendido encontrado com sucesso!",
        };
    } catch (error) {
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
    FROM "vendas"
    WHERE DATE("criado_em") = CURRENT_DATE
      AND "unidade_id" = ${unidadeId};
  `;
    return result[0]?.total ?? 0;
};

// Média por transação das vendas do dia
export const calcularMediaPorTransacaoDiaria = async (unidadeId) => {
    try {
        const [res] = await prisma.$queryRaw`
            SELECT COALESCE(SUM("total"),0) AS total, COUNT(*) AS quantidade
            FROM "vendas"
            WHERE DATE("criado_em") = CURRENT_DATE
              AND "unidade_id" = ${unidadeId};
        `;

        const total = Number(res.total || 0);
        const quantidade = Number(res.quantidade || 0);
        const media = quantidade > 0 ? total / quantidade : 0;

        return {
            sucesso: true,
            total,
            quantidade,
            media: Number(media.toFixed(2)),
            message: "Média por transação calculada com sucesso",
        };
    } catch (error) {
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
            FROM "vendas"
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
      FROM "vendas"
      WHERE "unidade_id" = ${unidadeId}
      GROUP BY DATE_TRUNC('month', "criado_em")
      ORDER BY mes DESC;
    `;
    return result[0]?.total_vendas ?? 0;
}
  
export const somarSaidas = async (unidadeId) => {
    const result = await prisma.$queryRaw`
    SELECT COALESCE (SUM(valor), 0) AS total
    from "Saidas"
    where date("data") = CURRENT_DATE
    and "unidadeId" = ${unidadeId}`;
    return result[0]?.total ?? 0;
}

export const calcularLucroDoMes = async (unidadeId) => { //TESTAR
    const [vendas] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(total), 0) AS total
    FROM "vendas"
    WHERE "unidade_id" = ${unidadeId}
      AND DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  `;

  const [saidas] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "Saidas"
    WHERE "unidadeId" = ${unidadeId}
      AND DATE_TRUNC('month', "data") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  `;

  return {
    total_vendas: vendas.total,
    total_saidas: saidas.total,
    lucro: vendas.total - saidas.total,
  };
}

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
        if (acc[categoria]) {
          acc[categoria] += despesa.valor;
        } else {
          acc[categoria] = despesa.valor;
        }
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
        const { caixaId, usuarioId, unidadeId, pagamento, itens } = req.body;
        // Basic validation: itens required
        if (!usuarioId || !unidadeId || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ sucesso: false, erro: 'Dados incompletos. Verifique os campos enviados.' });
        }

        // If caixaId not provided, try to find today's caixa for the unidade
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

        if (!caixaIdToUse) {
            return res.status(400).json({ sucesso: false, erro: 'Caixa não informado e nenhum caixa aberto encontrado para a unidade hoje.' });
        }

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

        // Resolve items: support either produtoId (numeric) or produtoSku (string in item.produtoSku or item.produtoId)
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

            if (!produtoIdNum || Number.isNaN(produtoIdNum)) {
                throw new Error(`Produto não encontrado ou id inválido para item: ${JSON.stringify(item)}`);
            }

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

        const novaVenda = await prisma.venda.create({
            data: {
                caixaId: Number(caixaIdToUse),
                usuarioId: Number(usuarioId),
                unidadeId: Number(unidadeId),
                pagamento: pagamentoFinal,
                total: totalVenda,
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

        const totalSaidas = await prisma.saidas.aggregate({// soma dos valores das saídas
            _sum: { valor: true, },
            where: { unidadeId: Number(unidadeId), },
        });

        const somaCaixas = Number(totalCaixas._sum.saldoFinal || 0);
        const somaSaidas = Number(totalSaidas._sum.valor || 0);
        const saldoLiquido = somaCaixas - somaSaidas; // cálculo do saldo líquido

        return {
            sucesso: true,
            unidadeId: Number(unidadeId),
            saldoLiquido: saldoLiquido.toFixed(2),
            message: "Saldo líquido calculado com sucesso!",
        };
    } catch (error) {
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
          unidadeId: Number(unidadeId), // filtra todos com a mesma unidade
          tipoMovimento: "SAIDA",        // filtra apenas os movimentos do tipo "SAIDA"
        },
        // orderBy: { data: "desc" }, // Você pode descomentar caso queira ordenar por data
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
    const { caixaId, usuarioId, unidadeId, itens, pagamento } = data;

    // 1 — Validar unidade
    const unidade = await prisma.Unidade.findUnique({where: { id: Number(unidadeId) }});

    if (!unidade) {
      return {
        sucesso: false,
        erro: "Unidade não encontrada"
      };
    }

    // 2 — Validar caixa
    const caixa = await prisma.Caixa.findUnique({where: { id: Number(caixaId) }});

    if (!caixa || caixa.unidadeId !== Number(unidadeId)) {return {sucesso: false,erro: "Caixa não pertence à unidade especificada"};}

    // 3 — Criar venda
    const venda = await prisma.Venda.create({
      data: {caixaId,usuarioId,unidadeId,pagamento,total: 0 }
    });

    let totalVenda = 0;
    const itensCriados = [];

    // 4 — Criar itens + movimentar estoque
    for (const item of itens) {
      const subtotal = (item.quantidade * item.precoUnitario) - item.desconto;
      totalVenda += subtotal;

      // Criar item
      const novoItem = await prisma.ItemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          desconto: item.desconto,
          subtotal
        }
      });

      itensCriados.push(novoItem);

      // Buscar estoque da unidade
      const estoque = await prisma.Estoque.findFirst({
        where: {unidadeId: Number(unidadeId),produtoId: item.produtoId}
      });

      if (!estoque) {
        return {
          sucesso: false,
          erro: `Produto ${item.produtoId} não está no estoque desta unidade`
        };
      }

      // Atualizar estoque
      await prisma.Estoque.update({
        where: { id: estoque.id },
        data: {quantidade: estoque.quantidade - item.quantidade}
      });

      // Registrar movimento
      await prisma.EstoqueMovimento.create({
        data: {
          estoqueId: estoque.id,
          tipoMovimento: "SAIDA",
          quantidade: item.quantidade,
          vendaId: venda.id,
          origemUnidadeId: unidadeId
        }
      });
    }

    // 5 — Atualizar total
    await prisma.Venda.update({where: { id: venda.id },data: { total: totalVenda } });

    // 6 — Criar PDF
    const filePath = path.join(process.cwd(), `nota_fiscal_${venda.id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(22).text("NOTA FISCAL", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Venda: ${venda.id}`);
    doc.text(`Unidade: ${unidadeId}`);
    doc.text(`Caixa: ${caixaId}`);
    doc.text(`Usuário: ${usuarioId}`);
    doc.text(`Pagamento: ${pagamento}`);
    doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`);
    doc.moveDown();

    // Itens
    doc.fontSize(16).text("Itens da Nota:").moveDown(0.5);

    itensCriados.forEach((i) => {
      doc.fontSize(12)
        .text(`Produto ID: ${i.produtoId}`)
        .text(`Quantidade: ${i.quantidade}`)
        .text(`Preço: R$ ${i.precoUnitario}`)
        .text(`Desconto: R$ ${i.desconto}`)
        .text(`Subtotal: R$ ${i.subtotal}`)
        .moveDown();
    });

    doc.fontSize(16).text(`TOTAL: R$ ${totalVenda}`, { align: "right" });

    doc.end();

    await new Promise((resolve) => stream.on("finish", resolve));

    return {
      sucesso: true,
      venda,
      itens: itensCriados,
      total: totalVenda,
      pdfPath: filePath
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar nota fiscal",
      detalhes: error.message
    };
  }
};