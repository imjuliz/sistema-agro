import { useState, useEffect, useCallback } from 'react';
import {
  categoriasAPI,
  subcategoriasAPI,
  contasFinanceirasAPI,
  relatoriosFinanceirosAPI
} from '@/services/financeirosAPI';

// ============ HOOK PARA CATEGORIAS ============

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const listar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await categoriasAPI.listar();
      if (response.sucesso) {
        setCategorias(response.dados);
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criar = useCallback(async (nome, tipo, descricao = null) => {
    try {
      setErro(null);
      const response = await categoriasAPI.criar(nome, tipo, descricao);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const atualizar = useCallback(async (categoriaId, nome, descricao) => {
    try {
      setErro(null);
      const response = await categoriasAPI.atualizar(categoriaId, nome, descricao);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const deletar = useCallback(async (categoriaId) => {
    try {
      setErro(null);
      const response = await categoriasAPI.deletar(categoriaId);
      if (response.sucesso) {
        await listar();
        return true;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  useEffect(() => {
    listar();
  }, [listar]);

  return {
    categorias,
    carregando,
    erro,
    listar,
    criar,
    atualizar,
    deletar
  };
};

// ============ HOOK PARA CONTAS FINANCEIRAS ============

export const useContasFinanceiras = (filtroInicial = {}) => {
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState(filtroInicial);

  const listar = useCallback(async (novoFiltro = filtro) => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await contasFinanceirasAPI.listar(novoFiltro);
      if (response.sucesso) {
        setContas(response.dados);
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  const criar = useCallback(async (dadosConta) => {
    try {
      setErro(null);
      const response = await contasFinanceirasAPI.criar(dadosConta);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const atualizar = useCallback(async (contaId, dados) => {
    try {
      setErro(null);
      const response = await contasFinanceirasAPI.atualizar(contaId, dados);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const marcarComoPaga = useCallback(async (contaId, dataPagamento = null) => {
    try {
      setErro(null);
      const response = await contasFinanceirasAPI.marcarComoPaga(contaId, dataPagamento);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const marcarComoRecebida = useCallback(async (contaId, dataRecebimento = null) => {
    try {
      setErro(null);
      const response = await contasFinanceirasAPI.marcarComoRecebida(contaId, dataRecebimento);
      if (response.sucesso) {
        await listar();
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const deletar = useCallback(async (contaId) => {
    try {
      setErro(null);
      const response = await contasFinanceirasAPI.deletar(contaId);
      if (response.sucesso) {
        await listar();
        return true;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    }
  }, [listar]);

  const atualizarFiltro = useCallback((novoFiltro) => {
    setFiltro(novoFiltro);
    listar(novoFiltro);
  }, [listar]);

  useEffect(() => {
    listar();
  }, []);

  return {
    contas,
    carregando,
    erro,
    filtro,
    listar,
    criar,
    atualizar,
    marcarComoPaga,
    marcarComoRecebida,
    deletar,
    atualizarFiltro
  };
};

// ============ HOOK PARA RELATÓRIOS ============

export const useRelatoriosFinanceiros = () => {
  const [resumo, setResumo] = useState(null);
  const [saldoPorCategoria, setSaldoPorCategoria] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const obterResumo = useCallback(async (mes, ano) => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await relatoriosFinanceirosAPI.obterResumo(mes, ano);
      if (response.sucesso) {
        setResumo(response.dados);
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const obterSaldoPorCategoria = useCallback(async (mes, ano, tipoMovimento) => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await relatoriosFinanceirosAPI.obterSaldoPorCategoria(mes, ano, tipoMovimento);
      if (response.sucesso) {
        setSaldoPorCategoria(response.dados);
        return response.dados;
      } else {
        setErro(response.erro);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    resumo,
    saldoPorCategoria,
    carregando,
    erro,
    obterResumo,
    obterSaldoPorCategoria
  };
};
