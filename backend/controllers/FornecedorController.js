// Controller para deletar um contrato
export const deleteContratoController = async (req, res) => {
  try {
    const contratoId = Number(req.params.id);
    if (!contratoId) return res.status(400).json({ sucesso: false, erro: 'ID do contrato não informado.' });

    const resultado = await deleteContrato(contratoId);
    
    if (!resultado.sucesso) {
      return res.status(404).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('[deleteContratoController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao deletar contrato.', detalhes: error.message });
  }
};
import { calcularFornecedores, listarTodasAsLojas, listarFornecedoresExternos, listarFornecedoresInternos, criarContratoInterno, criarContratoExterno, listarLojasAtendidas, verContratosComFazendas, verContratosComFazendasAsFornecedor, verContratosComLojas, verContratosExternos, listarTodosFornecedoresExternos, criarFornecedorExterno, buscarPedidosExternos, criarPedido, atualizarStatusPedido, updateFornecedor, getFornecedoresKpis, deleteFornecedorWithContracts, buscarContratoPorIdService, contarFornecedoresExternos, totalContratosExternos, totalContratosExternosAtivos, deleteContrato } from "../models/Fornecedores.js";
import { fornecedorSchema } from "../schemas/fornecedorSchema.js";

export const totalContratosExternosController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    if (!unidadeId) {
      return res.status(400).json({ sucesso: false, erro: 'Unidade não informada.' });
    }
    const resultado = await totalContratosExternos(unidadeId);
    return res.status(200).json({
      sucesso: true,
      count: resultado.count || 0,
      message: "Total de contratos externos obtido com sucesso!"
    });
  } catch (error) {
    console.error("Erro no controller ao obter total de contratos externos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao obter total de contratos externos.",
      detalhes: error.message,
    });
  }
};

export const totalContratosExternosAtivosController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    if (!unidadeId) {
      return res.status(400).json({ sucesso: false, erro: 'Unidade não informada.' });
    }
    const resultado = await totalContratosExternosAtivos(unidadeId);
    return res.status(200).json({
      sucesso: true,
      count: resultado.count || 0,
      message: "Total de contratos externos ativos obtido com sucesso!"
    });
  } catch (error) {
    console.error("Erro no controller ao obter total de contratos externos ativos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao obter total de contratos externos ativos.",
      detalhes: error.message,
    });
  }
};
export const contarFornecedoresExternosController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    if (!unidadeId) {
      return res.status(400).json({ sucesso: false, erro: 'Unidade não informada.' });
    }
    const resultado = await contarFornecedoresExternos(unidadeId);
    
    return res.status(200).json({
      sucesso: true,
      count: resultado.count || 0,
      message: "Quantidade de fornecedores externos contada com sucesso!"
    });
  } catch (error) {
    console.error("Erro no controller ao contar fornecedores externos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao contar fornecedores externos.",
      detalhes: error.message,
    });
  }
};

// Retorna metadados úteis para o frontend (enums / opções)
export const listarMetaContratosController = async (req, res) => {
  try {
    const frequencias = [
      { key: 'SEMANALMENTE', label: 'Semanalmente' },
      { key: 'QUINZENAL', label: 'Quinzenal' },
      { key: 'MENSALMENTE', label: 'Mensalmente' },
      { key: 'TRIMESTRAL', label: 'Trimestral' },
      { key: 'SEMESTRAL', label: 'Semestral' }
    ];

    const formasPagamento = [
      { key: 'DINHEIRO', label: 'Dinheiro' },
      { key: 'CARTAO', label: 'Cartão' },
      { key: 'PIX', label: 'PIX' }
    ];

    return res.status(200).json({ sucesso: true, frequencias, formasPagamento });
  } catch (error) {
    console.error('Erro ao listar metadados de contratos:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno ao obter metadados.' });
  }
};

export const listarTodasAsLojasController = async (req, res) => {
  try {
    const resultado = await listarTodasAsLojas();

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar lojas.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar lojas:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar lojas.",
      detalhes: error.message,
    });
  }
};

