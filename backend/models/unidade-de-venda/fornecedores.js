import prisma from '../../prisma/client.js';

// export const listarFornecedores = async (unidadeId) =>{ //tem controller
//     try{
//         const fornecedores = await prisma.FornecedorExterno.findMany({where:{ unidadeId: Number(unidadeId)},})
//         return ({
//             sucesso: true,
//             fornecedores,
//             message: "Fornecedores da unidade listados com sucesso!!"
//         })
//     } catch (error) {
//         return {
//             sucesso: false,
//             erro: "Erro ao listar fornecedores",
//             detalhes: error.message
//         }
//     }
// }

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

export const criarFornecedorExterno = async (dadosFornecedor) => {
  try {
    const novoFornecedor = await prisma.fornecedorExterno.create({
      data: {
        nomeEmpresa: dadosFornecedor.nomeEmpresa,
        descricaoEmpresa: dadosFornecedor.descricaoEmpresa,
        cnpjCpf: dadosFornecedor.cnpjCpf || null,
        email: dadosFornecedor.email || null,
        telefone: dadosFornecedor.telefone,
        endereco: dadosFornecedor.endereco || null,
        status: "ATIVO", // Ou outro status padrão, conforme o enum StatusFornecedor
      },
    });

    return {
      sucesso: true,
      fornecedor: novoFornecedor,
      message: "Fornecedor externo criado com sucesso!",
    };
  } catch (error) {
    // Tratar erro de CNPJ/CPF duplicado, por exemplo
    if (error.code === 'P2002' && error.meta?.target?.includes('cnpj_cpf')) {
      return {
        sucesso: false,
        erro: "CNPJ/CPF já cadastrado.",
        detalhes: error.message,
      };
    }
    return {
      sucesso: false,
      erro: "Erro ao criar fornecedor externo",
      detalhes: error.message,
    };
  }
};

//fazer uma função para buscar fornecedor interno 
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
    const totalFornecedores = await prisma.fornecedor.aggregate({ where: { unidadeId: Number(unidadeId), }, });
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
    const contratos = await prisma.Contrato.findMany({
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
    const contratosExternos = await prisma.Contrato.findMany({
      where: { unidadeId: Number(unidadeId) },
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
      contratosExternos,
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

export const verContratosComFazendas = async(unidadeId) =>{
try {
    const contratos = await prisma.Contrato.findMany({
      where: { unidadeId: Number(unidadeId) },
      include: {
        // unidade: {
        //   select: {
        //     id: true, nome: true, cidade: true, estado: true
        //   }
        // },
        fornecedorInterno :{
          select : {nome: true}
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

export async function updateFornecedor(id, data) {
  try {
    const fornecedor = await prisma.fornecedor.update({
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
      fornecedor,
      message: "Fornecedor atualizado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar fornecedor",
      detalhes: error.message,
    }
  }
}

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
      unidadeId,            // ID da loja
      
      dataInicio,
      dataFim,
      dataEnvio,
      status,
      frequenciaEntregas,
      diaPagamento,
      formaPagamento,
      valorTotal,
      itens                 // array de itens do contrato, ex: [{nome, quantidade, precoUnitario}]
    } = dadosContrato;

    // Cria o contrato
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
          create: itens?.map(i => ({
            nome: i.nome,
            quantidade: i.quantidade ? Number(i.quantidade) : null,
            precoUnitario: i.precoUnitario ? Number(i.precoUnitario) : null,
            raca: i.raca || null,
            pesoUnidade: i.pesoUnidade ? Number(i.pesoUnidade) : null,
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
      message: "Contrato interno criado com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar contrato interno",
      detalhes: error.message
    };
  }
};


