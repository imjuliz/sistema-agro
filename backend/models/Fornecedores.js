import prisma from "../prisma/client.js";

export const listarFornecedoresExternos = async (unidadeId) => {
  try {
    const contratos = await prisma.contrato.findMany({
      where: {
        unidadeId: Number(unidadeId),
        fornecedorExternoId: { not: null }
      },
      include: {
        fornecedorExterno: true
      }
    });

    // Extrai fornecedores únicos
    const fornecedores = contratos
      .map(c => c.fornecedorExterno)
      .filter((f, i, arr) => f && arr.findIndex(x => x.id === f.id) === i);

    return {
      sucesso: true,
      fornecedores,
      message: "Fornecedores externos listados com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fornecedores externos",
      detalhes: error.message
    };
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
    const { nomeEmpresa, descricaoEmpresa, cnpjCpf, email, telefone, endereco } = data;

    if (!nomeEmpresa || !descricaoEmpresa || !cnpjCpf || !telefone) {
      return { sucesso:false, erro: "nomeEmpresa, descricaoEmpresa, cnpj e telefone são obrigatórios.", field: null };
    }

    // checar duplicidade por CNPJ, email ou telefone
    const existing = await prisma.fornecedorExterno.findFirst({
      where: {
        OR: [
          { cnpj: cnpjCpf },
          { email: email || undefined },
          { telefone: telefone || undefined }
        ]
      },
      select: { id: true, cnpj: true, email: true, telefone: true }
    });

    if (existing) {
      if (existing.cnpj === cnpjCpf) return { sucesso: false, erro: "CNPJ já cadastrado.", field: "cnpj" };
      if (existing.email && existing.email === email) return { sucesso: false, erro: "Email já cadastrado.", field: "email" };
      if (existing.telefone && existing.telefone === telefone) return { sucesso: false, erro: "Telefone já cadastrado.", field: "telefone" };
      return { sucesso: false, erro: "Fornecedor já cadastrado.", field: null };
    }

    const f = await prisma.fornecedorExterno.create({
      data: {
        nomeEmpresa,
        descricaoEmpresa,
        cnpj: cnpjCpf,
        email: email || null,
        telefone,
        endereco: endereco || null,
      },
      select: { id: true, nomeEmpresa: true, cnpj: true, email: true, telefone: true }
    });

    return { sucesso: true, fornecedorExterno: f, message: "Fornecedor criado" };
  } catch (error) {
    console.error("Erro ao criar fornecedorExterno:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('cnpj')) {
      return { sucesso: false, erro: "CNPJ já cadastrado.", field: "cnpj" };
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
        itens :{
          select: {nome: true}
        }
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
        fornecedorInterno :{
          select : {
            id: true,
            nome: true,
            cidade: true,
            estado: true
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

    console.log('[verContratosComFazendas] Contratos internos encontrados (onde esta unidade CONSOME):', contratos.length, contratos);

    return ({
      sucesso: true,
      contratos,
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
    const {
      unidadeId, // loja
      dataInicio,
      dataFim,
      dataEnvio,
      status,
      frequenciaEntregas,
      diaPagamento,
      formaPagamento,
      valorTotal,
      itens = []
    } = dadosContrato;

    if (!fazendaId) {
      return { sucesso: false, erro: "ID da fazenda (fornecedorExterno interno) é obrigatório." };
    }

    if (!unidadeId) {
      return { sucesso: false, erro: "unidadeId da loja é obrigatório." };
    }

    if (!dataInicio || !dataEnvio || !frequenciaEntregas || !diaPagamento || !formaPagamento) {
      return { sucesso: false, erro: "Campos obrigatórios ausentes." };
    }

    const contrato = await prisma.contrato.create({
      data: {
        unidadeId: Number(unidadeId),
        fornecedorUnidadeId: Number(fazendaId),

        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        dataEnvio: new Date(dataEnvio),

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