// export const listarFornecedoresController = async (req, res) => {
//   try {
//     const unidadeId = req.params.unidadeId;

//     if (!unidadeId) {
//       return res.status(401).json({
//         sucesso: false,
//         erro: "Sessão inválida ou unidade não identificada.",
//       });
//     }
//     const resultado = await listarFornecedores(unidadeId);

//     if (!resultado.sucesso) {
//       return res.status(400).json({
//         sucesso: false,
//         erro: resultado.erro || "Erro ao listar fornecedores.",
//         detalhes: resultado.detalhes,
//       });
//     }

//     return res.status(200).json(resultado);
//   } catch (error) {
//     console.error("Erro no controller ao listar fornecedores:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro interno ao listar fornecedores.",
//       detalhes: error.message,
//     });
//   }
// };

export const listarFornecedoresExternosController = async (req, res) => { //FUNCIONANDO - essa função serve para a fazenda ver a lista de fornecedores externos (empresas que fornecem produtos para as fazendas) 
  try {
    const { unidadeId } = req.params;

    if (!unidadeId) {
      return res.status(400).json({
        sucesso: false,
        erro: "Unidade não informada."
      });
    }

    const resultado = await listarFornecedoresExternos(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao listar fornecedores externos:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message
    });
  }
};

export const listarFornecedoresInternosController = async (req, res) => { //FUNCIONANDO - essa função serve para a loja ver a lista de fornecedores (fazendas) que ela possui
  try {
    const { unidadeId } = req.params;

    if (!unidadeId) {
      return res.status(400).json({
        sucesso: false,
        erro: "Unidade não informada."
      });
    }

    const resultado = await listarFornecedoresInternos(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao listar fornecedores internos:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message
    });
  }
};

//calcular fornecedores -- rota feita
export const calcularFornecedoresController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada à sessão.",
      });
    }
    const resultado = await calcularFornecedores(Number(unidadeId));

    return res.status(200).json({
      sucesso: resultado.sucesso,
      message: resultado.message,
      qtdFornecedores: resultado.qtdFornecedores ?? 0,
    });

  } catch (error) {
    console.error("Erro no controller ao calcular quantidade de fornecedores:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao calcular quantidade de fornecedores.",
      detalhes: error.message,
    });
  }
};


export const verContratosComLojasController = async (req, res) => {// FUNCIONANDO - essa função serve para a fazenda ver uma lista das lojas das quais ela é fornecedora
  try {
    const fornecedorUnidadeId = req.params.fornecedorUnidadeId;

    if (!fornecedorUnidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada!"
      })
    }
    
    const resultado = await verContratosComLojas(fornecedorUnidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    // Passa diretamente o shape padronizado do model:
    // { sucesso: true, contratos: [...], message: "..." }
    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "erro no controller ao ver contratos com lojas.",
      detalhes: error.message
    })
  }
};

export const verContratosExternosController = async (req,res) =>{ //FUNCIONANDO - essa fução serve para que a fazenda possa ver os contratos que ela tem com as empresas externas
  try {
    const unidadeId = req.params.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada!"
      })
    }
    console.log('[verContratosExternosController] recebida requisição. unidadeId=', unidadeId);
    const result = await verContratosExternos(unidadeId);

    // Normalize result: model may return { sucesso, contratosExternos, message } or an array directly
    const contratosArray = Array.isArray(result) ? result : (Array.isArray(result?.contratosExternos) ? result.contratosExternos : []);
    console.log('[verContratosExternosController] contratosExternos count (normalized)=', contratosArray.length);

    return res.status(200).json({
      sucesso: true,
      contratosExternos: contratosArray,
      message: "Contratos listados com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "erro no controller ao ver contratos externos.",
      detalhes: error.message
    })
  }
}

