import prisma from "../prisma/client.js";

export const contarFornecedoresExternos = async (unidadeId) => {
  try {
    const count = await prisma.fornecedorExterno.count({
      where: {
        unidadeId: Number(unidadeId),
        status: 'ATIVO'
      }
    });
    return { sucesso: true, count, message: 'Contagem de fornecedores externos realizada com sucesso!' };
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao contar fornecedores externos', detalhes: error.message };
  }
};

export const listarFornecedoresExternos = async (unidadeId) => {
  try {
    // Se veio unidadeId, lista fornecedores externos vinculados a essa unidade
    if (unidadeId) {
      const fornecedores = await prisma.fornecedorExterno.findMany({
        where: {
          unidadeId: Number(unidadeId),
          status: 'ATIVO'
        },
        select: {
          id: true,
          nomeEmpresa: true,
          descricaoEmpresa: true,
          cnpjCpf: true,
          email: true,
          telefone: true,
          status: true,
          unidadeId: true
        },
        orderBy: { nomeEmpresa: 'asc' }
      });

      return { sucesso: true, fornecedores, message: 'Fornecedores externos listados com sucesso!' };
    }

    // Fallback: se não foi fornecido unidadeId, retorna todos ativos
    const fornecedores = await prisma.fornecedorExterno.findMany({
      where: { status: 'ATIVO' },
      select: { id: true, nomeEmpresa: true, descricaoEmpresa: true, cnpjCpf: true, email: true, telefone: true, status: true, unidadeId: true },
      orderBy: { nomeEmpresa: 'asc' }
    });

    return { sucesso: true, fornecedores, message: 'Fornecedores externos listados com sucesso!' };
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao listar fornecedores externos', detalhes: error.message };
  }
};

export const listarTodosFornecedoresExternos = async () => {
  try {
    const fornecedores = await prisma.fornecedorExterno.findMany({
      select: {
        id: true,
        nomeEmpresa: true,
        cnpjCpf: true,
        email: true,
        telefone: true,
        endereco: true,
        descricaoEmpresa: true,
      },
      orderBy: { nomeEmpresa: 'asc' },
    });

    return {
      sucesso: true,
      fornecedores,
      message: "Todos os fornecedores externos listados com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar todos os fornecedores externos",
      detalhes: error.message,
    };
  }
};

export const criarFornecedorExterno = async (data) => {
  try {
   const { unidadeId, nomeEmpresa, descricaoEmpresa, cnpjCpf, email, telefone, endereco, status } = data;

   if (!unidadeId || !nomeEmpresa || !descricaoEmpresa || !cnpjCpf || !telefone) {
     return { sucesso:false, erro: "unidadeId, nomeEmpresa, descricaoEmpresa, cnpj e telefone são obrigatórios.", field: null };
    }

    // checar duplicidade por CNPJ, email ou telefone
    const existing = await prisma.fornecedorExterno.findFirst({
      where: {
        OR: [
          { cnpjCpf: cnpjCpf },
          { email: email || undefined },
          { telefone: telefone || undefined }
        ]
      },
      select: { id: true, cnpjCpf: true, email: true, telefone: true }
    });

    if (existing) {
      if (existing.cnpjCpf === cnpjCpf) return { sucesso: false, erro: "CNPJ já cadastrado.", field: "cnpjCpf" };
      if (existing.email && existing.email === email) return { sucesso: false, erro: "Email já cadastrado.", field: "email" };
      if (existing.telefone && existing.telefone === telefone) return { sucesso: false, erro: "Telefone já cadastrado.", field: "telefone" };
      return { sucesso: false, erro: "Fornecedor já cadastrado.", field: null };
    }

    const f = await prisma.fornecedorExterno.create({
      data: {
       unidadeId: Number(unidadeId),
        nomeEmpresa,
        descricaoEmpresa,
        cnpjCpf: cnpjCpf,
        email: email || null,
        telefone,
        endereco: endereco || null,
        status: status || 'ATIVO'
      },
     select: { id: true, nomeEmpresa: true, cnpjCpf: true, email: true, telefone: true, unidadeId: true }
    });

    return { sucesso: true, fornecedorExterno: f, message: "Fornecedor criado" };
  } catch (error) {
    console.error("Erro ao criar fornecedorExterno:", error);
    if (error.code === 'P2002' && (error.meta?.target?.includes('cnpj') || error.meta?.target?.includes('cnpj_cpf') || error.meta?.target?.includes('cnpjCpf'))) {
      return { sucesso: false, erro: "CNPJ já cadastrado.", field: "cnpjCpf" };
    }
    return { sucesso: false, erro: "Erro ao criar fornecedorExterno.", detalhes: error.message, field: null };
  }
};


