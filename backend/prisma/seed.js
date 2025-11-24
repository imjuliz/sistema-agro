import bcrypt from "bcryptjs";
import 'dotenv/config'
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import * as pkg from "./generated/client.ts";

// Extrai enums
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, tipoTransporte, StatusUnidade, StatusFornecedor, StatusQualidade, TipoMovimento, TipoAtvd, TipoAnimais, StatusVenda, StatusAtvdAnimalia, TipoAnimalia, StatusPedido, StatusProducao, StatusPlantacao } = pkg;

// Fallbacks para enums
const TP = TipoPerfil ?? {
    GERENTE_MATRIZ: "GERENTE_MATRIZ",
    GERENTE_FAZENDA: "GERENTE_FAZENDA",
    GERENTE_LOJA: "GERENTE_LOJA",
    FUNCIONARIO_LOJA: "FUNCIONARIO_LOJA",
    FUNCIONARIO_FAZENDA: "FUNCIONARIO_FAZENDA"
};

const TU = TipoUnidade ?? { MATRIZ: "MATRIZ", FAZENDA: "FAZENDA", LOJA: "LOJA" };
const TL = TipoLote ?? { GADO: "GADO", SOJA: "SOJA", LEITE: "LEITE", OUTRO: "OUTRO", PLANTIO: "PLANTIO" };
const TRS = TipoRegistroSanitario ?? { VACINA: "VACINA", MEDICACAO: "MEDICACAO", RACAO: "RACAO", OUTRO: "OUTRO" };
const TPAG = TipoPagamento ?? { DINHEIRO: "DINHEIRO", CARTAO: "CARTAO", PIX: "PIX" };
const TSAIDA = TipoSaida ?? { ALUGUEL: "ALUGUEL", AGUA: "AGUA", ENERGIA: "ENERGIA", MANUTENCAO: "MANUTENCAO", SALARIOS: "SALARIOS", ESTOQUE: "ESTOQUE" };
const TAT = AtividadesEnum ?? { PLANTIO: "PLANTIO", ADUBACAO: "ADUBACAO", FERTILIZACAO: "FERTILIZACAO" };
const SCON = StatusContrato ?? { ATIVO: "ATIVO", INATIVO: "INATIVO" };
const FREQ = FrequenciaEnum ?? { SEMANALMENTE: "SEMANALMENTE", QUINZENAL: "QUINZENAL", MENSALMENTE: "MENSALMENTE", SEMESTRAL: "SEMESTRAL", TRIMESTRAL: "TRIMESTRAL" };
const UMED = UnidadesDeMedida ?? { KG: "KG", UNIDADE: "UNIDADE", LITRO: "LITRO", SACA: "SACA", G: "G", ML: 'ML', CABECA: 'CABECA' };
const SUNI = StatusUnidade ?? { ATIVA: "ATIVA", INATIVA: "INATIVA", MANUTENCAO: "MANUTENCAO" };
const SF = StatusFornecedor ?? { ATIVO: "ATIVO", INATIVO: "INATIVO" };
const SQ = StatusQualidade ?? { PROPRIO: "PROPRIO", ALERTA: "ALERTA", IMPROPRIO: "IMPROPRIO" };
const TM = TipoMovimento ?? { ENTRADA: "ENTRADA", SAIDA: "SAIDA" };
const TATV = TipoAtvd ?? { IRRIGACAO: "IRRIGACAO", ADUBACAO: "ADUBACAO", USO_AGROTOXICO: "USO_AGROTOXICO", PLANTIO: "PLANTIO", COLHEITA: "COLHEITA" };
const TAN = TipoAnimais ?? { ABATE: "ABATE", VENDA: "VENDA", REPRODUCAO: "REPRODUCAO" };
const TS = StatusVenda ?? { OK: "OK", A_RETIRAR: "A_RETIRAR", CANCELADO: "CANCELADO" };
const TTRANS = tipoTransporte ?? { RODOVIARIO: "RODOVIARIO", FERROVIARIO: "FERROVIARIO", AEREO: "AEREO", FLUVIAL: "FLUVIAL", INTERNO: "INTERNO", OUTRO: "OUTRO" };
const SATVDA = StatusAtvdAnimalia ?? { ATIVA: "ATIVA", INATIVA: "INATIVA", SUSPENSA: "SUSPENSA", CONCLUIDA: "CONCLUIDA" };
const SPLANT = StatusPlantacao ?? { EM_DESENVOLVIMENTO: "EM_DESENVOLVIMENTO", COLHIDO: "COLHIDO", EM_PREPARO: "EM_PREPARO", SEMEADO: "SEMEADO" };
const TANIMALIA = TipoAnimalia ?? { VACINACAO: "VACINACAO", VERMIFUGACAO: "VERMIFUGACAO", ANTIBIOTICO: "ANTIBIOTICO", TESTE_TUBERCULOSE: "TESTE_TUBERCULOSE", TESTE_BRUCELOSE: "TESTE_BRUCELOSE", SANIDADE_GERAL: "SANIDADE_GERAL", NUTRICAO: "NUTRICAO", SUPLEMENTACAO: "SUPLEMENTACAO", CONSUMO_RACAO: "CONSUMO_RACAO", AJUSTE_DIETA: "AJUSTE_DIETA", INSEMINACAO: "INSEMINACAO", MONITORAMENTO_CIO: "MONITORAMENTO_CIO", MONITORAMENTO_GESTACAO: "MONITORAMENTO_GESTACAO", PARTO: "PARTO", SECAGEM: "SECAGEM", TOURO_MANEJO: "TOURO_MANEJO", MANEJO_GERAL: "MANEJO_GERAL", MANEJO_PESAGEM: "MANEJO_PESAGEM", MANEJO_CARREIRA: "MANEJO_CARREIRA", MOVIMENTACAO_INTERNA: "MOVIMENTACAO_INTERNA", SEPARACAO_LOTE: "SEPARACAO_LOTE", ORDENHA_TESTE: "ORDENHA_TESTE", ORDENHA_DIARIA: "ORDENHA_DIARIA", COLETA_LEITE_AMOSTRA: "COLETA_LEITE_AMOSTRA", AVALIACAO_MASTITE: "AVALIACAO_MASTITE", RECEBIMENTO: "RECEBIMENTO", TRANSFERENCIA: "TRANSFERENCIA", VENDA_ANIMAL: "VENDA_ANIMAL", BAIXA_ANIMAL: "BAIXA_ANIMAL", BANHO: "BANHO", HIGIENIZACAO_AMBIENTE: "HIGIENIZACAO_AMBIENTE", TRATAMENTO_PE: "TRATAMENTO_PE", CURATIVO: "CURATIVO", OCORRENCIA: "OCORRENCIA", TRATAMENTO_URGENCIA: "TRATAMENTO_URGENCIA" };
const SPEDIDO = StatusPedido ?? { PENDENTE: "PENDENTE", ENVIADO: "ENVIADO", EM_TRANSITO: "EM_TRANSITO", ENTREGUE: "ENTREGUE", CANCELADO: "CANCELADO" };
const SPROD = StatusProducao ?? { PLANEJADA: "PLANEJADA", EM_ANDAMENTO: "EM_ANDAMENTO", FINALIZADA: "FINALIZADA", CANCELADA: "CANCELADA", EM_ANALISE: "EM_ANALISE" };

