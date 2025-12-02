// import prisma from "../prisma/client";

// export async function getEstoques() {
//   try {
//     const estoques = await prisma.estoque.findMany();
//     return {
//       sucesso: true,
// Clean implementation for estoque model
// modelo de Estoque (prisma)
import prisma from "../prisma/client.js";

// Helper: normalize suppliers for each estoqueProduto.
// Chooses fornecedorExterno when present (useful for FAZENDA), otherwise fornecedorUnidade (LOJA).
function normalizeFornecedores(estoque) {
  if (!estoque || !Array.isArray(estoque.estoqueProdutos)) return estoque;
  // determine unit type (FAZENDA / LOJA etc.) to decide preference
  const unidadeTipo = String(estoque?.unidade?.tipo ?? '').toUpperCase();

    const produtos = estoque.estoqueProdutos.map((p) => {
    let fornecedorResolved = null;

    // Helper selectors
    const hasExterno = p.fornecedorExternoId && p.fornecedorExterno;
    const hasUnidade = p.fornecedorUnidadeId && p.fornecedorUnidade;

    if (unidadeTipo === 'FAZENDA') {
      // For FAZENDA prefer externo, then unidade
      if (hasExterno) {
        fornecedorResolved = {
          tipo: 'externo',
          id: p.fornecedorExternoId,
          nome: p.fornecedorExterno.nomeEmpresa || null,
          dados: p.fornecedorExterno,
        };
      } else if (hasUnidade) {
        fornecedorResolved = {
          tipo: 'unidade',
          id: p.fornecedorUnidadeId,
          nome: p.fornecedorUnidade.nome || null,
          dados: p.fornecedorUnidade,
        };
      } else {
        // fallback to pedido origin (some seed data puts supplier on pedido)
        if (p.pedido?.fornecedorExterno) {
          fornecedorResolved = {
            tipo: 'externo',
            id: p.pedido.origemFornecedorExternoId || p.pedido.fornecedorExterno.id,
            nome: p.pedido.fornecedorExterno.nomeEmpresa || null,
            dados: p.pedido.fornecedorExterno,
          };
        } else if (p.pedido?.origemUnidade) {
          fornecedorResolved = {
            tipo: 'unidade',
            id: p.pedido.origemUnidadeId || p.pedido.origemUnidade.id,
            nome: p.pedido.origemUnidade.nome || null,
            dados: p.pedido.origemUnidade,
          };
        }
      }
    } else if (unidadeTipo === 'LOJA') {
      // For LOJA prefer unidade, then externo
      if (hasUnidade) {
        fornecedorResolved = {
          tipo: 'unidade',
          id: p.fornecedorUnidadeId,
          nome: p.fornecedorUnidade.nome || null,
          dados: p.fornecedorUnidade,
        };
      } else if (hasExterno) {
        fornecedorResolved = {
          tipo: 'externo',
          id: p.fornecedorExternoId,
          nome: p.fornecedorExterno.nomeEmpresa || null,
          dados: p.fornecedorExterno,
        };
      } else {
        // fallback to pedido origin
        if (p.pedido?.origemUnidade) {
          fornecedorResolved = {
            tipo: 'unidade',
            id: p.pedido.origemUnidadeId || p.pedido.origemUnidade.id,
            nome: p.pedido.origemUnidade.nome || null,
            dados: p.pedido.origemUnidade,
          };
        } else if (p.pedido?.fornecedorExterno) {
          fornecedorResolved = {
            tipo: 'externo',
            id: p.pedido.origemFornecedorExternoId || p.pedido.fornecedorExterno.id,
            nome: p.pedido.fornecedorExterno.nomeEmpresa || null,
            dados: p.pedido.fornecedorExterno,
          };
        }
      }
    } else {
      // default behavior: prefer externo if present, then unidade
      if (hasExterno) {
        fornecedorResolved = {
          tipo: 'externo',
          id: p.fornecedorExternoId,
          nome: p.fornecedorExterno.nomeEmpresa || null,
          dados: p.fornecedorExterno,
        };
      } else if (hasUnidade) {
        fornecedorResolved = {
          tipo: 'unidade',
          id: p.fornecedorUnidadeId,
          nome: p.fornecedorUnidade.nome || null,
          dados: p.fornecedorUnidade,
        };
      } else {
        // fallback to pedido origin
        if (p.pedido?.fornecedorExterno) {
          fornecedorResolved = {
            tipo: 'externo',
            id: p.pedido.origemFornecedorExternoId || p.pedido.fornecedorExterno.id,
            nome: p.pedido.fornecedorExterno.nomeEmpresa || null,
            dados: p.pedido.fornecedorExterno,
          };
        } else if (p.pedido?.origemUnidade) {
          fornecedorResolved = {
            tipo: 'unidade',
            id: p.pedido.origemUnidadeId || p.pedido.origemUnidade.id,
            nome: p.pedido.origemUnidade.nome || null,
            dados: p.pedido.origemUnidade,
          };
        }
      }
    }

  // compute quantities (qntdAtual, qntdMin) with sensible fallbacks
  // Prefer explicit qntdAtual/qntdMin fields from the DB. Avoid relying on legacy `quantidade` field.
  const qntdAtual = Number(p.qntdAtual ?? p.quantidade ?? 0);
  const qntdMin = Number(p.qntdMin ?? p.minimo ?? p.minimum ?? estoque?.minimo ?? 0);

    return { ...p, fornecedorResolved, qntdAtual, qntdMin };
  });

  return {
    ...estoque,
    estoqueProdutos: produtos,
  };
}

