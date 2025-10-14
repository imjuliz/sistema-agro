// arquivo para popular o banco com dados iniciais
import prisma from "./client.js";
import bcrypt from "bcryptjs";

async function main() {

    // Limpar dados antigos
    await prisma.usuarios.deleteMany({});
    await prisma.unidades.deleteMany({});
    await prisma.perfis.deleteMany({});

    console.log("Dados antigos apagados com sucesso");


    // // 1️. Criar perfis
    // await prisma.perfis.createMany({
    //     data: [
    //         { nome: "gerente_matriz", descricao: "Gerente da matriz ou administração central" },
    //         { nome: "gerente_fazenda", descricao: "Gerente responsável pela fazenda" },
    //         { nome: "gerente_loja", descricao: "Gerente responsável pela loja ou filial" },
    //     ],
    //     skipDuplicates: true,
    // });
    // console.log("Perfis criados com sucesso");

    // // 2️. Criar unidades
    // const unidadesData = [
    //     { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 123", tipo: "FAZENDA" },
    //     { nome: "Fazenda Beta", endereco: "Estrada do Campo, s/n", tipo: "FAZENDA" },
    //     { nome: "Loja Central", endereco: "Av. Principal, 456", tipo: "LOJA" },
    //     { nome: "Loja Norte", endereco: "Rua das Flores, 789", tipo: "LOJA" },
    //     { nome: "Empresa X", endereco: "Av. Empresarial, 1000, Centro, Cidade E", tipo: "MATRIZ" },
    //     { nome: "Empresa Y", endereco: "Rua Corporativa, 200, Distrito Industrial, Cidade F", tipo: "MATRIZ" },
    // ];

    // const unidadesCriadas = await prisma.unidades.createMany({
    //     data: unidadesData,
    //     skipDuplicates: true,
    // });
    // console.log("Unidades criadas com sucesso");

    // // 3️. Buscar IDs de perfis e unidades
    // const perfis = await prisma.perfis.findMany();
    // const unidades = await prisma.unidades.findMany();

    // const perfilMap = Object.fromEntries(perfis.map(p => [p.nome, p.id]));
    // const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));

    // // 4. Criar usuários
    // const senhaHash = await bcrypt.hash("123456", 10);

    // const usuariosData = [
    //     // Administradores
    //     { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, perfil_id: perfilMap["gerente_matriz"], unidade_id: unidadeMap["Empresa X"] },
    //     { nome: "Lorena Oshiro", email: "lorena.oshiro@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_matriz"], unidade_id: unidadeMap["Empresa X"] },
    //     { nome: "Maria Del Rey", email: "maria.delrey@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_matriz"], unidade_id: unidadeMap["Empresa Y"] },
    //     { nome: "Richard Souza", email: "richard.souza@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_matriz"], unidade_id: unidadeMap["Empresa Y"] },

    //     // Gerente Fazenda
    //     { nome: "Carlos Silva", email: "carlos.silva@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_fazenda"], unidade_id: unidadeMap["Fazenda Alpha"] },
    //     { nome: "Ana Costa", email: "ana.costa@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_fazenda"], unidade_id: unidadeMap["Fazenda Alpha"] },
    //     { nome: "Paulo Lima", email: "paulo.lima@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_fazenda"], unidade_id: unidadeMap["Fazenda Beta"] },
    //     { nome: "Fernanda Rocha", email: "fernanda.rocha@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_fazenda"], unidade_id: unidadeMap["Fazenda Beta"] },

    //     // Gerente Loja
    //     { nome: "Bruno Pereira", email: "bruno.pereira@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_loja"], unidade_id: unidadeMap["Loja Central"] },
    //     { nome: "Carla Mendes", email: "carla.mendes@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_loja"], unidade_id: unidadeMap["Loja Central"] },
    //     { nome: "Thiago Santos", email: "thiago.santos@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_loja"], unidade_id: unidadeMap["Loja Norte"] },
    //     { nome: "Juliana Fernandes", email: "juliana.fernandes@example.com", senha: senhaHash, perfil_id: perfilMap["gerente_loja"], unidade_id: unidadeMap["Loja Norte"] },
    // ];

    // await prisma.usuarios.createMany({
    //     data: usuariosData,
    //     skipDuplicates: true,
    // });
    // console.log("Usuários criados com sucesso");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