//fazer uma função para buscar fornecedorExterno interno 
export const listarFornecedoresInternos = async (unidadeId) => { //nesse caso a função é  para as lojas consultarem as fazendas fornecedoras
  try {
    const contratos = await prisma.contrato.findMany({
      where: {
        unidadeId: Number(unidadeId),        // loja
        fornecedorUnidadeId: { not: null }  // fazendas fornecedoras
      },
      include: {
        fornecedorInterno: true             // Unidade (fazenda)
      }
    });

    // extrair fazendas únicas
    const fornecedores = contratos
      .map(c => c.fornecedorInterno)
      .filter((f, i, arr) => f && arr.findIndex(x => x.id === f.id) === i);

    return {
      sucesso: true,
      fornecedores,
      message: "Fornecedores internos listados com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fornecedores internos",
      detalhes: error.message
    };
  }
}

export const listarTodasAsLojas = async () => {
  try {
    const lojas = await prisma.unidade.findMany({
      where: {
        tipo: 'LOJA',
        status: 'ATIVA'
      },
      select: {
        id: true,
        nome: true,
        endereco: true,
        cidade: true,
        estado: true,
        cnpj: true,
        telefone: true,
        email: true
      },
      orderBy: { nome: 'asc' }
    });

    return {
      sucesso: true,
      lojas,
      message: "Lojas listadas com sucesso!"
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lojas",
      detalhes: error.message
    };
  }
};

export const calcularFornecedores = async (unidadeId) => { //ok
  try {
    const totalFornecedores = await prisma.fornecedorExterno.aggregate({ where: { unidadeId: Number(unidadeId), }, });
    const somaFornecedores = Number(totalFornecedores || 0);

    return {
      sucesso: true,
      qtdFornecedores: somaFornecedores,
      message: "Quantidade de fornecedores calculada com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao calcular quantidade de fornecedores",
      detalhes: error.message,
    };
  }
};

export const verContratosComLojas = async (fornecedorUnidadeId) => { //função para que a fazenda consulte seus contratos
  try {
    const contratos = await prisma.contrato.findMany({
      where: { fornecedorUnidadeId: Number(fornecedorUnidadeId) },
      include: {
        unidade: {
          select: {
            id: true, nome: true, cidade: true, estado: true
          }
        },
        itens: {
          select: {
            id: true,
            nome: true,
            quantidade: true,
            unidadeMedida: true,
            precoUnitario: true
          }
        },
      }
    });

    return ({
      sucesso: true,
      contratos,
      message: "Contratos listados com sucesso!"
    })
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fornecedores",
      detalhes: error.message
    }
  }
}

export const verContratosExternos = async(unidadeId) =>{
  try {
    const contratosExternos = await prisma.contrato.findMany({
      where: { 
        unidadeId: Number(unidadeId),
        fornecedorExternoId: { not: null }  // Filtra apenas contratos externos
      },
      include: {
        unidade: {
          select: {
            id: true, nome: true, cidade: true, estado: true
          }
        },
          itens :{
            select: {
              id: true,
              nome: true
            }
          },
          fornecedorExterno: {
            select: { 
              id: true, 
              nomeEmpresa: true, 
              cnpjCpf: true, 
              email: true, 
              telefone: true,
              descricaoEmpresa: true
            }
          }
      }
    });

    // TEMP LOG: help debug why frontend sometimes receives an empty array
    try {
      console.log('[verContratosExternos] unidadeId=', unidadeId, 'contratosExternosCount=', contratosExternos?.length);
      // Log a small sample (up to 3) so we can inspect structure without flooding logs
      console.log('[verContratosExternos] sample contratos:', JSON.stringify((contratosExternos || []).slice(0,3)));
    } catch (e) {
      // swallow logging errors to avoid breaking response
      console.error('[verContratosExternos] erro ao logar contratos:', e?.message ?? e);
    }

    return ({
      sucesso: true,
      contratosExternos,
      message: "Contratos externos listados com sucesso!"
    })
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar contratos externos",
      detalhes: error.message
    }
  }
}

