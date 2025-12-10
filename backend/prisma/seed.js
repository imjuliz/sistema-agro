import bcrypt from "bcryptjs";
import 'dotenv/config'
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import * as pkg from "./generated/client.js";

// Extrai enums
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, tipoTransporte, StatusUnidade, StatusFornecedor, StatusQualidade, TipoMovimento, TipoAtvd, TipoAnimais, StatusVenda, StatusAtvdAnimalia, TipoAnimalia, StatusPedido, StatusProducao, StatusPlantacao, CategoriaInsumo, StatusLote, ContaStatus, TipoFormaAquisicao, EspecieAnimal, SexoAnimal } = pkg;

// Fallbacks para enums
const TP = TipoPerfil ?? { GERENTE_MATRIZ: "GERENTE_MATRIZ", GERENTE_FAZENDA: "GERENTE_FAZENDA", GERENTE_LOJA: "GERENTE_LOJA", FUNCIONARIO_LOJA: "FUNCIONARIO_LOJA", FUNCIONARIO_FAZENDA: "FUNCIONARIO_FAZENDA" };
const TU = TipoUnidade ?? { MATRIZ: "MATRIZ", FAZENDA: "FAZENDA", LOJA: "LOJA" };
const TL = TipoLote ?? { SOJA: "SOJA", LEITE: "LEITE", BOVINOS: "BOVINOS", SUINOS: "SUINOS", OVINOS: "OVINOS", AVES: "AVES", EQUINO: "EQUINO", CAPRINOS: "CAPRINOS", OUTRO: "OUTRO", LEGUME: "LEGUME", FRUTA: "FRUTA", VERDURA: "VERDURA", GRAOS: "GRAOS", PLANTIO: "PLANTIO" };
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
const CtgInsumo = CategoriaInsumo ?? { SEMENTE: "SEMENTE", FERTILIZANTE: "FERTILIZANTE", DEFENSIVO: "DEFENSIVO", RACAO: "RACAO", MEDICAMENTO: "MEDICAMENTO", SUPLEMENTO: "SUPLEMENTO", VACINA: "VACINA", OUTROS: "OUTROS", LATICINIOS: "LATICINIOS" };
const SLOTE = StatusLote ?? { SEMEADO: "SEMEADO", CRESCIMENTO: "CRESCIMENTO", COLHEITA: "COLHEITA", COLHIDO: "COLHIDO", RECEBIDO: "RECEBIDO", EM_QUARENTENA: "EM_QUARENTENA", AVALIACAO_SANITARIA: "AVALIACAO_SANITARIA", EM_CRESCIMENTO: "EM_CRESCIMENTO", EM_ENGORDA: "EM_ENGORDA", EM_REPRODUCAO: "EM_REPRODUCAO", LACTACAO: "LACTACAO", ABATE: "ABATE", PENDENTE: "PENDENTE", PRONTO: "PRONTO", BLOQUEADO: "BLOQUEADO", VENDIDO: "VENDIDO" }
const SCONTA = ContaStatus ?? { PENDENTE: "PENDENTE", PAGA: "PAGA", VENCIDA: "VENCIDA", CANCELADA: "CANCELADA" }
const ESPANIMAL = EspecieAnimal ?? { BOVINO: "BOVINO", BUBALINO: "BUBALINO", CAPRINO: "CAPRINO", OVINO: "OVINO", SUINO: "SUINO", EQUINO: "EQUINO", MUAR: "MUAR", AVE: "AVE", GALINHA: "GALINHA", PERU: "PERU", PATO: "PATO", MARRECO: "MARRECO", GANSO: "GANSO", CODORNA: "CODORNA", COELHO: "COELHO", PEIXE: "PEIXE", CAMARAO: "CAMARAO", ABELHA: "ABELHA", OUTRO: "OUTRO" }
const TAQUISICAO = TipoFormaAquisicao ?? { COMPRA: "COMPRA", TRANSFERENCIA: "TRANSFERENCIA", DOACAO: "DOACAO", NATURAL: "NATURAL", OUTRO: "OUTRO" }
const SXANIMAL = SexoAnimal ?? { MACHO: "MACHO", FEMEA: "FEMEA" }

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
            { nome: "RuralTech", endereco: "Av. Empresarial, 1000", tipo: TU.MATRIZ, cidade: "São Paulo", estado: "SP", cep: "01000-000", latitude: -23.55052, longitude: -46.633308, cnpj: "12345678000101", email: "ruraltech052@gmail.com", telefone: "1140000001", status: SUNI.ATIVA, },
            { nome: "VerdeFresco Hortaliças", endereco: "Av. Central, 1", tipo: TU.LOJA, cidade: "São Paulo", estado: "SP", cep: "01001-001", latitude: -23.5450, longitude: -46.6340, cnpj: "12345678000202", email: "lojacentral@empresa.com", telefone: "1140000002", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T19:00:00Z'), status: SUNI.ATIVA, },
            { nome: "AgroBoi", endereco: "Rua Norte, 23", tipo: TU.LOJA, cidade: "Guarulhos", estado: "SP", cep: "07010-000", latitude: -23.4628, longitude: -46.5333, cnpj: "12345678000303", email: "lojanorte@empresa.com", telefone: "1140000003", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T18:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Casa Útil Mercado", endereco: "Av. Sul, 45", tipo: TU.LOJA, cidade: "Santo André", estado: "SP", cep: "09010-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678000404", email: "lojasul@empresa.com", telefone: "1140000004", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Sabor do Campo Laticínios", endereco: "Praça Leste, 10", tipo: TU.LOJA, cidade: "São Bernardo", estado: "SP", cep: "09810-000", latitude: -23.6916, longitude: -46.5644, cnpj: "12345678000505", email: "lojaleste@empresa.com", telefone: "1140000005", horarioAbertura: new Date('1970-01-01T09:30:00Z'), horarioFechamento: new Date('1970-01-01T19:30:00Z'), status: SUNI.ATIVA, },
            { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 100", tipo: TU.FAZENDA, cidade: "Campinas", estado: "SP", cep: "13010-000", areaTotal: 1500.5, areaProdutiva: 1200.3, latitude: -22.9099, longitude: -47.0626, cnpj: "12345678100110", email: "fazendaalpha@empresa.com", telefone: "1930001001", status: SUNI.ATIVA, focoProdutivo: "gado" },
            { nome: "Fazenda Gamma", endereco: "Rod. BR-101, km 150", tipo: TU.FAZENDA, cidade: "Ribeirão Preto", estado: "SP", cep: "14010-000", areaTotal: 980.75, areaProdutiva: 760.0, latitude: -21.1775, longitude: -47.8103, cnpj: "12345678100220", email: "fazendabeta@empresa.com", telefone: "1630001002", status: SUNI.ATIVA, focoProdutivo: "grãos e cereais" },
            { nome: "Fazenda Beta", endereco: "Estrada Rural, 77", tipo: TU.FAZENDA, cidade: "Piracicaba", estado: "SP", cep: "13400-000", areaTotal: 420.0, areaProdutiva: 365.25, latitude: -22.7127, longitude: -47.6476, cnpj: "12345678100330", email: "fazendagamma@empresa.com", telefone: "1930001003", status: SUNI.ATIVA, focoProdutivo: "laticínios e gado" },
            { nome: "Fazenda Delta", endereco: "Estrada Rural, 88", tipo: TU.FAZENDA, cidade: "Limeira", estado: "SP", cep: "13480-000", areaTotal: 600.0, areaProdutiva: 480.5, latitude: -22.5641, longitude: -47.4019, cnpj: "12345678100440", email: "fazendadelta@empresa.com", telefone: "1930001004", status: SUNI.ATIVA, focoProdutivo: "hortaliças e vegetais" },
            { nome: "Fazenda Teste", endereco: "Rua Teste, 9", tipo: TU.FAZENDA, cidade: "Itu", estado: "SP", cep: "13300-000", areaTotal: 50.0, areaProdutiva: 40.0, latitude: -23.2646, longitude: -47.2995, cnpj: "12345678100550", email: "teste@empresa.com", telefone: "1140000099", status: SUNI.ATIVA, focoProdutivo: "laticínios e gado" },
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
            { nome: "Renato Martins", email: "renato.martins@gmail.com", senha: senhaHash, telefone: "11987652001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            { nome: "Maria Del Rey", email: "mebdelrey@gmail.com", senha: senhaHash, telefone: "11987653001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Richard Souza", email: "richardrrggts@gmail.com", senha: senhaHash, telefone: "11916694683", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            // gerente da loja
            { nome: "Bruna Carvalho", email: "bru.carvalho@gmail.com", senha: senhaHash, telefone: "11988821353", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            { nome: "Roberto Barros", email: "robertbarros01@gmail.com", senha: senhaHash, telefone: "11916683574", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Lorena Oshiro", email: "lorenaoshiro2007@gmail.com", senha: senhaHash, telefone: "11944556677", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
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
            data: { gerenteId: usuarioMap["Renato Martins"], matrizId: unidadeMap["RuralTech"] },
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
            data: { gerenteId: usuarioMap["Lorena Oshiro"], matrizId: unidadeMap["RuralTech"] },
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
        // const contratosData = [
        //     // ----------------------------------------------------------
        //     // FAZENDAS
        //     // externos -> Faz. Alpha
        //     {
        //         unidadeId: unidadeMap["Fazenda Alpha"],
        //         fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"],
        //         dataInicio: new Date("2024-01-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-01-05T08:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "30",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Alpha"],
        //         fornecedorExternoId: fornecedorMap["NutriBov Distribuidora"],
        //         dataInicio: new Date("2024-02-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-02-03T07:30:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "15",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Alpha"],
        //         fornecedorExternoId: fornecedorMap["BovinoPrime Reprodutores"],
        //         dataInicio: new Date("2025-02-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-02-03T08:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "20",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     // externos -> Faz. Gamma
        //     {
        //         unidadeId: unidadeMap["Fazenda Gamma"],
        //         fornecedorExternoId: fornecedorMap["Sementes Brasil"],
        //         dataInicio: new Date("2024-03-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-03-05T09:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE, // fallback
        //         diaPagamento: "10",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Gamma"],
        //         fornecedorExternoId: fornecedorMap["AgroGrãos Comercial"],
        //         dataInicio: new Date("2024-04-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-04-03T08:30:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "05",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // externos -> Faz. Delta
        //     {
        //         unidadeId: unidadeMap["Fazenda Delta"],
        //         fornecedorExternoId: fornecedorMap["FertSul Distribuição"],
        //         dataInicio: new Date("2024-01-15T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-01-20T06:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "20",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Delta"],
        //         fornecedorExternoId: fornecedorMap["BioInsumos Ltda"],
        //         dataInicio: new Date("2024-02-10T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-02-12T07:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "10",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // externos -> Fazenda Beta
        //     {
        //         unidadeId: unidadeMap["Fazenda Beta"],
        //         fornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
        //         dataInicio: new Date("2024-07-15T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-07-18T08:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "10",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Beta"],
        //         fornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
        //         dataInicio: new Date("2024-07-20T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-07-22T07:30:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "15",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Beta"],
        //         fornecedorExternoId: fornecedorMap["AgroBov Genetics"],
        //         dataInicio: new Date("2024-09-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-09-03T06:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.TRIMESTRAL, // inseminação/troca genética não é mensal
        //         diaPagamento: "30",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Fazenda Beta"],
        //         fornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
        //         dataInicio: new Date("2024-08-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-08-05T07:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "15",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // Fazenda Teste <- PastosVerde Nutrição Animal (silagem, feno, suplementos minerais)
        //     {
        //         unidadeId: unidadeMap["Fazenda Teste"],
        //         fornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
        //         dataInicio: new Date("2024-10-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-10-03T09:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "10",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     // Fazenda Teste <- GenBov Melhoramento Genético (inseminação e consultoria)
        //     {
        //         unidadeId: unidadeMap["Fazenda Teste"],
        //         fornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
        //         dataInicio: new Date("2024-11-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-11-04T08:30:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.TRIMESTRAL,
        //         diaPagamento: "20",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     // Fazenda Teste <- AgroVet Saúde Animal (medicamentos e vacinas)
        //     {
        //         unidadeId: unidadeMap["Fazenda Teste"],
        //         fornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
        //         dataInicio: new Date("2024-12-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2024-12-05T07:45:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "25",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     // Fazenda Teste <- CampoForte Equipamentos (balanças, troncos, bebedouros)
        //     {
        //         unidadeId: unidadeMap["Fazenda Teste"],
        //         fornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
        //         dataInicio: new Date("2025-01-10T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-01-12T10:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.SEMESTRAL,
        //         diaPagamento: "05",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // -------------------------------------------------------
        //     // LOJAS
        //     // VerdeFresco Hortaliças (vende hortaliças) <- fornecedor: Fazenda Delta
        //     {
        //         unidadeId: unidadeMap["VerdeFresco Hortaliças"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Delta"],
        //         dataInicio: new Date("2025-05-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-05-02T06:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.SEMANALMENTE,
        //         diaPagamento: "15",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // AgroBoi (vende gado/insumos) <- fornecedor: Fazenda Alpha
        //     {
        //         unidadeId: unidadeMap["AgroBoi"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
        //         dataInicio: new Date("2025-05-10T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-05-12T08:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "30",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // Casa Útil Mercado (produtos diversos) <- fornecedores variados (ex.: usa fazendas para apresentação do usuário Maria)
        //     {
        //         unidadeId: unidadeMap["Casa Útil Mercado"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Gamma"],
        //         dataInicio: new Date("2025-04-15T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "15",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Casa Útil Mercado"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
        //         dataInicio: new Date("2025-04-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-04-03T08:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "30",
        //         formaPagamento: TPAG.PIX,
        //     },
        //     {
        //         unidadeId: unidadeMap["Casa Útil Mercado"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
        //         dataInicio: new Date("2025-03-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-03-02T09:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "05",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // Sabor do Campo Laticínios (laticínios) <- fornecedor: Fazenda Beta
        //     {
        //         unidadeId: unidadeMap["Sabor do Campo Laticínios"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
        //         dataInicio: new Date("2025-05-05T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-05-06T07:30:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.SEMANALMENTE,
        //         diaPagamento: "30",
        //         formaPagamento: TPAG.PIX,
        //     },

        //     // Loja Teste (laticínios e carne) <- fornecedor: Fazenda Teste
        //     {
        //         unidadeId: unidadeMap["Loja Teste"],
        //         fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
        //         dataInicio: new Date("2025-06-01T00:00:00.000Z"),
        //         dataFim: null,
        //         dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
        //         status: SCON.ATIVO,
        //         frequenciaEntregas: FREQ.MENSALMENTE,
        //         diaPagamento: "10",
        //         formaPagamento: TPAG.PIX,
        //     },
        // ];
        // await prisma.contrato.createMany({ data: contratosData, skipDuplicates: true });
        const contratosData = [
            // ----------------------------------------------------------
            // FAZENDAS
            // externos -> Faz. Alpha
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"],
                dataInicio: new Date("2024-01-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-01-05T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00", // Será calculado após inserção dos itens
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["NutriBov Distribuidora"],
                dataInicio: new Date("2024-02-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-02-03T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["BovinoPrime Reprodutores"],
                dataInicio: new Date("2025-02-01T00:00:00.000Z"),
                dataFim: new Date("2026-01-31T23:59:59.999Z"),
                dataEnvio: new Date("2025-02-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
                valorTotal: "24500.00", // (2 * 3200) + (6 * 2100) + (4 * 850) = 6400 + 12600 + 3400 = 22400
            },
            // externos -> Faz. Gamma
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["Sementes Brasil"],
                dataInicio: new Date("2024-03-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-03-05T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["AgroGrãos Comercial"],
                dataInicio: new Date("2024-04-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-04-03T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },

            // externos -> Faz. Delta
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["FertSul Distribuição"],
                dataInicio: new Date("2024-01-15T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-01-20T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["BioInsumos Ltda"],
                dataInicio: new Date("2024-02-10T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-02-12T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },

            // externos -> Fazenda Beta
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
                dataInicio: new Date("2024-07-15T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-07-18T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
                valorTotal: "835.00", // (10 * 45) + (100 * 0.85) + (10 * 30) = 450 + 85 + 300 = 835
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
                dataInicio: new Date("2024-07-20T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-07-22T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
                valorTotal: "740.00", // (1 * 420) + (20 * 6.50) + (2 * 95) = 420 + 130 + 190 = 740
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroBov Genetics"],
                dataInicio: new Date("2024-09-01T00:00:00.000Z"),
                dataFim: new Date("2026-08-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-09-03T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
                valorTotal: "21330.00", // (6 * 85) + (1 * 420) + (2 * 4200) + (5 * 2400) = 510 + 420 + 8400 + 12000 = 21330
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
                dataInicio: new Date("2024-08-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-08-05T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
                valorTotal: "414.00", // (20 * 6.50) + (8 * 28) + (5 * 12) = 130 + 224 + 60 = 414
            },

            // Fazenda Teste <- PastosVerde Nutrição Animal
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
                dataInicio: new Date("2024-10-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-10-03T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
                valorTotal: "139.20", // (400 * 0.18) + (800 * 0.08) + (1 * 3.20) = 72 + 64 + 3.20 = 139.20
            },
            // Fazenda Teste <- GenBov Melhoramento Genético
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
                dataInicio: new Date("2024-11-01T00:00:00.000Z"),
                dataFim: new Date("2026-10-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-11-04T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
                valorTotal: "17875.00", // (1 * 75) + (1 * 5500) + (4 * 3200) = 75 + 5500 + 12800 = 18375
            },
            // Fazenda Teste <- AgroVet Saúde Animal
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
                dataInicio: new Date("2024-12-01T00:00:00.000Z"),
                dataFim: new Date("2025-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2024-12-05T07:45:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "25",
                formaPagamento: TPAG.PIX,
                valorTotal: "130.50", // (3 * 5.50) + (3 * 22) + (1 * 48) = 16.50 + 66 + 48 = 130.50
            },
            // Fazenda Teste <- CampoForte Equipamentos
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
                dataInicio: new Date("2025-01-10T00:00:00.000Z"),
                dataFim: new Date("2026-12-31T23:59:59.999Z"),
                dataEnvio: new Date("2025-01-12T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMESTRAL,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
                valorTotal: "10220.00", // (1 * 7200) + (1 * 2500) + (1 * 520) = 10220
            },

            // -------------------------------------------------------
            // LOJAS
            // VerdeFresco Hortaliças <- Fazenda Delta
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                fornecedorUnidadeId: unidadeMap["Fazenda Delta"],
                dataInicio: new Date("2025-05-01T00:00:00.000Z"),
                dataFim: new Date("2026-04-30T23:59:59.999Z"),
                dataEnvio: new Date("2025-05-02T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
                valorTotal: "3147.20", // (100*2.50)+(48*3)+(24*3.50)+(32*2.80)+(28*2.20)+(24*80)+(8*65)+(36*3.80)+(16*6.50)+(28*3.20) = 250+144+84+89.60+61.60+1920+520+136.80+104+89.60 = 3399.60
            },

            // AgroBoi <- Fazenda Alpha
            {
                unidadeId: unidadeMap["AgroBoi"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-05-10T00:00:00.000Z"),
                dataFim: new Date("2026-05-09T23:59:59.999Z"),
                dataEnvio: new Date("2025-05-12T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
                valorTotal: "19403.00", // Calculado baseado nos 22 itens do contrato
            },

            // Casa Útil Mercado <- Fazenda Gamma
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Gamma"],
                dataInicio: new Date("2025-04-15T00:00:00.000Z"),
                dataFim: new Date("2026-04-14T23:59:59.999Z"),
                dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
                valorTotal: "31898.00", // Calculado baseado nos 18 itens do contrato
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-04-01T00:00:00.000Z"),
                dataFim: new Date("2026-03-31T23:59:59.999Z"),
                dataEnvio: new Date("2025-04-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-03-01T00:00:00.000Z"),
                dataFim: new Date("2026-02-28T23:59:59.999Z"),
                dataEnvio: new Date("2025-03-02T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
                valorTotal: "0.00",
            },

            // Sabor do Campo Laticínios <- Fazenda Beta
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
                dataInicio: new Date("2025-05-05T00:00:00.000Z"),
                dataFim: new Date("2026-05-04T23:59:59.999Z"),
                dataEnvio: new Date("2025-05-06T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
                valorTotal: "7863.80", // Calculado baseado nos 27 itens do contrato
            },

            // Loja Teste <- Fazenda Teste
            {
                unidadeId: unidadeMap["Loja Teste"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-06-01T00:00:00.000Z"),
                dataFim: new Date("2026-05-31T23:59:59.999Z"),
                dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
                valorTotal: "872.00", // (20*4)+(4*22)+(10*40)+(8*48) = 80+88+400+384 = 952
            },
        ];

        await prisma.contrato.createMany({ data: contratosData, skipDuplicates: true });
        console.log("Contratos criados (seed).");
        const contratosDb = await prisma.contrato.findMany({
            include: {
                unidade: true,
                fornecedorExterno: true,
                fornecedorInterno: true
            }
        });

        const contratoMap = {};

        for (const c of contratosDb) {
            const unidadeNome =
                c.unidade?.nome?.trim() || "SEM_UNIDADE";

            const fornecedorNome =
                c.fornecedorExterno?.nomeEmpresa?.trim() ||
                c.fornecedorInterno?.nome?.trim() ||
                "SEM_FORNECEDOR";

            const chave = `${unidadeNome} - ${fornecedorNome}`;
            contratoMap[chave] = c.id;
        }

        // ===== 7. FORNECEDOR ITEMS (Itens dos Contratos) =====
        console.log("7. Criando itens dos contratos...");
        // ============================================================
        // INSUMOS - ContratoItens com pesoUnidade e precoUnitario
        // ============================================================

        const insumosContratosItens = [
            // ---------------- Fazenda Beta <- AgroLácteos Suprimentos ----------------
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Culturas lácteas (starter) - pacote",
                categoria: ["Insumo", "Laticínios", "Culturas"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020", // 20 g por pacote
                quantidade: "10",
                precoUnitario: "45.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Embalagem PET 1L (unidade)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.035", // ~35 g por garrafa vazia
                quantidade: "100",
                precoUnitario: "0.85",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Etiquetas / rótulos (pacote 1000 uni)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500", // 0.5 kg por pacote 1000 uni
                quantidade: "10",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },

            // ---------------- Fazenda Beta <- Lácteos & Tecnologia Ltda ----------------
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Filtro micro/ultra para pasteurização (unidade)",
                categoria: ["Insumo", "Equipamento", "Processamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.800", // 800 g
                quantidade: "1",
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Produto de limpeza CIP (litro)",
                categoria: ["Insumo", "Higiene"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000", // 1 kg por litro aproximado
                quantidade: "20",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Kits de calibragem Válvulas / sensores (unidade)",
                categoria: ["Insumo", "Manutenção", "Peças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500", // 500 g
                quantidade: "2",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },

            // ---------------- Fazenda Beta <- AgroBov Genetics (genética) ----------------
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Sêmen congelado Holandês (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.005", // 5 g por ampola (aprox.)
                quantidade: "6",
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Embrião (Holandês) - unidade",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.002", // 2 g (conteúdo criogênico leve)
                quantidade: "1",
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },

            // ---------------- Fazenda Beta <- VetBov Serviços e Insumos ----------------
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Vacina contra brucelose (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020", // 20 g por dose (frasco/seringa)
                quantidade: "20",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Antibiótico injetável (frasco)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.200", // 200 g
                quantidade: "8",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Seringas agulha (pacote 100 uni)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.200", // 200 g por pacote
                quantidade: "5",
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },

            // ---------------- Fazenda Teste <- PastosVerde Nutrição Animal ----------------
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Feno (fardo 20kg)",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "20.000", // 20 kg por fardo
                quantidade: "400",
                precoUnitario: "0.18",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Silagem",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "10.000",
                quantidade: "800",
                precoUnitario: "0.08",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Suplemento mineral (kg)",
                categoria: ["Insumo", "Suplemento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "5.000",
                quantidade: "1",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },

            // ---------------- Fazenda Teste <- GenBov Melhoramento Genético ----------------
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Sêmen congelado Angus (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.005",
                quantidade: "1",
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2024-11-01")
            },

            // ---------------- Fazenda Teste <- AgroVet Saúde Animal ----------------
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Vacina múltipla (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020",
                quantidade: "3",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Antiparasitário oral (unidade embalagem)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.100",
                quantidade: "3",
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Kits de primeiros socorros (unidade)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500",
                quantidade: "1",
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },

            // ---------------- Fazenda Teste <- CampoForte Equipamentos ----------------
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Balança de piso animal (unidade)",
                categoria: ["Equipamento", "Pesagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "120.000", // kg aproximado
                quantidade: "1",
                precoUnitario: "7200.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Tronco / brete de contenção (unidade)",
                categoria: ["Equipamento", "Handling"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "200.000",
                quantidade: "1",
                precoUnitario: "2500.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Bebedouro automático (unidade)",
                categoria: ["Equipamento", "Água"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "15.000",
                quantidade: "1",
                precoUnitario: "520.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            }
        ];

        // ============================================================
        // ANIMAIS - ContratoItens com pesoUnidade e precoUnitario
        // ============================================================

        const animaisContratosItens = [
            // --------------------------------------------------------
            // BovinoPrime Reprodutores — Fazenda Alpha
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Touro reprodutor Nelore (adulto)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "850.000", // peso médio de um touro Nelore adulto em kg
                quantidade: "2",
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
                pesoUnidade: "550.000", // vaca adulta em kg
                quantidade: "6",
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
                pesoUnidade: "180.000", // peso médio bezerro desmama em kg
                quantidade: "4",
                precoUnitario: "850.00",
                ativo: true,
                criadoEm: new Date("2025-09-03")
            },

            // --------------------------------------------------------
            // AgroBov Genetics — Fazenda Beta
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Touro reprodutor Holandês",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "900.000", // touro Holandês adulto em kg
                quantidade: "2",
                precoUnitario: "4200.00",
                ativo: true,
                criadoEm: new Date("2025-09-04")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Vaca reprodutora Holandesa",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "650.000", // vaca Holandesa em kg
                quantidade: "5",
                precoUnitario: "2400.00",
                ativo: true,
                criadoEm: new Date("2025-09-05")
            },

            // --------------------------------------------------------
            // GenBov Melhoramento Genético — Fazenda Teste
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Touro reprodutor Angus (adulto, PO)",
                categoria: ["Animal", "Reprodutor", "Bovino", "Genética"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "950.000", // touro PO Angus adulto em kg
                quantidade: "1",
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
                pesoUnidade: "600.000", // vaca Angus em kg
                quantidade: "4",
                precoUnitario: "3200.00",
                ativo: true,
                criadoEm: new Date("2025-09-08")
            },
        ];

        // ============================================================
        // CRIAR OS REGISTROS NO BANCO
        // ============================================================

        await prisma.contratoItens.createMany({
            data: [...insumosContratosItens, ...animaisContratosItens],
            skipDuplicates: true
        });

        // ============================================================
        // PRODUTOS - ContratoItens com pesoUnidade e precoUnitario
        // ============================================================

        const produtosContratosItens = [
            // ----------------- AgroBoi - Fazenda Alpha -----------------
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Gado bovino vivo (cabeça)",
                categoria: ["Pecuária"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "450.000",   // peso médio por cabeça (kg)
                quantidade: "5",
                precoUnitario: "950.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carcaça bovina inteira (kg)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "120",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-02")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Miúdos bovinos (kg)",
                categoria: ["Carne", "Miúdos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",
                precoUnitario: "10.00",
                ativo: true,
                criadoEm: new Date("2025-06-03")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro bovino cru (unidade)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "12.000",
                quantidade: "5",
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-06-04")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Ossos bovinos (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-06-05")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo bovino bruto (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "15",
                precoUnitario: "6.00",
                ativo: true,
                criadoEm: new Date("2025-06-06")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sangue bovino para subprodutos (L)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "30",
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-06-07")
            },

            // Cortes
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Coxão mole (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-06-08")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Alcatra (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",
                precoUnitario: "55.00",
                ativo: true,
                criadoEm: new Date("2025-06-09")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Contrafilé (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "15",
                precoUnitario: "60.00",
                ativo: true,
                criadoEm: new Date("2025-06-10")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Costela ripa (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "8",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-06-11")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Maminha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "10",
                precoUnitario: "47.00",
                ativo: true,
                criadoEm: new Date("2025-06-12")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Picanha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2025-06-13")
            },

            // Processados / Industrializados
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne moída (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "40",
                precoUnitario: "25.00",
                ativo: true,
                criadoEm: new Date("2025-06-14")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne para hambúrguer (mistura 80/20) (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",
                precoUnitario: "23.00",
                ativo: true,
                criadoEm: new Date("2025-06-15")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Hambúrguer congelado 120g (caixa)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.120",
                quantidade: "50",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-16")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Linguiça bovina artesanal (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-17")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Charque (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "4",
                precoUnitario: "32.00",
                ativo: true,
                criadoEm: new Date("2025-06-18")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne desidratada (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "2",
                precoUnitario: "120.00",
                ativo: true,
                criadoEm: new Date("2025-06-19")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo industrializado (kg)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "8",
                precoUnitario: "9.00",
                ativo: true,
                criadoEm: new Date("2025-06-20")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro curtido (m²)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "2.500",
                quantidade: "3",
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
                pesoUnidade: "60.000",
                quantidade: "40",
                precoUnitario: "185.00",
                ativo: true,
                criadoEm: new Date("2025-06-22")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho grão (saca 60kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "60.000",
                quantidade: "35",
                precoUnitario: "155.00",
                ativo: true,
                criadoEm: new Date("2025-06-23")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Trigo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "50.000",
                quantidade: "15",
                precoUnitario: "162.00",
                ativo: true,
                criadoEm: new Date("2025-06-24")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão carioca (saca 30kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "30.000",
                quantidade: "9",
                precoUnitario: "225.00",
                ativo: true,
                criadoEm: new Date("2025-06-25")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Sorgo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "50.000",
                quantidade: "7",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-06-26")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Casca de soja (subproduto) (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "80",
                precoUnitario: "0.80",
                ativo: true,
                criadoEm: new Date("2025-06-27")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de soja bruto (saca 40kg)",
                categoria: ["Derivados", "Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "40.000",
                quantidade: "24",
                precoUnitario: "100.00",
                ativo: true,
                criadoEm: new Date("2025-06-28")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja bruto (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "120",
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-29")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja refinado (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "100",
                precoUnitario: "7.00",
                ativo: true,
                criadoEm: new Date("2025-06-30")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "160",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-01")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 5kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "5.000",
                quantidade: "48",
                precoUnitario: "14.00",
                ativo: true,
                criadoEm: new Date("2025-07-02")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho triturado (ração) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "32",
                precoUnitario: "78.00",
                ativo: true,
                criadoEm: new Date("2025-07-03")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Ração de engorda (mistura milho+farelo) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "28",
                precoUnitario: "92.00",
                ativo: true,
                criadoEm: new Date("2025-07-04")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farinha de trigo 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "100",
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-05")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de trigo (saca 25kg)",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "16",
                precoUnitario: "68.00",
                ativo: true,
                criadoEm: new Date("2025-07-06")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão limpo e selecionado 1kg (pacote)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "72",
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-07")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Grãos embalados a vácuo (diversos) (unidade)",
                categoria: ["Grãos", "Embalados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.500",
                quantidade: "48",
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
                pesoUnidade: "1.000",
                quantidade: "200",
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-07-09")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite cru tipo B (L)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "80",
                precoUnitario: "0.95",
                ativo: true,
                criadoEm: new Date("2025-07-10")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Nata / creme do leite (kg)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-07-11")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Soro de leite (L)",
                categoria: ["Laticínios", "Subprodutos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "48",
                precoUnitario: "0.30",
                ativo: true,
                criadoEm: new Date("2025-07-12")
            },

            // Beneficiados / Embalagens
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "140",
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-13")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 2L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "2.000",
                quantidade: "48",
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-14")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite UHT 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "80",
                precoUnitario: "4.20",
                ativo: true,
                criadoEm: new Date("2025-07-15")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite integral 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "72",
                precoUnitario: "4.80",
                ativo: true,
                criadoEm: new Date("2025-07-16")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite desnatado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "36",
                precoUnitario: "4.60",
                ativo: true,
                criadoEm: new Date("2025-07-17")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite sem lactose 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "16",
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-07-18")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Creme de leite 200ml",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-07-19")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "28",
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2025-07-20")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 500g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.500",
                quantidade: "12",
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-07-21")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Ricota fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",
                precoUnitario: "26.00",
                ativo: true,
                criadoEm: new Date("2025-07-22")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Minas padrão (kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-07-23")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (peça 3kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "3.000",
                quantidade: "4",
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-07-24")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (barra 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "11",
                precoUnitario: "38.00",
                ativo: true,
                criadoEm: new Date("2025-07-25")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo parmesão (peça 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "3",
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-07-26")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte natural 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "64",
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-27")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor morango 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "48",
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-28")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor coco 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "32",
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-29")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte garrafa 1L",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "9.50",
                ativo: true,
                criadoEm: new Date("2025-07-30")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Requeijão cremoso 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",         // antes: 180
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-31")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite pastoso 400g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.400",
                quantidade: "17",         // antes: 84
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-08-01")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite em barra 300g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.300",
                quantidade: "10",         // antes: 52
                precoUnitario: "15.00",
                ativo: true,
                criadoEm: new Date("2025-08-02")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Kefir líquido 1L",
                categoria: ["Laticínios", "Fermentados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "9",          // antes: 44
                precoUnitario: "7.50",
                ativo: true,
                criadoEm: new Date("2025-08-03")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Coalhada fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",          // antes: 28
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
                pesoUnidade: "0.200",
                quantidade: "100",        // antes: 500
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-08-05")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface americana (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.250",
                quantidade: "48",         // antes: 240
                precoUnitario: "3.00",
                ativo: true,
                criadoEm: new Date("2025-08-06")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface roxa (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.220",
                quantidade: "24",         // antes: 120
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-08-07")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Rúcula (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.150",
                quantidade: "32",         // antes: 160
                precoUnitario: "2.80",
                ativo: true,
                criadoEm: new Date("2025-08-08")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Couve manteiga (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.250",
                quantidade: "28",         // antes: 140
                precoUnitario: "2.20",
                ativo: true,
                criadoEm: new Date("2025-08-09")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate caixa 20kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "20.000",
                quantidade: "24",         // antes: 120
                precoUnitario: "80.00",
                ativo: true,
                criadoEm: new Date("2025-08-10")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate cereja caixa 5kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "5.000",
                quantidade: "8",          // antes: 40
                precoUnitario: "65.00",
                ativo: true,
                criadoEm: new Date("2025-08-11")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Pepino japonês (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",         // antes: 180
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-08-12")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Abobrinha italiana (kg)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-08-13")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Cenoura (kg)",
                categoria: ["Hortaliças", "Raízes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "28",         // antes: 140
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
                pesoUnidade: "1.000",
                quantidade: "20",         // antes: 100
                precoUnitario: "4.00",
                ativo: true,
                criadoEm: new Date("2025-08-15")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Queijo fresco 500g (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500",
                quantidade: "4",          // antes: 20
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2025-08-16")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte dianteiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1",
                quantidade: "10",         // antes: 40
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-08-17")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte traseiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1",
                quantidade: "8",          // antes: 30
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
            },

            // === PEDIDOS: Loja Teste (recebe de Fazenda Teste) ===
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                origemFornecedorExternoId: null,
                origemUnidadeId: unidadeMap["Fazenda Teste"],   // fornecedor é unidade Fazenda Teste
                destinoUnidadeId: unidadeMap["Loja Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base: entrega mensal configurada em contratosData (envio 2025-06-03T10:00:00Z)
                dataPedido: new Date("2025-06-01T09:00:00.000Z"),
                dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
                dataRecebimento: new Date("2025-06-03T12:30:00.000Z"),
                documentoReferencia: "Romaneio-LOJA-20250603",
                observacoes: "Pedido mensal para Loja Teste — laticínios e cortes (seed).",
                status: SPEDIDO.ENTREGUE,
            },

            // === PEDIDO: Casa Útil Mercado (recebe de Fazenda Gamma) ===
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                origemFornecedorExternoId: null,
                origemUnidadeId: unidadeMap["Fazenda Gamma"],
                destinoUnidadeId: unidadeMap["Casa Útil Mercado"], // ou "Casa Útil Mercado" conforme seu mapa
                criadoPorId: usuarioMap["Maria Del Rey"],

                // base: contratosData mostra envio em 2025-04-18T09:00:00Z
                dataPedido: new Date("2025-04-16T09:00:00.000Z"),
                dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
                dataRecebimento: new Date("2025-04-18T11:45:00.000Z"),
                documentoReferencia: "Romaneio-CU-20250418",
                observacoes: "Pedido seed para Casa Útil Mercado — grãos e derivados.",
                status: SPEDIDO.ENTREGUE,
            }

        ];
        await prisma.pedido.createMany({ data: pedidosSeed, skipDuplicates: true });

        async function seedPedidoItems(prisma) {
            // helper: encontra pedido pelo documentoReferencia
            async function findPedidoByDoc(docRef) {
                return prisma.pedido.findFirst({ where: { documentoReferencia: docRef } });
            }

            // helper: encontra fornecedor/contrato item pelo nome exato
            // Busca robusta por nome de contratoItem
            async function findContratoItemByName(nome) {
                if (!nome) return null;
                const raw = nome.trim();

                // 1) tentativa exata case-insensitive
                let r = await prisma.contratoItens.findFirst({
                    where: { nome: { equals: raw, mode: "insensitive" } }
                });
                if (r) return r;

                // 2) tentativa contains (parte do texto) - útil para "Touro reprodutor Holandês (adulto)"
                r = await prisma.contratoItens.findFirst({
                    where: { nome: { contains: raw, mode: "insensitive" } }
                });
                if (r) return r;

                // 3) tentativa invertida: procura itens cujo nome contém a palavra-chave principal (ex.: 'Touro', 'Silagem')
                const keywords = raw.split(/\s+/).filter(Boolean).slice(0, 3);
                for (const kw of keywords) {
                    const cand = await prisma.contratoItens.findFirst({
                        where: { nome: { contains: kw, mode: "insensitive" } }
                    });
                    if (cand) return cand;
                }

                // DEBUG: lista os primeiros candidatos parecidos (ajuda a ver por quê não encontrou)
                const candidates = await prisma.contratoItens.findMany({
                    where: { nome: { contains: raw.split(/\s+/)[0], mode: "insensitive" } },
                    take: 10
                });
                console.warn("findContratoItemByName: nenhum match exato para:", nome, "— candidatos:", candidates.map(c => c.nome));
                return null;
            }


            // resolvemos os pedidos existentes pelo documentoReferencia
            const pedidoAgroBov = await findPedidoByDoc("Romaneio-AGB-20241203");
            const pedidoVetBov = await findPedidoByDoc("Nota-VET-20240905");
            const pedidoAgroLacteos = await findPedidoByDoc("Romaneio-AGL-20240818");
            const pedidoLaticosTec = await findPedidoByDoc("Romaneio-LAT-20240822");
            const pedidoPastosVerde = await findPedidoByDoc("Romaneio-PVS-20241103");
            const pedidoGenBov = await findPedidoByDoc("Romaneio-GEN-20250204");
            const pedidoAgroVet = await findPedidoByDoc("Romaneio-AGV-20250105");
            const pedidoCampoForte = await findPedidoByDoc("Romaneio-CFE-20250712");
            const pedidoLoja = await findPedidoByDoc("Romaneio-LOJA-20250603");
            const pedidoCasa = await findPedidoByDoc("Romaneio-CU-20250418");

            // checagem rápida
            const missing = [
                ["AGROBOV", pedidoAgroBov],
                ["VETBOV", pedidoVetBov],
                ["AGROLÁCTEOS", pedidoAgroLacteos],
                ["LÁCTEOS TEC", pedidoLaticosTec],
                ["PASTOSVERDE", pedidoPastosVerde],
                ["GENBOV", pedidoGenBov],
                ["AGROVET", pedidoAgroVet],
                ["CAMPOFORTE", pedidoCampoForte],
                ["LOJA", pedidoLoja],
                ["CASA", pedidoCasa]
            ].filter(([k, v]) => !v).map(([k]) => k);

            if (missing.length) {
                console.warn("Aviso: não encontrou pedidos para:", missing.join(", "),
                    "\nVerifique documentoReferencia nos pedidos antes de criar itens.");
                // continuação permitida — itens ligados a pedidos não encontrados serão omitidos
            }

            // utilitário para criar entrada de item (busca contratoItem para pegar id)
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

            // === Itens por pedido (quantidades ajustadas para NÃO ULTRAPASSAR contrato) ===
            const itensPromises = [

                // --- AgroBov Genetics (Fazenda Beta) - animais/genética ---
                // observação: quantidades reduzidas para os valores acordados em ContratoItens
                makeItem(pedidoAgroBov, "Touro reprodutor Holandês", 2, UMED.CABECA, "4200.00"), // antes:2
                makeItem(pedidoAgroBov, "Vaca reprodutora Holandesa", 5, UMED.CABECA, "2400.00"),   // antes:5
                makeItem(pedidoAgroBov, "Sêmen congelado Holandês (ampola)", 6, UMED.UNIDADE, "85.00"),       // antes:20 -> ajustado para contrato:6
                makeItem(pedidoAgroBov, "Embrião (Holandês) - unidade", 1, UMED.UNIDADE, "420.00"),          // antes:5 -> ajustado para contrato:1
                // removed "Sessão de inseminação / consultoria" — não havia ContratoItem claro com esse nome

                // --- VetBov Serviços e Insumos (Fazenda Beta) - sanidade ---
                makeItem(pedidoVetBov, "Vacina contra brucelose (dose)", 20, UMED.UNIDADE, "6.50"),        // antes:100 -> ajustado para contrato:20
                makeItem(pedidoVetBov, "Antibiótico injetável (frasco)", 8, UMED.UNIDADE, "28.00"),      // antes:20 -> ajustado para contrato:8
                makeItem(pedidoVetBov, "Seringas agulha (pacote 100 uni)", 5, UMED.UNIDADE, "12.00"),     // antes:10 -> ajustado para contrato:5

                // --- AgroLácteos Suprimentos (Fazenda Beta) - insumos laticínios ---
                makeItem(pedidoAgroLacteos, "Culturas lácteas (starter) - pacote", 10, UMED.UNIDADE, "45.00"),   // antes:50 -> contrato:10
                makeItem(pedidoAgroLacteos, "Embalagem PET 1L (unidade)", 100, UMED.UNIDADE, "0.85"),            // antes:1000 -> contrato:100
                makeItem(pedidoAgroLacteos, "Etiquetas / rótulos (pacote 1000 uni)", 10, UMED.UNIDADE, "30.00"),  // antes:2 -> contrato:10 (optei por pedir o total do contrato)

                // --- Lácteos & Tecnologia Ltda (Fazenda Beta) - equipamentos / consumíveis ---
                makeItem(pedidoLaticosTec, "Filtro micro/ultra para pasteurização (unidade)", 1, UMED.UNIDADE, "420.00"), // antes:1
                makeItem(pedidoLaticosTec, "Produto de limpeza CIP (litro)", 20, UMED.LITRO, "6.50"),                     // antes:50 -> contrato:20
                makeItem(pedidoLaticosTec, "Kits de calibragem Válvulas / sensores (unidade)", 2, UMED.UNIDADE, "95.00"),   // antes:2

                // --- PastosVerde (Fazenda Teste) - forragem ---
                makeItem(pedidoPastosVerde, "Silagem", 800, UMED.KG, "0.08"),              // antes:5000 -> contrato:800
                makeItem(pedidoPastosVerde, "Feno (fardo 20kg)", 400, UMED.UNIDADE, "95.00"),  // antes:300 -> contrato:400 (pedi total do contrato)
                makeItem(pedidoPastosVerde, "Suplemento mineral (kg)", 1, UMED.KG, "3.20"),    // antes:500 -> contrato:1

                // --- GenBov Melhoramento Genético (Fazenda Teste) - genética ---
                // existe duplicidade entre "insumos" e "animais" para sêmen; aqui usei a quantidade maior acordada (animals array)
                makeItem(pedidoGenBov, "Sêmen congelado Angus (ampola)", 20, UMED.UNIDADE, "75.00"), // antes:30 -> ajustado para contrato (20)
                // removed session item if not present explicitamente

                // --- AgroVet Saúde Animal (Fazenda Teste) - sanidade ---
                makeItem(pedidoAgroVet, "Vacina múltipla (dose)", 3, UMED.UNIDADE, "5.50"),               // antes:100 -> contrato:3
                makeItem(pedidoAgroVet, "Antiparasitário oral (unidade embalagem)", 3, UMED.UNIDADE, "22.00"), // antes:50 -> contrato:3
                makeItem(pedidoAgroVet, "Kits de primeiros socorros (unidade)", 1, UMED.UNIDADE, "48.00"), // antes:5 -> contrato:1

                // --- CampoForte Equipamentos (Fazenda Teste) - equipamentos (semestre) ---
                makeItem(pedidoCampoForte, "Balança de piso animal (unidade)", 1, UMED.UNIDADE, "7200.00"),  // antes:1
                makeItem(pedidoCampoForte, "Tronco / brete de contenção (unidade)", 1, UMED.UNIDADE, "2500.00"), // antes:1
                makeItem(pedidoCampoForte, "Bebedouro automático (unidade)", 1, UMED.UNIDADE, "520.00"), // antes:4 -> ajustado para contrato:1

                // === Itens para Loja Teste (usando exatamente os itens do seu produtosContratosItens para Loja Teste) ===
                makeItem(pedidoLoja, "Leite pasteurizado 1L (teste)", "20", UMED.LITRO, "4.00"),
                makeItem(pedidoLoja, "Queijo fresco 500g (teste)", "4", UMED.KG, "22.00"),
                makeItem(pedidoLoja, "Carne bovina corte dianteiro (teste)", "10", UMED.KG, "40.00"),
                makeItem(pedidoLoja, "Carne bovina corte traseiro (teste)", "8", UMED.KG, "48.00"),

                // === Itens para Casa Útil Mercado (escolha representativa; quantidades não ultrapassam contratos) ===
                makeItem(pedidoCasa, "Soja grão (saca 60kg)", "10", UMED.SACA, "185.00"),
                makeItem(pedidoCasa, "Milho grão (saca 60kg)", "8", UMED.SACA, "155.00"),
                makeItem(pedidoCasa, "Trigo (saca 50kg)", "4", UMED.SACA, "162.00"),
                makeItem(pedidoCasa, "Feijão carioca (saca 30kg)", "2", UMED.SACA, "225.00"),
                makeItem(pedidoCasa, "Óleo de soja refinado (L)", "20", UMED.LITRO, "7.00"),
                makeItem(pedidoCasa, "Farelo de soja bruto (saca 40kg)", "6", UMED.SACA, "100.00"),
                makeItem(pedidoCasa, "Fubá de milho 1kg (pacote)", "20", UMED.UNIDADE, "3.20"),
                makeItem(pedidoCasa, "Milho triturado (ração) 25kg", "5", UMED.SACA, "78.00"),

            ];

            // resolve todas as promises (algumas podem retornar null se pedido/item não encontrado)
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

        // === ESTOQUES DAS UNIDADES ===
        // Garantir que todas as lojas e fazendas tenham estoque
        const todasUnidades = await prisma.unidade.findMany();
        const estoques = todasUnidades.map(unidade => ({
            unidadeId: unidade.id,
            descricao: `Estoque principal - ${unidade.nome}`,
                qntdItens: 0,
        }));

        await prisma.estoque.createMany({ data: estoques, skipDuplicates: true })

        // Assuma import prisma já feito acima do seed

        // util: transforma nomes em slugs para sku (simples)
        function slugifyForSku(text) {
            return String(text || '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        /**
         * Gera um array de objetos prontos para inserir em EstoqueProduto a partir de
         * um pedidoItem. Ajuste campos extras conforme seu model.
         */
        function gerarEntradasDeEstoqueParaPedidoItem({ pedido, pedidoItem, estoqueId, prefixo = '', dataEntrada = new Date() }) {
            // nome, sku, marca, quantidade, precoUnitario, pedidoId, pedidoItemId, estoqueId, dataEntrada, unidadeBase
            const nome = pedidoItem.fornecedorItem?.nome ?? pedidoItem.produto?.nome ?? pedidoItem.observacoes ?? `PedidoItem-${pedidoItem.id}`;
            const sku = `${prefixo}-${pedidoItem.produtoId ?? pedidoItem.fornecedorItemId ?? pedidoItem.id}`.slice(0, 100);
            const marca = pedidoItem.produto?.marca ?? null;

            const quantidadeRaw = pedidoItem.qntdAtual ?? pedidoItem.quantidade ?? 0;
            const qntdAtual = Math.max(0, Math.floor(Number(quantidadeRaw)));

            const precoUnitario = pedidoItem.precoUnitario ? Number(pedidoItem.precoUnitario) : 0;

            return {
                nome,
                sku,
                marca,
                qntdAtual,
                estoqueId: Number(estoqueId),
                produtoId: pedidoItem.produtoId ?? null,
                loteId: pedidoItem.loteId ?? null,
                precoUnitario: precoUnitario || null,
                unidadeBase: pedidoItem.unidadeMedida ?? undefined,
                pedidoId: pedido.id,
                pedidoItemId: pedidoItem.id,
                fornecedorUnidadeId: null,
                fornecedorExternoId: pedido.fornecedorExternoId ?? null,
                dataEntrada: dataEntrada instanceof Date ? dataEntrada : new Date(dataEntrada)
            };
        }

        // async function seedEstoqueProdutosFromDeliveredPedidos(prisma) {
        //     const docRefs = [
        //         "Romaneio-AGB-20241203",
        //         "Nota-VET-20240905",
        //         "Romaneio-AGL-20240818",
        //         "Romaneio-LAT-20240822",
        //         "Romaneio-PVS-20241103",
        //         "Romaneio-GEN-20250204",
        //         "Romaneio-AGV-20250105",
        //         "Romaneio-CFE-20250712",
        //         "Romaneio-LOJA-20250603",
        //         "Romaneio-CU-20250418"
        //     ];

        //     // Busca os pedidos com os itens (observe include: { itens: true })
        //     const pedidos = await prisma.pedido.findMany({
        //         where: { documentoReferencia: { in: docRefs } },
        //         include: {
        //             itens: { include: { fornecedorItem: true, produto: true, lote: true } },
        //             destinoUnidade: true,
        //             fornecedorExterno: true
        //         }
        //     });

        //     if (!pedidos || pedidos.length === 0) {
        //         console.warn("Nenhum pedido encontrado para as referências informadas.");
        //         return;
        //     }

        //     const created = [];
        //     for (const pedido of pedidos) {
        //         const destinoUnidadeId = pedido.destinoUnidadeId ?? pedido.destinoUnidade?.id;
        //         if (!destinoUnidadeId) {
        //             console.warn("Pedido sem destinoUnidadeId:", pedido.documentoReferencia);
        //             continue;
        //         }

        //         const estoque = await prisma.estoque.findFirst({ where: { unidadeId: Number(destinoUnidadeId) } });
        //         if (!estoque) {
        //             console.warn("Estoque não encontrado para unidadeId:", destinoUnidadeId, "(pedido)", pedido.documentoReferencia);
        //             continue;
        //         }

        //         const items = pedido.itens ?? [];
        //         if (!items.length) {
        //             console.warn("Pedido sem itens:", pedido.documentoReferencia);
        //             continue;
        //         }

        //         // Inserir um a um para garantir vinculações e capturar erros
        //         for (const pi of items) {
        //             // valida qtd
        //             const qtd = Number(pi.qntdAtual ?? 0);
        //             if (!qtd || isNaN(qtd) || qtd <= 0) {
        //                 console.warn("Quantidade inválida em pedidoItem:", pi.id, "pedido", pedido.documentoReferencia);
        //                 continue;
        //             }

        //             const prefix = slugifyForSku(pi.fornecedorItem?.nome ?? pi.produto?.nome ?? `PED${pedido.id}-ITEM${pi.id}`);
        //             const entrada = gerarEntradasDeEstoqueParaPedidoItem({
        //                 pedido,
        //                 pedidoItem: pi,
        //                 estoqueId: estoque.id,
        //                 prefixo: prefix,
        //                 dataEntrada: pedido.dataRecebimento ?? new Date()
        //             });

        //             // Atenção: create pode falhar devido a unique constraint (estoqueId+produtoId). Tratamos com try/catch.
        //             try {
        //                 const novo = await prisma.estoqueProduto.create({ data: entrada });
        //                 created.push(novo);
        //             } catch (err) {
        //                 // se houver constraint, logamos e pulamos
        //                 console.warn("Falha ao criar EstoqueProduto para pedidoItem", pi.id, "erro:", err.message);
        //             }
        //         }
        //     }

        //     console.log("Finalizado seedEstoqueProdutosFromDeliveredPedidos — criados:", created.length);
        //     return created.length;
        // }

        // await seedEstoqueProdutosFromDeliveredPedidos(prisma);

        async function seedEstoqueProdutosFromDeliveredPedidos(prisma) {
            console.log("\n📦 Iniciando seed de EstoqueProduto a partir dos pedidos entregues...");

            const docRefs = [
                "Romaneio-AGB-20241203",
                "Nota-VET-20240905",
                "Romaneio-AGL-20240818",
                "Romaneio-LAT-20240822",
                "Romaneio-PVS-20241103",
                "Romaneio-GEN-20250204",
                "Romaneio-AGV-20250105",
                "Romaneio-CFE-20250712",
                "Romaneio-LOJA-20250603",
                "Romaneio-CU-20250418"
            ];

            // Buscar pedidos com status ENTREGUE e incluir todos os relacionamentos necessários
            const pedidos = await prisma.pedido.findMany({
                where: {
                    documentoReferencia: { in: docRefs },
                    status: "ENTREGUE" // Apenas pedidos entregues
                },
                include: {
                    itens: {
                        include: {
                            fornecedorItem: true,
                            produto: true,
                            lote: true
                        }
                    },
                    destinoUnidade: {
                        include: {
                            estoques: true // Incluir o estoque da unidade destino
                        }
                    },
                    fornecedorExterno: true,
                    origemUnidade: true
                }
            });

            if (!pedidos || pedidos.length === 0) {
                console.warn("⚠️  Nenhum pedido ENTREGUE encontrado para processar.");
                return 0;
            }

            console.log(`✓ Encontrados ${pedidos.length} pedidos entregues para processar`);

            let totalCriados = 0;
            let totalErros = 0;

            for (const pedido of pedidos) {
                const destinoUnidadeId = pedido.destinoUnidadeId;

                if (!destinoUnidadeId) {
                    console.warn(`⚠️  Pedido ${pedido.documentoReferencia} sem destinoUnidadeId - pulando`);
                    continue;
                }

                // Buscar ou criar estoque para a unidade destino
                let estoque = await prisma.estoque.findFirst({
                    where: { unidadeId: destinoUnidadeId }
                });

                if (!estoque) {
                    // Criar estoque se não existir
                    estoque = await prisma.estoque.create({
                        data: {
                            unidadeId: destinoUnidadeId,
                            descricao: `Estoque principal - ${pedido.destinoUnidade?.nome || 'Unidade'}`,
                            qntdItens: 0
                        }
                    });
                    console.log(`✓ Estoque criado para unidade ${destinoUnidadeId}`);
                }

                const items = pedido.itens || [];

                if (!items.length) {
                    console.warn(`⚠️  Pedido ${pedido.documentoReferencia} sem itens - pulando`);
                    continue;
                }

                console.log(`\n📋 Processando pedido: ${pedido.documentoReferencia} (${items.length} itens)`);

                for (const pi of items) {
                    try {
                        // Usar pi.quantidade do PedidoItem
                        const quantidadeStr = pi.quantidade;

                        if (!quantidadeStr) {
                            console.warn(`   ⚠️  Item ${pi.id}: quantidade null/undefined - pulando`);
                            totalErros++;
                            continue;
                        }

                        const quantidade = Number(quantidadeStr);

                        if (isNaN(quantidade) || quantidade <= 0) {
                            console.warn(`   ⚠️  Item ${pi.id}: quantidade inválida (${quantidadeStr}) - pulando`);
                            totalErros++;
                            continue;
                        }

                        const qntdInteira = Math.floor(quantidade);

                        // Dentro do loop "for (const pi of items)", substituir a partir da criação de dadosEstoque:

                        const nomeItem = pi.fornecedorItem?.nome ||
                            pi.produto?.nome ||
                            pi.observacoes ||
                            `Item do pedido ${pi.id}`;

                        const timestamp = Date.now();
                        const random = Math.floor(Math.random() * 1000);
                        const sku = `EST-${estoque.id}-${pi.id}-${timestamp}-${random}`;

                        // ✅ Determinar qntdMin baseado no tipo de unidade
                        let qntdMin = 0;
                        if (pedido.destinoUnidade?.tipo === "LOJA") {
                            // Lojas: mínimo 10% da quantidade recebida
                            qntdMin = Math.max(1, Math.floor(qntdInteira * 0.10));
                        } else if (pedido.destinoUnidade?.tipo === "FAZENDA") {
                            // Fazendas: mínimo 5% da quantidade recebida
                            qntdMin = Math.max(1, Math.floor(qntdInteira * 0.05));
                        }

                        // ✅ Determinar validade baseado no tipo de produto
                        let validade = null;
                        const categoria = pi.fornecedorItem?.categoria || [];
                        if (categoria.includes("Laticínios")) {
                            // Laticínios: 7-30 dias dependendo do tipo
                            if (nomeItem.toLowerCase().includes("leite")) {
                                validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
                            } else if (nomeItem.toLowerCase().includes("queijo") || nomeItem.toLowerCase().includes("manteiga")) {
                                validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
                            } else if (nomeItem.toLowerCase().includes("iogurte")) {
                                validade = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 dias
                            }
                        } else if (categoria.includes("Carne")) {
                            // Carnes: 5-7 dias
                            validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                        } else if (categoria.includes("Hortaliças")) {
                            // Hortaliças: 3-10 dias
                            validade = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
                        } else if (categoria.includes("Grãos")) {
                            // Grãos: 1 ano
                            validade = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                        }

                        // ✅ Buscar producaoId se for estoque de LOJA
                        let producaoId = null;
                        if (pedido.destinoUnidade?.tipo === "LOJA") {
                            // Buscar produção relacionada ao pedido/item
                            const producaoRelacionada = await prisma.producao.findFirst({
                                where: {
                                    destinoUnidadeId: pedido.destinoUnidadeId,
                                    status: "FINALIZADA",
                                    tipoProduto: {
                                        contains: nomeItem.split(' ')[0], // busca pela primeira palavra do nome
                                        mode: 'insensitive'
                                    }
                                },
                                orderBy: { dataFim: 'desc' }
                            });

                            producaoId = producaoRelacionada?.id || null;
                        }

                        const dadosEstoque = {
                            nome: nomeItem,
                            sku: sku,
                            marca: pi.produto?.marca || null,
                            qntdAtual: qntdInteira,
                            qntdMin: qntdMin,              // ✅ Calculado dinamicamente
                            estoqueId: estoque.id,
                            produtoId: pi.produtoId || null,
                            producaoId: producaoId,        // ✅ Vinculado se for loja
                            loteId: pi.loteId || null,
                            precoUnitario: pi.precoUnitario ? Number(pi.precoUnitario) : null,
                            pesoUnidade: pi.fornecedorItem?.pesoUnidade || pi.produto?.pesoUnidade || null,
                            validade: validade,            // ✅ Calculada por tipo de produto
                            unidadeBase: pi.unidadeMedida,
                            pedidoId: pedido.id,
                            pedidoItemId: pi.id,
                            fornecedorUnidadeId: pedido.origemUnidadeId || null,
                            fornecedorExternoId: pedido.origemFornecedorExternoId || null,
                            dataEntrada: pedido.dataRecebimento || new Date(),
                            dataSaida: null
                        };

                        const novoEstoque = await prisma.estoqueProduto.create({
                            data: dadosEstoque
                        });

                        totalCriados++;
                        console.log(`   ✓ Item ${pi.id}: ${nomeItem} - ${qntdInteira} unidades (min: ${qntdMin}, validade: ${validade ? validade.toLocaleDateString('pt-BR') : 'N/A'}, producao: ${producaoId || 'N/A'})`);

                    } catch (err) {
                        totalErros++;

                        // Verificar se é erro de constraint única
                        if (err.code === 'P2002') {
                            console.warn(`   ⚠️  Item ${pi.id}: já existe no estoque (constraint única) - pulando`);
                        } else {
                            console.error(`   ❌ Item ${pi.id}: Erro ao criar - ${err.message}`);
                        }
                    }
                }
            }

            console.log(`\n📊 Resumo do seed de EstoqueProduto:`);
            console.log(`   ✓ Registros criados: ${totalCriados}`);
            console.log(`   ⚠️  Erros/Pulos: ${totalErros}`);
            console.log(`   📦 Total processado: ${totalCriados + totalErros}\n`);

            return totalCriados;
        }

        await seedEstoqueProdutosFromDeliveredPedidos(prisma);

        const animals = [
            // Fazenda Beta — vacas Holandesas (5 registros individuais)
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ8-HOL-0001-01",
                dataNasc: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ8-HOL-0001-02",
                dataNasc: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ8-HOL-0001-03",
                dataNasc: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ8-HOL-0001-04",
                dataNasc: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ8-HOL-0001-05",
                dataNasc: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },

            // Fazenda Beta — touros Holandeses (2 registros)
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.MACHO,
                sku: "ANM-FAZ8-HOL-0002-01",
                dataNasc: new Date("2025-09-01T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Holandês",
                sexo: SXANIMAL.MACHO,
                sku: "ANM-FAZ8-HOL-0002-02",
                dataNasc: new Date("2025-09-01T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },

            // Fazenda Teste — touro Angus (1 registro)
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.MACHO,
                sku: "ANM-FAZ10-ANG-0001-01",
                dataNasc: new Date("2025-09-07T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 5500.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },

            // Fazenda Teste — vacas Angus (5 registros)
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ10-ANG-0002-01",
                dataNasc: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ10-ANG-0002-02",
                dataNasc: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ10-ANG-0002-03",
                dataNasc: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ10-ANG-0002-04",
                dataNasc: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },
            {
                especie: ESPANIMAL.BOVINO,
                raca: "Angus",
                sexo: SXANIMAL.FEMEA,
                sku: "ANM-FAZ10-ANG-0002-05",
                dataNasc: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                peso: null,
                formaAquisicao: TAQUISICAO.COMPRA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            }
        ];

        await prisma.animal.createMany({ data: animals, skipDuplicates: true });

        // ===== CRIAR LOTES BASEADOS NOS CONTRATOS COM LOJAS =====
        console.log("\n📦 Criando lotes baseados nos contratos com lojas...");

        const lotesGerados = [];

        // === FAZENDA BETA -> SABOR DO CAMPO LATICÍNIOS ===
        console.log("Processando: Fazenda Beta -> Sabor do Campo Laticínios");

        const contratoBetaSabor = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                status: SCON.ATIVO
            },
            include: { itens: true, fornecedorInterno: true }
        });

        if (contratoBetaSabor) {
            const responsavelBeta = await prisma.usuario.findFirst({
                where: {
                    unidadeId: unidadeMap["Fazenda Beta"],
                    perfilId: perfilMap["GERENTE_FAZENDA"]
                }
            });

            const itensEsperadosBeta = contratoBetaSabor.itens.map(item => ({
                contratoItemId: item.id,
                contratoItemNome: item.nome,
                quantidadeEsperada: Number(item.quantidade),
                unidadeMedida: item.unidadeMedida,
                precoUnitario: Number(item.precoUnitario)
            }));

            const totalPreco = contratoBetaSabor.itens.reduce((sum, item) =>
                sum + (Number(item.quantidade) * Number(item.precoUnitario)), 0
            );

            const loteBeta = await prisma.lote.create({
                data: {
                    unidadeId: unidadeMap["Fazenda Beta"],
                    responsavelId: (responsavelBeta && responsavelBeta.id) || usuarioMap["Julia Alves"],
                    nome: `Lote Laticínios - Sabor do Campo - ${new Date().toLocaleDateString('pt-BR')}`,
                    tipo: TL.LEITE,
                    quantidade: contratoBetaSabor.itens.length,            // <- corrigido
                    preco: Number(totalPreco.toFixed(2)),                  // <- number com 2 casas
                    unidadeMedida: UMED.LITRO,
                    observacoes: `Lote com ${contratoBetaSabor.itens.length} produtos lácteos para Sabor do Campo Laticínios`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoBetaSabor.id,
                    dataEnvioReferencia: contratoBetaSabor.dataEnvio,
                    itensEsperados: itensEsperadosBeta
                }
            });
            lotesGerados.push(loteBeta);
            console.log(`✓ Lote criado: ${loteBeta.nome} (${loteBeta.quantidade} itens)`);
        }

        // === FAZENDA TESTE -> CASA ÚTIL MERCADO ===
        console.log("Processando: Fazenda Teste -> Casa Útil Mercado");

        const contratoTesteCasa = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                unidadeId: unidadeMap["Casa Útil Mercado"],
                status: SCON.ATIVO
            },
            include: { itens: true, fornecedorInterno: true }
        });

        if (contratoTesteCasa) {
            const responsavelTeste = await prisma.usuario.findFirst({
                where: { unidadeId: unidadeMap["Fazenda Teste"], perfilId: perfilMap["GERENTE_FAZENDA"] }
            });

            const itensEsperadosTesteCasa = contratoTesteCasa.itens.map(item => ({
                contratoItemId: item.id,
                contratoItemNome: item.nome,
                quantidadeEsperada: Number(item.quantidade),
                unidadeMedida: item.unidadeMedida,
                precoUnitario: Number(item.precoUnitario)
            }));

            const totalPrecoTesteCasa = contratoTesteCasa.itens.reduce((sum, item) =>
                sum + (Number(item.quantidade) * Number(item.precoUnitario)), 0
            );

            const loteTesteCasa = await prisma.lote.create({
                data: {
                    unidadeId: unidadeMap["Fazenda Teste"],
                    responsavelId: (responsavelTeste && responsavelTeste.id) || usuarioMap["Julia Alves"],
                    nome: `Lote Mix - Casa Útil Mercado - ${new Date().toLocaleDateString('pt-BR')}`,
                    tipo: TL.OUTRO,
                    quantidade: contratoTesteCasa.itens.length,
                    preco: Number(totalPrecoTesteCasa.toFixed(2)),
                    unidadeMedida: UMED.UNIDADE,
                    observacoes: `Lote com ${contratoTesteCasa.itens.length} produtos diversos para Casa Útil Mercado`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoTesteCasa.id,
                    dataEnvioReferencia: contratoTesteCasa.dataEnvio,
                    itensEsperados: itensEsperadosTesteCasa
                }
            });
            lotesGerados.push(loteTesteCasa);
            console.log(`✓ Lote criado: ${loteTesteCasa.nome} (${loteTesteCasa.quantidade} itens)`);
        }

        // === FAZENDA TESTE -> LOJA TESTE ===
        console.log("Processando: Fazenda Teste -> Loja Teste");

        const contratoTesteLoja = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                unidadeId: unidadeMap["Loja Teste"],
                status: SCON.ATIVO
            },
            include: { itens: true, fornecedorInterno: true }
        });

        if (contratoTesteLoja) {
            const responsavelTeste = await prisma.usuario.findFirst({
                where: { unidadeId: unidadeMap["Fazenda Teste"], perfilId: perfilMap["GERENTE_FAZENDA"] }
            });

            const itensEsperadosTesteLoja = contratoTesteLoja.itens.map(item => ({
                contratoItemId: item.id,
                contratoItemNome: item.nome,
                quantidadeEsperada: Number(item.quantidade),
                unidadeMedida: item.unidadeMedida,
                precoUnitario: Number(item.precoUnitario)
            }));

            const totalPrecoTesteLoja = contratoTesteLoja.itens.reduce((sum, item) =>
                sum + (Number(item.quantidade) * Number(item.precoUnitario)), 0
            );

            const loteTesteLoja = await prisma.lote.create({
                data: {
                    unidadeId: unidadeMap["Fazenda Teste"],
                    responsavelId: (responsavelTeste && responsavelTeste.id) || usuarioMap["Julia Alves"],
                    nome: `Lote Laticínios e Carnes - Loja Teste - ${new Date().toLocaleDateString('pt-BR')}`,
                    tipo: TL.LEITE,
                    quantidade: contratoTesteLoja.itens.length,
                    preco: Number(totalPrecoTesteLoja.toFixed(2)),
                    unidadeMedida: UMED.UNIDADE,
                    observacoes: `Lote com ${contratoTesteLoja.itens.length} produtos (laticínios e carnes) para Loja Teste`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoTesteLoja.id,
                    dataEnvioReferencia: contratoTesteLoja.dataEnvio,
                    itensEsperados: itensEsperadosTesteLoja
                }
            });
            lotesGerados.push(loteTesteLoja);
            console.log(`✓ Lote criado: ${loteTesteLoja.nome} (${loteTesteLoja.quantidade} itens)`);
        }

        // === FAZENDA ALPHA -> AGROBOI ===
        console.log("Processando: Fazenda Alpha -> AgroBoi");

        const contratoAlphaAgro = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                unidadeId: unidadeMap["AgroBoi"],
                status: SCON.ATIVO
            },
            include: { itens: true, fornecedorInterno: true }
        });

        if (contratoAlphaAgro) {
            const responsavelAlpha = await prisma.usuario.findFirst({
                where: { unidadeId: unidadeMap["Fazenda Alpha"], perfilId: perfilMap["GERENTE_FAZENDA"] }
            });

            const itensEsperadosAlphaAgro = contratoAlphaAgro.itens.map(item => ({
                contratoItemId: item.id,
                contratoItemNome: item.nome,
                quantidadeEsperada: Number(item.quantidade),
                unidadeMedida: item.unidadeMedida,
                precoUnitario: Number(item.precoUnitario)
            }));

            const totalPrecoAlphaAgro = contratoAlphaAgro.itens.reduce((sum, item) =>
                sum + (Number(item.quantidade) * Number(item.precoUnitario)), 0
            );

            const loteAlphaAgro = await prisma.lote.create({
                data: {
                    unidadeId: unidadeMap["Fazenda Alpha"],
                    responsavelId: (responsavelAlpha && responsavelAlpha.id) || usuarioMap["Julia Alves"],
                    nome: `Lote Bovinos - AgroBoi - ${new Date().toLocaleDateString('pt-BR')}`,
                    tipo: TL.BOVINOS,                                 // <- corrigido
                    quantidade: contratoAlphaAgro.itens.length,
                    preco: Number(totalPrecoAlphaAgro.toFixed(2)),
                    unidadeMedida: UMED.KG,
                    observacoes: `Lote com ${contratoAlphaAgro.itens.length} produtos bovinos (carne e derivados) para AgroBoi`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoAlphaAgro.id,
                    dataEnvioReferencia: contratoAlphaAgro.dataEnvio,
                    itensEsperados: itensEsperadosAlphaAgro
                }
            });
            lotesGerados.push(loteAlphaAgro);
            console.log(`✓ Lote criado: ${loteAlphaAgro.nome} (${loteAlphaAgro.quantidade} itens)`);
        }

        // === FAZENDA ALPHA -> CASA ÚTIL MERCADO ===
        console.log("Processando: Fazenda Alpha -> Casa Útil Mercado");

        const contratoAlphaCasa = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                unidadeId: unidadeMap["Casa Útil Mercado"],
                status: SCON.ATIVO
            },
            include: { itens: true, fornecedorInterno: true }
        });

        if (contratoAlphaCasa && contratoAlphaCasa.itens.length > 0) {
            const responsavelAlpha = await prisma.usuario.findFirst({
                where: { unidadeId: unidadeMap["Fazenda Alpha"], perfilId: perfilMap["GERENTE_FAZENDA"] }
            });

            const itensEsperadosAlphaCasa = contratoAlphaCasa.itens.map(item => ({
                contratoItemId: item.id,
                contratoItemNome: item.nome,
                quantidadeEsperada: Number(item.quantidade),
                unidadeMedida: item.unidadeMedida,
                precoUnitario: Number(item.precoUnitario)
            }));

            const totalPrecoAlphaCasa = contratoAlphaCasa.itens.reduce((sum, item) =>
                sum + (Number(item.quantidade) * Number(item.precoUnitario)), 0
            );

            const loteAlphaCasa = await prisma.lote.create({
                data: {
                    unidadeId: unidadeMap["Fazenda Alpha"],
                    responsavelId: (responsavelAlpha && responsavelAlpha.id) || usuarioMap["Julia Alves"],
                    nome: `Lote Bovinos - Casa Útil - ${new Date().toLocaleDateString('pt-BR')}`,
                    tipo: TL.BOVINOS,
                    quantidade: contratoAlphaCasa.itens.length,
                    preco: Number(totalPrecoAlphaCasa.toFixed(2)),
                    unidadeMedida: UMED.KG,
                    observacoes: `Lote com ${contratoAlphaCasa.itens.length} produtos bovinos para Casa Útil Mercado`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoAlphaCasa.id,
                    dataEnvioReferencia: contratoAlphaCasa.dataEnvio,
                    itensEsperados: itensEsperadosAlphaCasa
                }
            });
            lotesGerados.push(loteAlphaCasa);
            console.log(`✓ Lote criado: ${loteAlphaCasa.nome} (${loteAlphaCasa.quantidade} itens)`);
        }

        console.log(`\n✅ Total de ${lotesGerados.length} lotes criados para contratos com lojas`);


        // ===== CRIAR PRODUÇÕES BASEADAS NOS LOTES =====
        console.log("\n🏭 Criando produções baseadas nos lotes...");

        const producoesGeradas = [];

        for (const lote of lotesGerados) {
            const contrato = await prisma.contrato.findUnique({
                where: { id: lote.contratoId },
                include: { itens: true, unidade: true }
            });

            if (!contrato) continue;

            // Buscar animais ou plantios associados ao lote
            const animaisLote = await prisma.animal.findMany({
                where: { loteId: lote.id }
            });

            const plantiosLote = await prisma.plantio.findMany({
                where: { loteId: lote.id }
            });

            // Criar produção para cada item do contrato
            for (const item of contrato.itens) {
                const quantidadeContratada = Number(item.quantidade);
                const precoUnit = Number(item.precoUnitario);

                // Determinar percentuais baseados no tipo de produto
                let perdaPercent = 5.0;
                let custoMaoObraPercent = 0.15;
                let outrosCustosPercent = 0.10;
                let metodo = "MANUAL";

                if (lote.tipo === TL.GADO || lote.tipo === TL.BOVINOS) {
                    perdaPercent = 8.0;
                    custoMaoObraPercent = 0.20;
                    outrosCustosPercent = 0.12;
                    metodo = "MISTA";
                } else if (lote.tipo === TL.LEITE) {
                    perdaPercent = 5.0;
                    custoMaoObraPercent = 0.15;
                    metodo = "INDUSTRIAL";
                }

                const quantidadeBruta = quantidadeContratada * (1 + perdaPercent / 100);

                const producao = await prisma.producao.create({
                    data: {
                        loteId: lote.id,
                        animalId: animaisLote.length > 0 ? animaisLote[0].id : null,
                        plantioId: plantiosLote.length > 0 ? plantiosLote[0].id : null,
                        tipoProduto: item.nome,
                        quantidadeBruta: quantidadeBruta,
                        quantidadeLiquida: quantidadeContratada,
                        unidadeMedida: item.unidadeMedida,
                        perdaPercent: perdaPercent,
                        custoMaoObra: quantidadeContratada * precoUnit * custoMaoObraPercent,
                        outrosCustos: quantidadeContratada * precoUnit * outrosCustosPercent,
                        custoTotal: quantidadeContratada * precoUnit * 0.70,
                        custoUnitario: precoUnit * 0.70,
                        dataInicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
                        dataFim: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
                        dataColheita: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        dataRegistro: new Date(),
                        status: SPROD.FINALIZADA,
                        metodo: metodo,
                        responsavelId: lote.responsavelId,
                        destinoUnidadeId: contrato.unidadeId,
                        unidadeId: lote.unidadeId,
                        observacoes: `Produção de ${item.nome} para contrato com ${contrato.unidade.nome}`
                    }
                });
                producoesGeradas.push(producao);
            }
        }

        console.log(`✅ ${producoesGeradas.length} produções criadas`);

        // ===== CRIAR ATIVIDADES ANIMALIA BASEADAS NOS LOTES =====
        console.log("\n🐄 Criando atividades de manejo animal baseadas nos lotes...");

        const atividadesAnimaliaCriadas = [];

        for (const lote of lotesGerados) {
            // Apenas lotes com animais
            if (![TL.GADO, TL.BOVINOS, TL.LEITE].includes(lote.tipo)) continue;

            const animaisLote = await prisma.animal.findMany({
                where: { loteId: lote.id }
            });

            if (animaisLote.length === 0) continue;

            for (const animal of animaisLote) {
                const atividadesParaAnimal = [
                    {
                        tipo: TANIMALIA.MANEJO_GERAL,
                        descricao: `Manejo geral do lote ${lote.nome} - ${animal.raca}`,
                        dataInicio: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                        status: SATVDA.CONCLUIDA
                    },
                    {
                        tipo: TANIMALIA.NUTRICAO,
                        descricao: `Preparação nutricional para produção - ${animal.raca}`,
                        dataInicio: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                        dataFim: null,
                        status: SATVDA.ATIVA
                    },
                    {
                        tipo: TANIMALIA.MANEJO_PESAGEM,
                        descricao: `Pesagem pré-produção - ${animal.raca}`,
                        dataInicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        status: SATVDA.CONCLUIDA
                    }
                ];

                // Se for lote de leite, adicionar ordenha
                if (lote.tipo === TL.LEITE) {
                    atividadesParaAnimal.push({
                        tipo: TANIMALIA.ORDENHA_DIARIA,
                        descricao: `Ordenha diária - ${animal.raca}`,
                        dataInicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                        dataFim: null,
                        status: SATVDA.ATIVA
                    });
                }

                for (const atvd of atividadesParaAnimal) {
                    const atividade = await prisma.atvdAnimalia.create({
                        data: {
                            animalId: animal.id,
                            loteId: lote.id,
                            responsavelId: lote.responsavelId,
                            descricao: atvd.descricao,
                            tipo: atvd.tipo,
                            dataInicio: atvd.dataInicio,
                            dataFim: atvd.dataFim,
                            status: atvd.status
                        }
                    });
                    atividadesAnimaliaCriadas.push(atividade);
                }
            }
        }

        console.log(`✅ ${atividadesAnimaliaCriadas.length} atividades de manejo animal criadas`);

        // ===== CRIAR ATIVIDADES AGRÍCOLAS BASEADAS NOS LOTES =====
        console.log("\n🌾 Criando atividades agrícolas baseadas nos lotes...");

        const atividadesAgricolasCriadas = [];

        for (const lote of lotesGerados) {
            // Apenas lotes com plantios
            if (lote.tipo !== TL.PLANTIO && lote.tipo !== TL.SOJA) continue;

            const plantiosLote = await prisma.plantio.findMany({
                where: { loteId: lote.id }
            });

            if (plantiosLote.length === 0) continue;

            for (const plantio of plantiosLote) {
                const atividadesParaPlantio = [
                    {
                        tipo: TATV.PLANTIO,
                        descricao: `Plantio - ${plantio.categoria} - ${lote.nome}`,
                        dataInicio: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.IRRIGACAO,
                        descricao: `Irrigação - ${plantio.categoria}`,
                        dataInicio: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.ADUBACAO,
                        descricao: `Adubação - ${plantio.categoria}`,
                        dataInicio: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.COLHEITA,
                        descricao: `Colheita - ${plantio.categoria} - ${lote.nome}`,
                        dataInicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    }
                ];

                for (const atvd of atividadesParaPlantio) {
                    const atividade = await prisma.atvdAgricola.create({
                        data: {
                            loteId: lote.id,
                            responsavelId: lote.responsavelId,
                            descricao: atvd.descricao,
                            tipo: atvd.tipo,
                            dataInicio: atvd.dataInicio,
                            dataFim: atvd.dataFim,
                            status: atvd.status
                        }
                    });
                    atividadesAgricolasCriadas.push(atividade);
                }
            }
        }

        console.log(`✅ ${atividadesAgricolasCriadas.length} atividades agrícolas criadas`);

        console.log(`\n📊 Resumo completo:`);
        console.log(`   - ${lotesGerados.length} lotes criados`);
        console.log(`   - ${producoesGeradas.length} produções finalizadas`);
        console.log(`   - ${atividadesAnimaliaCriadas.length} atividades animais`);
        console.log(`   - ${atividadesAgricolasCriadas.length} atividades agrícolas\n`);






        // pedidos loja

        // estoque loja

        // ===== CRIAR PRODUTOS PARA VENDA NAS LOJAS =====
        console.log("\n🛒 Criando produtos para venda nas lojas...");

        const produtosParaVenda = [];

        // === SABOR DO CAMPO LATICÍNIOS ===
        console.log("Criando produtos: Sabor do Campo Laticínios");

        const estoquesSaborCampo = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Sabor do Campo Laticínios"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesSaborCampo) {
            // Pegar 50% do estoque para transformar em produtos à venda
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.5);

            if (qtdParaVenda > 0) {
                // Criar produtos individuais
                for (let i = 0; i < Math.min(qtdParaVenda, 10); i++) { // Limitar a 10 produtos por item
                    const markup = 1.25; // 25% de margem
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    // Validade baseada no tipo de produto
                    if (estoqueItem.nome.includes("Leite")) {
                        dataValidade.setDate(dataValidade.getDate() + 7); // 7 dias
                    } else if (estoqueItem.nome.includes("Queijo") || estoqueItem.nome.includes("Manteiga")) {
                        dataValidade.setDate(dataValidade.getDate() + 30); // 30 dias
                    } else if (estoqueItem.nome.includes("Iogurte")) {
                        dataValidade.setDate(dataValidade.getDate() + 15); // 15 dias
                    } else {
                        dataValidade.setDate(dataValidade.getDate() + 20); // padrão 20 dias
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                            origemUnidadeId: unidadeMap["Fazenda Beta"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-SCL-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: "Laticínios",
                            descricao: `${estoqueItem.nome} - Produto pronto para venda`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === LOJA TESTE ===
        console.log("Criando produtos: Loja Teste");

        const estoquesLojaTeste = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Loja Teste"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesLojaTeste) {
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.4); // 40% para venda

            if (qtdParaVenda > 0) {
                for (let i = 0; i < Math.min(qtdParaVenda, 8); i++) {
                    const markup = 1.30; // 30% de margem
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    if (estoqueItem.nome.includes("Leite")) {
                        dataValidade.setDate(dataValidade.getDate() + 7);
                    } else if (estoqueItem.nome.includes("Queijo")) {
                        dataValidade.setDate(dataValidade.getDate() + 25);
                    } else if (estoqueItem.nome.includes("Carne")) {
                        dataValidade.setDate(dataValidade.getDate() + 5);
                    } else {
                        dataValidade.setDate(dataValidade.getDate() + 15);
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Loja Teste"],
                            origemUnidadeId: unidadeMap["Fazenda Teste"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-LT-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: estoqueItem.nome.includes("Leite") || estoqueItem.nome.includes("Queijo") ? "Laticínios" : "Açougue",
                            descricao: `${estoqueItem.nome} - Disponível para venda`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === CASA ÚTIL MERCADO ===
        console.log("Criando produtos: Casa Útil Mercado");

        const estoquesCasaUtil = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Casa Útil Mercado"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesCasaUtil) {
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.6); // 60% para venda

            if (qtdParaVenda > 0) {
                for (let i = 0; i < Math.min(qtdParaVenda, 15); i++) {
                    const markup = 1.20; // 20% de margem (grãos têm margem menor)
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    // Grãos têm validade maior
                    if (estoqueItem.nome.includes("Soja") || estoqueItem.nome.includes("Milho") || estoqueItem.nome.includes("Trigo")) {
                        dataValidade.setFullYear(dataValidade.getFullYear() + 1); // 1 ano
                    } else if (estoqueItem.nome.includes("Óleo")) {
                        dataValidade.setMonth(dataValidade.getMonth() + 6); // 6 meses
                    } else {
                        dataValidade.setMonth(dataValidade.getMonth() + 3); // 3 meses
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Casa Útil Mercado"],
                            origemUnidadeId: unidadeMap["Fazenda Gamma"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-CUM-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: "Grãos e Cereais",
                            descricao: `${estoqueItem.nome} - Produto de qualidade premium`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true,
                            tags: ["orgânico", "premium", "selecionado"]
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === VERDEFRESCO HORTALIÇAS ===
        console.log("Criando produtos: VerdeFresco Hortaliças");

        // Como VerdeFresco não tem estoque criado ainda, vamos criar alguns produtos manualmente
        const produtosVerdeFresco = [
            { nome: "Alface Crespa", preco: 3.50, validade: 3, peso: 0.200, un: UMED.UNIDADE },
            { nome: "Alface Americana", preco: 4.20, validade: 3, peso: 0.250, un: UMED.UNIDADE },
            { nome: "Rúcula Fresca", preco: 3.80, validade: 2, peso: 0.150, un: UMED.UNIDADE },
            { nome: "Couve Manteiga", preco: 3.00, validade: 4, peso: 0.250, un: UMED.UNIDADE },
            { nome: "Tomate Caixa", preco: 8.50, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Pepino Japonês", preco: 5.00, validade: 5, peso: 0.200, un: UMED.UNIDADE },
            { nome: "Cenoura", preco: 4.50, validade: 10, peso: 1.000, un: UMED.KG }
        ];

        for (const item of produtosVerdeFresco) {
            const qtd = Math.floor(Math.random() * 20) + 10; // Entre 10 e 30 unidades

            for (let i = 0; i < qtd; i++) {
                const dataFabricacao = new Date();
                const dataValidade = new Date();
                dataValidade.setDate(dataValidade.getDate() + item.validade);

                const produto = await prisma.produto.create({
                    data: {
                        unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                        origemUnidadeId: unidadeMap["Fazenda Delta"],
                        nome: item.nome,
                        sku: `VENDA-VFH-${item.nome.replace(/\s+/g, '')}-${i}-${Date.now()}`,
                        categoria: "Hortaliças",
                        descricao: `${item.nome} - Fresco e orgânico`,
                        preco: item.preco,
                        dataFabricacao: dataFabricacao,
                        dataValidade: dataValidade,
                        unidadeMedida: item.un,
                        pesoUnidade: item.peso,
                        isForSale: true,
                        tags: ["fresco", "orgânico", "local"]
                    }
                });
                produtosParaVenda.push(produto);
            }
        }

        // === AGROBOI ===
        console.log("Criando produtos: AgroBoi");

        const produtosAgroBoi = [
            { nome: "Coxão Mole", preco: 52.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Alcatra", preco: 72.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Contrafilé", preco: 78.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Picanha", preco: 110.00, validade: 5, peso: 1.000, un: UMED.KG },
            { nome: "Costela Ripa", preco: 36.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Maminha", preco: 62.00, validade: 6, peso: 1.000, un: UMED.KG },
            { nome: "Carne Moída", preco: 32.00, validade: 3, peso: 1.000, un: UMED.KG },
            { nome: "Hambúrguer Artesanal 120g", preco: 7.50, validade: 30, peso: 0.120, un: UMED.UNIDADE },
            { nome: "Linguiça Bovina", preco: 38.00, validade: 20, peso: 1.000, un: UMED.KG }
        ];

        for (const item of produtosAgroBoi) {
            const qtd = Math.floor(Math.random() * 15) + 8; // Entre 8 e 23 unidades

            for (let i = 0; i < qtd; i++) {
                const dataFabricacao = new Date();
                const dataValidade = new Date();
                dataValidade.setDate(dataValidade.getDate() + item.validade);

                const produto = await prisma.produto.create({
                    data: {
                        unidadeId: unidadeMap["AgroBoi"],
                        origemUnidadeId: unidadeMap["Fazenda Alpha"],
                        nome: item.nome,
                        sku: `VENDA-AB-${item.nome.replace(/\s+/g, '')}-${i}-${Date.now()}`,
                        categoria: "Carnes",
                        descricao: `${item.nome} - Carne de qualidade certificada`,
                        preco: item.preco,
                        dataFabricacao: dataFabricacao,
                        dataValidade: dataValidade,
                        unidadeMedida: item.un,
                        pesoUnidade: item.peso,
                        isForSale: true,
                        tags: ["premium", "certificado", "rastreável"]
                    }
                });
                produtosParaVenda.push(produto);
            }
        }

        // ===== GARANTIR PRODUTOS PARA TODAS AS LOJAS =====
        console.log("\n🛍️  Garantindo produtos para todas as lojas...");
        
        const todasLojas = await prisma.unidade.findMany({
            where: { tipo: TU.LOJA }
        });

        for (const loja of todasLojas) {
            const produtosLoja = produtosParaVenda.filter(p => p.unidadeId === loja.id);
            
            // Se a loja não tem produtos, criar produtos padrão
            if (produtosLoja.length === 0) {
                console.log(`   Criando produtos padrão para ${loja.nome}...`);
                
                let produtosPadrao = [];
                
                if (loja.nome === "Sabor do Campo Laticínios") {
                    produtosPadrao = [
                        { nome: "Leite pasteurizado 1L", preco: 6.50, validade: 7, peso: 1.0, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Queijo fresco 500g", preco: 18.00, validade: 30, peso: 0.5, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Iogurte natural 500g", preco: 8.50, validade: 15, peso: 0.5, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Manteiga 200g", preco: 12.00, validade: 30, peso: 0.2, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Requeijão cremoso 250g", preco: 9.50, validade: 20, peso: 0.25, un: UMED.UNIDADE, categoria: "Laticínios" }
                    ];
                } else if (loja.nome === "Casa Útil Mercado") {
                    produtosPadrao = [
                        { nome: "Soja grão (saca 60kg)", preco: 180.00, validade: 365, peso: 60.0, un: UMED.SACA, categoria: "Grãos e Cereais" },
                        { nome: "Milho grão (saca 60kg)", preco: 150.00, validade: 365, peso: 60.0, un: UMED.SACA, categoria: "Grãos e Cereais" },
                        { nome: "Trigo (saca 50kg)", preco: 140.00, validade: 365, peso: 50.0, un: UMED.SACA, categoria: "Grãos e Cereais" },
                        { nome: "Feijão carioca (saca 30kg)", preco: 220.00, validade: 365, peso: 30.0, un: UMED.SACA, categoria: "Grãos e Cereais" },
                        { nome: "Óleo de soja refinado 1L", preco: 12.50, validade: 180, peso: 1.0, un: UMED.LITRO, categoria: "Grãos e Cereais" },
                        { nome: "Fubá de milho 1kg", preco: 8.00, validade: 365, peso: 1.0, un: UMED.KG, categoria: "Grãos e Cereais" }
                    ];
                } else if (loja.nome === "Loja Teste") {
                    produtosPadrao = [
                        { nome: "Leite pasteurizado 1L", preco: 6.50, validade: 7, peso: 1.0, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Queijo fresco 500g", preco: 18.00, validade: 30, peso: 0.5, un: UMED.UNIDADE, categoria: "Laticínios" },
                        { nome: "Carne bovina corte dianteiro", preco: 45.00, validade: 5, peso: 1.0, un: UMED.KG, categoria: "Carnes" },
                        { nome: "Carne bovina corte traseiro", preco: 55.00, validade: 5, peso: 1.0, un: UMED.KG, categoria: "Carnes" }
                    ];
                }

                // Criar produtos para esta loja
                for (const item of produtosPadrao) {
                    const qtd = Math.floor(Math.random() * 20) + 15; // Entre 15 e 35 unidades
                    
                    for (let i = 0; i < qtd; i++) {
                        const dataFabricacao = new Date();
                        const dataValidade = new Date();
                        dataValidade.setDate(dataValidade.getDate() + item.validade);

                        const produto = await prisma.produto.create({
                            data: {
                                unidadeId: loja.id,
                                nome: item.nome,
                                sku: `VENDA-${loja.nome.substring(0, 3).toUpperCase()}-${item.nome.substring(0, 10).replace(/\s+/g, '')}-${i}-${Date.now()}`,
                                categoria: item.categoria,
                                descricao: `${item.nome} - Produto de qualidade`,
                                preco: item.preco,
                                dataFabricacao: dataFabricacao,
                                dataValidade: dataValidade,
                                unidadeMedida: item.un,
                                pesoUnidade: item.peso,
                                isForSale: true
                            }
                        });
                        produtosParaVenda.push(produto);
                    }
                }
            }
        }

        console.log(`✓ ${produtosParaVenda.length} produtos criados e disponíveis para venda nas lojas`);

        // Estatísticas por loja
        const estatisticas = {
            "Sabor do Campo Laticínios": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Sabor do Campo Laticínios"]).length,
            "Loja Teste": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Loja Teste"]).length,
            "Casa Útil Mercado": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Casa Útil Mercado"]).length,
            "VerdeFresco Hortaliças": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["VerdeFresco Hortaliças"]).length,
            "AgroBoi": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["AgroBoi"]).length
        };

        console.log("\n📊 Produtos por loja:");
        for (const [loja, qtd] of Object.entries(estatisticas)) {
            console.log(`   - ${loja}: ${qtd} produtos`);
        }
        console.log("");

        // ===== CRIAR ESTOQUEPRODUTO A PARTIR DOS PRODUTOS CRIADOS PARA VENDA =====
        console.log("\n📦 Criando EstoqueProduto a partir dos produtos para venda...");
        
        // Agrupar produtos por unidade
        const produtosPorUnidade = {};
        for (const produto of produtosParaVenda) {
            if (!produtosPorUnidade[produto.unidadeId]) {
                produtosPorUnidade[produto.unidadeId] = [];
            }
            produtosPorUnidade[produto.unidadeId].push(produto);
        }

        // Criar EstoqueProduto para cada produto
        let estoqueProdutosCriados = 0;
        for (const [unidadeId, produtos] of Object.entries(produtosPorUnidade)) {
            // Buscar estoque da unidade
            const estoque = await prisma.estoque.findUnique({
                where: { unidadeId: parseInt(unidadeId) }
            });

            if (!estoque) {
                console.log(`⚠️  Estoque não encontrado para unidade ${unidadeId}`);
                continue;
            }

            // Agrupar produtos por nome para consolidar quantidade
            const produtosAgrupados = {};
            for (const produto of produtos) {
                const chave = produto.nome;
                if (!produtosAgrupados[chave]) {
                    produtosAgrupados[chave] = {
                        produto: produto,
                        quantidade: 0,
                        precoUnitario: Number(produto.preco)
                    };
                }
                produtosAgrupados[chave].quantidade += 1;
            }

            // Criar EstoqueProduto para cada grupo
            for (const [nome, dados] of Object.entries(produtosAgrupados)) {
                try {
                    // Verificar se já existe
                    const existe = await prisma.estoqueProduto.findFirst({
                        where: {
                            estoqueId: estoque.id,
                            produtoId: dados.produto.id
                        }
                    });

                    if (existe) {
                        // Atualizar quantidade
                        await prisma.estoqueProduto.update({
                            where: { id: existe.id },
                            data: {
                                qntdAtual: existe.qntdAtual + dados.quantidade
                            }
                        });
                    } else {
                        // Criar novo
                        await prisma.estoqueProduto.create({
                            data: {
                                nome: dados.produto.nome,
                                sku: dados.produto.sku,
                                estoqueId: estoque.id,
                                produtoId: dados.produto.id,
                                qntdAtual: dados.quantidade,
                                qntdMin: 1,
                                precoUnitario: dados.precoUnitario,
                                unidadeBase: dados.produto.unidadeMedida || UMED.UNIDADE,
                                pesoUnidade: dados.produto.pesoUnidade,
                                validade: dados.produto.dataValidade,
                                dataEntrada: new Date()
                            }
                        });
                    }
                    estoqueProdutosCriados++;
                } catch (error) {
                    console.log(`⚠️  Erro ao criar EstoqueProduto para ${nome}: ${error.message}`);
                }
            }
        }

        console.log(`✓ ${estoqueProdutosCriados} EstoqueProduto criados/atualizados`);
        
        // Garantir que TODOS os produtos tenham EstoqueProduto
        console.log("\n🔍 Verificando produtos sem EstoqueProduto...");
        
        // Buscar todos os produtos de lojas
        const todosProdutosLoja = await prisma.produto.findMany({
            where: {
                isForSale: true,
                unidade: {
                    tipo: TU.LOJA
                }
            },
            include: {
                unidade: true,
                estoqueProdutos: true
            }
        });

        // Filtrar produtos que não têm EstoqueProduto
        const produtosSemEstoque = todosProdutosLoja.filter(p => p.estoqueProdutos.length === 0);

        if (produtosSemEstoque.length > 0) {
            console.log(`   Encontrados ${produtosSemEstoque.length} produtos sem EstoqueProduto, criando...`);
            
            for (const produto of produtosSemEstoque) {
                const estoque = await prisma.estoque.findUnique({
                    where: { unidadeId: produto.unidadeId }
                });

                if (estoque) {
                    try {
                        await prisma.estoqueProduto.create({
                            data: {
                                nome: produto.nome,
                                sku: produto.sku,
                                estoqueId: estoque.id,
                                produtoId: produto.id,
                                qntdAtual: Math.floor(Math.random() * 10) + 5, // Entre 5 e 15 unidades
                                qntdMin: 1,
                                precoUnitario: Number(produto.preco),
                                unidadeBase: produto.unidadeMedida || UMED.UNIDADE,
                                pesoUnidade: produto.pesoUnidade,
                                validade: produto.dataValidade,
                                dataEntrada: new Date()
                            }
                        });
                        estoqueProdutosCriados++;
                    } catch (error) {
                        console.log(`   ⚠️  Erro ao criar EstoqueProduto para ${produto.nome}: ${error.message}`);
                    }
                }
            }
            console.log(`✓ ${produtosSemEstoque.length} EstoqueProduto adicionais criados`);
        }

        // CAIXAS
        const lojas = await prisma.unidade.findMany({
            where: { tipo: TU.LOJA }
        });

        for (const loja of lojas) {
            // Verificar se já existe caixa aberto para esta loja
            const caixaExistente = await prisma.caixa.findFirst({
                where: {
                    unidadeId: loja.id,
                    status: true
                }
            });

            if (caixaExistente) {
                continue; // Já existe caixa aberto
            }

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

        // ===== CRIAR VENDAS E ITENS DE VENDA PARA HOJE E ÚLTIMOS 15 DIAS =====
        console.log("\n💰 Criando vendas para hoje e últimos 15 dias nas lojas específicas...");

        const vendasCriadas = [];

        // Data de hoje (início e fim do dia para filtros)
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const fimHoje = new Date();
        fimHoje.setHours(23, 59, 59, 999);

        console.log(`📅 Criando vendas para: ${hoje.toLocaleDateString('pt-BR')} e últimos 15 dias`);

        // Buscar caixas abertos em TODAS as lojas
        const caixasAbertas = await prisma.caixa.findMany({
            where: {
                status: true,
                unidade: {
                    tipo: TU.LOJA
                }
            },
            include: {
                unidade: true,
                usuario: true
            }
        });

        if (caixasAbertas.length === 0) {
            console.log("⚠️  Nenhum caixa aberto nas lojas");
        } else {
            console.log(`✓ Encontrados ${caixasAbertas.length} caixas abertos nas lojas`);
        }

        for (const caixa of caixasAbertas) {
            // Buscar estoque da unidade
            const estoque = await prisma.estoque.findUnique({
                where: { unidadeId: caixa.unidadeId }
            });

            if (!estoque) {
                console.log(`⚠️  Nenhum estoque encontrado para ${caixa.unidade.nome}`);
                continue;
            }

            // Buscar produtos de estoque disponíveis para venda nesta loja
            const estoqueProdutosDisponiveis = await prisma.estoqueProduto.findMany({
                where: {
                    estoqueId: estoque.id,
                    qntdAtual: { gt: 0 },
                    produtoId: { not: null }, // Garantir que tem produto relacionado
                    produto: {
                    isForSale: true
                    }
                },
                include: {
                    produto: true
                },
                take: 50
            });

            if (estoqueProdutosDisponiveis.length === 0) {
                console.log(`⚠️  Nenhum produto disponível no estoque para ${caixa.unidade.nome}`);
                continue;
            }

            // Criar entre 30 e 60 vendas por loja
            const numVendas = Math.floor(Math.random() * 31) + 30;

            for (let i = 0; i < numVendas; i++) {
                // Selecionar entre 1 e 5 produtos aleatórios
                const numItens = Math.floor(Math.random() * 5) + 1;
                const produtosSelecionados = [];

                for (let j = 0; j < numItens; j++) {
                    const estoqueProdutoAleatorio = estoqueProdutosDisponiveis[Math.floor(Math.random() * estoqueProdutosDisponiveis.length)];
                    produtosSelecionados.push(estoqueProdutoAleatorio);
                }

                // Calcular total da venda
                let totalVenda = 0;
                const itensVenda = [];

                for (const estoqueProduto of produtosSelecionados) {
                    // Garantir que a quantidade não exceda o estoque disponível
                    const quantidadeMaxima = Math.min(estoqueProduto.qntdAtual, 3);
                    const quantidade = Math.floor(Math.random() * quantidadeMaxima) + 1; // 1 a quantidadeMaxima unidades
                    // Usar precoUnitario do EstoqueProduto ou do Produto relacionado
                    const precoUnitario = estoqueProduto.precoUnitario 
                        ? Number(estoqueProduto.precoUnitario) 
                        : (estoqueProduto.produto ? Number(estoqueProduto.produto.preco) : 0);
                    const desconto = Math.random() < 0.3 ? (precoUnitario * 0.05 * quantidade) : 0; // 30% chance de 5% desconto
                    const subtotal = (precoUnitario * quantidade) - desconto;

                    totalVenda += subtotal;

                    itensVenda.push({
                        produtoId: estoqueProduto.id, // Usar EstoqueProduto.id
                        quantidade: quantidade,
                        precoUnitario: precoUnitario,
                        desconto: desconto,
                        subtotal: subtotal
                    });
                }

                // Definir forma de pagamento aleatória
                const formasPagamento = [TPAG.DINHEIRO, TPAG.CARTAO, TPAG.PIX];
                const formaPagamento = formasPagamento[Math.floor(Math.random() * formasPagamento.length)];

                // Data da venda = Distribuir entre hoje e últimos 15 dias
                // 40% das vendas são de hoje, 60% distribuídas nos últimos 15 dias
                const diasAtras = Math.random() < 0.4 
                    ? 0  // 40% das vendas são de hoje
                    : Math.floor(Math.random() * 15) + 1; // 60% distribuídas nos últimos 15 dias
                
                const dataVenda = new Date();
                dataVenda.setDate(dataVenda.getDate() - diasAtras);
                dataVenda.setHours(
                    Math.floor(Math.random() * 12) + 8, // Hora entre 8h e 19h
                    Math.floor(Math.random() * 60),     // Minuto aleatório
                    Math.floor(Math.random() * 60),     // Segundo aleatório
                    0
                );

                // Nomes de clientes variados (opcional)
                const nomesClientes = [
                    "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa",
                    "Carlos Souza", "Juliana Lima", "Roberto Alves", "Fernanda Rocha",
                    "Ricardo Mendes", "Patricia Ferreira", null, null, null // alguns sem nome
                ];
                const nomeCliente = nomesClientes[Math.floor(Math.random() * nomesClientes.length)];

                // Criar a venda
                const venda = await prisma.venda.create({
                    data: {
                        nomeCliente: nomeCliente,
                        caixaId: caixa.id,
                        usuarioId: caixa.usuarioId,
                        unidadeId: caixa.unidadeId,
                        total: totalVenda,
                        pagamento: formaPagamento,
                        status: TS.OK,
                        criadoEm: dataVenda,
                        itens: {
                            create: itensVenda
                        }
                    },
                    include: {
                        itens: true
                    }
                });

                vendasCriadas.push(venda);
            }

            console.log(`✓ ${numVendas} vendas criadas para ${caixa.unidade.nome} (distribuídas nos últimos 15 dias)`);
        }

        console.log(`\n✅ Total de ${vendasCriadas.length} vendas criadas com sucesso!`);
        console.log(`📅 Período das vendas: últimos 15 dias (incluindo hoje: ${hoje.toLocaleDateString('pt-BR')})`);

        // Resumo por loja
        const resumoPorLoja = {};
        for (const venda of vendasCriadas) {
            const caixa = caixasAbertas.find(c => c.id === venda.caixaId);
            const nomeLoja = caixa.unidade.nome;

            if (!resumoPorLoja[nomeLoja]) {
                resumoPorLoja[nomeLoja] = { quantidade: 0, total: 0 };
            }

            resumoPorLoja[nomeLoja].quantidade++;
            resumoPorLoja[nomeLoja].total += Number(venda.total);
        }

        console.log("\n📊 Resumo por loja:");
        for (const [loja, dados] of Object.entries(resumoPorLoja)) {
            console.log(`   ${loja}: ${dados.quantidade} vendas - Total: R$ ${dados.total.toFixed(2)}`);
        }

        // --- Seed financeiro: criar lançamentos de exemplo para matriz, fazendas e lojas ---
        // colocar abaixo de onde unidadeMap e usuarioMap já existem (após criar unidades/usuarios)
        console.log("\n💰 Criando dados financeiros...");
        async function seedFinanceiro(prisma, unidadeMap, usuarioMap) {
            const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
            const firstOfMonth = (y, m) => new Date(y, m - 1, 1);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const getMonthName = (month) => monthNames[month - 1] || "Mês";

            // Lista de unidades (nomes conforme seu unidadeMap)
            const unidades = [
                "RuralTech",
                "VerdeFresco Hortaliças",
                "AgroBoi",
                "Casa Útil Mercado",
                "Sabor do Campo Laticínios",
                "Fazenda Alpha",
                "Fazenda Gamma",
                "Fazenda Beta",
                "Fazenda Delta",
                "Fazenda Teste",
                "Loja Teste"
            ];

            // 1) Garantir categorias por unidade (Folha, Manutenção, Aluguel, Receita, Vendas).
            const categoryPromises = [];
            for (const nomeUnidade of unidades) {
                const unidadeId = unidadeMap[nomeUnidade];
                if (!unidadeId) continue;
                // SAIDAS
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Folha", tipo: "SAIDA" } },
                        update: {},
                        create: { unidadeId, nome: "Folha", tipo: "SAIDA" }
                    })
                );
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Manutenção", tipo: "SAIDA" } },
                        update: {},
                        create: { unidadeId, nome: "Manutenção", tipo: "SAIDA" }
                    })
                );
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Aluguel", tipo: "SAIDA" } },
                        update: {},
                        create: { unidadeId, nome: "Aluguel", tipo: "SAIDA" }
                    })
                );
                // ENTRADAS
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Receita", tipo: "ENTRADA" } },
                        update: {},
                        create: { unidadeId, nome: "Receita", tipo: "ENTRADA" }
                    })
                );
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Vendas", tipo: "ENTRADA" } },
                        update: {},
                        create: { unidadeId, nome: "Vendas", tipo: "ENTRADA" }
                    })
                );
            }

            // Repasse: saída na Matriz e entrada nas demais unidades
            const matrizId = unidadeMap["RuralTech"];
            if (matrizId) {
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId: matrizId, nome: "Repasse", tipo: "SAIDA" } },
                        update: {},
                        create: { unidadeId: matrizId, nome: "Repasse", tipo: "SAIDA" }
                    })
                );
            }
            for (const nomeUnidade of unidades) {
                const unidadeId = unidadeMap[nomeUnidade];
                if (!unidadeId || nomeUnidade === "RuralTech") continue;
                categoryPromises.push(
                    prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId, nome: "Repasse Recebido", tipo: "ENTRADA" } },
                        update: {},
                        create: { unidadeId, nome: "Repasse Recebido", tipo: "ENTRADA" }
                    })
                );
            }

            const categoriasCriadas = await Promise.all(categoryPromises);

            // montar um mapa rápido: categoriaMap["NomeUnidade|CategoriaNome"] = id
            const categoriaMap = {};
            for (const c of categoriasCriadas) {
                // algumas upserts podem repetir o mesmo registro; protegemos por chave
                const key = `${c.unidadeId}|${c.nome}`;
                categoriaMap[key] = c.id;
            }

            // helper pra pegar id de categoria
            const getCategoriaId = (unidadeNome, catNome) => {
                const uid = unidadeMap[unidadeNome];
                return categoriaMap[`${uid}|${catNome}`];
            };

            // 2) Valores sugeridos por unidade (folha) e outras despesas/receitas
            const folhas = {
                "RuralTech": 12000,
                "VerdeFresco Hortaliças": 6000,
                "AgroBoi": 5500,
                "Casa Útil Mercado": 7000,
                "Sabor do Campo Laticínios": 6500,
                "Fazenda Alpha": 14000,
                "Fazenda Gamma": 12000,
                "Fazenda Beta": 13000,
                "Fazenda Delta": 9000,
                "Fazenda Teste": 4000,
                "Loja Teste": 5000
            };

            const alugueis = {
                "VerdeFresco Hortaliças": 3000,
                "AgroBoi": 2000,
                "Casa Útil Mercado": 4000,
                "Sabor do Campo Laticínios": 2800,
                "Loja Teste": 2500
            };

            const manutencoes = {
                "Fazenda Alpha": 6000,
                "Fazenda Gamma": 4500,
                "Fazenda Beta": 5000,
                "Fazenda Delta": 3000,
                "Fazenda Teste": 1200,
                "RuralTech": 2500,
                "Casa Útil Mercado": 1500
            };

            // repasses da matriz para cada unidade (saída na matriz)
            const repassesDaMatriz = {
                "VerdeFresco Hortaliças": 2000,
                "AgroBoi": 1500,
                "Casa Útil Mercado": 1800,
                "Sabor do Campo Laticínios": 2500,
                "Fazenda Alpha": 5000,
                "Fazenda Gamma": 4500,
                "Fazenda Beta": 4800,
                "Fazenda Delta": 3000,
                "Fazenda Teste": 800,
                "Loja Teste": 1000
            };

            // receitas/vendas por unidade (entradas)
            const receitas = {
                "VerdeFresco Hortaliças": 35000,
                "AgroBoi": 22000,
                "Casa Útil Mercado": 30000,
                "Sabor do Campo Laticínios": 18000,
                "Loja Teste": 15000,
                "Fazenda Alpha": 55000,
                "Fazenda Gamma": 40000,
                "Fazenda Beta": 60000,
                "Fazenda Delta": 25000,
                "Fazenda Teste": 8000,
                "RuralTech": 10000 // receitas institucionais/serviços da matriz
            };

            // 3) Montar array de dados (lancamentos)
            const dados = [];

            const competencia = firstOfMonth(prevYear, prevMonth);

            // -- folhas (saídas)
            for (const [unidadeNome, valor] of Object.entries(folhas)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Folha");
                if (!categoriaId) continue;
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Folha de pagamento - ${getMonthName(prevMonth)}/${prevYear} (${unidadeNome})`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: valor,
                    valorPago: valor,
                    competencia,
                    vencimento: new Date(prevYear, prevMonth - 1, 30),
                    dataPagamento: daysFromNow(-5),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: `FOLHA-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                });
            }

            // -- alugueis (saídas) para lojas
            for (const [unidadeNome, valor] of Object.entries(alugueis)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Aluguel");
                if (!categoriaId) continue;
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Aluguel - ${getMonthName(prevMonth)}/${prevYear} (${unidadeNome})`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "BOLETO",
                    valor: valor,
                    valorPago: null,
                    competencia,
                    vencimento: new Date(prevYear, prevMonth - 1, 10),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PENDENTE",
                    documento: `ALUGUEL-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                });
            }

            // -- manutencoes (saídas)
            for (const [unidadeNome, valor] of Object.entries(manutencoes)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Manutenção");
                if (!categoriaId) continue;
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Manutenção / reparos - ${getMonthName(prevMonth)}/${prevYear} (${unidadeNome})`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: valor,
                    valorPago: valor,
                    competencia,
                    vencimento: daysFromNow(-2),
                    dataPagamento: daysFromNow(-2),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: `MANUT-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                });
            }

            // -- repasses: saída na matriz e entrada nas unidades
            if (matrizId) {
                const categoriaRepasseMatriz = getCategoriaId("RuralTech", "Repasse");
                for (const [unidadeNome, valor] of Object.entries(repassesDaMatriz)) {
                    const unidadeIdRecebedora = unidadeMap[unidadeNome];
                    if (!unidadeIdRecebedora) continue;
                    // saída na matriz
                    if (categoriaRepasseMatriz) {
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: matrizId,
                            categoriaId: categoriaRepasseMatriz,
                            subcategoriaId: null,
                            descricao: `Repasse operacional para ${unidadeNome} - ${getMonthName(prevMonth)}/${prevYear}`,
                            tipoMovimento: "SAIDA",
                            formaPagamento: "TRANSFERENCIA",
                            valor: valor,
                            valorPago: valor,
                            competencia,
                            vencimento: daysFromNow(-7),
                            dataPagamento: daysFromNow(-7),
                            parcela: 1,
                            totalParcelas: 1,
                            status: "PAGA",
                            documento: `REPASSE-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                        });
                    }
                    // entrada na unidade recebedora
                    const catRepReceb = getCategoriaId(unidadeNome, "Repasse Recebido") || getCategoriaId(unidadeNome, "Receita");
                    if (catRepReceb) {
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: unidadeIdRecebedora,
                            categoriaId: catRepReceb,
                            subcategoriaId: null,
                            descricao: `Repasse recebido da Matriz - ${getMonthName(prevMonth)}/${prevYear}`,
                            tipoMovimento: "ENTRADA",
                            formaPagamento: "TRANSFERENCIA",
                            valor: valor,
                            valorPago: valor,
                            competencia,
                            vencimento: daysFromNow(-7),
                            dataPagamento: daysFromNow(-7),
                            parcela: 1,
                            totalParcelas: 1,
                            status: "PAGA",
                            documento: `REC-REPASSE-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                        });
                    }
                }
            }

            // -- receitas / vendas (entradas) por unidade
            for (const [unidadeNome, valor] of Object.entries(receitas)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Receita") || getCategoriaId(unidadeNome, "Vendas");
                if (!categoriaId) continue;
                // marcar algumas como pagas (vendas realizadas)
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Receita / Vendas - ${getMonthName(prevMonth)}/${prevYear} (${unidadeNome})`,
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "PIX",
                    valor: valor,
                    valorPago: valor,
                    competencia,
                    vencimento: daysFromNow(-12),
                    dataPagamento: daysFromNow(-12),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: `REC-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-202511`
                });
            }

            // ===== DADOS PARA O MÊS ATUAL (currentMonth/currentYear) =====
            const competenciaAtual = firstOfMonth(currentYear, currentMonth);
            
            // -- folhas (saídas) para o mês atual
            for (const [unidadeNome, valor] of Object.entries(folhas)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Folha");
                if (!categoriaId) continue;
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Folha de pagamento - ${getMonthName(currentMonth)}/${currentYear} (${unidadeNome})`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: valor,
                    valorPago: null, // Ainda não pago
                    competencia: competenciaAtual,
                    vencimento: new Date(currentYear, currentMonth - 1, 30),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PENDENTE",
                    documento: `FOLHA-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-${currentYear}${String(currentMonth).padStart(2, '0')}`
                });
            }

            // -- receitas / vendas (entradas) para o mês atual
            for (const [unidadeNome, valor] of Object.entries(receitas)) {
                const unidadeId = unidadeMap[unidadeNome];
                if (!unidadeId) continue;
                const categoriaId = getCategoriaId(unidadeNome, "Receita") || getCategoriaId(unidadeNome, "Vendas");
                if (!categoriaId) continue;
                dados.push({
                    criadoPorId: usuarioMap["Julia Alves"],
                    unidadeId,
                    categoriaId,
                    subcategoriaId: null,
                    descricao: `Receita / Vendas - ${getMonthName(currentMonth)}/${currentYear} (${unidadeNome})`,
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "PIX",
                    valor: valor,
                    valorPago: valor, // Receitas são consideradas recebidas
                    competencia: competenciaAtual,
                    vencimento: competenciaAtual, // Para ENTRADA, vencimento = competência
                    dataPagamento: daysFromNow(-2), // Recebido há 2 dias
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: `REC-${unidadeNome.replace(/\s+/g, '').toUpperCase()}-${currentYear}${String(currentMonth).padStart(2, '0')}`
                });
            }

            // const fazendaBetaNome = "Fazenda Beta";
            // const fazendaBetaId = unidadeMap[fazendaBetaNome];

            // if (fazendaBetaId) {
            //     // garantir categorias específicas para Fazenda Beta (se não existirem)
            //     const categoriasBeta = await Promise.all([
            //         prisma.categoria.upsert({
            //             where: { unidadeId_nome: { unidadeId: fazendaBetaId, nome: "Sanidade" } },
            //             update: {},
            //             create: { unidadeId: fazendaBetaId, nome: "Sanidade", tipo: "SAIDA" }
            //         }),
            //         prisma.categoria.upsert({
            //             where: { unidadeId_nome: { unidadeId: fazendaBetaId, nome: "Compras" } },
            //             update: {},
            //             create: { unidadeId: fazendaBetaId, nome: "Compras", tipo: "SAIDA" }
            //         }),
            //         prisma.categoria.upsert({
            //             where: { unidadeId_nome: { unidadeId: fazendaBetaId, nome: "Equipamentos" } },
            //             update: {},
            //             create: { unidadeId: fazendaBetaId, nome: "Equipamentos", tipo: "SAIDA" }
            //         })
            //     ]);

            //     const getCat = (nome) => {
            //         const uid = fazendaBetaId;
            //         const key = `${uid}|${nome}`;
            //         // tentar mapa existente (getCategoriaId no escopo da função original)
            //         const built = (typeof getCategoriaId === 'function') ? getCategoriaId(fazendaBetaNome, nome) : null;
            //         if (built) return built;
            //         // fallback a partir das upserts que acabamos de rodar
            //         const found = categoriasBeta.find(c => c.nome === nome);
            //         return found ? found.id : null;
            //     };

            //     // Competência / datas
            //     const competenciaBeta = firstOfMonth(2025, 12);

            //     const lancamentosBeta = [
            //         // 1) Folha - adiantamento / benefícios
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Folha") || getCat("Compras") || getCat("Manutenção") || getCategoriaId(fazendaBetaNome, "Folha"),
            //             subcategoriaId: null,
            //             descricao: "Adiantamento + benefícios - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 3200,
            //             valorPago: 3200,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-20),
            //             dataPagamento: daysFromNow(-20),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "FOLHA-ADIANT-BETA-202511"
            //         },

            //         // 2) Sanidade - vacinas / medicamentos
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Sanidade"),
            //             subcategoriaId: null,
            //             descricao: "Vacinação e medicamentos - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 3000,
            //             valorPago: 3000,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-15),
            //             dataPagamento: daysFromNow(-15),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "SANIDADE-BETA-202511"
            //         },

            //         // 3) Compras de insumos (ração / fertilizantes)
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Compras"),
            //             subcategoriaId: null,
            //             descricao: "Compra de ração e insumos - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "BOLETO",
            //             valor: 8000,
            //             valorPago: null,
            //             competencia: competenciaBeta,
            //             vencimento: new Date("2025-11-20"),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PENDENTE",
            //             documento: "COMPRA-INSUMOS-BETA-202511"
            //         },

            //         // 4) Manutenção / equipamentos (reparo de ordenhadeira, tratores)
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Equipamentos") || getCat("Manutenção"),
            //             subcategoriaId: null,
            //             descricao: "Manutenção de equipamento - ordem de serviço - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 4500,
            //             valorPago: 4500,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-8),
            //             dataPagamento: daysFromNow(-8),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "MANUT-EQ-BETA-202511"
            //         },
            //         // 1) Folha – Adiantamento / benefícios
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Folha"),
            //             subcategoriaId: null,
            //             descricao: "Adiantamento + benefícios - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 3200,
            //             valorPago: 3200,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-5),
            //             dataPagamento: daysFromNow(-5),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "FOLHA-ADIANT-BETA-202511"
            //         },

            //         // 2) Sanidade – vacinação / medicamentos
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Sanidade"),
            //             subcategoriaId: null,
            //             descricao: "Vacinação e medicamentos - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 3000,
            //             valorPago: 3000,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-12),
            //             dataPagamento: daysFromNow(-12),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "SANIDADE-BETA-202511"
            //         },

            //         // 3) Receita – venda de leite
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCategoriaId(fazendaBetaNome, "Receita"),
            //             subcategoriaId: null,
            //             descricao: "Venda de leite - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "ENTRADA",
            //             formaPagamento: "PIX",
            //             valor: 42000,
            //             valorPago: 42000,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-7),
            //             dataPagamento: daysFromNow(-7),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "VENDA-LEITE-BETA-202511"
            //         },

            //         // 4) Receita – venda de gado
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCategoriaId(fazendaBetaNome, "Receita"),
            //             subcategoriaId: null,
            //             descricao: "Venda de gado - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "ENTRADA",
            //             formaPagamento: "TRANSFERENCIA",
            //             valor: 18000,
            //             valorPago: 18000,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-10),
            //             dataPagamento: daysFromNow(-10),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "VENDA-GADO-BETA-202511"
            //         },


            //         //
            //         //  PENDENTES (2 itens)
            //         //

            //         // 5) Compra de ração e insumos — pendente (a vencer)
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Compras"),
            //             subcategoriaId: null,
            //             descricao: "Compra de ração e insumos - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "BOLETO",
            //             valor: 8000,
            //             valorPago: null,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(+3), // ainda vai vencer
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PENDENTE",
            //             documento: "COMPRA-INSUMOS-BETA-202511"
            //         },

            //         // 6) Frete / logística — pendente (recente)
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Manutenção"),
            //             subcategoriaId: null,
            //             descricao: "Frete e logística - transporte de leite (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 1200,
            //             valorPago: null,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(+1),
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PENDENTE",
            //             documento: "FRETE-BETA-202511"
            //         },


            //         //
            //         //  ATRASADAS (2 itens)
            //         //

            //         // 7) Manutenção de equipamento — atrasada mas foi paga
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Manutenção"),
            //             subcategoriaId: null,
            //             descricao: "Manutenção de ordenhadeira - Novembro/2025 (Fazenda Beta)",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "PIX",
            //             valor: 4500,
            //             valorPago: 4500,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-20), // vencido
            //             dataPagamento: daysFromNow(-17), // pago com atraso
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PAGA",
            //             documento: "MANUT-EQ-BETA-202511"
            //         },

            //         // 8) Compra emergencial de peças — atrasada e pendente
            //         {
            //             criadoPorId: usuarioMap["Richard Souza"],
            //             unidadeId: fazendaBetaId,
            //             categoriaId: getCat("Equipamentos"),
            //             subcategoriaId: null,
            //             descricao: "Compra emergencial de peças - Fazenda Beta",
            //             tipoMovimento: "SAIDA",
            //             formaPagamento: "BOLETO",
            //             valor: 2600,
            //             valorPago: null,
            //             competencia: competenciaBeta,
            //             vencimento: daysFromNow(-4), // atrasado
            //             parcela: 1,
            //             totalParcelas: 1,
            //             status: "PENDENTE",
            //             documento: "COMPRA-PECAS-BETA-202511"
            //         }
            //     ];

            //     // Inserir os lançamentos específicos de Fazenda Beta no array principal 'dados'
            //     for (const l of lancamentosBeta) {
            //         dados.push(l);
            //     }
            // }

            // ===== ADICIONAR DADOS FINANCEIROS PARA RURALTECH, CASA ÚTIL E FAZENDA BETA =====
            
            // 1. RURALTECH - Saídas e Entradas
            const ruralTechId = unidadeMap["RuralTech"];
            if (ruralTechId) {
                // Lista de unidades para criar categorias de saída
                const unidadesParaCategorias = [
                    "Fazenda Alpha", "Fazenda Gamma", "Fazenda Beta", "Fazenda Delta", "Fazenda Teste",
                    "Casa Útil Mercado", "Sabor do Campo Laticínios", "VerdeFresco Hortaliças", "AgroBoi", "Loja Teste"
                ];

                // Criar categorias de SAÍDA para cada unidade (RuralTech)
                const categoriasSaidaRuralTech = [];
                for (const nomeUnidade of unidadesParaCategorias) {
                    const categoria = await prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId: ruralTechId, nome: nomeUnidade, tipo: "SAIDA" } },
                        update: {},
                        create: { unidadeId: ruralTechId, nome: nomeUnidade, tipo: "SAIDA" }
                    });
                    categoriasSaidaRuralTech.push({ id: categoria.id, nome: nomeUnidade });

                    // Criar subcategorias para cada categoria
                    const subcategorias = [
                        "Folha de pagamento",
                        "Manutenção de máquinas para fazendas",
                        "Reforma do ambiente para as lojas"
                    ];

                    for (const subNome of subcategorias) {
                        await prisma.subcategoria.upsert({
                            where: { categoriaId_nome: { categoriaId: categoria.id, nome: subNome } },
                        update: {},
                            create: { categoriaId: categoria.id, nome: subNome }
                        });
                    }
                }

                // Criar categorias de ENTRADA para cada fazenda (RuralTech)
                const fazendas = ["Fazenda Alpha", "Fazenda Gamma", "Fazenda Beta", "Fazenda Delta", "Fazenda Teste"];
                const categoriasEntradaRuralTech = [];
                for (const nomeFazenda of fazendas) {
                    const categoria = await prisma.categoria.upsert({
                        where: { unidadeId_nome_tipo: { unidadeId: ruralTechId, nome: `${nomeFazenda} - Receitas`, tipo: "ENTRADA" } },
                        update: {},
                        create: { unidadeId: ruralTechId, nome: `${nomeFazenda} - Receitas`, tipo: "ENTRADA" }
                    });
                    categoriasEntradaRuralTech.push({ id: categoria.id, nome: nomeFazenda });

                    // Criar subcategorias para receitas das fazendas
                    const subcategoriasReceitas = [
                        "Venda de produtos",
                        "Venda de animais",
                        "Venda de leite",
                        "Outras receitas"
                    ];

                    for (const subNome of subcategoriasReceitas) {
                        await prisma.subcategoria.upsert({
                            where: { categoriaId_nome: { categoriaId: categoria.id, nome: subNome } },
                            update: {},
                            create: { categoriaId: categoria.id, nome: subNome }
                        });
                    }
                }

                // Adicionar lançamentos financeiros para RuralTech
                const competenciaRuralTechNov = firstOfMonth(prevYear, prevMonth); // Mês anterior
                const competenciaRuralTechDez = firstOfMonth(currentYear, currentMonth); // Mês atual
                
                // ===== NOVEMBRO/2025 =====
                // Saídas - Folha de pagamento para cada unidade
                for (const cat of categoriasSaidaRuralTech) {
                    const categoria = await prisma.categoria.findFirst({
                        where: { unidadeId: ruralTechId, nome: cat.nome, tipo: cat.tipo }
                    });
                    if (categoria) {
                        const subcategoria = await prisma.subcategoria.findFirst({
                            where: { categoriaId: categoria.id, nome: "Folha de pagamento" }
                        });
                        
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: ruralTechId,
                            categoriaId: categoria.id,
                            subcategoriaId: subcategoria?.id || null,
                            descricao: `Folha de pagamento - ${cat.nome} - ${getMonthName(prevMonth)}/${prevYear}`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "PIX",
                            valor: 5000 + Math.floor(Math.random() * 5000),
                            valorPago: 5000 + Math.floor(Math.random() * 5000),
                            competencia: competenciaRuralTechNov,
                            vencimento: new Date(prevYear, prevMonth - 1, 30),
                            dataPagamento: daysFromNow(-35),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                            documento: `FOLHA-${cat.nome.replace(/\s+/g, '').toUpperCase()}-202511`
                        });
                    }
                }

                // Entradas - Receitas das fazendas
                for (const cat of categoriasEntradaRuralTech) {
                    const categoria = await prisma.categoria.findFirst({
                        where: { unidadeId: ruralTechId, nome: { contains: cat.nome } }
                    });
                    if (categoria) {
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: ruralTechId,
                            categoriaId: categoria.id,
                        subcategoriaId: null,
                            descricao: `Receita recebida de ${cat.nome} - ${getMonthName(prevMonth)}/${prevYear}`,
                            tipoMovimento: "ENTRADA",
                            formaPagamento: "TRANSFERENCIA",
                            valor: 10000 + Math.floor(Math.random() * 20000),
                            valorPago: 10000 + Math.floor(Math.random() * 20000),
                            competencia: competenciaRuralTechNov,
                            vencimento: daysFromNow(-40),
                            dataPagamento: daysFromNow(-40),
                            parcela: 1,
                            totalParcelas: 1,
                            status: "PAGA",
                            documento: `REC-${cat.nome.replace(/\s+/g, '').toUpperCase()}-202511`
                        });
                    }
                }

                // ===== DEZEMBRO/2025 (MÊS ATUAL) =====
                // Saídas - Folha de pagamento para cada unidade (algumas pagas, algumas pendentes)
                for (let i = 0; i < categoriasSaidaRuralTech.length; i++) {
                    const cat = categoriasSaidaRuralTech[i];
                    const categoria = await prisma.categoria.findFirst({
                        where: { unidadeId: ruralTechId, nome: cat.nome, tipo: cat.tipo }
                    });
                    if (categoria) {
                        const subcategoria = await prisma.subcategoria.findFirst({
                            where: { categoriaId: categoria.id, nome: "Folha de pagamento" }
                        });
                        
                        const isPaid = i < 5; // Primeiras 5 pagas, resto pendente
                        
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: ruralTechId,
                            categoriaId: categoria.id,
                            subcategoriaId: subcategoria?.id || null,
                            descricao: `Folha de pagamento - ${cat.nome} - ${getMonthName(currentMonth)}/${prevYear}`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "PIX",
                            valor: 5000 + Math.floor(Math.random() * 5000),
                            valorPago: isPaid ? (5000 + Math.floor(Math.random() * 5000)) : null,
                            competencia: competenciaRuralTechDez,
                            vencimento: new Date(currentYear, currentMonth - 1, 30),
                            dataPagamento: isPaid ? daysFromNow(-i * 2) : null,
                            parcela: 1,
                            totalParcelas: 1,
                            status: isPaid ? "PAGA" : "PENDENTE",
                            documento: `FOLHA-${cat.nome.replace(/\s+/g, '').toUpperCase()}-202512`
                        });
                    }
                }

                // Entradas - Receitas das fazendas (várias entradas no mês)
                for (const cat of categoriasEntradaRuralTech) {
                    const categoria = await prisma.categoria.findFirst({
                        where: { unidadeId: ruralTechId, nome: { contains: cat.nome } }
                    });
                    if (categoria) {
                        // Criar 2-3 receitas por fazenda no mês
                        for (let i = 1; i <= 2; i++) {
                            dados.push({
                                criadoPorId: usuarioMap["Julia Alves"],
                                unidadeId: ruralTechId,
                                categoriaId: categoria.id,
                                subcategoriaId: null,
                                descricao: `Receita recebida de ${cat.nome} - ${getMonthName(currentMonth)}/${prevYear} - ${i === 1 ? 'Primeira quinzena' : 'Segunda quinzena'}`,
                                tipoMovimento: "ENTRADA",
                                formaPagamento: "TRANSFERENCIA",
                                valor: 10000 + Math.floor(Math.random() * 20000),
                                valorPago: 10000 + Math.floor(Math.random() * 20000),
                                competencia: competenciaRuralTechDez,
                                vencimento: daysFromNow(-i * 7),
                                dataPagamento: daysFromNow(-i * 7),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                                documento: `REC-${cat.nome.replace(/\s+/g, '').toUpperCase()}-202512-${i}`
                            });
                        }
                    }
                }

                // Saídas - Manutenção (algumas unidades)
                for (let i = 0; i < 3; i++) {
                    const cat = categoriasSaidaRuralTech[i];
                    const categoria = await prisma.categoria.findFirst({
                        where: { unidadeId: ruralTechId, nome: cat.nome, tipo: cat.tipo }
                    });
                    if (categoria) {
                        const subcategoria = await prisma.subcategoria.findFirst({
                            where: { categoriaId: categoria.id, nome: "Manutenção de máquinas para fazendas" }
                        });
                        
                        dados.push({
                            criadoPorId: usuarioMap["Julia Alves"],
                            unidadeId: ruralTechId,
                            categoriaId: categoria.id,
                            subcategoriaId: subcategoria?.id || null,
                            descricao: `Manutenção de máquinas - ${cat.nome} - ${getMonthName(currentMonth)}/${prevYear}`,
                            tipoMovimento: "SAIDA",
                            formaPagamento: "PIX",
                            valor: 2000 + Math.floor(Math.random() * 3000),
                            valorPago: i < 2 ? (2000 + Math.floor(Math.random() * 3000)) : null,
                            competencia: competenciaRuralTechDez,
                            vencimento: daysFromNow(-i * 3),
                            dataPagamento: i < 2 ? daysFromNow(-i * 3) : null,
                            parcela: 1,
                            totalParcelas: 1,
                            status: i < 2 ? "PAGA" : "PENDENTE",
                            documento: `MANUT-${cat.nome.replace(/\s+/g, '').toUpperCase()}-202512`
                        });
                    }
                }
            }

            // 2. CASA ÚTIL MERCADO - Saídas e Entradas
            const casaUtilId = unidadeMap["Casa Útil Mercado"];
            if (casaUtilId) {
                // Criar categoria de saída - Salários
                const categoriaSalarios = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: casaUtilId, nome: "Salários", tipo: "SAIDA" } },
                    update: {},
                    create: { unidadeId: casaUtilId, nome: "Salários", tipo: "SAIDA" }
                });

                // Criar subcategorias para salários
                await prisma.subcategoria.upsert({
                    where: { categoriaId_nome: { categoriaId: categoriaSalarios.id, nome: "Folha de pagamento" } },
                    update: {},
                    create: { categoriaId: categoriaSalarios.id, nome: "Folha de pagamento" }
                });
                await prisma.subcategoria.upsert({
                    where: { categoriaId_nome: { categoriaId: categoriaSalarios.id, nome: "Benefícios" } },
                    update: {},
                    create: { categoriaId: categoriaSalarios.id, nome: "Benefícios" }
                });

                // Criar categoria de entrada - Vendas
                const categoriaVendas = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: casaUtilId, nome: "Vendas", tipo: "ENTRADA" } },
                    update: {},
                    create: { unidadeId: casaUtilId, nome: "Vendas", tipo: "ENTRADA" }
                });

                // Criar categoria de entrada - Matriz
                const categoriaMatriz = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: casaUtilId, nome: "Repasse Recebido", tipo: "ENTRADA" } },
                    update: {},
                    create: { unidadeId: casaUtilId, nome: "Repasse Recebido", tipo: "ENTRADA" }
                });

                const competenciaCasaUtilNov = firstOfMonth(prevYear, prevMonth); // Mês anterior
                const competenciaCasaUtilDez = firstOfMonth(currentYear, currentMonth); // Mês atual
                const subcategoriaFolha = await prisma.subcategoria.findFirst({
                    where: { categoriaId: categoriaSalarios.id, nome: "Folha de pagamento" }
                });

                // ===== NOVEMBRO/2025 =====
                // Saídas - Salários
                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaSalarios.id,
                    subcategoriaId: subcategoriaFolha?.id || null,
                    descricao: `Folha de pagamento - ${getMonthName(prevMonth)}/${prevYear} (Casa Útil Mercado)`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: 7000,
                    valorPago: 7000,
                    competencia: competenciaCasaUtilNov,
                    vencimento: new Date(prevYear, prevMonth - 1, 30),
                    dataPagamento: daysFromNow(-35),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: "FOLHA-CASAUTIL-202511"
                });

                // Entradas - Vendas
                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaVendas.id,
                        subcategoriaId: null,
                    descricao: `Vendas realizadas - ${getMonthName(prevMonth)}/${prevYear} (Casa Útil Mercado)`,
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "PIX",
                    valor: 30000,
                    valorPago: 30000,
                    competencia: competenciaCasaUtilNov,
                    vencimento: daysFromNow(-40),
                    dataPagamento: daysFromNow(-40),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: "VENDAS-CASAUTIL-202511"
                });

                // Entradas - Repasse da Matriz
                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaMatriz.id,
                    subcategoriaId: null,
                    descricao: "Repasse recebido da Matriz - Novembro/2025",
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "TRANSFERENCIA",
                    valor: 1800,
                    valorPago: 1800,
                    competencia: competenciaCasaUtilNov,
                    vencimento: daysFromNow(-37),
                    dataPagamento: daysFromNow(-37),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: "REPASSE-CASAUTIL-202511"
                });

                // ===== DEZEMBRO/2025 (MÊS ATUAL) =====
                // Saídas - Salários
                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaSalarios.id,
                    subcategoriaId: subcategoriaFolha?.id || null,
                    descricao: `Folha de pagamento - ${getMonthName(currentMonth)}/${prevYear} (Casa Útil Mercado)`,
                        tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: 7000,
                        valorPago: null,
                    competencia: competenciaCasaUtilDez,
                    vencimento: new Date(currentYear, currentMonth - 1, 30),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PENDENTE",
                    documento: "FOLHA-CASAUTIL-202512"
                });

                // Entradas - Vendas (várias vendas do mês)
                for (let i = 1; i <= 5; i++) {
                    dados.push({
                        criadoPorId: usuarioMap["Maria Del Rey"],
                        unidadeId: casaUtilId,
                        categoriaId: categoriaVendas.id,
                        subcategoriaId: null,
                        descricao: `Vendas realizadas - ${getMonthName(currentMonth)}/${prevYear} - Semana ${i} (Casa Útil Mercado)`,
                        tipoMovimento: "ENTRADA",
                        formaPagamento: "PIX",
                        valor: 5000 + Math.floor(Math.random() * 3000),
                        valorPago: 5000 + Math.floor(Math.random() * 3000),
                        competencia: competenciaCasaUtilDez,
                        vencimento: daysFromNow(-i * 2),
                        dataPagamento: daysFromNow(-i * 2),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                        documento: `VENDAS-CASAUTIL-202512-SEM${i}`
                    });
                }

                // Entradas - Repasse da Matriz
                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaMatriz.id,
                    subcategoriaId: null,
                    descricao: "Repasse recebido da Matriz - Dezembro/2025",
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "TRANSFERENCIA",
                    valor: 1800,
                    valorPago: 1800,
                    competencia: competenciaCasaUtilDez,
                    vencimento: daysFromNow(-5),
                    dataPagamento: daysFromNow(-5),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: "REPASSE-CASAUTIL-202512"
                });

                // Saídas - Aluguel (pendente)
                const categoriaAluguel = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: casaUtilId, nome: "Aluguel", tipo: "SAIDA" } },
                    update: {},
                    create: { unidadeId: casaUtilId, nome: "Aluguel", tipo: "SAIDA" }
                });

                dados.push({
                    criadoPorId: usuarioMap["Maria Del Rey"],
                    unidadeId: casaUtilId,
                    categoriaId: categoriaAluguel.id,
                    subcategoriaId: null,
                    descricao: `Aluguel - ${getMonthName(currentMonth)}/${prevYear} (Casa Útil Mercado)`,
                    tipoMovimento: "SAIDA",
                    formaPagamento: "BOLETO",
                    valor: 4000,
                    valorPago: null,
                    competencia: competenciaCasaUtilDez,
                    vencimento: new Date(currentYear, currentMonth - 1, 10),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PENDENTE",
                    documento: "ALUGUEL-CASAUTIL-202512"
                });
            }

            // 3. FAZENDA BETA - Atualizar saídas e entradas
            const fazendaBetaId = unidadeMap["Fazenda Beta"];
            if (fazendaBetaId) {
                // Criar categoria de saída - Veterinário para emergência
                const categoriaVeterinario = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: fazendaBetaId, nome: "Veterinário", tipo: "SAIDA" } },
                    update: {},
                    create: { unidadeId: fazendaBetaId, nome: "Veterinário", tipo: "SAIDA" }
                });

                // Criar subcategoria - Emergência
                await prisma.subcategoria.upsert({
                    where: { categoriaId_nome: { categoriaId: categoriaVeterinario.id, nome: "Emergência" } },
                    update: {},
                    create: { categoriaId: categoriaVeterinario.id, nome: "Emergência" }
                });

                // Criar categoria de saída - Salários (se não existir)
                const categoriaSalariosBeta = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: fazendaBetaId, nome: "Folha", tipo: "SAIDA" } },
                    update: {},
                    create: { unidadeId: fazendaBetaId, nome: "Folha", tipo: "SAIDA" }
                });

                // Criar categoria de entrada - Vendas (se não existir)
                const categoriaVendasBeta = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: fazendaBetaId, nome: "Vendas", tipo: "ENTRADA" } },
                    update: {},
                    create: { unidadeId: fazendaBetaId, nome: "Vendas", tipo: "ENTRADA" }
                });

                // Criar categoria de entrada - Matriz (se não existir)
                const categoriaMatrizBeta = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: fazendaBetaId, nome: "Repasse Recebido", tipo: "ENTRADA" } },
                    update: {},
                    create: { unidadeId: fazendaBetaId, nome: "Repasse Recebido", tipo: "ENTRADA" }
                });

                const competenciaBetaNov = firstOfMonth(prevYear, prevMonth); // Mês anterior
                const competenciaBetaDez = firstOfMonth(currentYear, currentMonth); // Mês atual
                const subcategoriaEmergencia = await prisma.subcategoria.findFirst({
                    where: { categoriaId: categoriaVeterinario.id, nome: "Emergência" }
                });

                // ===== NOVEMBRO/2025 =====
                // Saída - Veterinário para emergência
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaVeterinario.id,
                    subcategoriaId: subcategoriaEmergencia?.id || null,
                    descricao: `Veterinário para emergência - ${getMonthName(prevMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "PIX",
                    valor: 2500,
                    valorPago: 2500,
                    competencia: competenciaBetaNov,
                    vencimento: daysFromNow(-38),
                    dataPagamento: daysFromNow(-38),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                    documento: "VET-EMERG-BETA-202511"
                });

                // Saída - Salários (adicionar se não existir nos dados anteriores)
                const jaExisteSalario = dados.some(d => 
                    d.unidadeId === fazendaBetaId && 
                    d.descricao?.includes("Folha") && 
                    d.descricao?.includes("Fazenda Beta") &&
                    d.descricao?.includes("Novembro")
                );
                if (!jaExisteSalario) {
                    dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                        categoriaId: categoriaSalariosBeta.id,
                        subcategoriaId: null,
                        descricao: `Salários - ${getMonthName(prevMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "PIX",
                        valor: 13000,
                        valorPago: 13000,
                        competencia: competenciaBetaNov,
                        vencimento: new Date(prevYear, prevMonth - 1, 30),
                        dataPagamento: daysFromNow(-35),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                        documento: "FOLHA-BETA-202511"
                    });
                }

                // Entrada - Vendas
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaVendasBeta.id,
                        subcategoriaId: null,
                    descricao: `Vendas - ${getMonthName(prevMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "ENTRADA",
                        formaPagamento: "PIX",
                    valor: 60000,
                    valorPago: 60000,
                    competencia: competenciaBetaNov,
                    vencimento: daysFromNow(-42),
                    dataPagamento: daysFromNow(-42),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                    documento: "VENDAS-BETA-202511"
                });

                // Entrada - Repasse da Matriz
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaMatrizBeta.id,
                        subcategoriaId: null,
                    descricao: "Repasse recebido da Matriz - Novembro/2025",
                        tipoMovimento: "ENTRADA",
                        formaPagamento: "TRANSFERENCIA",
                    valor: 4800,
                    valorPago: 4800,
                    competencia: competenciaBetaNov,
                    vencimento: daysFromNow(-37),
                    dataPagamento: daysFromNow(-37),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                    documento: "REPASSE-BETA-202511"
                });

                // ===== DEZEMBRO/2025 (MÊS ATUAL) =====
                // Saída - Veterinário para emergência
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaVeterinario.id,
                    subcategoriaId: subcategoriaEmergencia?.id || null,
                    descricao: `Veterinário para emergência - ${getMonthName(currentMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "SAIDA",
                    formaPagamento: "PIX",
                    valor: 2800,
                    valorPago: 2800,
                    competencia: competenciaBetaDez,
                    vencimento: daysFromNow(-3),
                    dataPagamento: daysFromNow(-3),
                        parcela: 1,
                        totalParcelas: 1,
                    status: "PAGA",
                    documento: "VET-EMERG-BETA-202512"
                });

                // Saída - Salários
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaSalariosBeta.id,
                        subcategoriaId: null,
                    descricao: `Salários - ${getMonthName(currentMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "PIX",
                    valor: 13000,
                        valorPago: null,
                    competencia: competenciaBetaDez,
                    vencimento: new Date(currentYear, currentMonth - 1, 30),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PENDENTE",
                    documento: "FOLHA-BETA-202512"
                });

                // Entrada - Vendas (várias vendas no mês)
                for (let i = 1; i <= 4; i++) {
                    dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                        categoriaId: categoriaVendasBeta.id,
                        subcategoriaId: null,
                        descricao: `Vendas - ${getMonthName(currentMonth)}/${prevYear} - ${i === 1 ? 'Primeira semana' : i === 2 ? 'Segunda semana' : i === 3 ? 'Terceira semana' : 'Quarta semana'} (Fazenda Beta)`,
                        tipoMovimento: "ENTRADA",
                        formaPagamento: "PIX",
                        valor: 12000 + Math.floor(Math.random() * 8000),
                        valorPago: 12000 + Math.floor(Math.random() * 8000),
                        competencia: competenciaBetaDez,
                        vencimento: daysFromNow(-i * 2),
                        dataPagamento: daysFromNow(-i * 2),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PAGA",
                        documento: `VENDAS-BETA-202512-SEM${i}`
                    });
                }

                // Entrada - Repasse da Matriz
                dados.push({
                        criadoPorId: usuarioMap["Richard Souza"],
                        unidadeId: fazendaBetaId,
                    categoriaId: categoriaMatrizBeta.id,
                        subcategoriaId: null,
                    descricao: "Repasse recebido da Matriz - Dezembro/2025",
                    tipoMovimento: "ENTRADA",
                    formaPagamento: "TRANSFERENCIA",
                    valor: 4800,
                    valorPago: 4800,
                    competencia: competenciaBetaDez,
                    vencimento: daysFromNow(-5),
                    dataPagamento: daysFromNow(-5),
                    parcela: 1,
                    totalParcelas: 1,
                    status: "PAGA",
                    documento: "REPASSE-BETA-202512"
                });

                // Saída - Manutenção (pendente)
                const categoriaManutencaoBeta = await prisma.categoria.upsert({
                    where: { unidadeId_nome_tipo: { unidadeId: fazendaBetaId, nome: "Manutenção", tipo: "SAIDA" } },
                    update: {},
                    create: { unidadeId: fazendaBetaId, nome: "Manutenção", tipo: "SAIDA" }
                });

                dados.push({
                    criadoPorId: usuarioMap["Richard Souza"],
                    unidadeId: fazendaBetaId,
                    categoriaId: categoriaManutencaoBeta.id,
                    subcategoriaId: null,
                    descricao: `Manutenção de equipamentos - ${getMonthName(currentMonth)}/${prevYear} (Fazenda Beta)`,
                        tipoMovimento: "SAIDA",
                        formaPagamento: "BOLETO",
                    valor: 3500,
                        valorPago: null,
                    competencia: competenciaBetaDez,
                    vencimento: new Date(currentYear, currentMonth - 1, 15),
                        parcela: 1,
                        totalParcelas: 1,
                        status: "PENDENTE",
                    documento: "MANUT-BETA-202512"
                });
            }

            // Inserir todos os dados financeiros no banco
            if (dados.length > 0) {
                await prisma.financeiro.createMany({ data: dados, skipDuplicates: true });
                console.log(`✓ ${dados.length} lançamentos financeiros criados`);
            }
        }
        
        // Chamar a função seedFinanceiro
        await seedFinanceiro(prisma, unidadeMap, usuarioMap);

        // Dados gerais — Fazenda Beta (5 registros)
        const fazendaBetaId = unidadeMap["Fazenda Beta"];
        if (fazendaBetaId) {
            const dadosGeraisBeta = [
                {
                    unidadeId: fazendaBetaId,
                    dado: "Clima",
                    valor: "Tropical com estação seca pronunciada",
                    descricao: "Clima predominantemente tropical, com estação seca entre maio e setembro. Temperatura média anual ~22°C, chuvas concentradas em out/fev."
                },
                {
                    unidadeId: fazendaBetaId,
                    dado: "Tipo de solo",
                    valor: "Solo argiloso-arenoso",
                    descricao: "Predomínio de solo argiloso-arenoso com boa drenagem em áreas altas e pontos mais argilosos próximos a cursos d'água; fertilidade média a ser corrigida com calcário e adubação."
                },
                {
                    unidadeId: fazendaBetaId,
                    dado: "Irrigação",
                    valor: "Irrigação por pivô parcial",
                    descricao: "Sistema de pivô central cobrindo ~40% da área produtiva; demais áreas dependem de chuva e manejo de umidade do solo."
                },
                {
                    unidadeId: fazendaBetaId,
                    dado: "Topografia / Altitude",
                    valor: "Suave ondulado / 560 m",
                    descricao: "Relevo suave ondulado favorecendo drenagem. Altitude média aproximada de 560 metros acima do nível do mar."
                },
                {
                    unidadeId: fazendaBetaId,
                    dado: "Acesso & Infraestrutura",
                    valor: "Estrada de terra batida (6 km até asfalto)",
                    descricao: "Acesso por estrada rural de terra batida, com 6 km até rodovia asfaltada; possui galpões de armazenamento, curral e rede elétrica trifásica limitada em pontos."
                }
            ];

            await prisma.dadoGeralUnidade.createMany({
                data: dadosGeraisBeta,
                skipDuplicates: true
            });

            console.log("Inseridos dados gerais para Fazenda Beta:", dadosGeraisBeta.length);
        } else {
            console.warn("Fazenda Beta não encontrada em unidadeMap — dados gerais não inseridos.");
        }


    } catch (error) {
        console.error(" Erro durante seed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log("Desconectado do banco.");
    }
}

main();