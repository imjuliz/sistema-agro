// models/Unidades.js
import prisma from "../prisma/client.js";

export async function getUnidades() {
  try {
    const unidades = await prisma.unidade.findMany();
    return { sucesso: true, unidades, message: "Unidades listadas com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar unidades.", detalhes: error.message };}
}

export async function getUnidadePorId(id) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade listada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar unidade por id.", detalhes: error.message };}
}

// buscar APENAS fazendas 
export async function getFazendas() {
  try {
    const fazendas = await prisma.unidade.findMany({
      where: { tipo: 'FAZENDA' },
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        endereco: true,
        cnpj: true,
        cep: true,
        imagemUrl: true,
        cidade: true,
        estado: true,
        tipo: true,
        status: true,
        latitude: true,
        longitude: true,
        areaTotal: true,
        areaProdutiva: true,
        atualizadoEm: true,
        criadoEm: true,
        email: true,
        telefone: true,
        gerente: {
          select: { nome: true }
        }
      }
    });

    return { sucesso: true, unidades: fazendas };
  }
  catch (error) {
    return { sucesso: false, erro: "Erro ao listar fazendas.", detalhes: error.message };
  }
}

export async function getMatriz() {
  try {
    const matrizes = await prisma.unidade.findMany({
      where: { tipo: 'MATRIZ' },
      orderBy: { nome: 'asc' },
    });
    return { sucesso: true, unidades: matrizes, message: "Matriz listadas com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar matriz.", detalhes: error.message };}
}

export async function getLoja() {
  try {
    const lojas = await prisma.unidade.findMany({
      where: { tipo: 'LOJA' },
      orderBy: { nome: 'asc' },
       select: {
        id: true,
        nome: true,
        endereco: true,
        cnpj: true,
        cidade: true,
        estado: true,
        cep: true,
        imagemUrl: true,
        tipo: true,
        status: true,
        latitude: true,
        longitude: true,
        horarioAbertura: true,
        horarioFechamento: true,
        telefone: true,
        email: true,
        atualizadoEm: true,
        criadoEm: true,
        gerente: {
          select: { nome: true }
        }
      }
    });
    return { sucesso: true, unidades: lojas, message: "Loja listadas com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar loja.", detalhes: error.message };}
}

// CONTAGEM
export const FazendaService = {
  async contarFazendas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA' } });},
  async contarFazendasAtivas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'ATIVA' } });},
  async contarFazendasInativas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'INATIVA' } });},
};

export const LojaService = {
  async contarLojas() {return await prisma.unidade.count({ where: { tipo: 'LOJA' } });},
  async contarLojasAtivas() {return await prisma.unidade.count({ where: { tipo: 'LOJA', status: 'ATIVA' } });},
  async contarLojasInativas() {return await prisma.unidade.count({ where: { tipo: 'LOJA', status: 'INATIVA' } });},
};

// CRIAR
export async function createUnidade(data) {
  try {
    const unidade = await prisma.unidade.create({ data });
    return { sucesso: true, unidade, message: "Unidade criada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao criar unidade.", detalhes: error.message };}
}

// ATUALIZAR (implementei)
export async function updateUnidade(id, data) {
  try {
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data,
    });
    return { sucesso: true, unidade, message: "Unidade atualizada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao atualizar unidade.", detalhes: error.message };}
}

// DELETAR
export async function deleteUnidade(id) {
  try {
    const unidade = await prisma.unidade.delete({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade deletada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao deletar unidade.", detalhes: error.message };}
}

// ATUALIZAR STATUS
export async function updateStatusUnidade(id, novoStatus) {
  try {
    const statusPermitidos = ["ATIVA", "INATIVA", "MANUTENCAO"];
    const upper = String(novoStatus).toUpperCase();
    if (!statusPermitidos.includes(upper)) {return { sucesso: false, message: "Status inválido. Use: 'ATIVA', 'INATIVA' ou 'MANUTENCAO'." };}
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data: { status: upper },
    });
    return { sucesso: true, unidade, message: `Status da unidade atualizado para ${upper}.` };
  }
  catch (error) {return { sucesso: false, message: "Erro ao atualizar status da unidade.", error: error.message };}
}


/* Busca usuários (funcionários) de uma unidade com filtros e paginação. */
export async function getUsuariosPorUnidade({ unidadeId = null, q = null, perfilId = null, status = null, page = 1, perPage = 25 } = {}) {
  try {
    if (unidadeId == null) return { sucesso: false, erro: "unidadeId é obrigatório." };

    const where = { unidadeId: Number(unidadeId) };

    // busca por texto (nome, email, telefone)
    if (q) {
      const texto = String(q).trim();
      where.AND = [
        {
          OR: [
            { nome: { contains: texto, mode: "insensitive" } },
            { email: { contains: texto, mode: "insensitive" } },
            { telefone: { contains: texto, mode: "insensitive" } },
          ],
        },
      ];
    }

    if (perfilId != null) {
      where.perfilId = Number(perfilId);
    }

    if (status != null) {
      // aceita 'true'/'false', 'ativo'/'inativo', 1/0 ou boolean
      if (typeof status === "string") {
        const s = status.toLowerCase();
        if (s === "ativo" || s === "true" || s === "1") where.status = true;
        else if (s === "inativo" || s === "false" || s === "0") where.status = false;
      } else {
        where.status = Boolean(status);
      }
    }

    const pageNum = Math.max(1, Number(page || 1));
    const per = Math.max(1, Math.min(100, Number(perPage || 25)));
    const skip = (pageNum - 1) * per;

    const [total, usuarios] = await Promise.all([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({
        where,
        orderBy: { nome: "asc" },
        skip,
        take: per,
        include: {
          perfil: { select: { id: true, funcao: true, descricao: true } },
          unidade: { select: { id: true, nome: true, cidade: true, estado: true } },
        },
      }),
    ]);

    return { sucesso: true, total, page: pageNum, perPage: per, usuarios };
  } catch (error) {
    console.error("[getUsuariosPorUnidade] erro:", error);
    return { sucesso: false, erro: "Erro ao buscar usuários da unidade.", detalhes: error.message };
  }
}

/**
 * Buscar usuário por id (opcional, útil para detalhe).
 */
export async function getUsuarioPorId(id) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        perfil: { select: { id: true, funcao: true, descricao: true } },
        unidade: { select: { id: true, nome: true, cidade: true, estado: true } },
      },
    });

    if (!usuario) return { sucesso: false, erro: "Usuário não encontrado." };
    return { sucesso: true, usuario };
  } catch (error) {
    console.error("[getUsuarioPorId] erro:", error);
    return { sucesso: false, erro: "Erro ao buscar usuário.", detalhes: error.message };
  }
}

/**
 * Contagem simples (opcional)
 */
export async function countUsuariosPorUnidade(unidadeId) {
  try {
    const total = await prisma.usuario.count({ where: { unidadeId: Number(unidadeId) } });
    return { sucesso: true, total };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao contar usuários.", detalhes: error.message };
  }
}
