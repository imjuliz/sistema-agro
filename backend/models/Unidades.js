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
    const unidade = await prisma.unidade.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: { usuarios: true } // contar usuários vinculados
        }
      }
    });
    
    if (!unidade) {
      return { sucesso: false, erro: "Unidade não encontrada.", message: "A unidade com este ID não existe." };
    }
    
    // normalizar resposta incluindo quantidade de funcionários
    const unidadeComContagem = {
      ...unidade,
      quantidadeFuncionarios: unidade._count?.usuarios || 0
    };
    
    return { sucesso: true, unidade: unidadeComContagem, message: "Unidade listada com sucesso." };
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

// BUSCA FAZENDAS COM FILTROS E PAGINAÇÃO
export async function getFazendasFiltered({ q = null, cidade = null, estado = null, minArea = null, maxArea = null, tipos = null, status = null, responsible = null, page = 1, perPage = 25, orderBy = 'nome_asc' } = {}) {
  try {
    const where = { tipo: 'FAZENDA' };

    const and = [];

    if (q) {
      const texto = String(q).trim();
      and.push({
        OR: [
          { nome: { contains: texto, mode: 'insensitive' } },
          { endereco: { contains: texto, mode: 'insensitive' } },
          { cidade: { contains: texto, mode: 'insensitive' } },
          { estado: { contains: texto, mode: 'insensitive' } },
        ],
      });
    }

    if (cidade) {
      and.push({ cidade: { contains: String(cidade).trim(), mode: 'insensitive' } });
    }

    if (estado) {
      and.push({ estado: { contains: String(estado).trim(), mode: 'insensitive' } });
    }

    // tipos: aceita string com vírgula ou array de tipos (ex: 'FAZENDA,MATRIZ')
    if (tipos) {
      const list = Array.isArray(tipos) ? tipos : String(tipos).split(',');
      const cleaned = list.map(t => String(t || '').trim()).filter(Boolean).map(t => {
        const upper = t.toUpperCase();
        if (upper === 'FAZENDA') return 'FAZENDA';
        if (upper === 'MATRIZ') return 'MATRIZ';
        if (upper === 'LOJA' || upper === 'LOJAS') return 'LOJA';
        return upper;
      });
      if (cleaned.length > 0) {
        and.push({ tipo: { in: cleaned } });
      }
    }

    // status: aceita 'ATIVA,INATIVA' or localized forms
    if (status) {
      const list = Array.isArray(status) ? status : String(status).split(',');
      const cleaned = list.map(s => String(s || '').trim()).filter(Boolean).map(s => s.toUpperCase());
      if (cleaned.length > 0) {
        and.push({ status: { in: cleaned } });
      }
    }

    // responsible: buscar pelo campo gerente.nome ou gerente (string)
    if (responsible) {
      const texto = String(responsible).trim();
      and.push({ OR: [ { gerente: { nome: { contains: texto, mode: 'insensitive' } } }, { gerente: { contains: texto, mode: 'insensitive' } } ] });
    }

    if (minArea != null || maxArea != null) {
      const areaCond = {};
      if (minArea != null) areaCond.gte = Number(minArea);
      if (maxArea != null) areaCond.lte = Number(maxArea);
      // assume areaProdutiva is stored in hectares
      and.push({ areaProdutiva: areaCond });
    }

    if (and.length > 0) where.AND = and;

    // Processar ordenação
    let orderByObj = { nome: 'asc' };
    const orderByStr = String(orderBy || 'nome_asc').toLowerCase();
    if (orderByStr === 'nome_desc' || orderByStr === 'z-a') {
      orderByObj = { nome: 'desc' };
    } else if (orderByStr === 'mais_recente' || orderByStr === 'recente') {
      orderByObj = { atualizadoEm: 'desc' };
    } else if (orderByStr === 'mais_antigo' || orderByStr === 'antigo') {
      orderByObj = { atualizadoEm: 'asc' };
    }

    const pageNum = Math.max(1, Number(page || 1));
    const per = Math.max(1, Math.min(200, Number(perPage || 25)));
    const skip = (pageNum - 1) * per;

    const [total, unidades] = await Promise.all([
      prisma.unidade.count({ where }),
      prisma.unidade.findMany({ 
        where, 
        skip, 
        take: per, 
        orderBy: orderByObj,
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
      }),
    ]);

    return { sucesso: true, unidades, total, page: pageNum, perPage: per };
  } catch (error) {
    console.error('[getFazendasFiltered] erro:', error);
    return { sucesso: false, erro: 'Erro ao buscar fazendas filtradas.', detalhes: error.message };
  }
}