export const verContratosComFazendas = async(unidadeId) =>{
try {
    console.log('[verContratosComFazendas] Buscando contratos onde esta unidade é CONSUMIDOR (compra de outras fazendas) para unidadeId:', unidadeId);
    
    // DEBUG: Buscar TODOS os contratos desta unidade como consumidor
    const allContratos = await prisma.contrato.findMany({
      where: { unidadeId: Number(unidadeId) },
      select: {
        id: true,
        unidadeId: true,
        fornecedorUnidadeId: true,
        fornecedorExternoId: true,
        status: true
      }
    });
    console.log('[verContratosComFazendas] TODOS os contratos onde unidade é consumidor:', allContratos.length, allContratos);
    
    // Buscar apenas contratos internos (onde esta unidade CONSOME de outras unidades)
    const contratos = await prisma.contrato.findMany({
      where: { 
        unidadeId: Number(unidadeId),
        fornecedorUnidadeId: { not: null }  // Tem um fornecedor interno (outro unidade/fazenda)
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            telefone: true,
            email: true,
            cnpj: true
          }
        },
        fornecedorInterno :{
          select : {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            telefone: true,
            email: true,
            cnpj: true
          }
        },
        itens :{
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    console.log('[verContratosComFazendas] Contratos internos encontrados (onde esta unidade CONSOME):', contratos.length);

    // Sanitizar campos sensíveis para JSON (Dates -> ISO strings, Decimals -> Number)
    const contratosSanitizados = contratos.map(c => ({
      ...c,
      valorTotal: c.valorTotal != null ? Number(c.valorTotal) : null,
      dataInicio: c.dataInicio ? c.dataInicio.toISOString() : null,
      dataFim: c.dataFim ? c.dataFim.toISOString() : null,
      dataEnvio: c.dataEnvio ? c.dataEnvio.toISOString() : null,
      itens: Array.isArray(c.itens) ? c.itens.map(it => ({
        ...it,
        quantidade: it.quantidade != null ? Number(it.quantidade) : null,
        pesoUnidade: it.pesoUnidade != null ? Number(it.pesoUnidade) : null,
        precoUnitario: it.precoUnitario != null ? Number(it.precoUnitario) : null,
        criadoEm: it.criadoEm ? it.criadoEm.toISOString() : null,
        atualizadoEm: it.atualizadoEm ? it.atualizadoEm.toISOString() : null
      })) : []
    }));

    return ({
      sucesso: true,
      contratos: contratosSanitizados,
      message: "Contratos internos (onde você consome de outras unidades) listados com sucesso!"
    })
  } catch (error) {
    console.error('[verContratosComFazendas] Erro:', error);
    return {
      sucesso: false,
      erro: "Erro ao listar contratos internos",
      detalhes: error.message
    }
  }
}

// Nova função: contratos onde esta unidade é FORNECEDORA para outras unidades
export const verContratosComFazendasAsFornecedor = async(unidadeId) => {
  try {
    console.log('[verContratosComFazendasAsFornecedor] Buscando contratos onde esta unidade é FORNECEDORA (vende para outras unidades) para unidadeId:', unidadeId);
    
    const contratosRaw = await prisma.contrato.findMany({
      where: { 
        fornecedorUnidadeId: Number(unidadeId)  // Esta unidade é o fornecedor
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            telefone: true,
            email: true,
            cnpj: true
          }
        },
        itens: {
          select: {
            id: true,
            nome: true,
            // raca: true,
            // pesoUnidade: true,
            quantidade: true,
            unidadeMedida: true,
            // precoUnitario: true,
            // categoria: true,
            // ativo: true,
            // criadoEm: true,
            // atualizadoEm: true
          }
        }
      }
    });

    // Sanitizar campos que podem ser Decimal para tipos primitivos (JSON-safe)
    const contratos = contratosRaw.map(c => ({
      ...c,
      valorTotal: c.valorTotal != null ? Number(c.valorTotal) : null,
      dataInicio: c.dataInicio ? c.dataInicio.toISOString() : null,
      dataFim: c.dataFim ? c.dataFim.toISOString() : null,
      dataEnvio: c.dataEnvio ? c.dataEnvio.toISOString() : null,
      itens: Array.isArray(c.itens) ? c.itens.map(it => ({
        ...it,
        quantidade: it.quantidade != null ? Number(it.quantidade) : null,
        pesoUnidade: it.pesoUnidade != null ? Number(it.pesoUnidade) : null,
        precoUnitario: it.precoUnitario != null ? Number(it.precoUnitario) : null,
        criadoEm: it.criadoEm ? it.criadoEm.toISOString() : null,
        atualizadoEm: it.atualizadoEm ? it.atualizadoEm.toISOString() : null
      })) : []
    }));

    console.log('[verContratosComFazendasAsFornecedor] Contratos encontrados (onde esta unidade FORNECE):', contratos.length, contratos);

    return ({
      sucesso: true,
      contratos,
      message: "Contratos onde você é fornecedor listados com sucesso!"
    })
  } catch (error) {
    console.error('[verContratosComFazendasAsFornecedor] Erro:', error);
    return {
      sucesso: false,
      erro: "Erro ao listar contratos como fornecedor",
      detalhes: error.message
    }
  }
}

