import bcrypt from "bcryptjs";
// arquivo para popular o banco com dados iniciais
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import pkg from "./generated/index.js";
const { TipoUnidade } = pkg;

async function main() {
    try {
        // Validar conexão com o banco
        console.log("🔗 Conectando ao banco de dados...");
        await prisma.$connect();
        console.log("✅ Conexão com banco estabelecida com sucesso");

    // Limpar dados antigos
        console.log("🧹 Limpando dados antigos...");
        await prisma.usuario.deleteMany({});
        await prisma.unidade.deleteMany({});
        await prisma.perfil.deleteMany({});

        console.log("✅ Dados antigos apagados com sucesso");
    } catch (error) {
        console.error("❌ Erro ao conectar ou limpar dados:", error);
        throw error;
    }

    // 1️. Criar perfis
    console.log("👥 Criando perfis de usuário...");
    const perfisResult = await prisma.perfil.createMany({
        data: [
            { nome: "gerente_matriz", descricao: "Gerente da matriz ou administração central" },
            { nome: "gerente_fazenda", descricao: "Gerente responsável pela fazenda" },
            { nome: "gerente_loja", descricao: "Gerente responsável pela loja ou filial" },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ ${perfisResult.count} perfis criados com sucesso`);

    // 2️. Criar unidades
    console.log("🏢 Criando unidades do sistema...");
    const unidadesData = [
        { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 123, Zona Rural, São Paulo - SP", tipo: pkg.TipoUnidade.Fazenda, gerenteId: null, status: true },
        { nome: "Fazenda Beta", endereco: "Estrada do Campo, s/n, Zona Rural, Campinas - SP", tipo: pkg.TipoUnidade.Fazenda, gerenteId: null, status: true },
        { nome: "Loja Central", endereco: "Av. Principal, 456, Centro, São Paulo - SP, CEP: 01310-100", tipo: pkg.TipoUnidade.Loja, gerenteId: null, status: true },
        { nome: "Loja Norte", endereco: "Rua das Flores, 789, Zona Norte, São Paulo - SP, CEP: 02456-000", tipo: pkg.TipoUnidade.Loja, gerenteId: null, status: true },
        { nome: "Matriz São Paulo", endereco: "Av. Empresarial, 1000, Centro, São Paulo - SP, CEP: 01310-200", tipo: pkg.TipoUnidade.Matriz, gerenteId: null, status: true },
        { nome: "Matriz Campinas", endereco: "Rua Corporativa, 200, Distrito Industrial, Campinas - SP, CEP: 13050-000", tipo: pkg.TipoUnidade.Matriz, gerenteId: null, status: true},
    ];

    const unidadesCriadas = await prisma.unidade.createMany({
        data: unidadesData,
        skipDuplicates: true,
    });
    console.log(`✅ ${unidadesCriadas.count} unidades criadas com sucesso`);

    console.log("🎉 Seed executado com sucesso! Banco de dados populado com dados iniciais.");

    // 3️. Buscar IDs de perfis e unidades
    const perfis = await prisma.perfil.findMany();
    const unidades = await prisma.unidade.findMany();

    const perfilMap = Object.fromEntries(perfis.map(p => [p.nome, p.id]));
    const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));

    // 4. Criar usuários
    const senhaHash = await bcrypt.hash("123456", 10);

    const usuariosData = [
        // Administradores
        { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, telefone: "(11) 98765-1001", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz São Paulo"], status: true },
        { nome: "Lorena Oshiro", email: "lorena.oshiro@example.com", senha: senhaHash, telefone: "(11) 98765-1002", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz São Paulo"], status: true },
        { nome: "Maria Del Rey", email: "maria.delrey@example.com", senha: senhaHash, telefone: "(19) 98765-1003", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz Campinas"], status: true },
        { nome: "Richard Sousa", email: "richard.sousa@example.com", senha: senhaHash, telefone: "(19) 98765-1004", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz Campinas"], status: true },

        // Gerente Fazenda
        { nome: "Carlos Silva", email: "carlos.silva@example.com", senha: senhaHash, telefone: "(11) 98765-2001", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
        { nome: "Ana Costa", email: "ana.costa@example.com", senha: senhaHash, telefone: "(11) 98765-2002", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
        { nome: "Paulo Lima", email: "paulo.lima@example.com", senha: senhaHash, telefone: "(19) 98765-2003", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
        { nome: "Fernanda Rocha", email: "fernanda.rocha@example.com", senha: senhaHash, telefone: "(19) 98765-2004", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Beta"], status: true },

        // Gerente Loja
        { nome: "Bruno Pereira", email: "bruno.pereira@example.com", senha: senhaHash, telefone: "(11) 98765-3001", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Central"], status: true },
        { nome: "Carla Mendes", email: "carla.mendes@example.com", senha: senhaHash, telefone: "(11) 98765-3002", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Central"], status: true },
        { nome: "Thiago Santos", email: "thiago.santos@example.com", senha: senhaHash, telefone: "(11) 98765-3003", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Norte"], status: true },
        { nome: "Juliana Fernandes", email: "juliana.fernandes@example.com", senha: senhaHash, telefone: "(11) 98765-3004", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Norte"], status: true },
    ];

    await prisma.usuario.createMany({
        data: usuariosData,
        skipDuplicates: true,
    });
    console.log(`✅ ${usuariosData.length} usuários criados com sucesso`);
    }

main()
    .catch((error) => {
        console.error("❌ Erro durante execução do seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        console.log("🔌 Desconectando do banco de dados...");
        await prisma.$disconnect();
        console.log("✅ Desconectado com sucesso");
    });