export async function getEstoques({ unidadeId = null, q = null } = {}) {
  try {
    const where = {};
    if (unidadeId != null) where.unidadeId = Number(unidadeId);
    if (q) where.descricao = { contains: String(q), mode: "insensitive" };

    const estoques = await prisma.estoque.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
      unidade: { select: { id: true, nome: true, cidade: true, estado: true, tipo: true } },
      estoqueProdutos: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            nome: true,
            qntdAtual: true,
            qntdMin: true,
            sku: true,
            marca: true,
            estoqueId: true,
            produtoId: true,
            producaoId: true,
            loteId: true,
            precoUnitario: true,
            pesoUnidade: true,
            validade: true,
            unidadeBase: true,
            pedidoId: true,
            pedidoItemId: true,
            fornecedorUnidadeId: true,
            fornecedorExternoId: true,
            dataEntrada: true,
            dataSaida: true,
            produto: { select: { id: true, nome: true } },
            lote: { select: { id: true, nome: true } },
            pedido: {
              select: {
                id: true,
                origemFornecedorExternoId: true,
                origemUnidadeId: true,
                fornecedorExterno: { select: { id: true, nomeEmpresa: true, email: true, telefone: true } },
                origemUnidade: { select: { id: true, nome: true, tipo: true } }
              }
            },
            fornecedorUnidade: { select: { id: true, nome: true } },
            fornecedorExterno: { select: { id: true, nomeEmpresa: true, email: true, telefone: true } }
          }
        },
        estoqueMovimentos: {
          orderBy: { data: "desc" },
          select: {
            id: true,
            estoqueId: true,
            tipoMovimento: true,
            quantidade: true,
            producaoId: true,
            pedidoId: true,
            vendaId: true,
            origemUnidadeId: true,
            destinoUnidadeId: true,
            data: true,
            producao: { select: { id: true, observacoes: true } },
            pedido: {
              select: {
                id: true,
                origemFornecedorExternoId: true,
                origemUnidadeId: true,
                fornecedorExterno: { select: { id: true, nomeEmpresa: true, email: true, telefone: true } },
                origemUnidade: { select: { id: true, nome: true, tipo: true } }
              }
            },
            venda: { select: { id: true } },
            origemUnidade: { select: { id: true, nome: true } },
            destinoUnidade: { select: { id: true, nome: true } }
          }
        }
      }
    });

    const mapped = estoques.map((e) => normalizeFornecedores(e));
    return { sucesso: true, estoques: mapped };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar estoques.", detalhes: error.message };
  }
}

export async function getEstoquePorId(id) {
  try {
    const estoque = await prisma.estoque.findUnique({
      where: { id: Number(id) },
      include: {
      unidade: { select: { id: true, nome: true, cidade: true, estado: true, tipo: true } },
        estoqueProdutos: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            nome: true,
            sku: true,
            marca: true,
            estoqueId: true,
            produtoId: true,
            producaoId: true,
            loteId: true,
            precoUnitario: true,
            pesoUnidade: true,
            validade: true,
            unidadeBase: true,
            pedidoId: true,
            pedidoItemId: true,
            fornecedorUnidadeId: true,
            fornecedorExternoId: true,
            dataEntrada: true,
            dataSaida: true,
            produto: { select: { id: true, nome: true } },
            lote: { select: { id: true, nome: true } },
            pedido: { select: { id: true } },
            fornecedorUnidade: { select: { id: true, nome: true } },
            fornecedorExterno: { select: { id: true, nomeEmpresa: true, email: true, telefone: true } }
          }
        },
        estoqueMovimentos: {
          orderBy: { data: "desc" },
          select: {
            id: true,
            estoqueId: true,
            tipoMovimento: true,
            qntdAtual: true,
            qntdMin: true,
            producaoId: true,
            pedidoId: true,
            vendaId: true,
            origemUnidadeId: true,
            destinoUnidadeId: true,
            data: true,
            producao: { select: { id: true, observacoes: true } },
            pedido: { select: { id: true } },
            venda: { select: { id: true } },
            origemUnidade: { select: { id: true, nome: true } },
            destinoUnidade: { select: { id: true, nome: true } }
          }
        }
      }
    });

    if (!estoque) return { sucesso: false, erro: "Estoque não encontrado." };
    const mapped = normalizeFornecedores(estoque);
    return { sucesso: true, estoque: mapped };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao buscar estoque por id.", detalhes: error.message };
  }
}