export async function buscarContratoPorIdService(contratoId) {
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(contratoId) },
      select: {
        id: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        dataEnvio: true,
        status: true,
        frequenciaEntregas: true,
        diaPagamento: true,
        formaPagamento: true,
        valorTotal: true,

        // Relações imediatas
        unidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        fornecedorInterno: {
          select: {
            id: true,
            nome: true,
          },
        },
        fornecedorExterno: {
          select: {
            id: true,
            nomeEmpresa: true,
          },
        },
        itens: true,
        lotes: true,
        pedidos: true,
      },
    });

    if (!contrato) {
      throw new Error("Contrato não encontrado.");
    }

    return contrato;
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    throw new Error("Erro ao obter informações do contrato.");
  }
}

export async function updateFornecedor(id, data) {
  try {
    const fornecedorExterno = await prisma.fornecedorExterno.update({
      where: { id },
      data: {
        nomeEmpresa: data.nomeEmpresa,
        descricaoEmpresa: data.descricaoEmpresa,
        material: data.material,
        cnpj: data.cnpj,
        contato: data.contato,
        email: data.email,
        endereco: data.endereco
      }
    })
    return {
      sucesso: true,
      fornecedorExterno,
      message: "Fornecedor atualizado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar fornecedorExterno",
      detalhes: error.message,
    }
  }
}

export const getFornecedoresKpis = async (unidadeId) => {
  try {
    const contratosAtivos = await prisma.contrato.count({ where: { unidadeId: Number(unidadeId), status: 'ATIVO' } });
    const contratosInativos = await prisma.contrato.count({ where: { unidadeId: Number(unidadeId), status: 'INATIVO' } });

    const fornecedoresAtivos = await prisma.fornecedorExterno.count({
      where: {
        status: 'ATIVO',
        contratos: { some: { unidadeId: Number(unidadeId) } }
      }
    });

    const soma = await prisma.contrato.aggregate({
      where: { unidadeId: Number(unidadeId), status: 'ATIVO' },
      _sum: { valorTotal: true }
    });

    const valorTotalContratosAtivos = soma?._sum?.valorTotal ? Number(soma._sum.valorTotal) : 0;

    return {
      sucesso: true,
      contratosAtivos,
      contratosInativos,
      fornecedoresAtivos,
      valorTotalContratosAtivos,
      message: 'KPIs calculados com sucesso.'
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: 'Erro ao calcular KPIs de fornecedores',
      detalhes: error.message
    };
  }
};

