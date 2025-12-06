import {
  criarCategoria,
  listarCategoriasPorUnidade,
  obterCategoriaPorId,
  atualizarCategoria,
  deletarCategoria,
  criarSubcategoria,
  listarSubcategoriasPorCategoria,
  obterSubcategoriaPorId,
  atualizarSubcategoria,
  deletarSubcategoria
} from '../models/categoriaFinanceira.js';

// ============ CONTROLLERS PARA CATEGORIAS ============

export const criarCategoriaController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const { nome, tipo, descricao } = req.body;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    if (!nome || !tipo) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome e tipo são obrigatórios'
      });
    }

    const categoria = await criarCategoria(unidadeId, nome, tipo, descricao);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Categoria criada com sucesso',
      dados: categoria
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    
    // Verifica se é erro de categoria duplicada
    const isDuplicateError = error.message.includes('Já existe uma categoria') || 
                             error.message.includes('Unique constraint');
    
    return res.status(isDuplicateError ? 409 : 500).json({
      sucesso: false,
      erro: isDuplicateError ? error.message : 'Erro ao criar categoria',
      detalhes: error.message
    });
  }
};

export const listarCategoriasController = async (req, res) => {
  try {

    const unidadeId = req.usuario?.unidadeId;
    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    const categorias = await listarCategoriasPorUnidade(unidadeId);

    return res.status(200).json({
      sucesso: true,
      dados: categorias
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar categorias',
      detalhes: error.message
    });
  }
};

export const obterCategoriaController = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const categoria = await obterCategoriaPorId(categoriaId);

    if (!categoria) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Categoria não encontrada'
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: categoria
    });
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter categoria',
      detalhes: error.message
    });
  }
};

export const atualizarCategoriaController = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome é obrigatório'
      });
    }

    const categoria = await atualizarCategoria(categoriaId, nome, descricao);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Categoria atualizada com sucesso',
      dados: categoria
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar categoria',
      detalhes: error.message
    });
  }
};

export const deletarCategoriaController = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const categoria = await deletarCategoria(categoriaId);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Categoria deletada com sucesso',
      dados: categoria
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar categoria',
      detalhes: error.message
    });
  }
};

// ============ CONTROLLERS PARA SUBCATEGORIAS ============

export const criarSubcategoriaController = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome é obrigatório'
      });
    }

    const subcategoria = await criarSubcategoria(categoriaId, nome, descricao);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Subcategoria criada com sucesso',
      dados: subcategoria
    });
  } catch (error) {
    console.error('Erro ao criar subcategoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar subcategoria',
      detalhes: error.message
    });
  }
};

export const listarSubcategoriasController = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const subcategorias = await listarSubcategoriasPorCategoria(categoriaId);

    return res.status(200).json({
      sucesso: true,
      dados: subcategorias
    });
  } catch (error) {
    console.error('Erro ao listar subcategorias:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar subcategorias',
      detalhes: error.message
    });
  }
};

export const obterSubcategoriaController = async (req, res) => {
  try {
    const { subcategoriaId } = req.params;

    const subcategoria = await obterSubcategoriaPorId(subcategoriaId);

    if (!subcategoria) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Subcategoria não encontrada'
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: subcategoria
    });
  } catch (error) {
    console.error('Erro ao obter subcategoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter subcategoria',
      detalhes: error.message
    });
  }
};

export const atualizarSubcategoriaController = async (req, res) => {
  try {
    const { subcategoriaId } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome é obrigatório'
      });
    }

    const subcategoria = await atualizarSubcategoria(subcategoriaId, nome, descricao);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Subcategoria atualizada com sucesso',
      dados: subcategoria
    });
  } catch (error) {
    console.error('Erro ao atualizar subcategoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar subcategoria',
      detalhes: error.message
    });
  }
};

export const deletarSubcategoriaController = async (req, res) => {
  try {
    const { subcategoriaId } = req.params;

    const subcategoria = await deletarSubcategoria(subcategoriaId);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Subcategoria deletada com sucesso',
      dados: subcategoria
    });
  } catch (error) {
    console.error('Erro ao deletar subcategoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar subcategoria',
      detalhes: error.message
    });
  }
};
