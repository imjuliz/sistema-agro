// import prisma from "../prisma/client";

// export async function getEstoques() {
//   try {
//     const estoques = await prisma.estoque.findMany();
//     return {
//       sucesso: true,
//       estoques,
//       message: "Estoques listados com sucesso.",
//     };
//   } catch (error) {
//     return {
//       sucesso: false,
//       erro: "Erro ao listar estoques.",
//       detalhes: error.message, // opcional, para debug
//     };
//   }
// }

// export async function getEstoquePorId(id) {
//   try {
//     const estoque = await prisma.estoque.findUnique({
//       where: { id },
//     });
//     return {
//       sucesso: true,
//       estoque,
//       message: "Estoque listado com sucesso.",
//     };
//   } catch (error) {
//     return {
//       sucesso: false,
//       erro: "Erro ao listar estoque por id.",
//       detalhes: error.message, // opcional, para debug
//     };
//   }
// }

// export async function createEstoque(data) {
//   try {
//     const estoque = await prisma.estoque.findUnique({ where: { id: data.id } });
//     // Valdidacoes
//     if(estoque.id != data.id) {
//       return res.json({ message: "Estoque nao encontrado." });
//     }
//     if(estoque.unidadeId != data.unidadeId) {
//       return res.json({ message: "Unidade nao encontrada." });
//     }
    
//     const novoEstoque = await prisma.estoque.create({
//       data: {
//         unidadeId: data.unidadeId,
//         descricao: data.descricao,
//         qntdItens: data.qntdItens
//       }
//     });
//     return {
//       sucesso: true,
//       novoEstoque,
//       message: "Estoque criado com sucesso.",
//     };
//   } catch (error) {
//     return {
//       sucesso: false,
//       erro: "Erro ao criar estoque.",
//       detalhes: error.message, // opcional, para debug
//     };
//   }
// }

// export async function updateEstoque(id, data) {
//   try {
//     const estoque = await prisma.estoque.findUnique({ where: { id: data.id } });
//     // Valdidacoes
//     if(estoque.id != data.id) {
//       return res.json({ message: "Estoque nao encontrado." });
//     }

//     const estoqueAtualizado = await prisma.estoque.update({
//       where: { id },
//       data: {
//         unidadeId: data.unidadeId,
//         descricao: data.descricao,
//         qntdItens: data.qntdItens
//       },
//     });
//     return {
//       sucesso: true,
//       estoqueAtualizado,
//       message: "Estoque atualizado com sucesso.",
//     };
//   } catch (error) {
//     return {
//       sucesso: false,
//       erro: "Erro ao atualizar estoque.",
//       detalhes: error.message, // opcional, para debug
//     };
//   }
// }

// export async function deleteEstoque(id) {
//   try {
//     const estoque = await prisma.estoque.findUnique({ where: { id: id } });
//     // Valdidacoes
//     if(estoque.id != id) {
//       return res.json({ message: "Estoque nao encontrado." });
//     }
//     await prisma.estoque.delete({
//       where: { id },
//     });
//     return {
//       sucesso: true,
//       message: "Estoque deletado com sucesso.",
//     };
//   } catch (error) {
//     return {
//       sucesso: false,
//       erro: "Erro ao deletar estoque.",
//       detalhes: error.message, // opcional, para debug
//     };
//   }
// }













// alteracoes feitas pela julia dsclp se der erradooooo
import prisma from "../prisma/client.js";

export async function getEstoques({ unidadeId = null, q = null } = {}) {
  try {
    const where = {};
    if (unidadeId != null) where.unidadeId = Number(unidadeId);
    if (q) where.descricao = { contains: String(q), mode: "insensitive" };

    const estoques = await prisma.estoque.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
        unidade: { select: { id: true, nome: true, cidade: true, estado: true } },

        // Produtos vinculados ao estoque (tabela EstoqueProduto)
        estoqueProdutos: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            nome: true,                 // nome do item no estoque
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
            // relações opcionais: pegar só campos essenciais (se existirem)
            produto: { select: { id: true, nome: true } }, // caso queira link para produto mestre
            lote: { select: { id: true, nome: true } },
            pedido: { select: { id: true } },
            fornecedorUnidade: { select: { id: true, nome: true } },
            fornecedorExterno: { select: { id: true, nomeEmpresa: true } }
          }
        },

        // Movimentos do estoque
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
            // relações mínimas e seguras
            producao: { select: { id: true, observacoes: true } },
            pedido: { select: { id: true } },          // seu model usa id (não numero)
            venda: { select: { id: true } },
            origemUnidade: { select: { id: true, nome: true } },
            destinoUnidade: { select: { id: true, nome: true } }
          }
        }
      }
    });

    return { sucesso: true, estoques };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar estoques.", detalhes: error.message };
  }
}

export async function getEstoquePorId(id) {
  try {
    const estoque = await prisma.estoque.findUnique({
      where: { id: Number(id) },
      include: {
        unidade: { select: { id: true, nome: true, cidade: true, estado: true } },

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
            fornecedorExterno: { select: { id: true, nomeEmpresa: true } }
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
            pedido: { select: { id: true } },
            venda: { select: { id: true } },
            origemUnidade: { select: { id: true, nome: true } },
            destinoUnidade: { select: { id: true, nome: true } }
          }
        }
      }
    });

    if (!estoque) return { sucesso: false, erro: "Estoque não encontrado." };
    return { sucesso: true, estoque };
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
            quantidade: true,
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