export const verContratosComFazendasController = async (req, res) =>{ //funcionando
  try {
    const unidadeId = req.params.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada!"
      })
    }
    
    console.log('[verContratosComFazendasController] Recebida requisição para unidadeId:', unidadeId);
    const contratos = await verContratosComFazendas(unidadeId);
    console.log('[verContratosComFazendasController] Resposta:', contratos);
    
    return res.status(200).json({
      sucesso: true,
      contratos,
      message: "Contratos listados com sucesso!"
    });

  } catch (error) {
    console.error('[verContratosComFazendasController] Erro:', error);
    return res.status(500).json({
      sucesso: false,
      erro: "erro no controller ao ver contratos com lojas.",
      detalhes: error.message
    })
  }
}

export const verContratosComFazendasAsFornecedorController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Usuário não possui unidade vinculada!"
      })
    }
    const result = await verContratosComFazendasAsFornecedor(unidadeId);

    // Normalizar: o service pode devolver { sucesso: true, contratos: [...] } ou
    // diretamente um array. Garantir que retornamos sempre um array em `contratos`.
    let contratosArray = [];
    if (Array.isArray(result)) {
      contratosArray = result;
    } else if (Array.isArray(result?.contratos)) {
      contratosArray = result.contratos;
    } else if (Array.isArray(result?.data)) {
      contratosArray = result.data;
    }

    console.log('[verContratosComFazendasAsFornecedorController] contratos count (normalized)=', contratosArray.length);

    return res.status(200).json({
      sucesso: true,
      contratos: contratosArray,
      message: "Contratos onde você é fornecedor listados com sucesso!"
    });

  } catch (error) {
    console.error('[verContratosComFazendasAsFornecedorController] Erro:', error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao ver contratos como fornecedor.",
      detalhes: error.message
    })
  }
}

export async function buscarContratoPorIdController(req, res) {
  const id = req.params.id;

  try {
    const contrato = await buscarContratoPorIdService(id);

    return res.status(200).json({
      message: "Contrato encontrado com sucesso.",
      data: contrato,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

export async function updateFornecedorController(req, res) {
    const { id } = req.params;
    try {
        const data = fornecedorSchema.parse(req.body);
        const resultado = await updateFornecedor(id, data);
        if (!resultado.sucesso) {
            return res.status(400).json(resultado);
        }
        return res.status(200).json({ sucesso: true, fornecedor: resultado.fornecedorExterno ?? resultado.fornecedor, message: resultado.message || 'Fornecedor atualizado com sucesso.' });
    } catch (error) {
        console.error('[updateFornecedorController] Erro:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar fornecedor', detalhes: error.message });
    }
}

export const getFornecedoresKpisController = async (req, res) => {
  try {
    const { unidadeId } = req.params;
    if (!unidadeId) return res.status(400).json({ sucesso: false, erro: 'Unidade não informada.' });
    const resultado = await getFornecedoresKpis(unidadeId);
    if (!resultado.sucesso) return res.status(500).json(resultado);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('[getFornecedoresKpisController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao obter KPIs', detalhes: error.message });
  }
};

export const deleteFornecedorController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ sucesso: false, erro: 'ID do fornecedor não informado.' });

    const resultado = await deleteFornecedorWithContracts(id);
    if (!resultado.sucesso) return res.status(500).json(resultado);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('[deleteFornecedorController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao deletar fornecedor', detalhes: error.message });
  }
};

export const listarLojasAtendidasController = async (req, res) => { //FUNCIONANDO - essa função serve para a fazenda ver uma lista das lojas das quais ela é fornecedora
  try {
    const fazendaId = req.params.unidadeId;

    if (!fazendaId) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID da fazenda não informado.",
      });
    }

    const resultado = await listarLojasAtendidas(fazendaId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro,
        detalhes: resultado.detalhes
      });
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao listar lojas atendidas:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar lojas atendidas.",
      detalhes: error.message
    });
  }
};

export const criarContratoInternoController = async (req, res) => { //FUNCIONANDO - essa funcao é para criar contratos entre fazendas e lojas
  try {
    const fazendaId = req.params.fazendaId; // fornecedor interno (unidade que fornece)
    const dadosContrato = req.body;

    if (!fazendaId) {
      return res.status(400).json({
        sucesso: false,
        erro: "É necessário informar o ID da fazenda fornecedora."
      });
    }

    const resultado = await criarContratoInterno(fazendaId, dadosContrato);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json({
      sucesso: true,
      contrato: resultado.contrato,
      message: "Contrato interno criado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao criar contrato interno.",
      detalhes: error.message
    });
  }
};