export const deleteFornecedorWithContracts = async (fornecedorId) => {
  try {
    const idNum = Number(fornecedorId);
    await prisma.$transaction(async (tx) => {
      await tx.fornecedorExterno.update({ where: { id: idNum }, data: { status: 'INATIVO' } });
      await tx.contrato.updateMany({ where: { fornecedorExternoId: idNum }, data: { status: 'INATIVO' } });
    });

    return { sucesso: true, message: 'Fornecedor e contratos marcados como inativos com sucesso.' };
  } catch (error) {
    console.error('[deleteFornecedorWithContracts] Erro:', error);
    return { sucesso: false, erro: 'Erro ao deletar fornecedor', detalhes: error.message };
  }
};

export const listarLojasAtendidas = async (unidadeId) => { //função para a fazenda ver as lojas para as quais ela fornece produtos
  try {
    const contratos = await prisma.contrato.findMany({
      where: {
        fornecedorUnidadeId: Number(unidadeId),
      },
      include: {
        unidade: true, // A loja que recebe
      },
    });

    const lojas = contratos.map(c => c.unidade);

    return {
      sucesso: true,
      lojas,
      message: "Lojas atendidas pela fazenda listadas com sucesso!"
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lojas atendidas pela fazenda",
      detalhes: error.message,
    };
  }
};

