import { dadosPerfil, dadosPerfil } from "../../models/perfis/perfil";

export const dadosPerfilController = async (req, res) => {
    try {
        const id = req.user.id;
        const dadosPerfil = await dadosPerfil(id);
        if (!dadosPerfil) {return res.status(404).json({ erro: 'Usuário não encontrado.' })}
        return res.status(200).json(dadosPerfil)
    }
    catch (error) {
        console.error('Erro ao obter dados do perfil: ', error);
        res.status(500).json({ erro: 'Erro ao onter dados do perfil.' })
    }
};