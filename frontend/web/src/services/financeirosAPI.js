const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
import { useAuth } from '@/contexts/AuthContext'

// ============ CATEGORIAS FINANCEIRAS ============

export const categoriasAPI = {
  criar: async (nome, tipo, descricao = null) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, tipo, descricao })
    });
    if (!res.ok) throw new Error('Erro ao criar categoria');
    return res.json();
  },

  listar: async () => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao listar categorias');
    return res.json();
  },

  obter: async (categoriaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias/${categoriaId}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao obter categoria');
    return res.json();
  },

  atualizar: async (categoriaId, nome, descricao) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias/${categoriaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, descricao })
    });
    if (!res.ok) throw new Error('Erro ao atualizar categoria');
    return res.json();
  },

  deletar: async (categoriaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias/${categoriaId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao deletar categoria');
    return res.json();
  }
};

// ============ SUBCATEGORIAS ============

export const subcategoriasAPI = {
  criar: async (categoriaId, nome, descricao = null) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias/${categoriaId}/subcategorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, descricao })
    });
    if (!res.ok) throw new Error('Erro ao criar subcategoria');
    return res.json();
  },

  listar: async (categoriaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/categorias/${categoriaId}/subcategorias`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao listar subcategorias');
    return res.json();
  },

  obter: async (subcategoriaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/subcategorias/${subcategoriaId}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao obter subcategoria');
    return res.json();
  },

  atualizar: async (subcategoriaId, nome, descricao) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/subcategorias/${subcategoriaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, descricao })
    });
    if (!res.ok) throw new Error('Erro ao atualizar subcategoria');
    return res.json();
  },

  deletar: async (subcategoriaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/subcategorias/${subcategoriaId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao deletar subcategoria');
    return res.json();
  }
};

// ============ CONTAS FINANCEIRAS ============

export const contasFinanceirasAPI = {
  criar: async (dadosConta) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dadosConta)
    });
    if (!res.ok) throw new Error('Erro ao criar conta');
    return res.json();
  },

  listar: async (filtros = {}) => {
    const { fetchWithAuth } = useAuth();
    const params = new URLSearchParams();
    if (filtros.mes) params.append('mes', filtros.mes);
    if (filtros.ano) params.append('ano', filtros.ano);
    if (filtros.tipoMovimento) params.append('tipoMovimento', filtros.tipoMovimento);
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
    if (filtros.subcategoriaId) params.append('subcategoriaId', filtros.subcategoriaId);

    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao listar contas');
    return res.json();
  },

  obter: async (contaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras/${contaId}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao obter conta');
    return res.json();
  },

  atualizar: async (contaId, dados) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras/${contaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao atualizar conta');
    return res.json();
  },

  marcarComoPaga: async (contaId, dataPagamento = null) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras/${contaId}/pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dataPagamento })
    });
    if (!res.ok) throw new Error('Erro ao marcar como paga');
    return res.json();
  },

  marcarComoRecebida: async (contaId, dataRecebimento = null) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras/${contaId}/receber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dataRecebimento })
    });
    if (!res.ok) throw new Error('Erro ao marcar como recebida');
    return res.json();
  },

  deletar: async (contaId) => {
    const { fetchWithAuth } = useAuth();
    const res = await fetchWithAuth(`${API_BASE}/contas-financeiras/${contaId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao deletar conta');
    return res.json();
  }
};

// ============ RELATÓRIOS ============

export const relatoriosFinanceirosAPI = {
  obterResumo: async (mes, ano) => {
    const { fetchWithAuth } = useAuth();
    const params = new URLSearchParams({ mes, ano });
    const res = await fetchWithAuth(`${API_BASE}/financeiro/resumo?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao obter resumo financeiro');
    return res.json();
  },

  obterSaldoPorCategoria: async (mes, ano, tipoMovimento) => {
    const { fetchWithAuth } = useAuth();
    const params = new URLSearchParams({ mes, ano, tipoMovimento });
    const res = await fetchWithAuth(`${API_BASE}/financeiro/saldo-por-categoria?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao obter saldo por categoria');
    return res.json();
  }
};
