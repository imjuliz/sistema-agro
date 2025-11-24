import bcrypt from "bcryptjs";
import 'dotenv/config'
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import * as pkg from "./generated/client.ts";

// Extrai enums
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, tipoTransporte, StatusUnidade, StatusFornecedor, StatusQualidade, TipoMovimento, TipoAtvd, TipoAnimais, StatusVenda, StatusAtvdAnimalia, TipoAnimalia, StatusPedido, StatusProducao, StatusPlantacao, CategoriaInsumo } = pkg;

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

const CtgInsumo = CategoriaInsumo ?? {
    SEMENTE: "SEMENTE",
    FERTILIZANTE: "FERTILIZANTE",
    DEFENSIVO: "DEFENSIVO",
    RACAO: "RACAO",
    MEDICAMENTO: "MEDICAMENTO",
    SUPLEMENTO: "SUPLEMENTO",
    VACINA: "VACINA",
    OUTROS: "OUTROS",
    LATICINIOS: "LATICINIOS"
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
            // gerente da loja
            { nome: "Bruna Carvalho", email: "bru.carvalho@gmail.com", senha: senhaHash, telefone: "11988821353", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            { nome: "Roberto Barros", email: "robertbarros01@gmail.com", senha: senhaHash, telefone: "11916683574", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Renato Martins", email: "renato.martins@gmail.com", senha: senhaHash, telefone: "11944556677", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
            // funcionarios da loja
            { nome: "Mariana Coelho", email: "mari.coelho@gmail.com", senha: senhaHash, telefone: "1199637392", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
            { nome: "Jonatas Silva", email: "jonatas91silva@gmail.com", senha: senhaHash, telefone: "11958251620", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Alice Chagas", email: "chagas.alice@gmail.com", senha: senhaHash, telefone: "11953821185", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["AgroBoi"], status: true },
            { nome: "Marco Lucca Costa", email: "lucca.costa@gmail.com", senha: senhaHash, telefone: "11942221116", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Lúcia Mello", email: "luciamello11@gmail.com", senha: senhaHash, telefone: "1190086499", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            // funcionarios da fazenda
            { nome: "Bruno Tavares", email: "bruno.tavares@gmail.com", senha: senhaHash, telefone: "11987654321", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Teste"], status: true },
            { nome: "Camila Duarte", email: "camila.duarte@gmail.com", senha: senhaHash, telefone: "11999887766", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Eduardo Lima", email: "edu.lima@gmail.com", senha: senhaHash, telefone: "11988776655", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Fernanda Rocha", email: "fernanda.rocha@gmail.com", senha: senhaHash, telefone: "11977665544", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
            { nome: "Rafael Nunes", email: "rafael.nunes@gmail.com", senha: senhaHash, telefone: "11966554433", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            // gerentes de fazenda
            { nome: "Usuario Ficticio", email: "user.teste@gmail.com", senha: senhaHash, telefone: "11995251689", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Teste"], status: true },
            { nome: "Otávio Viana", email: "otavio.viana89@gmail.com", senha: senhaHash, telefone: "11999215361", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Kátia Oliveira", email: "oliveirakatia09@gmail.com", senha: senhaHash, telefone: "11924245261", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Juliana Correia", email: "correiajuh@gmail.com", senha: senhaHash, telefone: "11958283626", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
        ];
        await prisma.usuario.createMany({ data: usuariosData, skipDuplicates: true });
        const usuarios = await prisma.usuario.findMany();
        const usuarioMap = Object.fromEntries(usuarios.map(u => [u.nome, u.id]));

        // ===== 4. ATUALIZAR GERENTES DAS UNIDADES =====
        console.log("Ajustando gerenteId nas unidades...");

        await prisma.unidade.update({
            where: { id: unidadeMap["RuralTech"] },
            data: { gerenteId: usuarioMap["Julia Alves"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Teste"] },
            data: { gerenteId: usuarioMap["Usuario Ficticio"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Sabor do Campo Laticínios"] },
            data: { gerenteId: usuarioMap["Lorena Oshiro"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Gamma"] },
            data: { gerenteId: usuarioMap["Otávio Viana"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Beta"] },
            data: { gerenteId: usuarioMap["Richard Souza"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Delta"] },
            data: { gerenteId: usuarioMap["Kátia Oliveira"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Casa Útil Mercado"] },
            data: { gerenteId: usuarioMap["Maria Del Rey"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["AgroBoi"] },
            data: { gerenteId: usuarioMap["Bruna Carvalho"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["VerdeFresco Hortaliças"] },
            data: { gerenteId: usuarioMap["Roberto Barros"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Alpha"] },
            data: { gerenteId: usuarioMap["Juliana Correia"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Loja Teste"] },
            data: { gerenteId: usuarioMap["Renato Martins"], matrizId: unidadeMap["RuralTech"] },
        });

        console.log("gerenteId configurado para todas as unidades.");

        // ===== 5. FORNECEDORES EXTERNOS =====
        console.log("5. Criando fornecedores externos...");
        const fornecedoresData = [
            {
                nomeEmpresa: "AgroFornecimentos Ltda",
                descricaoEmpresa: "Fornece rações e insumos",
                cnpjCpf: "12345678000190",
                email: "contato@agrofornece.com",
                telefone: "11999001122",
                endereco: "Rua do Agronegócio, 100",
                status: SF.ATIVO,
                // unidadeId: unidadeMap["Fazenda Alpha"],
            },
            {
                nomeEmpresa: "NutriBov Distribuidora",
                descricaoEmpresa: "Distribuição de ração bovina e suplementos",
                cnpjCpf: "10111213000144",
                email: "vendas@nutribov.com",
                telefone: "11988882211",
                endereco: "Rua NutriBov, 123",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "BovinoPrime Reprodutores",
                descricaoEmpresa: "Fornecimento de gado de corte e reprodutores certificados, com seleção genética.",
                cnpjCpf: "23242526000177",
                email: "comercial@bovinoprime.com.br",
                telefone: "11993004567",
                endereco: "Rod. Rural BR-050, km 200, Galpão 3",
                status: SF.ATIVO,
            },
            // fazenda gamma
            {
                nomeEmpresa: "Sementes Brasil",
                descricaoEmpresa: "Venda de sementes selecionadas",
                cnpjCpf: "11121314000155",
                email: "contato@sementesbrasil.com",
                telefone: "19997773344",
                endereco: "Av. Sementes, 200",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "AgroGrãos Comercial",
                descricaoEmpresa: "Comercialização de farelos e grãos",
                cnpjCpf: "12131415000166",
                email: "vendas@agrograos.com",
                telefone: "21996664455",
                endereco: "Rua Grãos, 50",
                status: SF.ATIVO,
            },
            // fazenda delta
            {
                nomeEmpresa: "FertSul Distribuição",
                descricaoEmpresa: "Distribuição de fertilizantes e corretivos",
                cnpjCpf: "13141516000177",
                email: "contato@fertsul.com",
                telefone: "51995555566",
                endereco: "Av. Fertilizantes, 300",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "BioInsumos Ltda",
                descricaoEmpresa: "Produtos biológicos e microbianos",
                cnpjCpf: "14151617000188",
                email: "contato@bioinsumos.com",
                telefone: "51994446677",
                endereco: "Rua Bio, 77",
                status: SF.ATIVO,
            },
            // fazenda beta
            {
                nomeEmpresa: "AgroLácteos Suprimentos",
                descricaoEmpresa: "Insumos para laticínios: coalho, culturas lácteas, consumíveis de processo e embalagens.",
                cnpjCpf: "15161718000199",
                email: "vendas@agrolacteos.com",
                telefone: "11993334455",
                endereco: "Av. Laticínios, 45",
                status: SF.ATIVO,
                // unidadeId: null // fornecedor externo
            },
            {
                nomeEmpresa: "Lácteos & Tecnologia Ltda",
                descricaoEmpresa: "Fornece starter cultures, enzimas, embalagens térmicas e equipamentos de pequeno porte para produção de queijo e iogurte.",
                cnpjCpf: "16171819000100",
                email: "contato@lacteostec.com.br",
                telefone: "11992223344",
                endereco: "Rua do Leite, 200",
                status: SF.ATIVO,
                // unidadeId: null
            },
            {
                nomeEmpresa: "AgroBov Genetics",
                descricaoEmpresa: "Fornecedor de animais reprodutores, touros de alto desempenho e serviços de inseminação artificial.",
                cnpjCpf: "17181920000111",
                email: "contato@agrobovgenetics.com.br",
                telefone: "11991112233",
                endereco: "Estrada da Cria, 500",
                status: SF.ATIVO,
                // unidadeId: null
            },
            {
                nomeEmpresa: "VetBov Serviços e Insumos",
                descricaoEmpresa: "Vacinas, medicamentos veterinários, assistência técnica e serviços de saúde animal.",
                cnpjCpf: "18192021000122",
                email: "vendas@vetbov.com.br",
                telefone: "11994445566",
                endereco: "Rua Veterinária, 77",
                status: SF.ATIVO,
                // unidadeId: null
            },
            // unidade teste
            {
                nomeEmpresa: "PastosVerde Nutrição Animal",
                descricaoEmpresa: "Produção e fornecimento de silagem, feno e suplementos minerais para bovinos.",
                cnpjCpf: "19192122000133",
                email: "contato@pastosverde.com.br",
                telefone: "11993332211",
                endereco: "Rodovia Rural, km 12",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "GenBov Melhoramento Genético",
                descricaoEmpresa: "Serviços de melhoramento genético, inseminação artificial e fornecimento de animais reprodutores.",
                cnpjCpf: "20212223000144",
                email: "vendas@genbov.com.br",
                telefone: "11992221100",
                endereco: "Estrada da Pecuária, 88",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "AgroVet Saúde Animal",
                descricaoEmpresa: "Medicamentos veterinários, vacinas e kits de diagnóstico para rebanhos bovinos.",
                cnpjCpf: "21222324000155",
                email: "contato@agrovetsaude.com.br",
                telefone: "11991114455",
                endereco: "Av. Veterinária, 300",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "CampoForte Equipamentos",
                descricaoEmpresa: "Equipamentos para manejo de gado: balanças, troncos de contenção e bebedouros automáticos.",
                cnpjCpf: "22232425000166",
                email: "suporte@campoforte.com.br",
                telefone: "11990002233",
                endereco: "Rua Agroindústria, 150",
                status: SF.ATIVO,
            },
        ];
        await prisma.fornecedorExterno.createMany({ data: fornecedoresData, skipDuplicates: true });
        const fornecedoresDb = await prisma.fornecedorExterno.findMany();
        const fornecedorMap = Object.fromEntries(fornecedoresDb.map(f => [f.nomeEmpresa, f.id]));

        // ===== 6. CONTRATOS =====
        console.log("6. Criando contratos...");
        const contratosData = [
            // ----------------------------------------------------------
            // FAZENDAS
            // externos -> Faz. Alpha
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"],
                dataInicio: new Date("2024-01-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-05T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["NutriBov Distribuidora"],
                dataInicio: new Date("2024-02-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-03T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["BovinoPrime Reprodutores"],
                dataInicio: new Date("2025-02-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-02-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            // externos -> Faz. Gamma
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["Sementes Brasil"],
                dataInicio: new Date("2024-03-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-03-05T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE, // fallback
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["AgroGrãos Comercial"],
                dataInicio: new Date("2024-04-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-04-03T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // externos -> Faz. Delta
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["FertSul Distribuição"],
                dataInicio: new Date("2024-01-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-20T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["BioInsumos Ltda"],
                dataInicio: new Date("2024-02-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-12T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },

            // externos -> Fazenda Beta
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
                dataInicio: new Date("2024-07-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-07-18T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
                dataInicio: new Date("2024-07-20T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-07-22T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroBov Genetics"],
                dataInicio: new Date("2024-09-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-09-03T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL, // inseminação/troca genética não é mensal
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
                dataInicio: new Date("2024-08-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-08-05T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },

            // Fazenda Teste <- PastosVerde Nutrição Animal (silagem, feno, suplementos minerais)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
                dataInicio: new Date("2024-10-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-10-03T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- GenBov Melhoramento Genético (inseminação e consultoria)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
                dataInicio: new Date("2024-11-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-11-04T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- AgroVet Saúde Animal (medicamentos e vacinas)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
                dataInicio: new Date("2024-12-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-12-05T07:45:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "25",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- CampoForte Equipamentos (balanças, troncos, bebedouros)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
                dataInicio: new Date("2025-01-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-01-12T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMESTRAL,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // -------------------------------------------------------
            // LOJAS
            // VerdeFresco Hortaliças (vende hortaliças) <- fornecedor: Fazenda Delta
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                fornecedorUnidadeId: unidadeMap["Fazenda Delta"],
                dataInicio: new Date("2025-05-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-02T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },

            // AgroBoi (vende gado/insumos) <- fornecedor: Fazenda Alpha
            {
                unidadeId: unidadeMap["AgroBoi"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-05-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-12T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },

            // Casa Útil Mercado (produtos diversos) <- fornecedores variados (ex.: usa fazendas para apresentação do usuário Maria)
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Gamma"],
                dataInicio: new Date("2025-04-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-04-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-04-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-03-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-03-02T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // Sabor do Campo Laticínios (laticínios) <- fornecedor: Fazenda Beta
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
                dataInicio: new Date("2025-05-05T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-06T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },

            // Loja Teste (laticínios e carne) <- fornecedor: Fazenda Teste
            {
                unidadeId: unidadeMap["Loja Teste"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-06-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
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
            // ===== insumos que NAO vao p producao. São pra representar o que vai ser fornecido no contrato, APENAS =====
            // Fazenda Alpha → AgroFornecimentos Ltda
            {
                contratoId: contratoMap["Fazenda Alpha - AgroFornecimentos Ltda"],
                // sku: "RACAO-BOV-050",
                nome: "Ração Bovino Engorda 50kg",
                categoria: ["Ração"],
                unidadeMedida: UMED.SACA,
                quantidade: "200", // 200 sacas/mês (10 toneladas)
                precoUnitario: "260.00",
                ativo: true,
                criadoEm: new Date("2025-01-20"),
            },
            // Fazenda Alpha → NutriBov Distribuidora
            {
                contratoId: contratoMap["Fazenda Alpha - NutriBov Distribuidora"],
                // sku: "SUP-MIN-BOV-005",
                nome: "Suplemento Mineral Bovino 5kg",
                categoria: ["Suplemento"],
                unidadeMedida: UMED.KG,
                quantidade: "500",
                precoUnitario: "42.00",
                ativo: true,
                criadoEm: new Date("2025-02-01"),
            },
            {
                contratoId: contratoMap["Fazenda Alpha - NutriBov Distribuidora"],
                // sku: "BLOCO-MIN-BOV-010",
                nome: "Bloco Mineral Bovino 10kg",
                categoria: ["Suplemento"],
                unidadeMedida: UMED.KG,
                quantidade: "300", // 300 blocos/mês
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-02-10"),
            },

            // Fazenda Gamma → Sementes Brasil
            {
                contratoId: contratoMap["Fazenda Gamma - Sementes Brasil"],
                // sku: "SEED-SOJA-020",
                nome: "Semente Soja Alta Germinacao 20kg",
                categoria: ["Sementes"],
                unidadeMedida: UMED.SACA,
                quantidade: "150", // 150 sacas/mês
                precoUnitario: "320.00",
                ativo: true,
                criadoEm: new Date("2025-01-10"),
            },
            // Fazenda Gamma → AgroGrãos Comercial
            {
                contratoId: contratoMap["Fazenda Gamma - AgroGrãos Comercial"],
                // sku: "FARELO-SOJA-025",
                nome: "Farelo de Soja 25kg",
                categoria: ["Insumos"],
                unidadeMedida: UMED.SACA,
                quantidade: "400", // 400 sacas/mês
                precoUnitario: "130.00",
                ativo: true,
                criadoEm: new Date("2025-08-10"),
            },
            // Fazenda Gamma → FertSul Distribuição
            {
                contratoId: contratoMap["Fazenda Gamma - Sementes Brasil"],
                // sku: "CALC-AG-040",
                nome: "Calcario Agricola 40kg",
                categoria: ["Corretivo"],
                unidadeMedida: UMED.KG,
                quantidade: "1000", // 40 toneladas/mês
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2025-02-15"),
            },

            // Fazenda Delta → FertSul Distribuição
            {
                contratoId: contratoMap["Fazenda Delta - FertSul Distribuição"],
                // sku: "NPK-20520-025",
                nome: "NPK 20-05-20 25kg",
                categoria: ["Fertilizantes"],
                unidadeMedida: UMED.KG,
                quantidade: "600", // 15 toneladas/mês
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-01-10"),
            },

            // Fazenda Delta → BioInsumos Ltda
            {
                contratoId: contratoMap["Fazenda Delta - BioInsumos Ltda"],
                // sku: "COMPO-MIC-010",
                nome: "Composto Microbiano 10kg",
                categoria: ["Adubo"],
                unidadeMedida: UMED.KG,
                quantidade: "200", // 2 toneladas/mês
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2025-03-01"),
            },
            {
                contratoId: contratoMap["Fazenda Delta - BioInsumos Ltda"],
                // sku: "INOC-SOJA-001",
                nome: "Inoculante Microbiano para Soja 1L",
                categoria: ["Inoculante"],
                unidadeMedida: UMED.LITRO,
                quantidade: "300", // 300 litros/mês
                precoUnitario: "38.00",
                ativo: true,
                criadoEm: new Date("2025-01-12"),
            },

            // Fazenda Beta → AgroLácteos Suprimentos
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                // sku: "COALHO-LIQ-001",
                nome: "Coalho Líquido para Queijo 1L",
                categoria: ["Coagulação"],
                unidadeMedida: UMED.LITRO,
                quantidade: "50", // 50 litros/mês
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2025-03-01"),
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                // sku: "CULT-LACT-010",
                nome: "Cultura Láctea Termófila 10g",
                categoria: ["Fermento"],
                unidadeMedida: UMED.G,
                quantidade: "200", // 200 doses/mês
                precoUnitario: "32.00",
                ativo: true,
                criadoEm: new Date("2025-03-02"),
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                // sku: "EMBAL-LEITE-1L",
                nome: "Embalagem Plástica para Leite 1L (pacote c/ 100)",
                categoria: ["Embalagem"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "100", // 100 pacotes/mês
                precoUnitario: "55.00",
                ativo: true,
                criadoEm: new Date("2025-03-05"),
            },

            // Fazenda Beta → Lácteos & Tecnologia Ltda
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                // sku: "START-YOG-005",
                nome: "Starter Culture para Iogurte 5g",
                categoria: ["Fermento"],
                unidadeMedida: UMED.G,
                quantidade: "150", // 150 doses/mês
                precoUnitario: "27.00",
                ativo: true,
                criadoEm: new Date("2025-03-03"),
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                // sku: "ENZ-QUEIJO-020",
                nome: "Enzima Lipase para Queijo 20ml",
                categoria: ["Enzimas"],
                unidadeMedida: UMED.ML,
                quantidade: "80", // 80 frascos/mês
                precoUnitario: "19.00",
                ativo: true,
                criadoEm: new Date("2025-03-04"),
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                // sku: "POTE-YOG-200ML",
                nome: "Pote Plástico 200ml para Iogurte (caixa c/ 50)",
                categoria: ["Embalagem"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "60", // 60 caixas/mês
                precoUnitario: "34.00",
                ativo: true,
                criadoEm: new Date("2025-03-06"),
            },

            // Fazenda Beta → AgroBov Genetics
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                // sku: "SEME-STR-001",
                nome: "Sêmen Bovino (dose - straw) - Alta Fertilidade",
                categoria: ["Genética", "Sêmen"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "100", // 100 doses/mês
                precoUnitario: "120.00",
                ativo: true,
                criadoEm: new Date("2025-04-03"),
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                // sku: "SERV-IAF-001",
                nome: "Serviço Inseminação Artificial (por cabeça)",
                categoria: ["Serviço"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "50", // 50 serviços/mês
                precoUnitario: "250.00",
                ativo: true,
                criadoEm: new Date("2025-04-04")
            },
            // Fazenda Beta → VetBov Serviços e Insumos
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                // sku: "VAC-BRU-010",
                nome: "Vacina Brucelose (dose)",
                categoria: ["Vacina"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "300", // 300 doses/mês
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-04-05")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                // sku: "ANTIPAR-50ML",
                nome: "Antiparasitário Oral 50ml (dose unitária)",
                categoria: ["Medicamento"],
                unidadeMedida: UMED.ML,
                quantidade: "200", // 200 doses/mês
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2025-04-06")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                // sku: "KIT-SAN-001",
                nome: "Kit Sanidade (antiparasitário + vitaminas) - por animal",
                categoria: ["Kit", "Sanidade"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "150", // 150 kits/mês
                precoUnitario: "35.00",
                ativo: true,
                criadoEm: new Date("2025-04-07")
            },

            // Fazenda Teste → PastosVerde Nutrição Animal
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                // sku: "SILAGEM-MILHO-500KG",
                nome: "Silagem de Milho 500kg",
                categoria: ["Nutrição Animal"],
                unidadeMedida: UMED.KG,
                quantidade: "5000", // 5 toneladas/mês
                precoUnitario: "480.00",
                ativo: true,
                criadoEm: new Date("2025-03-10"),
            },
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                // sku: "FENO-CAPIM-BALE",
                nome: "Fardo de Feno de Capim 25kg",
                categoria: ["Nutrição Animal"],
                unidadeMedida: UMED.KG,
                quantidade: "2000", // 2 toneladas/mês
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-03-11"),
            },

            // Fazenda Teste → GenBov Melhoramento Genético
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                // sku: "SEMEN-TOURO-ALTA",
                nome: "Sêmen de Touro Alta Performance (dose)",
                categoria: ["Genética"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "80", // 80 doses/mês
                precoUnitario: "250.00",
                ativo: true,
                criadoEm: new Date("2025-03-15"),
            },
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                // sku: "SERV-INSEM-001",
                nome: "Serviço de Inseminação Artificial",
                categoria: ["Serviço"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "40", // 40 serviços/mês
                precoUnitario: "500.00",
                ativo: true,
                criadoEm: new Date("2025-03-16"),
            },

            // Fazenda Teste → AgroVet Saúde Animal
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                // sku: "VACINA-FOOT-AND-MOUTH",
                nome: "Vacina contra Febre Aftosa (dose)",
                categoria: ["Vacinas"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "400", // 400 doses/mês
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2025-03-20"),
            },
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                // sku: "ANTIBIOTICO-BOV-100ML",
                nome: "Antibiótico Bovino 100ml",
                categoria: ["Medicamentos"],
                unidadeMedida: UMED.ML,
                quantidade: "150", // 150 frascos/mês
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2025-03-21"),
            },

            // Fazenda Teste → CampoForte Equipamentos
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                // sku: "BALANCA-BOV-500KG",
                nome: "Balança Eletrônica para Bovinos até 500kg",
                categoria: ["Equipamentos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "5", // 5 unidades/mês
                precoUnitario: "3500.00",
                ativo: true,
                criadoEm: new Date("2025-03-25"),
            },
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                // sku: "TRONCO-CONTENCAO-001",
                nome: "Tronco de Contenção Bovino",
                categoria: ["Equipamentos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "3", // 3 unidades/mês
                precoUnitario: "7200.00",
                ativo: true,
                criadoEm: new Date("2025-03-26"),
            },

            // ANIMAIS --------------------------------------------
            // ----------------------- FAZENDA ALPHA
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                // sku: "BOI-NEL-ALPHA-001",
                nome: "Boi Nelore Reprodutor (macho adulto)",
                raca: "Nelore",
                categoria: ["Animal", "Reprodutor"],
                unidadeMedida: UMED.CABECA,
                quantidade: "8",
                precoUnitario: "13500.00",
                ativo: true,
                criadoEm: new Date("2025-02-04")
            },
            // ----------------------- FAZENDA BETA
            // AgroBov Genetics -> animais e genética
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                // sku: "TOURO-NEL-001",
                nome: "Touro Nelore Reprodutor - 1 (macho adulto)",
                raca: "Nelore",
                categoria: ["Animal", "Reprodutor"],
                unidadeMedida: UMED.CABECA, // cabeça
                quantidade: "2", // 
                precoUnitario: "15000.00",
                ativo: true,
                criadoEm: new Date("2025-04-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                // sku: "VACA-HOL-001",
                nome: "Vaca Holandesa - Reposição (fêmea adulta pronta para ordenha)",
                raca: "Holandesa",
                categoria: ["Animal", "Reprodução"],
                unidadeMedida: UMED.CABECA,
                quantidade: "5",
                precoUnitario: "6500.00",
                ativo: true,
                criadoEm: new Date("2025-04-02")
            },

            // -------------------- UNIDADE TESTE
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                // sku: "TOURO-NELORE-002",
                nome: "Touro Nelore Reprodutor (macho adulto)",
                raca: "Nelore",
                categoria: ["Animal", "Reprodutor"],
                unidadeMedida: UMED.CABECA,
                quantidade: "1",
                precoUnitario: "16000.00",
                ativo: true,
                criadoEm: new Date("2025-04-10")
            },
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                // sku: "VACA-HOLANDESA-002",
                nome: "Vaca Holandesa (fêmea adulta pronta para ordenha)",
                raca: "Holandesa",
                categoria: ["Animal", "Reprodução"],
                unidadeMedida: UMED.CABECA,
                quantidade: "3", // 10 vacas/mês
                precoUnitario: "7000.00",
                ativo: true,
                criadoEm: new Date("2025-04-11")
            },

            // PRODUTOS
            // Fazenda Alpha → AgroBoi (carne bovina)
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                // sku: "CARNE-DIANT-001",
                nome: "Carne bovina dianteiro (kg)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "1000", // 1000 kg/mês
                precoUnitario: "38.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                // sku: "CARNE-TRASEIRO-001",
                nome: "Carne bovina traseiro (kg)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "800", // 800 kg/mês
                precoUnitario: "45.00",
                ativo: true,
                criadoEm: new Date("2025-01-11")
            },

            // Fazenda Gamma → Casa Útil Mercado (grãos)
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                // sku: "SOJA-SACA-60KG",
                nome: "Soja em saca 60kg",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "500", // 500 sacas/mês
                precoUnitario: "180.00",
                ativo: true,
                criadoEm: new Date("2025-02-01")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                // sku: "MILHO-SACA-60KG",
                nome: "Milho em saca 60kg",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "400", // 400 sacas/mês
                precoUnitario: "150.00",
                ativo: true,
                criadoEm: new Date("2025-02-02")
            },

            // Fazenda Beta → Sabor do Campo Laticínios (laticínios)
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                // sku: "LEITE-PASTEUR-1L",
                nome: "Leite pasteurizado 1L",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.LITRO,
                quantidade: "2000", // 2000 litros/mês
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-03-01")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                // sku: "QUEIJO-MINAS-500G",
                nome: "Queijo Minas Frescal 500g",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.KG,
                quantidade: "300", // 300 kg/mês
                precoUnitario: "25.00",
                ativo: true,
                criadoEm: new Date("2025-03-02")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                // sku: "IOGURTE-NATURAL-170G",
                nome: "Iogurte natural 170g",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1000", // 1000 unidades/mês
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-03-03")
            },

            // Fazenda Delta → VerdeFresco Hortaliças (hortaliças)
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                // sku: "ALFACE-CRESPA-UN",
                nome: "Alface crespa unidade",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1500", // 1500 unidades/mês
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-04-01")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                // sku: "TOMATE-CAIXA-20KG",
                nome: "Tomate caixa 20kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                quantidade: "500", // 500 caixas (20kg cada) ≈ 10 toneladas/mês
                precoUnitario: "80.00",
                ativo: true,
                criadoEm: new Date("2025-04-02")
            },

            // Loja Teste (laticínios e carne) <- fornecedor: Fazenda Teste
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                // sku: "LEITE-TESTE-1L",
                nome: "Leite pasteurizado 1L (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.LITRO,
                quantidade: "500", // 500 litros/mês
                precoUnitario: "4.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                // sku: "QUEIJO-TESTE-500G",
                nome: "Queijo fresco 500g (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.KG,
                quantidade: "100", // 100 kg/mês
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                // sku: "CARNE-BOVINA-TESTE-1KG",
                nome: "Carne bovina corte dianteiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "200", // 200 kg/mês
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                // sku: "CARNE-BOVINA-TESTE-TRASEIRO",
                nome: "Carne bovina corte traseiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "150", // 150 kg/mês
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            }
        ];

        const insumosContratosItens = [
            {
                contratoId: contratoMap["AgroLácteos Suprimentos - Fazenda Beta"],
                raca: null,
                nome: "Culturas lácteas (starter) - pacote",
                categoria: ["Insumo", "Laticínios", "Culturas"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "200",
                precoUnitario: "45.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["AgroLácteos Suprimentos - Fazenda Beta"],
                raca: null,
                nome: "Embalagem PET 1L (unidade)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "5000",
                precoUnitario: "0.85",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["AgroLácteos Suprimentos - Fazenda Beta"],
                raca: null,
                nome: "Etiquetas / rótulos (pacote 1000 uni)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "200",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },

            // ---------------- Fazenda Beta <- Lácteos & Tecnologia Ltda ----------------
            {
                contratoId: contratoMap["Lácteos & Tecnologia Ltda - Fazenda Beta"],
                raca: null,
                nome: "Filtro micro/ultra para pasteurização (unidade)",
                categoria: ["Insumo", "Equipamento", "Processamento"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "10",
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Lácteos & Tecnologia Ltda - Fazenda Beta"],
                raca: null,
                nome: "Produto de limpeza CIP (litro)",
                categoria: ["Insumo", "Higiene"],
                unidadeMedida: UMED.LITRO,
                quantidade: "300",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Lácteos & Tecnologia Ltda - Fazenda Beta"],
                raca: null,
                nome: "Kits de calibragem Válvulas / sensores (unidade)",
                categoria: ["Insumo", "Manutenção", "Peças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "25",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },

            // ---------------- Fazenda Beta <- AgroBov Genetics (genética) ----------------
            {
                contratoId: contratoMap["AgroBov Genetics - Fazenda Beta"],
                raca: "Holandês",
                nome: "Sêmen congelado Holandês (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "120",
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },
            {
                contratoId: contratoMap["AgroBov Genetics - Fazenda Beta"],
                raca: "Holandês",
                nome: "Embrião (Holandês) - unidade",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "30",
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },
            // {
            //     contratoId: contratoMap["AgroBov Genetics - Fazenda Beta"],
            //     raca: null,
            //     nome: "Sessão de inseminação / consultoria (serviço, unidade)",
            //     categoria: ["Serviço", "Genética", "Inseminação"],
            //     unidadeMedida: UMED.UNIDADE,
            //     quantidade: "12",
            //     precoUnitario: "180.00",
            //     ativo: true,
            //     criadoEm: new Date("2024-09-01")
            // },

            // ---------------- Fazenda Beta <- VetBov Serviços e Insumos ----------------
            {
                contratoId: contratoMap["VetBov Serviços e Insumos - Fazenda Beta"],
                raca: null,
                nome: "Vacina contra brucelose (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "200",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["VetBov Serviços e Insumos - Fazenda Beta"],
                raca: null,
                nome: "Antibiótico injetável (frasco)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "100",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["VetBov Serviços e Insumos - Fazenda Beta"],
                raca: null,
                nome: "Seringas agulha (pacote 100 uni)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "60",
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },

            // ---------------- Fazenda Teste <- PastosVerde Nutrição Animal ----------------
            {
                contratoId: contratoMap["PastosVerde Nutrição Animal - Fazenda Teste"],
                raca: null,
                nome: "Feno (fardo 20kg)",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                quantidade: "20000",
                precoUnitario: "0.18",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["PastosVerde Nutrição Animal - Fazenda Teste"],
                raca: null,
                nome: "Silagem (ton)",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "10",
                quantidade: "50000",
                precoUnitario: "0.08",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["PastosVerde Nutrição Animal - Fazenda Teste"],
                raca: null,
                nome: "Suplemento mineral (kg)",
                categoria: ["Insumo", "Suplemento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "5",
                quantidade: "10",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },

            // ---------------- Fazenda Teste <- GenBov Melhoramento Genético ----------------
            {
                contratoId: contratoMap["GenBov Melhoramento Genético - Fazenda Teste"],
                raca: "Angus",
                nome: "Sêmen congelado Angus (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "6",
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2024-11-01")
            },
            // {
            //     contratoId: contratoMap["GenBov Melhoramento Genético - Fazenda Teste"],
            //     raca: "Angus",
            //     nome: "Sessão de inseminação / consultoria (unidade)",
            //     categoria: ["Serviço", "Genética", "Inseminação"],
            //     unidadeMedida: UMED.UNIDADE,
            //     quantidade: "20",
            //     precoUnitario: "150.00",
            //     ativo: true,
            //     criadoEm: new Date("2024-11-01")
            // },

            // ---------------- Fazenda Teste <- AgroVet Saúde Animal ----------------
            {
                contratoId: contratoMap["AgroVet Saúde Animal - Fazenda Teste"],
                raca: null,
                nome: "Vacina múltipla (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "30",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["AgroVet Saúde Animal - Fazenda Teste"],
                raca: null,
                nome: "Antiparasitário oral (unidade embalagem)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "30",
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["AgroVet Saúde Animal - Fazenda Teste"],
                raca: null,
                nome: "Kits de primeiros socorros (unidade)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "10",
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },

            // ---------------- Fazenda Teste <- CampoForte Equipamentos ----------------
            {
                contratoId: contratoMap["CampoForte Equipamentos - Fazenda Teste"],
                raca: null,
                nome: "Balança de piso animal (unidade)",
                categoria: ["Equipamento", "Pesagem"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "4",
                precoUnitario: "7200.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["CampoForte Equipamentos - Fazenda Teste"],
                raca: null,
                nome: "Tronco / brete de contenção (unidade)",
                categoria: ["Equipamento", "Handling"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "3",
                precoUnitario: "2500.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["CampoForte Equipamentos - Fazenda Teste"],
                raca: null,
                nome: "Bebedouro automático (unidade)",
                categoria: ["Equipamento", "Água"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "2",
                precoUnitario: "520.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            }
        ];
        await prisma.contratoItens.createMany({ data: insumosContratosItens, skipDuplicates: true });

        const animaisContratosItens = [
            // ----- Animais / Reprodutores por contrato -----
            // BovinoPrime Reprodutores — Fazenda Alpha
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Touro reprodutor Nelore (adulto)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                quantidade: "8",
                precoUnitario: "3200.00",
                ativo: true,
                criadoEm: new Date("2025-09-01")
            },
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Vaca reprodutora Nelore (multipar)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                quantidade: "25",
                precoUnitario: "2100.00",
                ativo: true,
                criadoEm: new Date("2025-09-02")
            },
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Bezerro reprodutor (macho, desmama)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                quantidade: "12",
                precoUnitario: "850.00",
                ativo: true,
                criadoEm: new Date("2025-09-03")
            },

            // AgroBov Genetics — Fazenda Beta
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Touro reprodutor Holandês (semen/animal)",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                quantidade: "6",
                precoUnitario: "4200.00",
                ativo: true,
                criadoEm: new Date("2025-09-04")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Vaca reprodutora Holandesa (multipar)",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                quantidade: "18",
                precoUnitario: "2400.00",
                ativo: true,
                criadoEm: new Date("2025-09-05")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Jersey",
                nome: "Embrião Jersey (unidade)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.CABECA,
                quantidade: "40",
                precoUnitario: "350.00",
                ativo: true,
                criadoEm: new Date("2025-09-06")
            },

            // GenBov Melhoramento Genético — Fazenda Teste
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Touro reprodutor Angus (adulto, PO)",
                categoria: ["Animal", "Reprodutor", "Bovino", "Genética"],
                unidadeMedida: UMED.CABECA,
                quantidade: "5",
                precoUnitario: "5500.00",
                ativo: true,
                criadoEm: new Date("2025-09-07")
            },
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Vaca reprodutora Angus (multipar, PO)",
                categoria: ["Animal", "Reprodutor", "Bovino", "Genética"],
                unidadeMedida: UMED.CABECA,
                quantidade: "15",
                precoUnitario: "3200.00",
                ativo: true,
                criadoEm: new Date("2025-09-08")
            },
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Sêmen congelado Angus (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.CABECA,
                quantidade: "200",
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2025-09-09")
            }

        ];
        await prisma.contratoItens.createMany({ data: animaisContratosItens, skipDuplicates: true });

        const produtosContratosItens = [
            // ----------------- AgroBoi - Fazenda Alpha -----------------
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Gado bovino vivo (cabeça)",
                categoria: ["Pecuária"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "120",
                precoUnitario: "950.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carcaça bovina inteira (kg)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "3000",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-02")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Miúdos bovinos (kg)",
                categoria: ["Carne", "Miúdos"],
                unidadeMedida: UMED.KG,
                quantidade: "200",
                precoUnitario: "10.00",
                ativo: true,
                criadoEm: new Date("2025-06-03")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro bovino cru (unidade)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "100",
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-06-04")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Ossos bovinos (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                quantidade: "400",
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-06-05")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo bovino bruto (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                quantidade: "300",
                precoUnitario: "6.00",
                ativo: true,
                criadoEm: new Date("2025-06-06")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sangue bovino para subprodutos (L)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.LITRO,
                quantidade: "500",
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-06-07")
            },

            // cortes
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Coxão mole (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "350",
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-06-08")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Alcatra (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "220",
                precoUnitario: "55.00",
                ativo: true,
                criadoEm: new Date("2025-06-09")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Contrafilé (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "260",
                precoUnitario: "60.00",
                ativo: true,
                criadoEm: new Date("2025-06-10")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Costela ripa (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "180",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-06-11")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Maminha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "140",
                precoUnitario: "47.00",
                ativo: true,
                criadoEm: new Date("2025-06-12")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Picanha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                quantidade: "100",
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2025-06-13")
            },

            // processados / industrializados
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne moída (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                quantidade: "800",
                precoUnitario: "25.00",
                ativo: true,
                criadoEm: new Date("2025-06-14")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne para hambúrguer (mistura 80/20) (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                quantidade: "400",
                precoUnitario: "23.00",
                ativo: true,
                criadoEm: new Date("2025-06-15")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Hambúrguer congelado 120g (caixa)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1200",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-16")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Linguiça bovina artesanal (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                quantidade: "250",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-17")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Charque (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                quantidade: "90",
                precoUnitario: "32.00",
                ativo: true,
                criadoEm: new Date("2025-06-18")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne desidratada (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                quantidade: "60",
                precoUnitario: "120.00",
                ativo: true,
                criadoEm: new Date("2025-06-19")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo industrializado (kg)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.KG,
                quantidade: "180",
                precoUnitario: "9.00",
                ativo: true,
                criadoEm: new Date("2025-06-20")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro curtido (m²)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "60",
                precoUnitario: "150.00",
                ativo: true,
                criadoEm: new Date("2025-06-21")
            },

            // ----------------- Casa Útil Mercado - Fazenda Gamma -----------------
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Soja grão (saca 60kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "800",
                precoUnitario: "185.00",
                ativo: true,
                criadoEm: new Date("2025-06-22")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho grão (saca 60kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "700",
                precoUnitario: "155.00",
                ativo: true,
                criadoEm: new Date("2025-06-23")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Trigo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "300",
                precoUnitario: "162.00",
                ativo: true,
                criadoEm: new Date("2025-06-24")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão carioca (saca 30kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "180",
                precoUnitario: "225.00",
                ativo: true,
                criadoEm: new Date("2025-06-25")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Sorgo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                quantidade: "140",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-06-26")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Casca de soja (subproduto) (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                quantidade: "2000",
                precoUnitario: "0.80",
                ativo: true,
                criadoEm: new Date("2025-06-27")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de soja bruto (saca 40kg)",
                categoria: ["Derivados", "Rações"],
                unidadeMedida: UMED.SACA,
                quantidade: "600",
                precoUnitario: "100.00",
                ativo: true,
                criadoEm: new Date("2025-06-28")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja bruto (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                quantidade: "3000",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-29")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja refinado (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                quantidade: "2500",
                precoUnitario: "7.00",
                ativo: true,
                criadoEm: new Date("2025-06-30")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "4000",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-01")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 5kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1200",
                precoUnitario: "14.00",
                ativo: true,
                criadoEm: new Date("2025-07-02")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho triturado (ração) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                quantidade: "800",
                precoUnitario: "78.00",
                ativo: true,
                criadoEm: new Date("2025-07-03")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Ração de engorda (mistura milho+farelo) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                quantidade: "700",
                precoUnitario: "92.00",
                ativo: true,
                criadoEm: new Date("2025-07-04")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farinha de trigo 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "2500",
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-05")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de trigo (saca 25kg)",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                quantidade: "400",
                precoUnitario: "68.00",
                ativo: true,
                criadoEm: new Date("2025-07-06")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão limpo e selecionado 1kg (pacote)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1800",
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-07")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Grãos embalados a vácuo (diversos) (unidade)",
                categoria: ["Grãos", "Embalados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1200",
                precoUnitario: "6.00",
                ativo: true,
                criadoEm: new Date("2025-07-08")
            },

            // ----------------- Sabor do Campo Laticínios - Fazenda Beta -----------------
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite cru tipo A (L)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.LITRO,
                quantidade: "5000",
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-07-09")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite cru tipo B (L)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.LITRO,
                quantidade: "2000",
                precoUnitario: "0.95",
                ativo: true,
                criadoEm: new Date("2025-07-10")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Nata / creme do leite (kg)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.KG,
                quantidade: "300",
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-07-11")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Soro de leite (L)",
                categoria: ["Laticínios", "Subprodutos"],
                unidadeMedida: UMED.LITRO,
                quantidade: "1200",
                precoUnitario: "0.30",
                ativo: true,
                criadoEm: new Date("2025-07-12")
            },

            // beneficiados / embalagens
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "3500",
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-13")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 2L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "1200",
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-14")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite UHT 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "2000",
                precoUnitario: "4.20",
                ativo: true,
                criadoEm: new Date("2025-07-15")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite integral 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "1800",
                precoUnitario: "4.80",
                ativo: true,
                criadoEm: new Date("2025-07-16")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite desnatado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "900",
                precoUnitario: "4.60",
                ativo: true,
                criadoEm: new Date("2025-07-17")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite sem lactose 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "400",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-07-18")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Creme de leite 200ml",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "900",
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-07-19")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "700",
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2025-07-20")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 500g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "320",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-07-21")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Ricota fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                quantidade: "120",
                precoUnitario: "26.00",
                ativo: true,
                criadoEm: new Date("2025-07-22")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Minas padrão (kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                quantidade: "250",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-07-23")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (peça 3kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "80",
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-07-24")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (barra 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                quantidade: "220",
                precoUnitario: "38.00",
                ativo: true,
                criadoEm: new Date("2025-07-25")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo parmesão (peça 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "60",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-07-26")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte natural 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1600",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-27")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor morango 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1200",
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-28")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor coco 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "800",
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-29")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte garrafa 1L",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.LITRO,
                quantidade: "400",
                precoUnitario: "9.50",
                ativo: true,
                criadoEm: new Date("2025-07-30")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Requeijão cremoso 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "900",
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-31")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite pastoso 400g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "420",
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-08-01")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite em barra 300g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "260",
                precoUnitario: "15.00",
                ativo: true,
                criadoEm: new Date("2025-08-02")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Kefir líquido 1L",
                categoria: ["Laticínios", "Fermentados"],
                unidadeMedida: UMED.LITRO,
                quantidade: "220",
                precoUnitario: "7.50",
                ativo: true,
                criadoEm: new Date("2025-08-03")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Coalhada fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                quantidade: "140",
                precoUnitario: "20.00",
                ativo: true,
                criadoEm: new Date("2025-08-04")
            },

            // ----------------- VerdeFresco Hortaliças - Fazenda Delta -----------------
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface crespa (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "2500",
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-08-05")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface americana (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "1200",
                precoUnitario: "3.00",
                ativo: true,
                criadoEm: new Date("2025-08-06")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface roxa (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "600",
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-08-07")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Rúcula (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "800",
                precoUnitario: "2.80",
                ativo: true,
                criadoEm: new Date("2025-08-08")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Couve manteiga (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "700",
                precoUnitario: "2.20",
                ativo: true,
                criadoEm: new Date("2025-08-09")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate caixa 20kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                quantidade: "600",
                precoUnitario: "80.00",
                ativo: true,
                criadoEm: new Date("2025-08-10")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate cereja caixa 5kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                quantidade: "200",
                precoUnitario: "65.00",
                ativo: true,
                criadoEm: new Date("2025-08-11")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Pepino japonês (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                quantidade: "900",
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-08-12")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Abobrinha italiana (kg)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                quantidade: "400",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-08-13")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Cenoura (kg)",
                categoria: ["Hortaliças", "Raízes"],
                unidadeMedida: UMED.KG,
                quantidade: "700",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-08-14")
            },

            // ----------------- Loja Teste - Fazenda Teste (manter itens de teste completos) -----------------
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Leite pasteurizado 1L (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.LITRO,
                quantidade: "500",
                precoUnitario: "4.00",
                ativo: true,
                criadoEm: new Date("2025-08-15")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Queijo fresco 500g (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.KG,
                quantidade: "100",
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2025-08-16")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte dianteiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "200",
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-08-17")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte traseiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                quantidade: "150",
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2025-08-18")
            }
        ];
        await prisma.contratoItens.createMany({ data: produtosContratosItens, skipDuplicates: true });
        const fornecedorItemsDb = await prisma.contratoItens.findMany();

        // ===== 8. PEDIDOS BASEADOS NOS CONTRATOS =====
        const pedidosSeed = [
            // Fazenda Beta <- AgroBov Genetics (frequencia: TRIMESTRAL)
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                origemFornecedorExternoId: fornecedorMap["AgroBov Genetics"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // Próximo envio = dataEnvio base 2024-09-03T06:00:00Z + 3 meses => 2024-12-03T06:00:00Z
                dataPedido: new Date("2024-12-01T09:00:00.000Z"),
                dataEnvio: new Date("2024-12-03T06:00:00.000Z"),
                dataRecebimento: new Date("2024-12-04T06:00:00.000Z"),
                documentoReferencia: "Romaneio-AGB-20241203",
                observacoes: "Pedido automático gerado pelo seed — genética (touro/vacas/embriões).",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- VetBov Serviços e Insumos (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                origemFornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-08-05T07:00:00Z + 1 mês => 2024-09-05T07:00:00Z
                dataPedido: new Date("2024-09-03T09:00:00.000Z"),
                dataEnvio: new Date("2024-09-05T07:00:00.000Z"),
                dataRecebimento: new Date("2024-09-06T07:00:00.000Z"),
                documentoReferencia: "Nota-VET-20240905",
                observacoes: "Vacinas e medicamentos mensais",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- AgroLácteos Suprimentos (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                origemFornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-07-18T08:00:00Z + 1 mês => 2024-08-18T08:00:00Z
                dataPedido: new Date("2024-08-15T09:00:00.000Z"),
                dataEnvio: new Date("2024-08-18T08:00:00.000Z"),
                dataRecebimento: new Date("2024-08-19T08:00:00.000Z"),
                documentoReferencia: "Romaneio-AGL-20240818",
                observacoes: "Insumos para laticínios (culturas, embalagens)",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- Lácteos & Tecnologia Ltda (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                origemFornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-07-22T07:30:00Z + 1 mês => 2024-08-22T07:30:00Z
                dataPedido: new Date("2024-08-20T09:00:00.000Z"),
                dataEnvio: new Date("2024-08-22T07:30:00.000Z"),
                dataRecebimento: new Date("2024-08-23T07:30:00.000Z"),
                documentoReferencia: "Romaneio-LAT-20240822",
                observacoes: "Equipamentos / starters / enzimas",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- PastosVerde Nutrição Animal (MENSAL)
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                origemFornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-10-03T09:00:00Z + 1 mês => 2024-11-03T09:00:00Z
                dataPedido: new Date("2024-11-01T09:00:00.000Z"),
                dataEnvio: new Date("2024-11-03T09:00:00.000Z"),
                dataRecebimento: new Date("2024-11-04T09:00:00.000Z"),
                documentoReferencia: "Romaneio-PVS-20241103",
                observacoes: "Silagem / feno mensais",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- GenBov Melhoramento Genético (TRIMESTRAL)
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                origemFornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-11-04T08:30:00Z + 3 meses => 2025-02-04T08:30:00Z
                dataPedido: new Date("2025-02-02T09:00:00.000Z"),
                dataEnvio: new Date("2025-02-04T08:30:00.000Z"),
                dataRecebimento: new Date("2025-02-05T08:30:00.000Z"),
                documentoReferencia: "Romaneio-GEN-20250204",
                observacoes: "Inseminação / material genético (trimestral)",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- AgroVet Saúde Animal (MENSAL)
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                origemFornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-12-05T07:45:00Z + 1 mês => 2025-01-05T07:45:00Z
                dataPedido: new Date("2024-12-30T09:00:00.000Z"),
                dataEnvio: new Date("2025-01-05T07:45:00.000Z"),
                dataRecebimento: new Date("2025-01-06T07:45:00.000Z"),
                documentoReferencia: "Romaneio-AGV-20250105",
                observacoes: "Vacinas e medicamentos",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- CampoForte Equipamentos (SEMESTRAL)
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                origemFornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2025-01-12T10:00:00Z + 6 meses => 2025-07-12T10:00:00Z
                dataPedido: new Date("2025-07-10T09:00:00.000Z"),
                dataEnvio: new Date("2025-07-12T10:00:00.000Z"),
                dataRecebimento: new Date("2025-07-13T10:00:00.000Z"),
                documentoReferencia: "Romaneio-CFE-20250712",
                status: SPEDIDO.ENTREGUE,
                observacoes: "Equipamentos (entrega semestral)"
            }
        ];
        await prisma.pedido.createMany({ data: pedidosSeed, skipDuplicates: true });

        async function seedPedidoItems(prisma) {
            // helper: encontra pedido pelo documentoReferencia
            async function findPedidoByDoc(docRef) {
                return prisma.pedido.findFirst({ where: { documentoReferencia: docRef } });
            }

            // helper: encontra fornecedor/contrato item pelo nome exato
            async function findContratoItemByName(nome) {
                return prisma.contratoItens.findFirst({ where: { nome } });
            }

            // -- resolvemos os pedidos existentes pelo documentoReferencia que você usou --
            const pedidoAgroBov = await findPedidoByDoc("Romaneio-AGB-20241203");
            const pedidoVetBov = await findPedidoByDoc("Nota-VET-20240905");
            const pedidoAgroLacteos = await findPedidoByDoc("Romaneio-AGL-20240818");
            const pedidoLaticosTec = await findPedidoByDoc("Romaneio-LAT-20240822");
            const pedidoPastosVerde = await findPedidoByDoc("Romaneio-PVS-20241103");
            const pedidoGenBov = await findPedidoByDoc("Romaneio-GEN-20250204");
            const pedidoAgroVet = await findPedidoByDoc("Romaneio-AGV-20250105");
            const pedidoCampoForte = await findPedidoByDoc("Romaneio-CFE-20250712");

            // checagem rápida (falha explícita se algum pedido não for encontrado)
            const missing = [
                ["AGROBOV", pedidoAgroBov],
                ["VETBOV", pedidoVetBov],
                ["AGROLÁCTEOS", pedidoAgroLacteos],
                ["LÁCTEOS TEC", pedidoLaticosTec],
                ["PASTOSVERDE", pedidoPastosVerde],
                ["GENBOV", pedidoGenBov],
                ["AGROVET", pedidoAgroVet],
                ["CAMPOFORTE", pedidoCampoForte],
            ].filter(([k, v]) => !v).map(([k]) => k);

            if (missing.length) {
                console.warn("Aviso: não encontrou pedidos para:", missing.join(", "),
                    "\nVerifique documentoReferencia nos pedidos antes de criar itens.");
                // você pode optar por continuar; aqui continuarei mas itens ligados a pedidos não encontrados serão omitidos
            }

            // -- função utilitária para criar entrada de item (busca fornecedorItem para pegar id) --
            async function makeItem(pedido, itemNome, quantidade, unidadeMedida, precoUnitario, observacoes = null) {
                if (!pedido) return null;
                const contratoItem = await findContratoItemByName(itemNome);
                if (!contratoItem) {
                    console.warn("ContratoItem não encontrado para:", itemNome);
                    return null;
                }
                const custoTotal = (Number(quantidade) * Number(precoUnitario)).toFixed(2);
                return {
                    pedidoId: pedido.id,
                    fornecedorItemId: contratoItem.id,
                    quantidade: String(quantidade),
                    unidadeMedida,
                    precoUnitario: String(precoUnitario),
                    custoTotal: String(custoTotal),
                    observacoes
                };
            }

            // === Definição dos itens por pedido (quantidades propostas) ===
            const itensPromises = [

                // --- AgroBov Genetics (Fazenda Beta) - animais/genética ---
                makeItem(pedidoAgroBov, "Touro reprodutor Holandês (semen/animal)", 2, UMED.CABECA, "4200.00"),
                makeItem(pedidoAgroBov, "Vaca reprodutora Holandesa (multipar)", 5, UMED.CABECA, "2400.00"),
                makeItem(pedidoAgroBov, "Embrião Jersey (unidade)", 10, UMED.UNIDADE, "350.00"),
                makeItem(pedidoAgroBov, "Sêmen congelado Holandês (ampola)", 20, UMED.UNIDADE, "85.00"),
                makeItem(pedidoAgroBov, "Embrião (Holandês) - unidade", 5, UMED.UNIDADE, "420.00"),
                makeItem(pedidoAgroBov, "Sessão de inseminação / consultoria (serviço, unidade)", 3, UMED.UNIDADE, "180.00"),

                // --- VetBov Serviços e Insumos (Fazenda Beta) - sanidade ---
                makeItem(pedidoVetBov, "Vacina contra brucelose (dose)", 100, UMED.UNIDADE, "6.50"),
                makeItem(pedidoVetBov, "Antibiótico injetável (frasco)", 20, UMED.UNIDADE, "28.00"),
                makeItem(pedidoVetBov, "Seringas agulha (pacote 100 uni)", 10, UMED.UNIDADE, "12.00"),

                // --- AgroLácteos Suprimentos (Fazenda Beta) - insumos laticínios ---
                makeItem(pedidoAgroLacteos, "Culturas lácteas (starter) - pacote", 50, UMED.UNIDADE, "45.00"),
                makeItem(pedidoAgroLacteos, "Embalagem PET 1L (unidade)", 1000, UMED.UNIDADE, "0.85"),
                makeItem(pedidoAgroLacteos, "Etiquetas / rótulos (pacote 1000 uni)", 2, UMED.UNIDADE, "30.00"),

                // --- Lácteos & Tecnologia Ltda (Fazenda Beta) - equipamentos / consumíveis ---
                makeItem(pedidoLaticosTec, "Filtro micro/ultra para pasteurização (unidade)", 1, UMED.UNIDADE, "420.00"),
                makeItem(pedidoLaticosTec, "Produto de limpeza CIP (litro)", 50, UMED.LITRO, "6.50"),
                makeItem(pedidoLaticosTec, "Kits de calibragem Válvulas / sensores (unidade)", 2, UMED.UNIDADE, "95.00"),

                // --- PastosVerde (Fazenda Teste) - forragem ---
                makeItem(pedidoPastosVerde, "Silagem (kg)", 5000, UMED.KG, "0.08"), // ex.: 5t
                makeItem(pedidoPastosVerde, "Feno (fardo 20kg)", 300, UMED.UNIDADE, "95.00"),
                makeItem(pedidoPastosVerde, "Suplemento mineral (kg)", 500, UMED.KG, "3.20"),

                // --- GenBov Melhoramento Genético (Fazenda Teste) - genética ---
                makeItem(pedidoGenBov, "Sêmen congelado Angus (ampola)", 30, UMED.UNIDADE, "75.00"),
                makeItem(pedidoGenBov, "Sessão de inseminação / consultoria (unidade)", 6, UMED.UNIDADE, "150.00"),

                // --- AgroVet Saúde Animal (Fazenda Teste) - sanidade ---
                makeItem(pedidoAgroVet, "Vacina múltipla (dose)", 100, UMED.UNIDADE, "5.50"),
                makeItem(pedidoAgroVet, "Antiparasitário oral (unidade embalagem)", 50, UMED.UNIDADE, "22.00"),
                makeItem(pedidoAgroVet, "Kits de primeiros socorros (unidade)", 5, UMED.UNIDADE, "48.00"),

                // --- CampoForte Equipamentos (Fazenda Teste) - equipamentos (semestre) ---
                makeItem(pedidoCampoForte, "Balança de piso animal (unidade)", 1, UMED.UNIDADE, "7200.00"),
                makeItem(pedidoCampoForte, "Tronco / brete de contenção (unidade)", 1, UMED.UNIDADE, "2500.00"),
                makeItem(pedidoCampoForte, "Bebedouro automático (unidade)", 4, UMED.UNIDADE, "520.00")
            ];

            // resolve todas as promises (algumas may return null if pedido/item não encontrado)
            const itensResolved = (await Promise.all(itensPromises)).filter(Boolean);

            if (!itensResolved.length) {
                console.warn("Nenhum PedidoItem a inserir (verifique pedidos / nomes dos ContratoItens).");
                return;
            }

            // Inserir os itens com createMany (skip duplicates)
            await prisma.pedidoItem.createMany({
                data: itensResolved,
                skipDuplicates: true
            });

            console.log("PedidoItems inseridos:", itensResolved.length);
        }

        await seedPedidoItems(prisma);


        function gerarInsumos({ nome, prefixoSku, quantidade, unidadeId, fornecedorId, categoria, unidadeBase, dataEntrada }) {
            const itens = [];

            for (let i = 1; i <= quantidade; i++) {
                itens.push({ nome, sku: `${prefixoSku}-${String(i).padStart(3, "0")}`, unidadeId, categoria, unidadeBase, fornecedorId, ativo: true, observacoes: null, dataEntrada, dataSaida: null, });
            }
            return itens;
        }

        // AgroLácteos Suprimentos - Fazenda Beta
        const insumosData = gerarInsumos({ nome: "Culturas lácteas (starter) - pacote", prefixoSku: "INS-FAZBET-CLA", quantidade: 200, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["AgroLácteos Suprimentos"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: new Date("2024-08-19T08:00:00.000Z") });

        const embalagensPET = gerarInsumos({ nome: "Embalagem PET 1L (unidade)", prefixoSku: "INS-FAZBET-EP1", quantidade: 5000, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["AgroLácteos Suprimentos"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: new Date("2024-08-19T08:00:00.000Z") });

        const etiquetasRotulos = gerarInsumos({ nome: "Etiquetas / rótulos (pacote 1000 uni)", prefixoSku: "INS-FAZBET-ETQ", quantidade: 200, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["AgroLácteos Suprimentos"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: new Date("2024-08-19T08:00:00.000Z") });

        // ---------------- Fazenda Beta <- Lácteos & Tecnologia Ltda ----------------
        const dataEntradaPedidoLaticos = new Date("2024-08-23T07:30:00.000Z"); // dataRecebimento do pedido Lácteos & Tecnologia Ltda
        // 1) Filtro micro/ultra para pasteurização (10 unidades)
        const filtrosPasteurizacao = gerarInsumos({ nome: "Filtro micro/ultra para pasteurização (unidade)", prefixoSku: "INS-FAZBET-FILT", quantidade: 10, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["Lácteos & Tecnologia Ltda"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaPedidoLaticos });
        // 2) Produto de limpeza CIP (300 litros)
        const produtoCIP = gerarInsumos({ nome: "Produto de limpeza CIP (litro)", prefixoSku: "INS-FAZBET-CIP", quantidade: 300, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["Lácteos & Tecnologia Ltda"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.LITRO, dataEntrada: dataEntradaPedidoLaticos });
        // 3) Kits de calibragem Válvulas / sensores (25 unidades)
        const kitsCalibragem = gerarInsumos({ nome: "Kits de calibragem Válvulas / sensores (unidade)", prefixoSku: "INS-FAZBET-KIT", quantidade: 25, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["Lácteos & Tecnologia Ltda"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaPedidoLaticos });

        // ---------------- Fazenda Beta <- AgroBov Genetics (genética) ----------------
        const dataEntradaAgroBov = new Date("2024-12-04T06:00:00.000Z");
        // --- 1) Sêmen congelado Holandês (120 unidades / ampolas) ---
        const semenHolandes = gerarInsumos({ nome: "Sêmen congelado Holandês (ampola)", prefixoSku: "INS-AGB-SEM", quantidade: 120, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["AgroBov Genetics"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaAgroBov });
        // --- 2) Embrião (Holandês) - unidade (30 unidades) ---
        const embriaoHolandes = gerarInsumos({ nome: "Embrião (Holandês) - unidade", prefixoSku: "INS-AGB-EMB", quantidade: 30, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["AgroBov Genetics"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaAgroBov });

        // Fazenda Beta <- VetBov Serviços e Insumos
        const dataEntradaVetBov = new Date("2024-09-05T07:00:00.000Z");
        const vacinaBrucelose = gerarInsumos({ nome: "Vacina contra brucelose (dose)", prefixoSku: "INS-VTB-VAC", quantidade: 200, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["VetBov Serviços e Insumos"], categoria: CtgInsumo.VACINA, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaVetBov });
        // --- 2) Antibiótico injetável (frasco) — 100 unidades ---
        const antibioticoInjetavel = gerarInsumos({ nome: "Antibiótico injetável (frasco)", prefixoSku: "INS-VTB-ANT", quantidade: 100, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["VetBov Serviços e Insumos"], categoria: CtgInsumo.MEDICAMENTO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaVetBov });
        // --- 3) Seringas agulha (pacote 100 uni) — 60 unidades ---
        const seringasAgulha = gerarInsumos({
            nome: "Seringas agulha (pacote 100 uni)",
            prefixoSku: "INS-VTB-SRG", quantidade: 60, unidadeId: unidadeMap["Fazenda Beta"], fornecedorId: fornecedorMap["VetBov Serviços e Insumos"], categoria: CtgInsumo.OUTROS, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaVetBov
        });

        // ---------------- Fazenda Teste <- PastosVerde Nutrição Animal ----------------
        const dataEntradaPastosVerde = new Date("2024-11-04T09:00:00.000Z");
        const fenoFardos = gerarInsumos({ nome: "Feno (fardo 20kg)", prefixoSku: "INS-TST-FENO", quantidade: 20000, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["PastosVerde Nutrição Animal"], categoria: CtgInsumo.FORRAGEM, unidadeBase: UMED.KG, dataEntrada: dataEntradaPastosVerde });

        const silagem = gerarInsumos({ nome: "Silagem (ton)", prefixoSku: "INS-TST-SILG", quantidade: 50000, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["PastosVerde Nutrição Animal"], categoria: CtgInsumo.FORRAGEM, unidadeBase: UMED.KG, dataEntrada: dataEntradaPastosVerde });

        const suplementoMineral = gerarInsumos({ nome: "Suplemento mineral (kg)", prefixoSku: "INS-TST-SUPM", quantidade: 2500, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["PastosVerde Nutrição Animal"], categoria: CtgInsumo.SUPLEMENTO, unidadeBase: UMED.KG, dataEntrada: dataEntradaPastosVerde });
        // ---------------- Fazenda Teste <- GenBov Melhoramento Genético ----------------
        const dataEntradaGenBov = new Date("2025-02-05T08:30:00.000Z");
        const semenAngus = gerarInsumos({ nome: "Sêmen congelado Angus (ampola)", prefixoSku: "INS-TST-GNB-SEM", quantidade: 160, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["GenBov Melhoramento Genético"], categoria: CtgInsumo.MATERIALGENETICO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaGenBov });

        const sessoesGenetica = gerarInsumos({ nome: "Sessão de inseminação / consultoria (unidade)", prefixoSku: "INS-TST-GNB-SVC", quantidade: 20, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["GenBov Melhoramento Genético"], categoria: CtgInsumo.SERVICO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaGenBov });

        // ---------------- Fazenda Teste <- AgroVet Saúde Animal ----------------
        const dataEntradaAgroVet = new Date("2025-01-06T07:45:00.000Z");
        const vacinaMultipla = gerarInsumos({ nome: "Vacina múltipla (dose)", prefixoSku: "INS-TST-AGV-VAC", quantidade: 300, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["AgroVet Saúde Animal"], categoria: CtgInsumo.VACINA, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaAgroVet });

        const antiparasitario = gerarInsumos({
            nome: "Antiparasitário oral (unidade embalagem)",
            prefixoSku: "INS-TST-AGV-ANT", quantidade: 180, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["AgroVet Saúde Animal"], categoria: CtgInsumo.MEDICAMENTO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaAgroVet
        });

        const kitsPrimeirosSocorros = gerarInsumos({ nome: "Kits de primeiros socorros (unidade)", prefixoSku: "INS-TST-AGV-KIT", quantidade: 30, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["AgroVet Saúde Animal"], categoria: CtgInsumo.MATERIALSANITARIO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaAgroVet });

        // ---------------- Fazenda Teste <- CampoForte Equipamentos ----------------
        const dataEntradaCampoForte = new Date("2025-07-13T10:00:00.000Z");
        const balancasPiso = gerarInsumos({ nome: "Balança de piso animal (unidade)", prefixoSku: "INS-TST-CF-BAL", quantidade: 4, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["CampoForte Equipamentos"], categoria: CtgInsumo.EQUIPAMENTO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaCampoForte });

        const troncosBrete = gerarInsumos({ nome: "Tronco / brete de contenção (unidade)", prefixoSku: "INS-TST-CF-TRN", quantidade: 6, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["CampoForte Equipamentos"], categoria: CtgInsumo.HARDWARE, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaCampoForte });

        const bebedouros = gerarInsumos({
            nome: "Bebedouro automático (unidade)",
            prefixoSku: "INS-TST-CF-BEB", quantidade: 12, unidadeId: unidadeMap["Fazenda Teste"], fornecedorId: fornecedorMap["CampoForte Equipamentos"], categoria: CtgInsumo.EQUIPAMENTO, unidadeBase: UMED.UNIDADE, dataEntrada: dataEntradaCampoForte
        });

        await prisma.insumo.createMany({
            data: [
                ...insumosData,
                ...embalagensPET,
                ...etiquetasRotulos,
                ...filtrosPasteurizacao,
                ...produtoCIP,
                ...kitsCalibragem,
                ...semenHolandes,
                ...embriaoHolandes,
                ...vacinaBrucelose,
                ...antibioticoInjetavel,
                ...seringasAgulha,
                ...fenoFardos,
                ...silagem,
                ...suplementoMineral,
                ...semenAngus,
                ...sessoesGenetica,
                ...vacinaMultipla,
                ...antiparasitario,
                ...kitsPrimeirosSocorros,
                ...balancasPiso,
                ...troncosBrete,
                ...bebedouros
            ],
            skipDuplicates: true
        });





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