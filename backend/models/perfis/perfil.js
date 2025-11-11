import { number } from "zod";
import prisma from "../../prisma/client";

export const dadosPerfil = async(id) =>{
    try{
       const user = prisma.usuario.findUnique({where: {id: Number(id)}});
       return ({
            sucesso: true,
            funcionarios,
            message: "Dados do perfil obtidos com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao obter dados do perfil",
            detalhes: error.message
        }
    }
}