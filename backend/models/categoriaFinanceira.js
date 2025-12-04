import prisma from '../prisma/client.js';

// ============ CATEGORIAS ============

export const criarCategoria = async (unidadeId, nome, tipo, descricao = null) => {
  try {
    const categoria = await prisma.categoria.create({
      data: {
        unidadeId: Number(unidadeId),
        nome,
        tipo, // ENTRADA ou SAIDA (TipoMovimento)
        descricao,
        ativa: true
      },
      include: {
        subcategorias: true
      }
    });
    return categoria;
  } catch (error) {
    throw new Error(`Erro ao criar categoria: ${error.message}`);
  }
};

export const listarCategoriasPorUnidade = async (unidadeId) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        unidadeId: Number(unidadeId),
        ativa: true
      },
      include: {
        subcategorias: {
          where: { ativa: true }
        },
        financeiros: {
          select: {
            parcela: true,
            totalParcelas: true,
            valor: true,
             valorPago: true,
             vencimento: true
          }
        }
      },
      orderBy: [
        { tipo: 'asc' },
        { nome: 'asc' }
      ]
    });
    return categorias;
  } catch (error) {
    throw new Error(`Erro ao listar categorias: ${error.message}`);
  }
};

export const obterCategoriaPorId = async (categoriaId) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: Number(categoriaId) },
      include: {
        subcategorias: {
          where: { ativa: true }
        }
      }
    });
    return categoria;
  } catch (error) {
    throw new Error(`Erro ao obter categoria: ${error.message}`);
  }
};

export const atualizarCategoria = async (categoriaId, nome, descricao) => {
  try {
    const categoria = await prisma.categoria.update({
      where: { id: Number(categoriaId) },
      data: {
        nome,
        descricao,
        atualizadoEm: new Date()
      },
      include: {
        subcategorias: {
          where: { ativa: true }
        }
      }
    });
    return categoria;
  } catch (error) {
    throw new Error(`Erro ao atualizar categoria: ${error.message}`);
  }
};

export const deletarCategoria = async (categoriaId) => {
  try {
    // Soft delete - marcar como inativa
    const categoria = await prisma.categoria.update({
      where: { id: Number(categoriaId) },
      data: {
        ativa: false,
        atualizadoEm: new Date()
      }
    });
    return categoria;
  } catch (error) {
    throw new Error(`Erro ao deletar categoria: ${error.message}`);
  }
};

// ============ SUBCATEGORIAS ============

export const criarSubcategoria = async (categoriaId, nome, descricao = null) => {
  try {
    const subcategoria = await prisma.subcategoria.create({
      data: {
        categoriaId: Number(categoriaId),
        nome,
        descricao,
        ativa: true
      }
    });
    return subcategoria;
  } catch (error) {
    throw new Error(`Erro ao criar subcategoria: ${error.message}`);
  }
};

export const listarSubcategoriasPorCategoria = async (categoriaId) => {
  try {
    const subcategorias = await prisma.subcategoria.findMany({
      where: {
        categoriaId: Number(categoriaId),
        ativa: true
      },
      orderBy: { nome: 'asc' }
    });
    return subcategorias;
  } catch (error) {
    throw new Error(`Erro ao listar subcategorias: ${error.message}`);
  }
};

export const obterSubcategoriaPorId = async (subcategoriaId) => {
  try {
    const subcategoria = await prisma.subcategoria.findUnique({
      where: { id: Number(subcategoriaId) },
      include: { categoria: true }
    });
    return subcategoria;
  } catch (error) {
    throw new Error(`Erro ao obter subcategoria: ${error.message}`);
  }
};

export const atualizarSubcategoria = async (subcategoriaId, nome, descricao) => {
  try {
    const subcategoria = await prisma.subcategoria.update({
      where: { id: Number(subcategoriaId) },
      data: {
        nome,
        descricao,
        atualizadoEm: new Date()
      }
    });
    return subcategoria;
  } catch (error) {
    throw new Error(`Erro ao atualizar subcategoria: ${error.message}`);
  }
};

export const deletarSubcategoria = async (subcategoriaId) => {
  try {
    // Soft delete - marcar como inativa
    const subcategoria = await prisma.subcategoria.update({
      where: { id: Number(subcategoriaId) },
      data: {
        ativa: false,
        atualizadoEm: new Date()
      }
    });
    return subcategoria;
  } catch (error) {
    throw new Error(`Erro ao deletar subcategoria: ${error.message}`);
  }
};
