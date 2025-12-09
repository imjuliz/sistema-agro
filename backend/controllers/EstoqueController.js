import { getEstoques, getEstoquePorId, createEstoque, updateEstoque, deleteEstoque, createMovimento } from "../models/estoque.js";
import prisma from "../prisma/client.js";

// Adiciona um produto a um estoque (estoqueProduto)
export async function adicionarProdutoEstoqueController(req, res) {
  try {
    const body = req.body || {};
    const estoqueId = Number(body.estoqueId ?? body.estoque_id ?? body.id);
    if (!estoqueId) return res.status(400).json({ sucesso: false, erro: 'estoqueId é obrigatório.' });

    // permissões: somente GERENTE_MATRIZ pode adicionar em qualquer unidade
    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null;
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    // buscar estoque para verificar pertence à unidade
    const estoqueResult = await getEstoquePorId(estoqueId);
    if (!estoqueResult.sucesso) return res.status(404).json({ sucesso: false, erro: 'Estoque não encontrado.' });
    const estoque = estoqueResult.estoque;
    if (!isGerenteMatriz && estoque.unidadeId !== userUnidadeId) {
      return res.status(403).json({ sucesso: false, erro: 'Acesso negado: você só pode modificar estoque da sua unidade.' });
    }

    // montar dados permitidos
    const dataToCreate = {
      estoqueId: estoqueId,
      produtoId: body.produtoId != null ? Number(body.produtoId) : undefined,
      nome: body.nome ?? body.description ?? undefined,
      sku: body.sku ?? undefined,
      marca: body.marca ?? undefined,
      qntdAtual: body.qntdAtual != null ? Number(body.qntdAtual) : (body.quantidade != null ? Number(body.quantidade) : 0),
      qntdMin: body.qntdMin != null ? Number(body.qntdMin) : (body.minimo != null ? Number(body.minimo) : 0),
      precoUnitario: body.precoUnitario != null ? Number(body.precoUnitario) : undefined,
      pesoUnidade: body.pesoUnidade != null ? Number(body.pesoUnidade) : undefined,
      validade: body.validade ? new Date(body.validade) : undefined,
      unidadeBase: body.unidadeBase ?? undefined,
      dataEntrada: body.dataEntrada ? new Date(body.dataEntrada) : undefined,
      pedidoId: body.pedidoId != null ? Number(body.pedidoId) : undefined,
      fornecedorUnidadeId: body.fornecedorUnidadeId != null ? Number(body.fornecedorUnidadeId) : undefined,
      fornecedorExternoId: body.fornecedorExternoId != null ? Number(body.fornecedorExternoId) : undefined,
    };

    // remover chaves undefined para evitar erro do prisma
    Object.keys(dataToCreate).forEach(k => dataToCreate[k] === undefined && delete dataToCreate[k]);

    const novo = await prisma.estoqueProduto.create({
      data: dataToCreate,
      include: {
        produto: true,
        lote: true,
        pedido: true,
        fornecedorUnidade: true,
        fornecedorExterno: true,
      }
    });

    return res.status(201).json({ sucesso: true, estoqueProduto: novo });
  } catch (error) {
    console.error('[EstoqueController] adicionarProdutoEstoqueController error', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno ao adicionar produto ao estoque.', detalhes: error.message });
  }
}

export async function getEstoquesController(req, res) {
  try {
    // Obter unidadeId do usuario autenticado (middleware auth anexa req.usuario)
    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null; // ex: 'GERENTE_MATRIZ', 'GERENTE_LOJA'
    
    // Detectar se é GERENTE_MATRIZ (case-insensitive)
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    // Query params do cliente
    let { unidadeId, q } = req.query;

    // Se cliente mandou unidadeId, validar permissão:
    // - GERENTE_MATRIZ: pode pedir qualquer unidade
    // - outros: só podem pedir a sua própria unidade
    if (unidadeId != null) {
      unidadeId = Number(unidadeId);
      if (!isGerenteMatriz && unidadeId !== userUnidadeId) {
        console.warn(`[EstoqueController] Acesso negado: usuario ${req.usuario?.id} tentou acessar estoque de unidade ${unidadeId}, mas pertence à ${userUnidadeId}`);
        return res.status(403).json({ sucesso: false, erro: "Acesso negado: você só pode acessar estoque da sua unidade." });
      }
    } else {
      // Se não mandou unidadeId, usar a unidade do usuário (ou deixar em branco para GERENTE_MATRIZ)
      if (!isGerenteMatriz && userUnidadeId) {
        unidadeId = userUnidadeId;
      }
    }

    const result = await getEstoques({ unidadeId, q });
    if (!result.sucesso) return res.status(500).json(result);
    return res.json({ sucesso: true, estoques: result.estoques });
  } catch (error) {
    console.error("[EstoqueController] getEstoquesController error:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

export async function getEstoquePorIdController(req, res) {
  try {
    const { id } = req.params;
    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null;
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    const result = await getEstoquePorId(id);
    if (!result.sucesso) return res.status(404).json(result);

    // Verificar permissão: se não é GERENTE_MATRIZ, só pode acessar estoque da sua unidade
    const estoque = result.estoque;
    if (!isGerenteMatriz && estoque.unidadeId !== userUnidadeId) {
      console.warn(`[EstoqueController] Acesso negado: usuario ${req.usuario?.id} tentou acessar estoque ${id} (unidade ${estoque.unidadeId}), mas pertence à ${userUnidadeId}`);
      return res.status(403).json({ sucesso: false, erro: "Acesso negado: você só pode acessar estoque da sua unidade." });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

export async function createEstoqueController(req, res) {
  try {
    const data = req.body;
    if (!data || !data.unidadeId) return res.status(400).json({ sucesso: false, erro: "unidadeId é obrigatório." });

    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null;
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    // Validar que tentam criar estoque para sua própria unidade (exceto GERENTE_MATRIZ)
    const targetUnidadeId = Number(data.unidadeId);
    if (!isGerenteMatriz && targetUnidadeId !== userUnidadeId) {
      console.warn(`[EstoqueController] Acesso negado: usuario ${req.usuario?.id} tentou criar estoque para unidade ${targetUnidadeId}, mas pertence à ${userUnidadeId}`);
      return res.status(403).json({ sucesso: false, erro: "Acesso negado: você só pode criar estoque para sua unidade." });
    }

    const result = await createEstoque(data);
    if (!result.sucesso) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

export async function updateEstoqueController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null;
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    // Buscar estoque existente para verificar permissão
    const existingResult = await getEstoquePorId(id);
    if (!existingResult.sucesso) return res.status(404).json(existingResult);

    const estoque = existingResult.estoque;
    if (!isGerenteMatriz && estoque.unidadeId !== userUnidadeId) {
      console.warn(`[EstoqueController] Acesso negado: usuario ${req.usuario?.id} tentou atualizar estoque ${id} (unidade ${estoque.unidadeId}), mas pertence à ${userUnidadeId}`);
      return res.status(403).json({ sucesso: false, erro: "Acesso negado: você só pode atualizar estoque da sua unidade." });
    }

    const result = await updateEstoque(id, data);
    if (!result.sucesso) return res.status(400).json(result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

export async function deleteEstoqueController(req, res) {
  try {
    const { id } = req.params;
    const userUnidadeId = req.usuario?.unidadeId ?? null;
    const userPerfilNome = req.usuario?.perfil?.nome ?? null;
    const isGerenteMatriz = userPerfilNome && String(userPerfilNome).toUpperCase() === 'GERENTE_MATRIZ';

    // Buscar estoque existente para verificar permissão
    const existingResult = await getEstoquePorId(id);
    if (!existingResult.sucesso) return res.status(404).json(existingResult);

    const estoque = existingResult.estoque;
    if (!isGerenteMatriz && estoque.unidadeId !== userUnidadeId) {
      console.warn(`[EstoqueController] Acesso negado: usuario ${req.usuario?.id} tentou deletar estoque ${id} (unidade ${estoque.unidadeId}), mas pertence à ${userUnidadeId}`);
      return res.status(403).json({ sucesso: false, erro: "Acesso negado: você só pode deletar estoque da sua unidade." });
    }

    const result = await deleteEstoque(id);
    if (!result.sucesso) return res.status(400).json(result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro interno", detalhes: error.message });
  }
}

export async function createMovimentoController(req, res) {
  try {
    const body = req.body || {};
    const usuarioId = req.usuario?.id ?? null;

    const payload = {
      estoqueProdutoId: body.estoqueProdutoId ?? body.produtoId ?? body.rawItemId,
      tipoMovimento: body.tipoMovimento ?? body.tipo ?? body.movimento,
      quantidade: body.quantidade,
      observacoes: body.observacoes ?? body.obs ?? null,
      pedidoId: body.pedidoId ?? null,
      origemUnidadeId: body.origemUnidadeId ?? null,
      destinoUnidadeId: body.destinoUnidadeId ?? null,
      vendaId: body.vendaId ?? null,
      producaoId: body.producaoId ?? null,
      usuarioId,
    };

    // Basic validations
    if (!payload.estoqueProdutoId) return res.status(400).json({ sucesso: false, erro: 'estoqueProdutoId é obrigatório.' });
    if (!payload.tipoMovimento) return res.status(400).json({ sucesso: false, erro: 'tipoMovimento é obrigatório.' });
    if (!payload.quantidade || Number(payload.quantidade) <= 0) return res.status(400).json({ sucesso: false, erro: 'quantidade inválida.' });

    const result = await createMovimento(payload);
    if (!result.sucesso) return res.status(400).json(result);
    return res.status(201).json({ sucesso: true, movimento: result.movimento, estoqueProduto: result.estoqueProduto });
  } catch (error) {
    console.error('[EstoqueController] createMovimentoController error', error);
    return res.status(500).json({ sucesso: false, erro: 'Erro interno ao registrar movimentação.', detalhes: error.message });
  }
}
