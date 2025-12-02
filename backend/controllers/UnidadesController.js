import { deleteUnidade, getUnidadePorId, getUnidades, updateStatusUnidade, createUnidade, getFazendas, getFazendasFiltered, getCityStateSuggestions, getLoja, getMatriz, FazendaService, LojaService, updateUnidade, getUsuariosPorUnidade, getUsuarioPorId, countUsuariosPorUnidade, atualizarFotoUnidade, removerFotoUnidade } from "../models/Unidades.js";
import { unidadeSchema } from "../schemas/unidadeSchema.js";

// BUSCA ---------------------------------------------------------------------------
export async function getUnidadesController(req, res) {
  try {
    const resultado = await getUnidades();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar unidades.",
      detalhes: error.message, // opcional, para debug
    });
  }
}

export async function getUnidadePorIdController(req, res) {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({ sucesso: false, erro: "ID da unidade inválido." });
    }

    const resultado = await getUnidadePorId(parsedId);
    if (!resultado.sucesso) {
      return res.status(404).json(resultado); // 404 se não encontrado
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar unidade por id.",
      detalhes: error.message, // opcional, para debug
    });
  }
}

export async function getFazendasController(req, res) {
  try {
    // aceitar filtros via query params
    const q = req.query?.q ?? null;
    const cidade = req.query?.cidade ?? req.query?.localidade ?? null;
    const estado = req.query?.estado ?? null;
    const minArea = req.query?.minArea ?? null;
    const maxArea = req.query?.maxArea ?? null;
    const tipos = req.query?.tipos ?? req.query?.types ?? req.query?.type ?? null; // comma-separated
    const status = req.query?.status ?? null; // comma-separated statuses
    const responsible = req.query?.responsible ?? req.query?.responsavel ?? null;
    const page = req.query?.page ?? 1;
    const perPage = req.query?.perPage ?? 25;
    const orderBy = req.query?.orderBy ?? 'nome_asc'; // novo parâmetro

    const resultado = await getFazendasFiltered({ q, cidade, estado, minArea, maxArea, tipos, status, responsible, page, perPage, orderBy });
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    console.error('[getFazendasController] erro:', error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao listar fazendas.", detalhes: error.message });
  }
}

export async function getCitySuggestionsController(req, res) {
  try {
    const q = req.query?.query ?? req.query?.q ?? '';
    const limit = Number(req.query?.limit ?? 20);
    const resultado = await getCityStateSuggestions(q, limit);
    if (!resultado.sucesso) return res.status(500).json(resultado);
    return res.json({ sucesso: true, suggestions: resultado.suggestions });
  } catch (error) {
    console.error('[getCitySuggestionsController] erro:', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar sugestões de cidades.', detalhes: error.message });
  }
}

export async function getLojaController(req, res) {
  try {
    const resultado = await getLoja();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lojas.",
      detalhes: error.message
    });
  }
}

export async function getMatrizController(req, res) {
  try {
    const resultado = await getMatriz();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar matriz.",
      detalhes: error.message
    });
  }
}