export async function createEstoque(data) {
  try {
    if (!data || !data.unidadeId) {
      return { sucesso: false, erro: "unidadeId é obrigatório." };
    }

    const novo = await prisma.estoque.create({
      data: {
        unidadeId: Number(data.unidadeId),
        descricao: data.descricao ?? null,
        qntdItens: data.qntdItens != null ? Number(data.qntdItens) : 0
      },
      include: {
        unidade: { select: { id: true, nome: true } },
        estoqueProdutos: true,
        estoqueMovimentos: true
      }
    });

    return { sucesso: true, estoque: novo };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao criar estoque.", detalhes: error.message };
  }
}

export async function updateEstoque(id, data) {
  try {
    const existing = await prisma.estoque.findUnique({ where: { id: Number(id) } });
    if (!existing) return { sucesso: false, erro: "Estoque não encontrado." };

    const atualizado = await prisma.estoque.update({
      where: { id: Number(id) },
      data: {
        unidadeId: data.unidadeId != null ? Number(data.unidadeId) : undefined,
        descricao: data.descricao ?? undefined,
        qntdItens: data.qntdItens != null ? Number(data.qntdItens) : undefined
      },
      include: {
        unidade: { select: { id: true, nome: true } },
        estoqueProdutos: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            nome: true,
            sku: true,
            marca: true,
            precoUnitario: true
          }
        },
        estoqueMovimentos: {
          orderBy: { data: "desc" },
          select: {
            id: true,
            tipoMovimento: true,
            qntdAtual: true,
            qntdMin: true,
            data: true,
            origemUnidade: { select: { id: true, nome: true } },
            destinoUnidade: { select: { id: true, nome: true } }
          }
        }
      }
    });

    return { sucesso: true, estoque: atualizado };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao atualizar estoque.", detalhes: error.message };
  }
}

export async function deleteEstoque(id) {
  try {
    const existing = await prisma.estoque.findUnique({ where: { id: Number(id) } });
    if (!existing) return { sucesso: false, erro: "Estoque não encontrado." };

    await prisma.estoque.delete({ where: { id: Number(id) } });
    return { sucesso: true, message: "Estoque deletado com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao deletar estoque.", detalhes: error.message };
  }
}

// Registra um movimento de estoque e atualiza a quantidade do produto em transação.
// Params: { estoqueProdutoId, tipoMovimento: 'ENTRADA'|'SAIDA', quantidade, usuarioId?, observacoes?, pedidoId?, origemUnidadeId?, destinoUnidadeId?, vendaId?, producaoId? }
export async function createMovimento(params = {}) {
  try {
    const epId = Number(params.estoqueProdutoId);
    const tipo = String(params.tipoMovimento ?? '').toUpperCase();
    const quantidade = Number(params.quantidade ?? 0);

    if (!epId || !['ENTRADA', 'SAIDA'].includes(tipo) || isNaN(quantidade) || quantidade <= 0) {
      return { sucesso: false, erro: 'Parâmetros inválidos para registrar movimentação.' };
    }

    const produto = await prisma.estoqueProduto.findUnique({ where: { id: epId }, select: { id: true, qntdAtual: true, estoqueId: true } });
    if (!produto) return { sucesso: false, erro: 'Produto de estoque não encontrado.' };
    let newQuantidade = Number(produto.qntdAtual ?? 0);
    if (tipo === 'ENTRADA') newQuantidade += quantidade;
    else if (tipo === 'SAIDA') {
      if (newQuantidade - quantidade < 0) return { sucesso: false, erro: 'Quantidade insuficiente para saída.' };
      newQuantidade -= quantidade;
    }

    // build allowed movimento data according to schema
    const movimentoDataAllowed = {
      estoqueId: produto.estoqueId,
      tipoMovimento: tipo,
      quantidade,
      data: new Date(),
    };

    if (params.pedidoId) movimentoDataAllowed.pedidoId = Number(params.pedidoId);
    if (params.origemUnidadeId) movimentoDataAllowed.origemUnidadeId = Number(params.origemUnidadeId);
    if (params.destinoUnidadeId) movimentoDataAllowed.destinoUnidadeId = Number(params.destinoUnidadeId);
    if (params.vendaId) movimentoDataAllowed.vendaId = Number(params.vendaId);
    if (params.producaoId) movimentoDataAllowed.producaoId = Number(params.producaoId);

    const [movimento, atualizado] = await prisma.$transaction([
      prisma.estoqueMovimento.create({ data: movimentoDataAllowed }),
      prisma.estoqueProduto.update({ where: { id: epId }, data: { qntdAtual: newQuantidade } })
    ]);

    return { sucesso: true, movimento, estoqueProduto: atualizado };
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao registrar movimentação.', detalhes: error?.message };
  }
}

    
