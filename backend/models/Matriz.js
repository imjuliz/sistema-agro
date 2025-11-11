import prisma from '../prisma/client.js';

// BUSCA ---------------------------------------------------------------------------
export async function getUnidades() {
    try {
        const unidades = await prisma.unidade.findMany();
        return {
            sucesso: true,
            unidades,
            message: "Unidades listadas com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidades.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function getUnidadePorId(id) {
    try {
        const unidade = await prisma.unidade.findUnique({ where: { id } })
        return ({
            sucesso: true,
            unidade,
            message: "Unidade listada com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidade por id.",
            detalhes: error.message // opcional, para debug
        }
    }
};

// buscar APENAS fazendas
export async function getFazendas() {
  try {
    const fazendas = await prisma.unidade.findMany({
      where: { tipo: 'Fazenda' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: fazendas,
      message: "Fazendas listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fazendas.",
      detalhes: error.message
    };
  }
}

// buscar APENAS matrizes
export async function getMatriz() {
  try {
    const matriz = await prisma.unidade.findMany({
      where: { tipo: 'Matriz' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: matriz,
      message: "Matriz listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar matriz.",
      detalhes: error.message
    };
  }
}

// buscar APENAS lojas
export async function getLoja() {
  try {
    const loja = await prisma.unidade.findMany({
      where: { tipo: 'Loja' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: loja,
      message: "Loja listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar loja.",
      detalhes: error.message
    };
  }
}

// CONTAGEM ---------------------------------------------------------------------------
export const UnidadeService = {
  // Contagem total de unidades do tipo "FAZENDA"
  async contarFazendas() {
    return await prisma.unidade.count({
      where: {
        tipo: 'FAZENDA',
      },
    });
  },

  // Contagem de fazendas com status ATIVA
  async contarFazendasAtivas() {
    return await prisma.unidade.count({
      where: {
        tipo: 'FAZENDA',
        status: 'ATIVA',
      },
    });
  },

  // Contagem de fazendas com status INATIVA
  async contarFazendasInativas() {
    return await prisma.unidade.count({
      where: {
        tipo: 'FAZENDA',
        status: 'INATIVA',
      },
    });
  },
};

// CRIAR --------------------------------------------------------------------
export async function createUnidade(data) {
    try {
        const unidade = await prisma.unidade.create({ data });
        return ({
            sucesso: true,
            unidade,
            message: "Unidade criada com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

// DELETAR ---------------------------------------------------------------------
export async function deleteUnidade(id) {
    const unidade = await prisma.unidade.delete({ where: { id } })
    return ({
        sucesso: true,
        unidade,
        message: "Unidade deletada com sucesso."
    })
};