// SUGESTÕES DE CIDADES / ESTADOS (autocomplete)
export async function getCityStateSuggestions(query = '', limit = 20) {
  try {
    const q = String(query || '').trim();
    if (!q) return { sucesso: true, suggestions: [] };

    const rows = await prisma.unidade.findMany({
      where: {
        tipo: 'FAZENDA',
        OR: [
          { cidade: { contains: q, mode: 'insensitive' } },
          { estado: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { cidade: true, estado: true },
      take: limit,
    });

    // dedupe combinations
    const seen = new Set();
    const suggestions = [];
    for (const r of rows) {
      const c = String(r.cidade || '').trim();
      const e = String(r.estado || '').trim();
      const key = `${c}||${e}`;
      if (!c) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push({ cidade: c, estado: e });
    }

    return { sucesso: true, suggestions };
  } catch (error) {
    console.error('[getCityStateSuggestions] erro:', error);
    return { sucesso: false, erro: 'Erro ao buscar sugestões de cidades.', detalhes: error.message };
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

// BUSCA LOJAS COM FILTROS E PAGINAÇÃO
export async function getLojasFiltered({ q = null, cidade = null, estado = null, tipos = null, status = null, responsible = null, page = 1, perPage = 25, orderBy = 'nome_asc' } = {}) {
  try {
    const where = { tipo: 'LOJA' };
    const and = [];

    if (q) {
      const texto = String(q).trim();
      and.push({
        OR: [
          { nome: { contains: texto, mode: 'insensitive' } },
          { endereco: { contains: texto, mode: 'insensitive' } },
          { cidade: { contains: texto, mode: 'insensitive' } },
          { estado: { contains: texto, mode: 'insensitive' } },
        ],
      });
    }

    if (cidade) and.push({ cidade: { contains: String(cidade).trim(), mode: 'insensitive' } });
    if (estado) and.push({ estado: { contains: String(estado).trim(), mode: 'insensitive' } });

    if (tipos) {
      const list = Array.isArray(tipos) ? tipos : String(tipos).split(',');
      const cleaned = list.map(t => String(t || '').trim().toUpperCase()).filter(Boolean);
      if (cleaned.length > 0) and.push({ tipo: { in: cleaned } });
    }

    if (status) {
      const list = Array.isArray(status) ? status : String(status).split(',');
      const cleaned = list.map(s => String(s || '').trim().toUpperCase()).filter(Boolean);
      if (cleaned.length > 0) and.push({ status: { in: cleaned } });
    }

    if (responsible) {
      const texto = String(responsible).trim();
      and.push({
        OR: [
          { gerente: { nome: { contains: texto, mode: 'insensitive' } } },
          { gerente: { contains: texto, mode: 'insensitive' } },
        ],
      });
    }

    if (and.length > 0) where.AND = and;

    let orderByObj = { nome: 'asc' };
    const orderByStr = String(orderBy || 'nome_asc').toLowerCase();
    if (orderByStr === 'nome_desc' || orderByStr === 'z-a') orderByObj = { nome: 'desc' };
    else if (orderByStr === 'mais_recente' || orderByStr === 'recente') orderByObj = { atualizadoEm: 'desc' };
    else if (orderByStr === 'mais_antigo' || orderByStr === 'antigo') orderByObj = { atualizadoEm: 'asc' };

    const pageNum = Math.max(1, Number(page || 1));
    const per = Math.max(1, Math.min(200, Number(perPage || 25)));
    const skip = (pageNum - 1) * per;

    const [total, unidades] = await Promise.all([
      prisma.unidade.count({ where }),
      prisma.unidade.findMany({
        where,
        skip,
        take: per,
        orderBy: orderByObj,
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
          gerente: { select: { nome: true } },
        },
      }),
    ]);

    return { sucesso: true, unidades, total, page: pageNum, perPage: per };
  } catch (error) {
    console.error('[getLojasFiltered] erro:', error);
    return { sucesso: false, erro: 'Erro ao buscar lojas filtradas.', detalhes: error.message };
  }
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
    
    // Criar estoque para a unidade
    await criarEstoqueUnidade(unidade.id);
    
    // Criar categorias financeiras padrão para a unidade
    await criarCategoriasPadraoUnidade(unidade.id);
    
    return { sucesso: true, unidade, message: "Unidade criada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao criar unidade.", detalhes: error.message };}
}

// Função auxiliar para criar estoque da unidade
async function criarEstoqueUnidade(unidadeId) {
  try {
    await prisma.estoque.create({
      data: {
        unidadeId,
        descricao: "Estoque da unidade",
        qntdItens: 0
      }
    });

    console.log(`✅ Estoque criado para unidade ${unidadeId}`);
  } catch (error) {
    console.error(`❌ Erro ao criar estoque para unidade ${unidadeId}:`, error.message);
    // Não lançar erro - a unidade já foi criada, apenas o estoque falharia
  }
}

// Função auxiliar para criar categorias financeiras padrão
async function criarCategoriasPadraoUnidade(unidadeId) {
  try {
    // Categorias de ENTRADA (Receitas)
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Vendas",
        tipo: "ENTRADA",
        descricao: "Receitas com vendas de produtos",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Vendas Locais", descricao: "Vendas realizadas no local", ativa: true },
              { nome: "Vendas Online", descricao: "Vendas pela internet", ativa: true },
              { nome: "Exportação", descricao: "Vendas para exportação", ativa: true }
            ]
          }
        }
      }
    });

    // Categorias de SAÍDA - Custos Operacionais
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Custos Operacionais",
        tipo: "SAIDA",
        descricao: "Despesas com operação da unidade",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Aluguel", descricao: "Aluguel da propriedade", ativa: true },
              { nome: "Energia Elétrica", descricao: "Consumo de energia", ativa: true },
              { nome: "Água", descricao: "Consumo de água", ativa: true }
            ]
          }
        }
      }
    });

    // Categorias de SAÍDA - Pessoal
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Pessoal",
        tipo: "SAIDA",
        descricao: "Despesas com funcionários e recursos humanos",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Salários", descricao: "Pagamento de salários dos funcionários", ativa: true },
              { nome: "Encargos Sociais", descricao: "INSS, FGTS e outros encargos", ativa: true }
            ]
          }
        }
      }
    });

    // Categorias de SAÍDA - Insumos
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Insumos",
        tipo: "SAIDA",
        descricao: "Compra de insumos e matérias-primas",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Sementes", descricao: "Compra de sementes", ativa: true },
              { nome: "Fertilizantes", descricao: "Compra de fertilizantes", ativa: true },
              { nome: "Defensivos", descricao: "Compra de defensivos agrícolas", ativa: true }
            ]
          }
        }
      }
    });

    // Categorias de SAÍDA - Infraestrutura
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Infraestrutura",
        tipo: "SAIDA",
        descricao: "Despesas com manutenção e infraestrutura",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Manutenção Equipamentos", descricao: "Manutenção de máquinas e equipamentos", ativa: true },
              { nome: "Reparos", descricao: "Reparos gerais da infraestrutura", ativa: true }
            ]
          }
        }
      }
    });

    // Categorias de SAÍDA - Financeiro
    await prisma.categoria.create({
      data: {
        unidadeId,
        nome: "Financeiro",
        tipo: "SAIDA",
        descricao: "Despesas financeiras (juros, taxas, etc)",
        ativa: true,
        subcategorias: {
          createMany: {
            data: [
              { nome: "Juros", descricao: "Pagamento de juros", ativa: true },
              { nome: "Taxas", descricao: "Taxas bancárias e outras taxas", ativa: true }
            ]
          }
        }
      }
    });

    console.log(`✅ Categorias financeiras padrão criadas para unidade ${unidadeId}`);
  } catch (error) {
    console.error(`❌ Erro ao criar categorias padrão para unidade ${unidadeId}:`, error.message);
    // Não lançar erro - a unidade já foi criada, apenas as categorias falharam
  }
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

// FOTO DA UNIDADE
export const atualizarFotoUnidade = async (id, caminhoFoto) => {
  try {
    const unidadeAtualizada = await prisma.unidade.update({
      where: { id: Number(id) },
      data: { imagemUrl: caminhoFoto },
      select: {
        id: true,
        nome: true,
        imagemUrl: true,
      },
    });
    return {
      sucesso: true,
      unidade: unidadeAtualizada,
      message: "Foto da unidade atualizada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar foto da unidade:", error);
    return {
      sucesso: false,
      erro: "Erro ao atualizar foto da unidade.",
      detalhes: error.message,
    };
  }
};

export const removerFotoUnidade = async (id) => {
  try {
    const unidadeAtualizada = await prisma.unidade.update({
      where: { id: Number(id) },
      data: { imagemUrl: null },
      select: {
        id: true,
        nome: true,
        imagemUrl: true,
      },
    });
    return {
      sucesso: true,
      unidade: unidadeAtualizada,
      message: "Foto da unidade removida com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao remover foto da unidade:", error);
    return {
      sucesso: false,
      erro: "Erro ao remover foto da unidade.",
      detalhes: error.message,
    };
  }
};