// CONTAGEM ---------------------------------------------------------------------------
export async function contarFazendasController(req, res) {
  try {
    const total = await FazendaService.contarFazendas();
    const ativas = await FazendaService.contarFazendasAtivas();
    const inativas = await FazendaService.contarFazendasInativas();

    res.json({
      total,
      ativas,
      inativas,
    });
  } catch (error) {
    console.error('Erro ao obter contagem das fazendas:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export async function contarLojasController(req, res) {
  try {
    const total = await LojaService.contarLojas();
    const ativas = await LojaService.contarLojasAtivas();
    const inativas = await LojaService.contarLojasInativas();
    return res.json({ total, ativas, inativas });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor', detalhes: error.message });
  }
}

// CRIAR ---------------------------------------------------------------------------
export async function createUnidadeController(req, res) {
  try {
    let data = req.body;

    // Normalizar tipo para maiúsculas
    if (data.tipo) {
      data.tipo = String(data.tipo).toUpperCase();
    }

    // Se imagemBase64 foi enviada, processar ela
    if (data.imagemBase64 && data.imagemBase64.startsWith('data:image')) {
      // Aqui você pode:
      // 1. Converter base64 para arquivo e salvar em storage (AWS S3, Cloudinary, etc)
      // 2. Ou salvar a string base64 diretamente no banco (não recomendado para produção)
      // 3. Ou enviar para um serviço de CDN
      
      // Por agora, vamos manter a base64 como imagemUrl (ajustar conforme sua infraestrutura)
      // Em produção, recomendo usar um serviço como Cloudinary ou AWS S3
      data.imagemUrl = data.imagemBase64;
      delete data.imagemBase64; // remover campo indesejado
    }

    // Validar dados com schema
    const dataValidada = unidadeSchema.parse(data);

    // Se a unidade é do tipo FAZENDA, ela só será ATIVA se tiver AMBOS os tipos de contrato:
    // 1. Contrato como consumidora (fornecedorExternoId preenchido)
    // 2. Contrato como fornecedora (fornecedorUnidadeId preenchido)
    if (dataValidada.tipo === 'FAZENDA') {
      if (dataValidada.contratos && dataValidada.contratos.length > 0) {
        const temContratoComoConsumidora = dataValidada.contratos.some(c => c.fornecedorExternoId);
        const temContratoComoFornecedora = dataValidada.contratos.some(c => c.fornecedorUnidadeId);
        
        // ATIVA apenas se tiver ambos os tipos de contrato
        if (!(temContratoComoConsumidora && temContratoComoFornecedora)) {
          dataValidada.status = 'INATIVA';
        }
      } else {
        // Sem contratos, força status INATIVA
        dataValidada.status = 'INATIVA';
      }
    }

    const resultado = await createUnidade(dataValidada);
    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }
    return res.status(201).json(resultado); // 201 Created
  } catch (error) {
    console.error("[createUnidadeController] erro:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ sucesso: false, erro: "Dados de validação inválidos.", detalhes: error.errors });
    }
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar unidade.",
      detalhes: error.message, // opcional, para debug
    });
  }
}

// ATUALIZAR ---------------------------------------------------------------------------
export async function updateUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const data = unidadeSchema.partial().parse(req.body); // Usar .partial() para atualização parcial
    const resultado = await updateUnidade(id, data);
    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    console.error("[updateUnidadeController] erro:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ sucesso: false, erro: "Dados de validação inválidos.", detalhes: error.errors });
    }
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar unidade.",
      detalhes: error.message, // opcional, para debug
    });
  }
}

// DELETAR ---------------------------------------------------------------------------
export async function deleteUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const resultado = await deleteUnidade(id);
    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar unidade.",
      detalhes: error.message, // opcional, para debug
    });
  }
}


/**
   * GET /unidades/:unidadeId/usuarios
   * ou GET /unidades/usuarios?unidadeId=...
   */