const CategoriaInsumo = {
    SEMENTE: "SEMENTE",
    FERTILIZANTE: "FERTILIZANTE",
    DEFENSIVO: "DEFENSIVO",
    RACAO: "RACAO",
    MEDICAMENTO: "MEDICAMENTO",
    SUPLEMENTO: "SUPLEMENTO",
    VACINA: "VACINA",
    OUTROS: "OUTROS"
};

async function main() {
    try {
        console.log("Conectando ao banco...");
        await prisma.$connect();

        // ===== 1. PERFIS =====
        console.log("1. Criando perfis...");
        const perfis = await prisma.perfil.createMany({
            data: [
                { funcao: TP.GERENTE_MATRIZ, descricao: "Gerente da matriz ou administração central" },
                { funcao: TP.GERENTE_FAZENDA, descricao: "Gerente responsável pela fazenda" },
                { funcao: TP.GERENTE_LOJA, descricao: "Gerente responsável pela loja ou filial" },
                { funcao: TP.FUNCIONARIO_LOJA, descricao: "Funcionário da loja" },
                { funcao: TP.FUNCIONARIO_FAZENDA, descricao: "Funcionário da fazenda" }
            ],
            skipDuplicates: true,
        });

        const perfisDb = await prisma.perfil.findMany();
        const perfilMap = Object.fromEntries(perfisDb.map(p => [String(p.funcao), p.id]));

        // ===== 2. UNIDADES =====
        console.log("2. Criando unidades...");
        const unidadesData = [
            { nome: "RuralTech", endereco: "Av. Empresarial, 1000", tipo: TU.MATRIZ, cidade: "São Paulo", estado: "SP", cep: "01000-000", latitude: -23.55052, longitude: -46.633308, cnpj: "12345678000101", email: "ruraltech91@gmail.com", telefone: "1140000001", status: SUNI.ATIVA, },
            { nome: "VerdeFresco Hortaliças", endereco: "Av. Central, 1", tipo: TU.LOJA, cidade: "São Paulo", estado: "SP", cep: "01001-001", latitude: -23.5450, longitude: -46.6340, cnpj: "12345678000202", email: "lojacentral@empresa.com", telefone: "1140000002", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T19:00:00Z'), status: SUNI.ATIVA, },
            { nome: "AgroBoi", endereco: "Rua Norte, 23", tipo: TU.LOJA, cidade: "Guarulhos", estado: "SP", cep: "07010-000", latitude: -23.4628, longitude: -46.5333, cnpj: "12345678000303", email: "lojanorte@empresa.com", telefone: "1140000003", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T18:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Casa Útil Mercado", endereco: "Av. Sul, 45", tipo: TU.LOJA, cidade: "Santo André", estado: "SP", cep: "09010-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678000404", email: "lojasul@empresa.com", telefone: "1140000004", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Sabor do Campo Laticínios", endereco: "Praça Leste, 10", tipo: TU.LOJA, cidade: "São Bernardo", estado: "SP", cep: "09810-000", latitude: -23.6916, longitude: -46.5644, cnpj: "12345678000505", email: "lojaleste@empresa.com", telefone: "1140000005", horarioAbertura: new Date('1970-01-01T09:30:00Z'), horarioFechamento: new Date('1970-01-01T19:30:00Z'), status: SUNI.ATIVA, },
            { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 100", tipo: TU.FAZENDA, cidade: "Campinas", estado: "SP", cep: "13010-000", areaTotal: 1500.5, areaProdutiva: 1200.3, latitude: -22.9099, longitude: -47.0626, cnpj: "12345678100110", email: "fazendaalpha@empresa.com", telefone: "1930001001", status: SUNI.ATIVA, },
            { nome: "Fazenda Gamma", endereco: "Rod. BR-101, km 150", tipo: TU.FAZENDA, cidade: "Ribeirão Preto", estado: "SP", cep: "14010-000", areaTotal: 980.75, areaProdutiva: 760.0, latitude: -21.1775, longitude: -47.8103, cnpj: "12345678100220", email: "fazendabeta@empresa.com", telefone: "1630001002", status: SUNI.ATIVA, },
            { nome: "Fazenda Beta", endereco: "Estrada Rural, 77", tipo: TU.FAZENDA, cidade: "Piracicaba", estado: "SP", cep: "13400-000", areaTotal: 420.0, areaProdutiva: 365.25, latitude: -22.7127, longitude: -47.6476, cnpj: "12345678100330", email: "fazendagamma@empresa.com", telefone: "1930001003", status: SUNI.ATIVA, },
            { nome: "Fazenda Delta", endereco: "Estrada Rural, 88", tipo: TU.FAZENDA, cidade: "Limeira", estado: "SP", cep: "13480-000", areaTotal: 600.0, areaProdutiva: 480.5, latitude: -22.5641, longitude: -47.4019, cnpj: "12345678100440", email: "fazendadelta@empresa.com", telefone: "1930001004", status: SUNI.ATIVA, },
            { nome: "Fazenda Teste", endereco: "Rua Teste, 9", tipo: TU.FAZENDA, cidade: "Itu", estado: "SP", cep: "13300-000", areaTotal: 50.0, areaProdutiva: 40.0, latitude: -23.2646, longitude: -47.2995, cnpj: "12345678100550", email: "teste@empresa.com", telefone: "1140000099", status: SUNI.ATIVA, },
            { nome: "Loja Teste", endereco: "Av. Caetano Limeira, 2205", tipo: TU.LOJA, cidade: "Atibaia", estado: "SP", cep: "04610-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678951244", email: "teste.loja@empresa.com", telefone: "1145003151", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
        ];
        await prisma.unidade.createMany({ data: unidadesData, skipDuplicates: true });
        const unidades = await prisma.unidade.findMany();
        const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));

        // ===== 3. USUÁRIOS =====
        console.log("3. Criando usuários...");
        const senhaHash = await bcrypt.hash("123456", 10);

        const usuariosData = [
            { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, telefone: "11987651001", perfilId: perfilMap["GERENTE_MATRIZ"], unidadeId: unidadeMap["RuralTech"], status: true },
            { nome: "Lorena Oshiro", email: "lorenaoshiro2007@gmail.com", senha: senhaHash, telefone: "11987652001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            { nome: "Maria Del Rey", email: "mebdelrey@gmail.com", senha: senhaHash, telefone: "11987653001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Richard Souza", email: "richardrrggts@gmail.com", senha: senhaHash, telefone: "11916694683", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            { nome: "Roberto Barros", email: "robertbarros01@gmail.com", senha: senhaHash, telefone: "11916683574", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Renato Martins", email: "renato.martins@gmail.com", senha: senhaHash, telefone: "11944556677", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
            { nome: "Juliana Correia", email: "correiajuh@gmail.com", senha: senhaHash, telefone: "11958283626", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
            { nome: "Otávio Viana", email: "otavio.viana89@gmail.com", senha: senhaHash, telefone: "11999215361", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Kátia Oliveira", email: "oliveirakatia09@gmail.com", senha: senhaHash, telefone: "11924245261", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Usuario Ficticio", email: "user.teste@gmail.com", senha: senhaHash, telefone: "11995251689", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Teste"], status: true },
        ];
        await prisma.usuario.createMany({ data: usuariosData, skipDuplicates: true });
        const usuarios = await prisma.usuario.findMany();
        const usuarioMap = Object.fromEntries(usuarios.map(u => [u.nome, u.id]));

        // ===== 4. ATUALIZAR GERENTES DAS UNIDADES =====
        console.log("4. Atualizando gerentes das unidades...");
        await prisma.$transaction([
            prisma.unidade.update({ where: { id: unidadeMap["RuralTech"] }, data: { gerenteId: usuarioMap["Julia Alves"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Fazenda Teste"] }, data: { gerenteId: usuarioMap["Usuario Ficticio"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Sabor do Campo Laticínios"] }, data: { gerenteId: usuarioMap["Lorena Oshiro"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Fazenda Gamma"] }, data: { gerenteId: usuarioMap["Otávio Viana"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Fazenda Beta"] }, data: { gerenteId: usuarioMap["Richard Souza"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Fazenda Delta"] }, data: { gerenteId: usuarioMap["Kátia Oliveira"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Casa Útil Mercado"] }, data: { gerenteId: usuarioMap["Maria Del Rey"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["VerdeFresco Hortaliças"] }, data: { gerenteId: usuarioMap["Roberto Barros"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Fazenda Alpha"] }, data: { gerenteId: usuarioMap["Juliana Correia"], matrizId: unidadeMap["RuralTech"] } }),
            prisma.unidade.update({ where: { id: unidadeMap["Loja Teste"] }, data: { gerenteId: usuarioMap["Renato Martins"], matrizId: unidadeMap["RuralTech"] } })
        ]);

        // ===== 5. FORNECEDORES EXTERNOS =====
        console.log("5. Criando fornecedores externos...");
        const fornecedoresData = [
            { nomeEmpresa: "AgroFornecimentos Ltda", descricaoEmpresa: "Fornece rações e insumos", cnpjCpf: "12345678000190", email: "contato@agrofornece.com", telefone: "11999001122", endereco: "Rua do Agronegócio, 100", status: SF.ATIVO },
            { nomeEmpresa: "NutriBov Distribuidora", descricaoEmpresa: "Distribuição de ração bovina e suplementos", cnpjCpf: "10111213000144", email: "vendas@nutribov.com", telefone: "11988882211", endereco: "Rua NutriBov, 123", status: SF.ATIVO },
            { nomeEmpresa: "BovinoPrime Reprodutores", descricaoEmpresa: "Fornecimento de gado de corte e reprodutores", cnpjCpf: "23242526000177", email: "comercial@bovinoprime.com.br", telefone: "11993004567", endereco: "Rod. Rural BR-050, km 200", status: SF.ATIVO },
            { nomeEmpresa: "Sementes Brasil", descricaoEmpresa: "Venda de sementes selecionadas", cnpjCpf: "11121314000155", email: "contato@sementesbrasil.com", telefone: "19997773344", endereco: "Av. Sementes, 200", status: SF.ATIVO },
            { nomeEmpresa: "AgroLácteos Suprimentos", descricaoEmpresa: "Insumos para laticínios", cnpjCpf: "15161718000199", email: "vendas@agrolacteos.com", telefone: "11993334455", endereco: "Av. Laticínios, 45", status: SF.ATIVO },
        ];
        await prisma.fornecedorExterno.createMany({ data: fornecedoresData, skipDuplicates: true });
        const fornecedoresDb = await prisma.fornecedorExterno.findMany();
        const fornecedorMap = Object.fromEntries(fornecedoresDb.map(f => [f.nomeEmpresa, f.id]));

        // ===== 6. CONTRATOS =====
        console.log("6. Criando contratos...");
        const contratosData = [
            // FAZENDAS com fornecedores externos
            { unidadeId: unidadeMap["Fazenda Alpha"], fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"], dataInicio: new Date("2024-01-01"), dataEnvio: new Date("2024-01-05T08:00:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.MENSALMENTE, unidadeMedida: UMED.SACA, diaPagamento: "30", formaPagamento: TPAG.PIX },
            { unidadeId: unidadeMap["Fazenda Alpha"], fornecedorExternoId: fornecedorMap["BovinoPrime Reprodutores"], dataInicio: new Date("2025-02-01"), dataEnvio: new Date("2025-02-03T08:00:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.MENSALMENTE, unidadeMedida: UMED.CABECA, diaPagamento: "20", formaPagamento: TPAG.PIX },
            { unidadeId: unidadeMap["Fazenda Beta"], fornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"], dataInicio: new Date("2024-07-15"), dataEnvio: new Date("2024-07-18T08:00:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.MENSALMENTE, unidadeMedida: UMED.UNIDADE, diaPagamento: "10", formaPagamento: TPAG.PIX },

            // LOJAS com fornecedores internos (fazendas)
            { unidadeId: unidadeMap["VerdeFresco Hortaliças"], fornecedorUnidadeId: unidadeMap["Fazenda Delta"], dataInicio: new Date("2025-05-01"), dataEnvio: new Date("2025-05-02T06:00:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.SEMANALMENTE, unidadeMedida: UMED.UNIDADE, diaPagamento: "15", formaPagamento: TPAG.PIX },
            { unidadeId: unidadeMap["AgroBoi"], fornecedorUnidadeId: unidadeMap["Fazenda Alpha"], dataInicio: new Date("2025-05-10"), dataEnvio: new Date("2025-05-12T08:00:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.MENSALMENTE, unidadeMedida: UMED.SACA, diaPagamento: "30", formaPagamento: TPAG.PIX },
            { unidadeId: unidadeMap["Sabor do Campo Laticínios"], fornecedorUnidadeId: unidadeMap["Fazenda Beta"], dataInicio: new Date("2025-05-05"), dataEnvio: new Date("2025-05-06T07:30:00.000Z"), status: SCON.ATIVO, frequenciaEntregas: FREQ.SEMANALMENTE, unidadeMedida: UMED.LITRO, diaPagamento: "30", formaPagamento: TPAG.PIX },
        ];
        await prisma.contrato.createMany({ data: contratosData, skipDuplicates: true });
        const contratosDb = await prisma.contrato.findMany();
        const contratoMap = {};
        for (const c of contratosDb) {
            const key = `${c.unidadeId}-${c.fornecedorExternoId || c.fornecedorUnidadeId}`;
            contratoMap[key] = c.id;
        }

        // ===== 7. FORNECEDOR ITEMS (Itens dos Contratos) =====
        console.log("7. Criando itens dos contratos...");
        const fornecedorItemsData = [
            // Fazenda Alpha - AgroFornecimentos (insumos)
            { contratoId: contratoMap[`${unidadeMap["Fazenda Alpha"]}-${fornecedorMap["AgroFornecimentos Ltda"]}`], nome: "Ração Bovino Engorda 50kg", categoria: ["Ração"], unidadeMedida: UMED.SACA, quantidade: "200", precoUnitario: "260.00", ativo: true },
            { contratoId: contratoMap[`${unidadeMap["Fazenda Alpha"]}-${fornecedorMap["AgroFornecimentos Ltda"]}`], nome: "Suplemento Mineral 5kg", categoria: ["Suplemento"], unidadeMedida: UMED.KG, quantidade: "500", precoUnitario: "42.00", ativo: true },

            // Fazenda Alpha - BovinoPrime (animais)
            { contratoId: contratoMap[`${unidadeMap["Fazenda Alpha"]}-${fornecedorMap["BovinoPrime Reprodutores"]}`], nome: "Boi Nelore Reprodutor", raca: "Nelore", categoria: ["Animal", "Reprodutor"], unidadeMedida: UMED.CABECA, quantidade: "8", precoUnitario: "13500.00", ativo: true },

            // Fazenda Beta - AgroLácteos (insumos)
            { contratoId: contratoMap[`${unidadeMap["Fazenda Beta"]}-${fornecedorMap["AgroLácteos Suprimentos"]}`], nome: "Coalho Líquido 1L", categoria: ["Coagulação"], unidadeMedida: UMED.LITRO, quantidade: "50", precoUnitario: "85.00", ativo: true },
            { contratoId: contratoMap[`${unidadeMap["Fazenda Beta"]}-${fornecedorMap["AgroLácteos Suprimentos"]}`], nome: "Cultura Láctea 10g", categoria: ["Fermento"], unidadeMedida: UMED.G, quantidade: "200", precoUnitario: "32.00", ativo: true },

            // VerdeFresco - Fazenda Delta (produtos)
            { contratoId: contratoMap[`${unidadeMap["VerdeFresco Hortaliças"]}-${unidadeMap["Fazenda Delta"]}`], nome: "Alface Crespa (maço)", categoria: ["Hortaliça"], unidadeMedida: UMED.UNIDADE, quantidade: "1500", precoUnitario: "2.50", ativo: true },
            { contratoId: contratoMap[`${unidadeMap["VerdeFresco Hortaliças"]}-${unidadeMap["Fazenda Delta"]}`], nome: "Tomate Carmem (kg)", categoria: ["Hortaliça"], unidadeMedida: UMED.KG, quantidade: "500", precoUnitario: "6.80", ativo: true },

            // AgroBoi - Fazenda Alpha (produtos)
            { contratoId: contratoMap[`${unidadeMap["AgroBoi"]}-${unidadeMap["Fazenda Alpha"]}`], nome: "Carne Bovina Dianteiro (kg)", categoria: ["Carne"], unidadeMedida: UMED.KG, quantidade: "1000", precoUnitario: "38.00", ativo: true },

            // Sabor do Campo - Fazenda Beta (produtos)
            { contratoId: contratoMap[`${unidadeMap["Sabor do Campo Laticínios"]}-${unidadeMap["Fazenda Beta"]}`], nome: "Leite Pasteurizado 1L", categoria: ["Laticínio"], unidadeMedida: UMED.LITRO, quantidade: "2000", precoUnitario: "4.50", ativo: true },
            { contratoId: contratoMap[`${unidadeMap["Sabor do Campo Laticínios"]}-${unidadeMap["Fazenda Beta"]}`], nome: "Queijo Minas Frescal 500g", categoria: ["Laticínio"], unidadeMedida: UMED.KG, quantidade: "300", precoUnitario: "25.00", ativo: true },
        ];
        await prisma.fornecedorItem.createMany({ data: fornecedorItemsData, skipDuplicates: true });
        const fornecedorItemsDb = await prisma.fornecedorItem.findMany();

        // ===== 8. PEDIDOS BASEADOS NOS CONTRATOS =====
        console.log("8. Criando pedidos baseados nos contratos...");

        // Função para calcular próxima data de entrega
        function calcularProximaData(dataBase, frequencia) {
            const data = new Date(dataBase);
            switch (frequencia) {
                case FREQ.SEMANALMENTE: data.setDate(data.getDate() + 7); break;
                case FREQ.MENSALMENTE: data.setMonth(data.getMonth() + 1); break;
                case FREQ.TRIMESTRAL: data.setMonth(data.getMonth() + 3); break;
                default: data.setMonth(data.getMonth() + 1); break;
            }
            return data;
        }

        const pedidosData = [];
        const pedidoItemsData = [];

        for (const contrato of contratosDb) {
            const dataPedido = new Date(contrato.dataInicio);
            const dataEnvio = new Date(contrato.dataEnvio);
            const dataRecebimento = new Date(dataEnvio);
            dataRecebimento.setDate(dataRecebimento.getDate() + 1); // +24 horas

            // Buscar itens do contrato
            const itensContrato = fornecedorItemsDb.filter(fi => fi.contratoId === contrato.id);

            // Criar pedido
            const pedido = await prisma.pedido.create({
                data: {
                    contratoId: contrato.id,
                    origemFornecedorExternoId: contrato.fornecedorExternoId,
                    origemUnidadeId: contrato.fornecedorUnidadeId,
                    destinoUnidadeId: contrato.unidadeId,
                    criadoPorId: usuarioMap["Julia Alves"],
                    dataPedido: dataPedido,
                    dataEnvio: dataEnvio,
                    dataRecebimento: dataRecebimento,
                    status: SPEDIDO.ENTREGUE,
                    documentoReferencia: `PED-${contrato.id}-${Date.now()}`,
                    tipoTransporte: TTRANS.RODOVIARIO,
                    observacoes: `Pedido gerado automaticamente baseado no contrato ${contrato.id}`
                }
            });

            // Calcular valor total
            let valorTotal = 0;

            // Criar itens do pedido baseados nos itens do contrato
            for (const itemContrato of itensContrato) {
                const quantidade = parseFloat(itemContrato.quantidade);
                const precoUnitario = parseFloat(itemContrato.precoUnitario);
                const custoTotal = quantidade * precoUnitario;
                valorTotal += custoTotal;

                pedidoItemsData.push({
                    pedidoId: pedido.id,
                    fornecedorItemId: itemContrato.id,
                    quantidade: quantidade.toString(),
                    unidadeMedida: itemContrato.unidadeMedida,
                    precoUnitario: precoUnitario.toString(),
                    custoTotal: custoTotal.toString(),
                    observacoes: `Item do contrato ${contrato.id}`
                });
            }

            // Atualizar valor total do pedido
            await prisma.pedido.update({
                where: { id: pedido.id },
                data: { valorTotal: valorTotal.toString() }
            });

            pedidosData.push(pedido);
        }

        // Inserir itens dos pedidos
        await prisma.pedidoItem.createMany({ data: pedidoItemsData, skipDuplicates: true });
        const pedidosDb = await prisma.pedido.findMany();

        // ===== 9. INSUMOS =====
        console.log("9. Criando insumos...");
        const insumosData = [
            { nome: "Ração Bovino Engorda", sku: "RACAO-BOV-050", categoria: CategoriaInsumo.RACAO, unidadeBase: UMED.SACA, fornecedorId: fornecedorMap["AgroFornecimentos Ltda"], ativo: true },
            { nome: "Suplemento Mineral Bovino", sku: "SUP-MIN-BOV-005", categoria: CategoriaInsumo.SUPLEMENTO, unidadeBase: UMED.KG, fornecedorId: fornecedorMap["AgroFornecimentos Ltda"], ativo: true },
            { nome: "Coalho Líquido", sku: "COALHO-LIQ-001", categoria: CategoriaInsumo.OUTROS, unidadeBase: UMED.LITRO, fornecedorId: fornecedorMap["AgroLácteos Suprimentos"], ativo: true },
            { nome: "Cultura Láctea", sku: "CULT-LACT-010", categoria: CategoriaInsumo.OUTROS, unidadeBase: UMED.G, fornecedorId: fornecedorMap["AgroLácteos Suprimentos"], ativo: true },
        ];
        await prisma.insumo.createMany({ data: insumosData, skipDuplicates: true });
        const insumosDb = await prisma.insumo.findMany();
        const insumoMap = Object.fromEntries(insumosDb.map(i => [i.nome, i.id]));

        // ===== 10. ESTOQUE E MOVIMENTAÇÃO (Entrada de insumos/animais) =====
        console.log("10. Registrando entrada no estoque...");

        for (const pedido of pedidosDb) {
            const pedidoItems = await prisma.pedidoItem.findMany({
                where: { pedidoId: pedido.id },
                include: { fornecedorItem: true }
            });

            for (const item of pedidoItems) {
                const fornecedorItem = item.fornecedorItem;

                // Verificar se é animal, insumo ou produto
                if (fornecedorItem.categoria?.includes("Animal")) {
                    // ===== ANIMAIS =====
                    console.log("10.1. Criando animais...");
                    const quantidade = parseInt(fornecedorItem.quantidade);

                    for (let i = 0; i < quantidade; i++) {
                        await prisma.animal.create({
                            data: {
                                animal: fornecedorItem.nome,
                                raca: fornecedorItem.raca || "Indefinida",
                                sku: `ANI-${fornecedorItem.id}-${i}-${Date.now()}`,
                                dataEntrada: pedido.dataRecebimento,
                                fornecedorId: pedido.origemFornecedorExternoId,
                                quantidade: 1,
                                tipo: TAN.ABATE,
                                custo: parseFloat(fornecedorItem.precoUnitario),
                                unidadeId: pedido.destinoUnidadeId
                            }
                        });
                    }

                } else if (fornecedorItem.categoria?.some(cat =>
                    ["Ração", "Suplemento", "Coagulação", "Fermento"].includes(cat))) {
                    // ===== INSUMOS NO ESTOQUE =====
                    const insumo = insumosDb.find(i => i.nome === fornecedorItem.nome);
                    if (insumo) {
                        let estoque = await prisma.estoque.findFirst({
                            where: {
                                unidadeId: pedido.destinoUnidadeId,
                                insumoId: insumo.id
                            }
                        });

                        if (!estoque) {
                            estoque = await prisma.estoque.create({
                                data: {
                                    unidadeId: pedido.destinoUnidadeId,
                                    insumoId: insumo.id,
                                    quantidade: parseInt(fornecedorItem.quantidade),
                                    estoqueMinimo: 10
                                }
                            });
                        } else {
                            await prisma.estoque.update({
                                where: { id: estoque.id },
                                data: {
                                    quantidade: {
                                        increment: parseInt(fornecedorItem.quantidade)
                                    }
                                }
                            });
                        }

                        // Registrar movimento de entrada
                        await prisma.estoqueMovimento.create({
                            data: {
                                estoqueId: estoque.id,
                                tipoMovimento: TM.ENTRADA,
                                quantidade: parseInt(fornecedorItem.quantidade),
                                pedidoId: pedido.id,
                                origemUnidadeId: pedido.origemUnidadeId,
                                destinoUnidadeId: pedido.destinoUnidadeId,
                                data: pedido.dataRecebimento
                            }
                        });
                    }
                }
            }
        }

        // ===== 11. LOTES =====
        console.log("11. Criando lotes...");

        // Buscar animais criados
        const animaisDb = await prisma.animal.findMany();

        // Agrupar animais por unidade e tipo para criar lotes
        const animaisPorUnidade = {};
        animaisDb.forEach(animal => {
            const key = `${animal.unidadeId}-${animal.raca}`;
            if (!animaisPorUnidade[key]) {
                animaisPorUnidade[key] = [];
            }
            animaisPorUnidade[key].push(animal);
        });

        const lotesData = [];
        const loteMap = {};

        for (const [key, animais] of Object.entries(animaisPorUnidade)) {
            const [unidadeId, raca] = key.split('-');
            const responsavel = await prisma.usuario.findFirst({
                where: { unidadeId: parseInt(unidadeId) }
            });

            const lote = await prisma.lote.create({
                data: {
                    nome: `Lote ${raca} - ${new Date().toISOString().split('T')[0]}`,
                    unidadeId: parseInt(unidadeId),
                    responsavelId: responsavel.id,
                    tipo: TL.GADO,
                    qntdItens: animais.length,
                    preco: 0,
                    unidadeMedida: UMED.CABECA,
                    dataCriacao: new Date(),
                    statusQualidade: SQ.PROPRIO
                }
            });

            loteMap[key] = lote.id;
            lotesData.push(lote);

            // Associar animais ao lote
            for (const animal of animais) {
                await prisma.animal.update({
                    where: { id: animal.id },
                    data: { loteId: lote.id }
                });
            }
        }

        // ===== 12. ATIVIDADES ANIMALIA =====
        console.log("12. Criando atividades animalia...");

        for (const lote of lotesData) {
            const animaisDoLote = await prisma.animal.findMany({
                where: { loteId: lote.id }
            });

            // Buscar insumos disponíveis na unidade
            const estoqueUnidade = await prisma.estoque.findMany({
                where: { unidadeId: lote.unidadeId },
                include: { insumo: true }
            });

            for (const animal of animaisDoLote) {
                // Para cada animal no lote, criar a mesma atividade
                if (estoqueUnidade.length > 0) {
                    const insumoAleatorio = estoqueUnidade[Math.floor(Math.random() * estoqueUnidade.length)];

                    await prisma.atvdAnimalia.create({
                        data: {
                            animalId: animal.id,
                            insumoId: insumoAleatorio.insumoId,
                            descricao: `Atividade de manejo para ${animal.animal} ${animal.raca}`,
                            tipo: TANIMALIA.VACINACAO,
                            loteId: lote.id,
                            dataInicio: new Date(),
                            responsavelId: lote.responsavelId,
                            status: SATVDA.CONCLUIDA
                        }
                    });

                    // Registrar saída do insumo usado
                    if (insumoAleatorio) {
                        await prisma.estoque.update({
                            where: { id: insumoAleatorio.id },
                            data: { quantidade: { decrement: 1 } }
                        });

                        await prisma.estoqueMovimento.create({
                            data: {
                                estoqueId: insumoAleatorio.id,
                                tipoMovimento: TM.SAIDA,
                                quantidade: 1,
                                origemUnidadeId: lote.unidadeId,
                                data: new Date()
                            }
                        });
                    }
                }
            }
        }

        // ===== 13. PRODUÇÃO =====
        console.log("13. Criando produções...");

        // Buscar contratos onde a unidade é fornecedora (fazenda fornecendo para lojas)
        const contratosFornecedores = await prisma.contrato.findMany({
            where: { fornecedorUnidadeId: { not: null } },
            include: { fornecedorInterno: true, itens: true }
        });

        for (const contrato of contratosFornecedores) {
            const fazenda = contrato.fornecedorInterno;
            const lotesFazenda = await prisma.lote.findMany({
                where: { unidadeId: fazenda.id }
            });

            for (const itemContrato of contrato.itens) {
                // Criar produção baseada nos itens do contrato
                if (lotesFazenda.length > 0) {
                    const lote = lotesFazenda[0]; // Usar primeiro lote disponível

                    const producao = await prisma.producao.create({
                        data: {
                            loteId: lote.id,
                            tipoProduto: itemContrato.nome,
                            quantidadeBruta: parseFloat(itemContrato.quantidade),
                            quantidadeLiquida: parseFloat(itemContrato.quantidade) * 0.95, // 5% de perda
                            unidadeMedida: itemContrato.unidadeMedida,
                            dataInicio: new Date(),
                            dataFim: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 dia
                            status: SPROD.FINALIZADA,
                            responsavelId: lote.responsavelId,
                            destinoUnidadeId: contrato.unidadeId, // Loja destino
                            observacoes: `Produção baseada no contrato ${contrato.id}`
                        }
                    });

                    // Registrar no estoque da fazenda
                    let estoqueProducao = await prisma.estoque.findFirst({
                        where: {
                            unidadeId: fazenda.id,
                            loteId: lote.id
                        }
                    });

                    if (!estoqueProducao) {
                        estoqueProducao = await prisma.estoque.create({
                            data: {
                                unidadeId: fazenda.id,
                                loteId: lote.id,
                                quantidade: parseInt(producao.quantidadeLiquida),
                                estoqueMinimo: 0
                            }
                        });
                    }

                    // Movimento de entrada da produção
                    await prisma.estoqueMovimento.create({
                        data: {
                            estoqueId: estoqueProducao.id,
                            tipoMovimento: TM.ENTRADA,
                            quantidade: parseInt(producao.quantidadeLiquida),
                            producaoId: producao.id,
                            origemUnidadeId: fazenda.id,
                            data: new Date()
                        }
                    });
                }
            }
        }

        // ===== 14. PEDIDOS DAS PRODUÇÕES =====
        console.log("14. Criando pedidos das produções...");

        for (const contrato of contratosFornecedores) {
            const proximaDataEnvio = calcularProximaData(contrato.dataEnvio, contrato.frequenciaEntregas);
            const proximaDataRecebimento = new Date(proximaDataEnvio);
            proximaDataRecebimento.setDate(proximaDataRecebimento.getDate() + 1);

            // Criar pedido
            const pedidoProducao = await prisma.pedido.create({
                data: {
                    contratoId: contrato.id,
                    origemUnidadeId: contrato.fornecedorUnidadeId,
                    destinoUnidadeId: contrato.unidadeId,
                    criadoPorId: usuarioMap["Julia Alves"],
                    dataPedido: new Date(),
                    dataEnvio: proximaDataEnvio,
                    dataRecebimento: proximaDataRecebimento,
                    status: SPEDIDO.ENTREGUE,
                    documentoReferencia: `PED-PROD-${contrato.id}-${Date.now()}`,
                    tipoTransporte: TTRANS.RODOVIARIO
                }
            });

            let valorTotalProducao = 0;

            // Criar itens do pedido baseados na produção
            for (const itemContrato of contrato.itens) {
                const quantidade = parseFloat(itemContrato.quantidade);
                const precoUnitario = parseFloat(itemContrato.precoUnitario);
                const custoTotal = quantidade * precoUnitario;
                valorTotalProducao += custoTotal;

                await prisma.pedidoItem.create({
                    data: {
                        pedidoId: pedidoProducao.id,
                        fornecedorItemId: itemContrato.id,
                        quantidade: quantidade.toString(),
                        unidadeMedida: itemContrato.unidadeMedida,
                        precoUnitario: precoUnitario.toString(),
                        custoTotal: custoTotal.toString()
                    }
                });
            }

            // Atualizar valor total
            await prisma.pedido.update({
                where: { id: pedidoProducao.id },
                data: { valorTotal: valorTotalProducao.toString() }
            });

            // ===== 15. ESTOQUE DAS LOJAS =====
            console.log("15. Registrando estoque nas lojas...");

            for (const itemContrato of contrato.itens) {
                // Buscar ou criar estoque na loja
                let estoqueLoja = await prisma.estoque.findFirst({
                    where: {
                        unidadeId: contrato.unidadeId, // ID da loja
                        loteId: null // Produto final, não insumo
                    }
                });

                if (!estoqueLoja) {
                    estoqueLoja = await prisma.estoque.create({
                        data: {
                            unidadeId: contrato.unidadeId,
                            loteId: null,
                            quantidade: parseInt(itemContrato.quantidade),
                            estoqueMinimo: 10
                        }
                    });
                }

                // Movimento de entrada na loja
                await prisma.estoqueMovimento.create({
                    data: {
                        estoqueId: estoqueLoja.id,
                        tipoMovimento: TM.ENTRADA,
                        quantidade: parseInt(itemContrato.quantidade),
                        pedidoId: pedidoProducao.id,
                        origemUnidadeId: contrato.fornecedorUnidadeId,
                        destinoUnidadeId: contrato.unidadeId,
                        data: proximaDataRecebimento
                    }
                });

                // ===== 16. RETIRAR METADE DO ESTOQUE E CRIAR PRODUTOS =====
                console.log("16. Retirando metade do estoque e criando produtos...");

                const quantidadeRetirada = Math.floor(parseInt(itemContrato.quantidade) / 2);

                if (quantidadeRetirada > 0) {
                    // Atualizar estoque da loja
                    await prisma.estoque.update({
                        where: { id: estoqueLoja.id },
                        data: { quantidade: { decrement: quantidadeRetirada } }
                    });

                    // Movimento de saída (venda/consumo)
                    await prisma.estoqueMovimento.create({
                        data: {
                            estoqueId: estoqueLoja.id,
                            tipoMovimento: TM.SAIDA,
                            quantidade: quantidadeRetirada,
                            origemUnidadeId: contrato.unidadeId,
                            data: new Date()
                        }
                    });

                    // Criar produtos para venda (metade da quantidade)
                    for (let i = 0; i < quantidadeRetirada; i++) {
                        await prisma.produto.create({
                            data: {
                                unidadeId: contrato.unidadeId,
                                origemUnidadeId: contrato.fornecedorUnidadeId,
                                nome: itemContrato.nome,
                                sku: `VENDA-${itemContrato.id}-${i}-${Date.now()}`,
                                categoria: itemContrato.categoria?.[0] || "Geral",
                                descricao: `Produto para venda - ${itemContrato.nome}`,
                                preco: parseFloat(itemContrato.precoUnitario) * 1.2, // 20% markup
                                dataFabricacao: new Date(),
                                dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                                unidadeMedida: itemContrato.unidadeMedida,
                                isForSale: true
                            }
                        });
                    }
                }
            }
        }

        // ===== 17. CAIXAS =====
        console.log("17. Criando caixas...");

        const lojas = unidades.filter(u => u.tipo === TU.LOJA);

        for (const loja of lojas) {
            const gerenteLoja = await prisma.usuario.findFirst({
                where: {
                    unidadeId: loja.id,
                    perfilId: perfilMap["GERENTE_LOJA"]
                }
            });

            if (gerenteLoja) {
                await prisma.caixa.create({
                    data: {
                        unidadeId: loja.id,
                        usuarioId: gerenteLoja.id,
                        status: true, // Aberto
                        saldoInicial: 1000.00, // Saldo inicial padrão
                        abertoEm: new Date()
                    }
                });
            }
        }

        console.log("✅ SEED CONCLUÍDO COM SUCESSO! Todas as etapas foram executadas na ordem correta.");

    } catch (error) {
        console.error("❌ Erro durante seed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log("Desconectado do banco.");
    }
}

main();