export const criarContratoInterno = async (fazendaId, dadosContrato) => {
  try {
    console.log('[criarContratoInterno] fazendaId:', fazendaId);
    console.log('[criarContratoInterno] dadosContrato recebido:', JSON.stringify(dadosContrato, null, 2));

    const {
      unidadeId, // loja
      dataInicio,
      dataFim,
      dataEnvio,
      status,
      descricao,
      frequenciaEntregas,
      diaPagamento,
      formaPagamento,
      valorTotal,
      itens = []
    } = dadosContrato;

    console.log('[criarContratoInterno] Valores extraídos:');
    console.log('  - unidadeId:', unidadeId);
    console.log('  - dataInicio:', dataInicio);
    console.log('  - dataFim:', dataFim);
    console.log('  - dataEnvio:', dataEnvio);
    console.log('  - status:', status);
    console.log('  - frequenciaEntregas:', frequenciaEntregas);
    console.log('  - diaPagamento:', diaPagamento);
    console.log('  - formaPagamento:', formaPagamento);

    if (!fazendaId) {
      return { sucesso: false, erro: "ID da fazenda (fornecedorExterno interno) é obrigatório." };
    }

    if (!unidadeId) {
      return { sucesso: false, erro: "unidadeId da loja é obrigatório." };
    }

    if (!dataInicio || !dataEnvio || !frequenciaEntregas || !diaPagamento || !formaPagamento) {
      const missingFields = [];
      if (!dataInicio) missingFields.push('dataInicio');
      if (!dataEnvio) missingFields.push('dataEnvio');
      if (!frequenciaEntregas) missingFields.push('frequenciaEntregas');
      if (!diaPagamento) missingFields.push('diaPagamento');
      if (!formaPagamento) missingFields.push('formaPagamento');
      return { sucesso: false, erro: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` };
    }

    const contrato = await prisma.contrato.create({
      data: {
        unidadeId: Number(unidadeId),
        fornecedorUnidadeId: Number(fazendaId),

        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        dataEnvio: new Date(dataEnvio),
        descricao: descricao || null,

        status,
        frequenciaEntregas,
        diaPagamento,
        formaPagamento,
        valorTotal: valorTotal ? Number(valorTotal) : null,

        itens: {
          create: itens.map(i => ({
            nome: i.nome || null,
            quantidade: i.quantidade ? Number(i.quantidade) : null,
            precoUnitario: i.precoUnitario ? Number(i.precoUnitario) : null,
            pesoUnidade: i.pesoUnidade ? Number(i.pesoUnidade) : null,
            raca: i.raca || null,
            categoria: i.categoria || null,
            unidadeMedida: i.unidadeMedida || null,
          }))
        }
      },

      include: {
        itens: true,
        fornecedorInterno: {
          select: { nome: true }
        }
      }
    });

    return {
      sucesso: true,
      contrato,
      message: "contrato interno criado com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar contrato interno",
      detalhes: error.message
    };
  }
};

export const criarContratoExterno = async (unidadeId, dadosContrato) => {
  try {
    const {
      fornecedorExternoId,   // agora vem do BODY
      dataInicio,
      dataFim,
      dataEnvio,
      descricao,
      status,
      frequenciaEntregas,
      diaPagamento,
      formaPagamento,
      valorTotal,
      itens = []
    } = dadosContrato;

    if (!unidadeId) {
      return { sucesso: false, erro: "O ID da unidade é obrigatório no parâmetro da rota." };
    }

    if (!fornecedorExternoId) {
      return { sucesso: false, erro: "O fornecedorExterno externo é obrigatório no corpo da requisição." };
    }

    if (!dataInicio || !dataEnvio || !frequenciaEntregas || !diaPagamento || !formaPagamento) {
      return { sucesso: false, erro: "Campos obrigatórios estão faltando." };
    }

    const contrato = await prisma.contrato.create({
      data: {
        unidadeId: Number(unidadeId),            // quem está criando o contrato
        fornecedorExternoId: Number(fornecedorExternoId), // empresa externa

        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        dataEnvio: new Date(dataEnvio),

        descricao: descricao || null,

        status: status || "ATIVO",
        frequenciaEntregas,
        diaPagamento,
        formaPagamento,
        valorTotal: valorTotal ? Number(valorTotal) : null,

        itens: {
          create: itens.map(i => ({
            nome: i.nome,
            quantidade: i.quantidade ? Number(i.quantidade) : null,
            precoUnitario: i.precoUnitario ? Number(i.precoUnitario) : null,
            pesoUnidade: i.pesoUnidade ? Number(i.pesoUnidade) : null,
            raca: i.raca || null,
            categoria: i.categoria || null,
            unidadeMedida: i.unidadeMedida || null
          }))
        }
      },

      include: {
        itens: true,
        fornecedorExterno: { select: { nomeEmpresa: true } }
      }
    });

    return {
      sucesso: true,
      contrato,
      message: "contrato externo criado com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar contrato externo",
      detalhes: error.message
    };
  }
};

export const buscarPedidosExternos = async (unidadeId) => {
  try {
    // 1) Buscar contratos com fornecedores externos para a unidade
    const contratos = await prisma.contrato.findMany({
      where: {
        unidadeId: Number(unidadeId),
        fornecedorExternoId: { not: null }
      },
      select: { id: true }
    });

    const contratoIds = contratos.map(c => c.id);

    // 2) Se não há contratos, retorna lista vazia
    if (contratoIds.length === 0) {
      return {
        sucesso: true,
        pedidos: [],
        message: "Nenhum contrato com fornecedor externo encontrado para esta unidade."
      };
    }

    // 3) Buscar pedidos relacionados aos contratos (ou com destinoUnidadeId = unidadeId)
    const pedidos = await prisma.pedido.findMany({
      where: {
        OR: [
          { contratoId: { in: contratoIds } },
          { destinoUnidadeId: Number(unidadeId), origemFornecedorExternoId: { not: null } }
        ]
      },
      include: {
        itens: {
          select: {
            id: true,
            quantidade: true,
            unidadeMedida: true,
            precoUnitario: true,
            custoTotal: true,
            observacoes: true,
            produto: { select: { id: true, nome: true, sku: true, categoria: true } },
            fornecedorItem: { select: { id: true, nome: true } }
          }
        },
        contrato: {
          select: {
            id: true,
            fornecedorExterno: { select: { id: true, nomeEmpresa: true, cnpjCpf: true, email: true, telefone: true } }
          }
        },
        fornecedorExterno: {
          select: { id: true, nomeEmpresa: true, cnpjCpf: true, email: true, telefone: true }
        },
        destinoUnidade: {
          select: { id: true, nome: true, cidade: true, estado: true }
        }
      },
      orderBy: { dataPedido: 'desc' }
    });

    return {
      sucesso: true,
      pedidos,
      message: "Pedidos de fornecedores externos recuperados com sucesso!"
    };

  } catch (error) {
    console.error('[buscarPedidosExternos] Erro:', error);
    return {
      sucesso: false,
      erro: "Erro ao buscar pedidos de fornecedores externos",
      detalhes: error.message
    };
  }
};

// Cria um pedido genérico. `dados` pode conter qualquer combinação de campos
// permitidos pelo modelo `Pedido`: contratoId, origemFornecedorExternoId,
// origemUnidadeId, destinoUnidadeId, criadoPorId, observacoes, itens: []
export const criarPedido = async (dados) => {
  try {
    // Prepare payload — allow caller to provide any of the recognized fields
    const payload = {};

    // Só adiciona campos que têm valor
    if (dados.contratoId != null) payload.contratoId = Number(dados.contratoId);
    if (dados.origemFornecedorExternoId != null) payload.origemFornecedorExternoId = Number(dados.origemFornecedorExternoId);
    if (dados.origemUnidadeId != null) payload.origemUnidadeId = Number(dados.origemUnidadeId);
    if (dados.destinoUnidadeId != null) payload.destinoUnidadeId = Number(dados.destinoUnidadeId);
    if (dados.criadoPorId != null) payload.criadoPorId = Number(dados.criadoPorId);
    if (dados.descricao != null) payload.descricao = dados.descricao;
    if (dados.observacoes != null) payload.observacoes = dados.observacoes;

    const created = await prisma.pedido.create({
      data: payload,
    });

    // Re-fetch the created pedido including related data so frontend can display supplier names
    const pedido = await prisma.pedido.findUnique({
      where: { id: created.id },
      include: {
        contrato: { select: { id: true, fornecedorExterno: { select: { id: true, nomeEmpresa: true } } } },
        fornecedorExterno: { select: { id: true, nomeEmpresa: true } },
        destinoUnidade: { select: { id: true, nome: true, cidade: true, estado: true } },
        origemUnidade: { select: { id: true, nome: true } }
      }
    });

    return { sucesso: true, pedido, message: 'Pedido criado com sucesso.' };
  } catch (error) {
    console.error('[criarPedido] Erro ao criar pedido:', error);
    return { sucesso: false, erro: 'Erro ao criar pedido.', detalhes: error.message };
  }
};

// Atualiza o status de um pedido (ex: marcar como ENTREGUE)
export const atualizarStatusPedido = async (pedidoId, novoStatus) => {
  try {
    if (!pedidoId) return { sucesso: false, erro: 'ID do pedido não informado.' };

    const updated = await prisma.pedido.update({
      where: { id: Number(pedidoId) },
      data: {
        status: novoStatus,
        dataRecebimento: novoStatus === 'ENTREGUE' ? new Date() : undefined,
      }
    });

    const pedido = await prisma.pedido.findUnique({
      where: { id: updated.id },
      include: {
        contrato: { select: { id: true, fornecedorExterno: { select: { id: true, nomeEmpresa: true } } } },
        fornecedorExterno: { select: { id: true, nomeEmpresa: true } },
        destinoUnidade: { select: { id: true, nome: true, cidade: true, estado: true } },
        origemUnidade: { select: { id: true, nome: true } }
      }
    });

    return { sucesso: true, pedido, message: 'Status do pedido atualizado com sucesso.' };
  } catch (error) {
    console.error('[atualizarStatusPedido] Erro ao atualizar status do pedido:', error);
    return { sucesso: false, erro: 'Erro ao atualizar status do pedido.', detalhes: error.message };
  }
};