export const criarContratoExternoController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;  // quem cria
    const dadosContrato = req.body;

    if (!unidadeId) {
      return res.status(400).json({
        sucesso: false,
        erro: "O ID da unidade é obrigatório na rota."
      });
    }

    const resultado = await criarContratoExterno(unidadeId, dadosContrato);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro no controller ao criar contrato externo.",
      detalhes: error.message
    });
  }
};

export const listarTodosFornecedoresExternosController = async (req, res) => {
  try {
    const resultado = await listarTodosFornecedoresExternos();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar todos os fornecedores externos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};

export const criarFornecedorExternoController = async (req, res) => {
  try {
   console.log('[criarFornecedorExternoController] Recebida requisição com body:', req.body);
    const resultado = await criarFornecedorExterno(req.body);
    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro,
        field: resultado.field || null
      });
    }
   console.log('[criarFornecedorExternoController] Fornecedor criado com sucesso:', resultado.fornecedorExterno);
    return res.status(201).json({
      sucesso: true,
      fornecedorExterno: resultado.fornecedorExterno,
      message: resultado.message || 'Fornecedor externo criado com sucesso!'
    });
  } catch (err) {
    console.error('[criarFornecedorExternoController] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno ao criar fornecedor externo.' });
  }
};

export const buscarPedidosExternosController = async (req, res) => {
  try {
    const { unidadeId } = req.params;

    if (!unidadeId) {
      return res.status(400).json({
        sucesso: false,
        erro: "Unidade não informada."
      });
    }

    const resultado = await buscarPedidosExternos(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao buscar pedidos externos:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message
    });
  }
};

// Controller para criar pedido interno (loja -> fazenda)
export const createPedidoInternoController = async (req, res) => {
  try {
    const origemUnidadeId = Number(req.params.unidadeId);
    const dados = req.body || {};

    if (!origemUnidadeId) {
      return res.status(400).json({ sucesso: false, erro: 'unidadeId (origem) obrigatório na rota.' });
    }

    // definir criadoPorId a partir do usuário autenticado quando disponível
    dados.criadoPorId = req.usuario?.id ?? dados.criadoPorId ?? null;
    dados.origemUnidadeId = dados.origemUnidadeId ?? origemUnidadeId;

    const resultado = await criarPedido(dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('[createPedidoInternoController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao criar pedido interno.', detalhes: error.message });
  }
};

// Controller para criar pedido externo (fazenda -> fornecedor externo)
export const createPedidoExternoController = async (req, res) => {
  try {
    const origemUnidadeId = Number(req.params.unidadeId);
    const dados = req.body || {};

    if (!origemUnidadeId) {
      return res.status(400).json({ sucesso: false, erro: 'unidadeId (origem) obrigatório na rota.' });
    }

    // definir criadoPorId a partir do usuário autenticado quando disponível
    dados.criadoPorId = req.usuario?.id ?? dados.criadoPorId ?? null;
    // origemUnidade é quem faz o pedido (fazenda)
    dados.origemUnidadeId = dados.origemUnidadeId ?? origemUnidadeId;

    // optional: permitir que o body contenha contratoId, origemFornecedorExternoId, descricao, etc.

    const resultado = await criarPedido(dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('[createPedidoExternoController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao criar pedido externo.', detalhes: error.message });
  }
};

// Controller para processar (marcar como ENTREGUE) um pedido
export const processarPedidoController = async (req, res) => {
  try {
    const pedidoId = Number(req.params.id);
    if (!pedidoId) return res.status(400).json({ sucesso: false, erro: 'ID do pedido não informado na rota.' });

    const resultado = await atualizarStatusPedido(pedidoId, 'ENTREGUE');
    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('[processarPedidoController] Erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao processar pedido.', detalhes: error.message });
  }
};
