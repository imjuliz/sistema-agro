import { calcularFornecedores,  listarFornecedoresExternos, listarFornecedoresInternos, criarContratoInterno, listarLojasAtendidas, verContratosComFazendas, verContratosComLojas, verContratosExternos, listarTodosFornecedoresExternos, criarFornecedorExterno } from "../../models/unidade-de-venda/fornecedores.js";

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
    const contratos = await verContratosComLojas(fornecedorUnidadeId);
    return res.status(200).json({
      sucesso: true,
      contratos,
      message: "Contratos listados com sucesso!"
    });

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
    const contratosExternos = await verContratosExternos(unidadeId);
    return res.status(200).json({
      sucesso: true,
      contratosExternos,
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
    const contratos = await verContratosComFazendas(unidadeId);
    return res.status(200).json({
      sucesso: true,
      contratos,
      message: "Contratos listados com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "erro no controller ao ver contratos com lojas.",
      detalhes: error.message
    })
  }
}

export async function updateFornecedorController(req, res) {
    const { id } = req.params;
    const data = fornecedorSchema.parse(req.body);
    try {
        const fornecedor = await updateFornecedor(id, data);
        return {
            sucesso: true,
            fornecedor,
            message: "Fornecedor atualizado com sucesso!!",
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar fornecedor",
            detalhes: error.message
        }
    }
}

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

export const criarContratoInternoController = async (req, res) => { 
  try {
    const fazendaId = req.params.fazendaId
    const dadosContrato = req.body;

    // Valida campos obrigatórios
    if (!dadosContrato.unidadeId ||  !dadosContrato.dataInicio || !dadosContrato.dataEnvio || !dadosContrato.status) {
      return res.status(400).json({
        sucesso: false,
        erro: "Campos obrigatórios ausentes."
      });
    }

    const resultado = await criarContratoInterno(dadosContrato);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro,
        detalhes: resultado.detalhes
      });
    }

    return res.status(201).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao criar contrato interno:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao criar contrato interno",
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
    const { nomeEmpresa, descricaoEmpresa, cnpjCpf, email, telefone, endereco } = req.body;

    if (!nomeEmpresa || !descricaoEmpresa || !telefone) {
      return res.status(400).json({ sucesso: false, erro: "Nome da empresa, descrição e telefone são obrigatórios." });
    }

    console.log("Dados recebidos para criar fornecedor externo:", req.body); // Adicionado para depuração
    const resultado = await criarFornecedorExterno({ nomeEmpresa, descricaoEmpresa, cnpjCpf, email, telefone, endereco });

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao criar fornecedor externo:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};
