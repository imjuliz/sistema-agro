import { calcularLucro, listarSaidas, listarVendas, somarDiaria, somarSaidas } from '../../models/unidade-de-venda/vendas_despesas'
export const contarChamadosController = async (req, res) => {
    try {
        const total = await contarTodosChamados();
        res.json(total);
    } catch (error) {
        console.error('Erro ao contar chamados!! ', error);
        res.status(500).json({ erro: 'erro ao contar chamados' });
    }
};

export const somarDiariaController = async (req, res) => {
    try {
        const unidadeId = Number(req.params.unidadeId);

        if (isNaN(unidadeId)) {
            return res.status(400).json({ error: 'ID da unidade inválido.' });
        }
        const total = await somarDiaria(unidadeId);
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao calcular a soma diária.' });
    }
};

export const somarSaidasController = async (req, res) =>{
    try{
        const unidadeId = Number(req.params.unidadeId);

        if (isNaN(unidadeId)) {
            return res.status(400).json({ error: 'ID da unidade inválido.' });
        }
        const total = await somarSaidas(unidadeId);
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao calcular a soma das saídas.' });
    }

    }


export const calcularLucroController = async (req, res) => { //funcao assincrona
      try {
    // Pegamos a unidade logada (supondo que vem do middleware de autenticação)
    const unidadeId = req.user?.unidadeId;

    if (!unidadeId) {
      return res.status(400).json({ error: 'Unidade não encontrada para o usuário.' });
    }

    // Chama o model que retorna o lucro
    const resultado = await calcularLucroUltimoMes(unidadeId);

    return res.status(200).json({
      unidadeId,
      total_vendas: resultado.total_vendas,
      total_saidas: resultado.total_saidas,
      lucro: resultado.lucro,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao calcular lucro do último mês.' });
  }
}

export const listarVendasController = async(req, res) =>{
    try{
        const unidadeId = req.user?.unidadeId;
        const vendas = await listarVendas(unidadeId);
        res.status(200).json(vendas);
    } catch(error) {
        console.error(error);
        return res.status(500).json({erro: 'Erro ao listar vendas.'})
    }
}