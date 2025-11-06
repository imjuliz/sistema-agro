import { mostrarEstoque } from "../../models/unidade-de-venda/estoque";

export const mostrarEstoqueController = async(req, res) =>{
    try{
        const unidadeId = req.user?.unidadeId;
        const estoque = await mostrarEstoque(unidadeId);
        res.json(estoque);
    } catch (error) {
        console.error(error);
        res.status(500).json({erro: 'Erro ao mostrar estoque da unidade de venda.'})
    }
}