export async function getUsuariosPorUnidadeController(req, res) {
  try {
    const unidadeId = req.params?.unidadeId ?? req.query?.unidadeId;
    if (!unidadeId) return res.status(400).json({ sucesso: false, erro: "unidadeId é obrigatório." });

    // autorização: req.usuario deve vir do seu middleware `auth`
    const user = req.usuario;
    if (!user) return res.status(401).json({ sucesso: false, erro: "Não autenticado." });

    // Verifica se é gerente_matriz (tem acesso total)
    const isGerenteMatriz = Array.isArray(user.roles) 
      ? user.roles.some(r => String(r).toLowerCase().includes("gerente_matriz"))
      : String(user.roles ?? "").toLowerCase().includes("gerente_matriz");

    // Se não for gerente_matriz, valida se é da mesma unidade
    if (!isGerenteMatriz && Number(user.unidadeId) !== Number(unidadeId)) {
      console.warn(`[getUsuariosPorUnidade] Acesso negado: user.unidadeId=${user.unidadeId}, unidadeId=${unidadeId}`);
      return res.status(403).json({ sucesso: false, erro: "Acesso negado a esta unidade." });
    }

    const q = req.query?.q ?? null;
    const perfilId = req.query?.perfilId ?? null;
    const status = req.query?.status ?? null;
    const page = Number(req.query?.page ?? 1);
    const perPage = Number(req.query?.perPage ?? 25);

    const result = await getUsuariosPorUnidade({ unidadeId, q, perfilId, status, page, perPage });
    if (!result.sucesso) return res.status(500).json(result);
    return res.json(result);
  } catch (error) {
    console.error("[getUsuariosPorUnidadeController] erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

/**
   * GET /unidades/usuarios/:id  (ou /usuarios/:id dependendo da sua organização)
   */
export async function getUsuarioPorIdController(req, res) {
  try {
    const id = req.params?.id;
    if (!id) return res.status(400).json({ sucesso: false, erro: "id do usuário é obrigatório." });

    const userReq = req.user;
    if (!userReq) return res.status(401).json({ sucesso: false, erro: "Não autenticado." });

    // você pode aplicar regras adicionais: ex., somente gerente_matriz ou gerente da unidade pode ver
    const result = await getUsuarioPorId(id);
    if (!result.sucesso) return res.status(404).json(result);

    const usuario = result.usuario;
    const isGerenteMatriz = Array.isArray(userReq.roles) && userReq.roles.some(r => String(r).toLowerCase() === "gerente_matriz");
    if (!isGerenteMatriz && Number(userReq.unidadeId) !== Number(usuario.unidadeId)) {
      return res.status(403).json({ sucesso: false, erro: "Acesso negado a este usuário." });
    }

    return res.json({ sucesso: true, usuario });
  } catch (error) {
    console.error("[getUsuarioPorIdController] erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

/**
 * Busca dados de endereço por CEP.
 * Ex: GET /unidades/cep?cep=12345000
 * Ex: GET /unidades/cep/12345000
 */
export async function buscarCepController(req, res) {
    try {
      const cep = req.query.cep || req.params.cep;
      
      if (!cep) {
        return res.status(400).json({ sucesso: false, erro: "CEP é obrigatório." });
      }

      const cepDigits = String(cep).replace(/\D/g, "");
      
      if (cepDigits.length !== 8) {
        return res.status(400).json({ sucesso: false, erro: "CEP inválido (formato esperado: 8 dígitos numéricos)." });
      }

      // Usar uma API de CEP externa, como ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      
      if (!response.ok) {
        return res.status(response.status).json({ sucesso: false, erro: "Erro ao buscar CEP na API externa." });
      }

      const data = await response.json();

      if (data.erro) {
        return res.status(404).json({ sucesso: false, erro: "CEP não encontrado." });
      }

      // Tentar buscar coordenadas via OpenStreetMap Nominatim (gratuito, sem API key)
      let latitude = null;
      let longitude = null;
      
      try {
        const endereco = `${data.logradouro || ''}, ${data.localidade || ''}, ${data.uf || ''}, Brasil`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;
        
        // Nominatim requer User-Agent para evitar bloqueios
        const geoResponse = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'SistemaAgro/1.0 (node.js)'
          }
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0) {
            latitude = parseFloat(geoData[0].lat);
            longitude = parseFloat(geoData[0].lon);
          }
        }
      } catch (geoErr) {
        console.warn("[buscarCepController] Erro ao buscar coordenadas no Nominatim:", geoErr.message);
        // Continua mesmo sem coordenadas
      }

      return res.json({ 
        sucesso: true, 
        cep: cepDigits, 
        endereco: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || '',
        latitude: latitude,
        longitude: longitude
      });

    } catch (error) {
      console.error("[buscarCepController] erro:", error);
      return res.status(500).json({ sucesso: false, erro: "Erro ao buscar CEP.", detalhes: error.message });
    }
}

// FOTO DA UNIDADE
export const atualizarFotoUnidadeController = async (req, res) => {
  try {
    console.log('[atualizarFotoUnidadeController] Iniciando upload');
    console.log('[atualizarFotoUnidadeController] req.file:', req.file ? 'existe' : 'não existe');
    console.log('[atualizarFotoUnidadeController] req.params:', req.params);
    
    if (!req.file) {
      console.error('[atualizarFotoUnidadeController] Nenhum arquivo enviado');
      return res.status(400).json({ sucesso: false, erro: 'Nenhuma imagem enviada.' });
    }

    const { id } = req.params;

    console.log('[atualizarFotoUnidadeController] Arquivo:', req.file.filename, 'ID:', id);

    if (!id) {
      console.error('[atualizarFotoUnidadeController] ID não fornecido');
      return res.status(400).json({ sucesso: false, erro: 'ID da unidade é obrigatório.' });
    }

    // Construir caminho da foto com a pasta uploads
    const fotoUrl = `uploads/${req.file.filename}`;
    
    console.log('[atualizarFotoUnidadeController] URL a armazenar:', fotoUrl);
    
    const resultado = await atualizarFotoUnidade(id, fotoUrl);

    console.log('[atualizarFotoUnidadeController] Resultado:', resultado);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('[atualizarFotoUnidadeController] Erro:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar foto da unidade.',
      detalhes: error.message,
    });
  }
};

export const removerFotoUnidadeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: 'ID da unidade é obrigatório.' });
    }

    const resultado = await removerFotoUnidade(id);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao remover foto da unidade:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao remover foto da unidade.',
      detalhes: error.message,
    });
  }
};
