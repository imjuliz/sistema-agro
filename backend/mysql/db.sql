create database Ruraltech
use Ruraltech
-- =============================================
--  TABELAS PRINCIPAIS
-- =============================================

CREATE TABLE perfil (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcao ENUM('GERENTE_MATRIZ', 'GERENTE_FAZENDA', 'GERENTE_LOJA', 'FUNCIONARIO_LOJA', 'FUNCIONARIO_FAZENDA') NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    matriz_id INT,
    gerente_id INT,
    nome VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    cep VARCHAR(20),
    foco_produtivo VARCHAR(50),
    imagem_url VARCHAR(1000),
    area_total DECIMAL(12,3),
    area_produtiva DECIMAL(12,3),
    latitude FLOAT,
    longitude FLOAT,
    descricao_curta TEXT,
    tipo ENUM('MATRIZ', 'FAZENDA', 'LOJA') NOT NULL,
    horario_abertura TIME,
    horario_fechamento TIME,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    status ENUM('ATIVA', 'INATIVA', 'MANUTENCAO') NOT NULL DEFAULT 'ATIVA',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (matriz_id) REFERENCES unidade(id),
    FOREIGN KEY (gerente_id) REFERENCES usuario(id)
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    perfil_id INT NOT NULL,
    unidade_id INT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    ft_perfil VARCHAR(1000),
    status BOOLEAN DEFAULT TRUE,
    token_version INT DEFAULT 0,
    failed_attempts INT DEFAULT 0,
    lockout_until DATETIME,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfil(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

CREATE TABLE sessao (
    id VARCHAR(50) PRIMARY KEY,
    usuario_id INT NOT NULL,
    refresh_token_hash VARCHAR(128) UNIQUE NOT NULL,
    user_agent VARCHAR(512),
    ip VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    replaced_by_id VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE reset_senhas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    codigo_reset VARCHAR(6) NOT NULL,
    codigo_expira DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE dado_geral_unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    dado VARCHAR(255) NOT NULL,
    valor VARCHAR(1000) NOT NULL,
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id) ON DELETE CASCADE
);

CREATE TABLE fornecedor_externo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(200) NOT NULL,
    descricao_empresa TEXT,
    cnpj_cpf VARCHAR(20) UNIQUE,
    email VARCHAR(150),
    telefone VARCHAR(20) NOT NULL,
    status ENUM('ATIVO', 'INATIVO') NOT NULL,
    endereco TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    responsavel_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo ENUM('SOJA', 'LEITE', 'BOVINOS', 'SUINOS', 'OVINOS', 'AVES', 'EQUINO', 'CAPRINOS', 'OUTRO', 'LEGUME', 'FRUTA', 'VERDURA', 'GRÃOS', 'PLANTIO') NOT NULL,
    tipo_produto ENUM('PLANTIO', 'ANIMALIA'),
    quantidade INT,
    preco DECIMAL(10,2) NOT NULL,
    unidade_medida ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML') NOT NULL,
    observacoes TEXT,
    status_qualidade ENUM('PROPRIO', 'ALERTA', 'IMPROPRIO') DEFAULT 'PROPRIO',
    bloqueado_para_venda BOOLEAN DEFAULT FALSE,
    status_lote ENUM('SEMEADO', 'CRESCIMENTO', 'COLHEITA', 'COLHIDO', 'RECEBIDO', 'EM_QUARENTENA', 'AVALIACAO_SANITARIA', 'EM_CRESCIMENTO', 'EM_ENGORDA', 'EM_REPRODUCAO', 'LACTACAO', 'ABATE', 'PENDENTE', 'PRONTO', 'BLOQUEADO', 'VENDIDO', 'ENVIADO', 'EM_PREPARO'),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    contrato_id INT,
    data_envio_referencia DATETIME,
    itens_esperados JSON,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id),
    FOREIGN KEY (contrato_id) REFERENCES contrato(id)
);

CREATE TABLE produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    origem_unidade_id INT,
    criado_por_id INT,
    lote_id INT UNIQUE,
    nome VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    categoria VARCHAR(100),
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    data_fabricacao DATETIME NOT NULL,
    data_validade DATETIME NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unidade_medida ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML'),
    codigo_barras VARCHAR(100),
    ncm VARCHAR(20),
    peso_unidade DECIMAL(10,3),
    tags JSON,
    impostos JSON,
    is_for_sale BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (origem_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (criado_por_id) REFERENCES usuario(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT UNIQUE NOT NULL,
    descricao TEXT,
    qntd_itens INT DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

CREATE TABLE estoque_produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    marca VARCHAR(255),
    qntd_atual INT DEFAULT 0,
    qntd_min INT DEFAULT 0,
    estoque_id INT NOT NULL,
    produto_id INT,
    producao_id INT,
    lote_id INT,
    preco_unitario DECIMAL(12,2),
    peso_unidade DECIMAL(14,3),
    validade DATETIME,
    unidade_base ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML') NOT NULL,
    pedido_id INT,
    pedido_item_id INT,
    fornecedor_unidade_id INT,
    fornecedor_externo_id INT,
    data_entrada DATETIME,
    data_saida DATETIME,
    UNIQUE KEY (estoque_id, produto_id),
    FOREIGN KEY (estoque_id) REFERENCES estoque(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (producao_id) REFERENCES producao(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (pedido_item_id) REFERENCES pedido_item(id),
    FOREIGN KEY (fornecedor_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (fornecedor_externo_id) REFERENCES fornecedor_externo(id)
);

CREATE TABLE contrato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    fornecedor_unidade_id INT,
    fornecedor_externo_id INT,
    descricao VARCHAR(500),
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    data_envio DATETIME,
    status ENUM('ATIVO', 'INATIVO') NOT NULL,
    frequencia_entregas ENUM('SEMANALMENTE', 'QUINZENAL', 'MENSALMENTE', 'SEMESTRAL', 'TRIMESTRAL') NOT NULL,
    dia_pagamento VARCHAR(100) NOT NULL,
    forma_pagamento ENUM('DINHEIRO', 'CARTAO', 'PIX') NOT NULL,
    valor_total DECIMAL(12,2),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (fornecedor_unidade_id) REFERENCES unidade(id) ON DELETE RESTRICT,
    FOREIGN KEY (fornecedor_externo_id) REFERENCES fornecedor_externo(id) ON DELETE RESTRICT
);

CREATE TABLE contrato_itens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contrato_id INT NOT NULL,
    produto_id INT NOT NULL,
    nome VARCHAR(255),
    quantidade INT NOT NULL,
    unidade_medida ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML'),
    UNIQUE KEY (contrato_id, produto_id),
    FOREIGN KEY (contrato_id) REFERENCES contrato(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

CREATE TABLE pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contrato_id INT,
    fornecedor_externo_id INT,
    origem_unidade_id INT,
    destino_unidade_id INT,
    criado_por_id INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_envio DATETIME,
    data_recebimento DATETIME,
    status ENUM('PENDENTE', 'ENVIADO', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO') DEFAULT 'PENDENTE',
    valor_total DECIMAL(14,2),
    documento_referencia VARCHAR(255),
    tipo_transporte ENUM('RODOVIARIO', 'FERROVIARIO', 'AEREO', 'FLUVIAL', 'INTERNO', 'OUTRO'),
    placa_veiculo VARCHAR(20),
    motorista VARCHAR(100),
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contrato(id),
    FOREIGN KEY (fornecedor_externo_id) REFERENCES fornecedor_externo(id),
    FOREIGN KEY (origem_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (destino_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (criado_por_id) REFERENCES usuario(id)
);

CREATE TABLE pedido_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    fornecedor_item_id INT,
    produto_id INT,
    insumo_id INT,
    lote_id INT,
    quantidade DECIMAL(14,3) NOT NULL,
    unidade_medida ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML') NOT NULL,
    preco_unitario DECIMAL(12,2),
    custo_total DECIMAL(14,2),
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_item_id) REFERENCES contrato_itens(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

CREATE TABLE animal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    especie ENUM('BOVINO', 'BUBALINO', 'CAPRINO', 'OVINO', 'SUINO', 'EQUINO', 'MUAR', 'AVE', 'GALINHA', 'PERU', 'PATO', 'MARRECO', 'GANSO', 'CODORNA', 'COELHO', 'PEIXE', 'CAMARAO', 'ABELHA', 'OUTRO') NOT NULL,
    raca VARCHAR(100) NOT NULL,
    sexo ENUM('MACHO', 'FEMEA'),
    sku VARCHAR(50) UNIQUE NOT NULL,
    data_nasc DATETIME,
    fornecedor_id INT,
    peso VARCHAR(50),
    forma_aquisicao ENUM('COMPRA', 'TRANSFERENCIA', 'DOACAO', 'NATURAL', 'OUTRO'),
    custo DECIMAL(10,2),
    unidade_id INT NOT NULL,
    lote_id INT,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

CREATE TABLE plantio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(100) NOT NULL,
    area_hectares DECIMAL(10,2) NOT NULL,
    data_plantio DATETIME,
    data_colheita_estimativa DATETIME,
    fornecedor_id INT,
    custo DECIMAL(10,2),
    unidade_id INT NOT NULL,
    lote_id INT,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

CREATE TABLE atvd_plantio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    tipo ENUM('IRRIGACAO', 'ADUBACAO', 'USO_AGROTOXICO', 'PLANTIO', 'COLHEITA', 'FERTILIZACAO', 'OUTRO') NOT NULL,
    lote_id INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    responsavel_id INT NOT NULL,
    status ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'),
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id)
);

CREATE TABLE atvd_animalia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT,
    descricao TEXT NOT NULL,
    tipo ENUM('VACINACAO', 'VERMIFUGACAO', 'TRATAMENTO', 'SANIDADE_GERAL', 'NUTRICAO', 'SUPLEMENTACAO', 'AJUSTE_DIETA', 'INSEMINACAO', 'MONITORAMENTO_GESTACAO', 'PARTO', 'SECAGEM', 'MANEJO_GERAL', 'MOVIMENTACAO_INTERNA', 'PESAGEM', 'ORDENHA_DIARIA', 'HIGIENIZACAO_AMBIENTE', 'BANHO', 'RECEBIMENTO', 'TRANSFERENCIA', 'VENDA_ANIMAL', 'BAIXA_ANIMAL', 'ABATE', 'OCORRENCIA'),
    lote_id INT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    responsavel_id INT NOT NULL,
    status ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'),
    FOREIGN KEY (animal_id) REFERENCES animal(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id)
);

CREATE TABLE plano_producao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contrato_id INT,
    lote_id INT,
    item_id INT,
    usuario_id INT,
    nome VARCHAR(255),
    descricao TEXT,
    etapas JSON NOT NULL,
    status VARCHAR(50) DEFAULT 'RASCUNHO',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contrato(id),
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE producao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lote_id INT NOT NULL,
    plantio_id INT,
    animal_id INT,
    tipo_produto VARCHAR(255) NOT NULL,
    produto_id INT,
    quantidade_bruta DECIMAL(14,3) NOT NULL,
    quantidade_liquida DECIMAL(14,3),
    unidade_medida ENUM('KG', 'G', 'T', 'LOTE', 'UNIDADE', 'SACA', 'CABECA', 'ARROBA', 'LITRO', 'ML') NOT NULL,
    rendimento_por_ha DECIMAL(12,3),
    perda_percent DECIMAL(5,3),
    custo_mao_obra DECIMAL(14,2),
    outros_custos DECIMAL(14,2),
    custo_total DECIMAL(14,2),
    custo_unitario DECIMAL(14,4),
    data_inicio DATETIME,
    data_fim DATETIME,
    data_colheita DATETIME,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PLANEJADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA', 'EM_ANALISE') DEFAULT 'PLANEJADA',
    metodo ENUM('MECANIZADA', 'MANUAL', 'INDUSTRIAL', 'MISTA'),
    responsavel_id INT,
    certificado_sanitario VARCHAR(255),
    certificado_qualidade VARCHAR(255),
    destino_unidade_id INT,
    destino_pedido_id INT,
    observacoes TEXT,
    documento_referencia VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unidade_id INT,
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (plantio_id) REFERENCES plantio(id),
    FOREIGN KEY (animal_id) REFERENCES animal(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id),
    FOREIGN KEY (destino_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

CREATE TABLE producao_etapa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producao_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INT NOT NULL,
    duracao_dias INT,
    data_prev_inicio DATETIME,
    data_prev_fim DATETIME,
    data_real_inicio DATETIME,
    data_real_fim DATETIME,
    quantidade_esperada DECIMAL(14,3),
    quantidade_real DECIMAL(14,3),
    status ENUM('PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'BLOQUEADA') DEFAULT 'PLANEJADA',
    responsavel_id INT,
    observacoes TEXT,
    custo_mao_obra DECIMAL(14,2),
    outros_custos DECIMAL(14,2),
    custo_total DECIMAL(14,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producao_id) REFERENCES producao(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id)
);

CREATE TABLE registros_sanitarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lote_id INT NOT NULL,
    tipo ENUM('VACINA', 'MEDICACAO', 'RACAO', 'OUTRO') NOT NULL,
    producao_id INT NOT NULL,
    produto VARCHAR(255) NOT NULL,
    data_aplicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantidade FLOAT,
    observacoes TEXT,
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (producao_id) REFERENCES producao(id) ON DELETE CASCADE
);

CREATE TABLE atvd_lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    tipo ENUM('PLANTIO', 'ADUBACAO', 'FERTILIZACAO') NOT NULL,
    lote_id INT NOT NULL,
    data DATETIME NOT NULL,
    responsavel_id INT NOT NULL,
    FOREIGN KEY (responsavel_id) REFERENCES usuario(id)
);

CREATE TABLE rastreabilidade_lotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lote_origem_id INT NOT NULL,
    lote_destino_id INT NOT NULL,
    descricao VARCHAR(255),
    data_vinculo DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lote_origem_id) REFERENCES lote(id) ON DELETE CASCADE,
    FOREIGN KEY (lote_destino_id) REFERENCES lote(id) ON DELETE CASCADE
);

CREATE TABLE estoque_movimentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estoque_id INT NOT NULL,
    tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    producao_id INT,
    pedido_id INT,
    venda_id INT,
    origem_unidade_id INT,
    destino_unidade_id INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estoque_id) REFERENCES estoque(id) ON DELETE CASCADE,
    FOREIGN KEY (producao_id) REFERENCES producao(id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (venda_id) REFERENCES venda(id),
    FOREIGN KEY (origem_unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (destino_unidade_id) REFERENCES unidade(id)
);

CREATE TABLE caixa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    usuario_id INT NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    saldo_inicial DECIMAL(12,2) DEFAULT 0,
    saldo_final DECIMAL(12,2),
    aberto_em DATETIME NOT NULL,
    fechado_em DATETIME,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE venda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_cliente VARCHAR(255),
    caixa_id INT NOT NULL,
    usuario_id INT NOT NULL,
    unidade_id INT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    pagamento ENUM('DINHEIRO', 'CARTAO', 'PIX') NOT NULL,
    status ENUM('OK', 'A_RETIRAR', 'CANCELADO') NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caixa_id) REFERENCES caixa(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

CREATE TABLE itens_vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(12,2) NOT NULL,
    desconto DECIMAL(12,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES venda(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES estoque_produto(id)
);

CREATE TABLE categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
    descricao TEXT,
    ativa BOOLEAN DEFAULT TRUE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (unidade_id, nome),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id) ON DELETE CASCADE
);

CREATE TABLE subcategoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativa BOOLEAN DEFAULT TRUE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (categoria_id, nome),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

CREATE TABLE financeiro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unidade_id INT NOT NULL,
    categoria_id INT,
    subcategoria_id INT,
    criado_por_id INT,
    descricao TEXT NOT NULL,
    tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
    forma_pagamento VARCHAR(100),
    valor DECIMAL(12,2) NOT NULL,
    valor_pago DECIMAL(12,2),
    competencia DATETIME,
    vencimento DATETIME NOT NULL,
    data_pagamento DATETIME,
    parcela INT,
    total_parcelas INT,
    status ENUM('PENDENTE', 'PAGA', 'VENCIDA', 'CANCELADA') DEFAULT 'PENDENTE',
    documento VARCHAR(255),
    observacao TEXT,
    anexo VARCHAR(255),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletado_em DATETIME,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategoria(id) ON DELETE SET NULL,
    FOREIGN KEY (criado_por_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- =============================================
--  ÍNDICES
-- =============================================

-- Índices para a tabela unidade
CREATE INDEX idx_unidade_matriz_id ON unidade(matriz_id);
CREATE INDEX idx_unidade_gerente_id ON unidade(gerente_id);
CREATE INDEX idx_unidade_tipo ON unidade(tipo);
CREATE INDEX idx_unidade_status ON unidade(status);
CREATE INDEX idx_unidade_cidade ON unidade(cidade);
CREATE INDEX idx_unidade_estado ON unidade(estado);

-- Índices para a tabela usuario
CREATE INDEX idx_usuario_unidade_id ON usuario(unidade_id);
CREATE INDEX idx_usuario_perfil_id ON usuario(perfil_id);
CREATE INDEX idx_usuario_status ON usuario(status);

-- Índices para a tabela sessao
CREATE INDEX idx_sessao_refresh_token_hash ON sessao(refresh_token_hash);
CREATE INDEX idx_sessao_usuario_id ON sessao(usuario_id);
CREATE INDEX idx_sessao_expires_at ON sessao(expires_at);

-- Índices para a tabela dado_geral_unidade
CREATE INDEX idx_dado_geral_unidade_unidade_id ON dado_geral_unidade(unidade_id);

-- Índices para a tabela lote
CREATE INDEX idx_lote_unidade_id ON lote(unidade_id);
CREATE INDEX idx_lote_responsavel_id ON lote(responsavel_id);
CREATE INDEX idx_lote_status_qualidade ON lote(status_qualidade);
CREATE INDEX idx_lote_tipo ON lote(tipo);

-- Índices para a tabela produto
CREATE INDEX idx_produto_unidade_id ON produto(unidade_id);
CREATE INDEX idx_produto_origem_unidade_id ON produto(origem_unidade_id);
CREATE INDEX idx_produto_lote_id ON produto(lote_id);
CREATE INDEX idx_produto_categoria ON produto(categoria);
CREATE INDEX idx_produto_codigo_barras ON produto(codigo_barras);

-- Índices para a tabela estoque_produto
CREATE INDEX idx_estoque_produto_produto_id ON estoque_produto(produto_id);
CREATE INDEX idx_estoque_produto_producao_id ON estoque_produto(producao_id);

-- Índices para a tabela contrato
CREATE INDEX idx_contrato_status ON contrato(status);
CREATE INDEX idx_contrato_data_inicio ON contrato(data_inicio);
CREATE INDEX idx_contrato_data_fim ON contrato(data_fim);
CREATE INDEX idx_contrato_unidade_id ON contrato(unidade_id);
CREATE INDEX idx_contrato_fornecedor_unidade_id ON contrato(fornecedor_unidade_id);
CREATE INDEX idx_contrato_fornecedor_externo_id ON contrato(fornecedor_externo_id);

-- Índices para a tabela contrato_itens
CREATE INDEX idx_contrato_itens_contrato_id ON contrato_itens(contrato_id);
CREATE INDEX idx_contrato_itens_produto_id ON contrato_itens(produto_id);

-- Índices para a tabela pedido
CREATE INDEX idx_pedido_contrato_id ON pedido(contrato_id);
CREATE INDEX idx_pedido_fornecedor_externo_id ON pedido(fornecedor_externo_id);
CREATE INDEX idx_pedido_origem_unidade_id ON pedido(origem_unidade_id);
CREATE INDEX idx_pedido_destino_unidade_id ON pedido(destino_unidade_id);
CREATE INDEX idx_pedido_status ON pedido(status);

-- Índices para a tabela pedido_item
CREATE INDEX idx_pedido_item_pedido_id ON pedido_item(pedido_id);
CREATE INDEX idx_pedido_item_fornecedor_item_id ON pedido_item(fornecedor_item_id);
CREATE INDEX idx_pedido_item_produto_id ON pedido_item(produto_id);
CREATE INDEX idx_pedido_item_insumo_id ON pedido_item(insumo_id);
CREATE INDEX idx_pedido_item_lote_id ON pedido_item(lote_id);

-- Índices para a tabela animal
CREATE INDEX idx_animal_unidade_id ON animal(unidade_id);
CREATE INDEX idx_animal_especie ON animal(especie);

-- Índices para a tabela plantio
CREATE INDEX idx_plantio_unidade_id ON plantio(unidade_id);
CREATE INDEX idx_plantio_categoria ON plantio(categoria);

-- Índices para a tabela atvd_plantio
CREATE INDEX idx_atvd_plantio_lote_id ON atvd_plantio(lote_id);
CREATE INDEX idx_atvd_plantio_responsavel_id ON atvd_plantio(responsavel_id);
CREATE INDEX idx_atvd_plantio_data_inicio ON atvd_plantio(data_inicio);
CREATE INDEX idx_atvd_plantio_tipo ON atvd_plantio(tipo);

-- Índices para a tabela atvd_animalia
CREATE INDEX idx_atvd_animalia_lote_id ON atvd_animalia(lote_id);
CREATE INDEX idx_atvd_animalia_animal_id ON atvd_animalia(animal_id);
CREATE INDEX idx_atvd_animalia_responsavel_id ON atvd_animalia(responsavel_id);
CREATE INDEX idx_atvd_animalia_data_inicio ON atvd_animalia(data_inicio);
CREATE INDEX idx_atvd_animalia_tipo ON atvd_animalia(tipo);

-- Índices para a tabela plano_producao
CREATE INDEX idx_plano_producao_contrato_id ON plano_producao(contrato_id);
CREATE INDEX idx_plano_producao_item_id ON plano_producao(item_id);

-- Índices para a tabela producao
CREATE INDEX idx_producao_lote_id ON producao(lote_id);
CREATE INDEX idx_producao_plantio_id ON producao(plantio_id);
CREATE INDEX idx_producao_animal_id ON producao(animal_id);
CREATE INDEX idx_producao_status ON producao(status);
CREATE INDEX idx_producao_data_registro ON producao(data_registro);

-- Índices para a tabela producao_etapa
CREATE INDEX idx_producao_etapa_producao_id ON producao_etapa(producao_id);
CREATE INDEX idx_producao_etapa_status ON producao_etapa(status);

-- Índices para a tabela registros_sanitarios
CREATE INDEX idx_registros_sanitarios_lote_id ON registros_sanitarios(lote_id);
CREATE INDEX idx_registros_sanitarios_producao_id ON registros_sanitarios(producao_id);
CREATE INDEX idx_registros_sanitarios_data_aplicacao ON registros_sanitarios(data_aplicacao);
CREATE INDEX idx_registros_sanitarios_tipo ON registros_sanitarios(tipo);

-- Índices para a tabela estoque_movimentos
CREATE INDEX idx_estoque_movimentos_origem_unidade_id ON estoque_movimentos(origem_unidade_id);
CREATE INDEX idx_estoque_movimentos_destino_unidade_id ON estoque_movimentos(destino_unidade_id);
CREATE INDEX idx_estoque_movimentos_data ON estoque_movimentos(data);
CREATE INDEX idx_estoque_movimentos_estoque_id ON estoque_movimentos(estoque_id);
CREATE INDEX idx_estoque_movimentos_producao_id ON estoque_movimentos(producao_id);
CREATE INDEX idx_estoque_movimentos_venda_id ON estoque_movimentos(venda_id);
CREATE INDEX idx_estoque_movimentos_pedido_id ON estoque_movimentos(pedido_id);
CREATE INDEX idx_estoque_movimentos_tipo_movimento ON estoque_movimentos(tipo_movimento);

-- Índices para a tabela caixa
CREATE INDEX idx_caixa_unidade_id ON caixa(unidade_id);
CREATE INDEX idx_caixa_usuario_id ON caixa(usuario_id);
CREATE INDEX idx_caixa_aberto_em ON caixa(aberto_em);
CREATE INDEX idx_caixa_status ON caixa(status);

-- Índices para a tabela venda
CREATE INDEX idx_venda_unidade_id ON venda(unidade_id);
CREATE INDEX idx_venda_usuario_id ON venda(usuario_id);
CREATE INDEX idx_venda_caixa_id ON venda(caixa_id);
CREATE INDEX idx_venda_criado_em ON venda(criado_em);
CREATE INDEX idx_venda_status ON venda(status);
CREATE INDEX idx_venda_pagamento ON venda(pagamento);

-- Índices para a tabela itens_vendas
CREATE INDEX idx_itens_vendas_venda_id ON itens_vendas(venda_id);
CREATE INDEX idx_itens_vendas_produto_id ON itens_vendas(produto_id);

-- Índices para a tabela categoria
CREATE INDEX idx_categoria_unidade_id ON categoria(unidade_id);
CREATE INDEX idx_categoria_tipo_movimento ON categoria(tipo_movimento);
CREATE INDEX idx_categoria_ativa ON categoria(ativa);

-- Índices para a tabela subcategoria
CREATE INDEX idx_subcategoria_categoria_id ON subcategoria(categoria_id);
CREATE INDEX idx_subcategoria_ativa ON subcategoria(ativa);

-- Índices para a tabela financeiro
CREATE INDEX idx_financeiro_competencia ON financeiro(competencia);
CREATE INDEX idx_financeiro_status ON financeiro(status);
CREATE INDEX idx_financeiro_tipo_movimento ON financeiro(tipo_movimento);
CREATE INDEX idx_financeiro_unidade_id ON financeiro(unidade_id);
CREATE INDEX idx_financeiro_criado_por_id ON financeiro(criado_por_id);
CREATE INDEX idx_financeiro_vencimento ON financeiro(vencimento);
CREATE INDEX idx_financeiro_categoria_id ON financeiro(categoria_id);
CREATE INDEX idx_financeiro_subcategoria_id ON financeiro(subcategoria_id);

-- =============================================
-- SCRIPT DE SEED PARA MYSQL WORKBENCH -- inserts
-- =============================================


-- ===== PERFIS =====
INSERT INTO perfil (funcao, descricao) VALUES
('GERENTE_MATRIZ', 'Gerente da matriz ou administração central'),
('GERENTE_FAZENDA', 'Gerente responsável pela fazenda'),
('GERENTE_LOJA', 'Gerente responsável pela loja ou filial'),
('FUNCIONARIO_LOJA', 'Funcionário da loja'),
('FUNCIONARIO_FAZENDA', 'Funcionário da fazenda');

-- ===== 2. UNIDADES (criar primeiro, sem gerente_id) =====
INSERT INTO unidade (nome, endereco, tipo, cidade, estado, cep, latitude, longitude, cnpj, email, telefone, status, criado_em, atualizado_em) VALUES
('RuralTech', 'Av. Empresarial, 1000', 'MATRIZ', 'São Paulo', 'SP', '01000-000', -23.55052, -46.633308, '12345678000101', 'ruraltech052@gmail.com', '1140000001', 'ATIVA', NOW(), NOW()),
('VerdeFresco Hortaliças', 'Av. Central, 1', 'LOJA', 'São Paulo', 'SP', '01001-001', -23.5450, -46.6340, '12345678000202', 'lojacentral@empresa.com', '1140000002', 'ATIVA', NOW(), NOW()),
('AgroBoi', 'Rua Norte, 23', 'LOJA', 'Guarulhos', 'SP', '07010-000', -23.4628, -46.5333, '12345678000303', 'lojanorte@empresa.com', '1140000003', 'ATIVA', NOW(), NOW()),
('Casa Útil Mercado', 'Av. Sul, 45', 'LOJA', 'Santo André', 'SP', '09010-000', -23.6639, -46.5361, '12345678000404', 'lojasul@empresa.com', '1140000004', 'ATIVA', NOW(), NOW()),
('Sabor do Campo Laticínios', 'Praça Leste, 10', 'LOJA', 'São Bernardo', 'SP', '09810-000', -23.6916, -46.5644, '12345678000505', 'lojaleste@empresa.com', '1140000005', 'ATIVA', NOW(), NOW()),
('Fazenda Alpha', 'Rod. BR-101, km 100', 'FAZENDA', 'Campinas', 'SP', '13010-000', -22.9099, -47.0626, '12345678100110', 'fazendaalpha@empresa.com', '1930001001', 'ATIVA', NOW(), NOW()),
('Fazenda Gamma', 'Rod. BR-101, km 150', 'FAZENDA', 'Ribeirão Preto', 'SP', '14010-000', -21.1775, -47.8103, '12345678100220', 'fazendabeta@empresa.com', '1630001002', 'ATIVA', NOW(), NOW()),
('Fazenda Beta', 'Estrada Rural, 77', 'FAZENDA', 'Piracicaba', 'SP', '13400-000', -22.7127, -47.6476, '12345678100330', 'fazendagamma@empresa.com', '1930001003', 'ATIVA', NOW(), NOW()),
('Fazenda Delta', 'Estrada Rural, 88', 'FAZENDA', 'Limeira', 'SP', '13480-000', -22.5641, -47.4019, '12345678100440', 'fazendadelta@empresa.com', '1930001004', 'ATIVA', NOW(), NOW()),
('Fazenda Teste', 'Rua Teste, 9', 'FAZENDA', 'Itu', 'SP', '13300-000', -23.2646, -47.2995, '12345678100550', 'teste@empresa.com', '1140000099', 'ATIVA', NOW(), NOW()),
('Loja Teste', 'Av. Caetano Limeira, 2205', 'LOJA', 'Atibaia', 'SP', '04610-000', -23.6639, -46.5361, '12345678951244', 'teste.loja@empresa.com', '1145003151', 'ATIVA', NOW(), NOW());

-- Atualizar horários das lojas
UPDATE unidade SET 
    horario_abertura = '09:00:00',
    horario_fechamento = '19:00:00'
WHERE nome = 'VerdeFresco Hortaliças';

UPDATE unidade SET 
    horario_abertura = '09:00:00',
    horario_fechamento = '18:00:00'
WHERE nome = 'AgroBoi';

UPDATE unidade SET 
    horario_abertura = '10:00:00',
    horario_fechamento = '20:00:00'
WHERE nome = 'Casa Útil Mercado';

UPDATE unidade SET 
    horario_abertura = '09:30:00',
    horario_fechamento = '19:30:00'
WHERE nome = 'Sabor do Campo Laticínios';

UPDATE unidade SET 
    horario_abertura = '10:00:00',
    horario_fechamento = '20:00:00'
WHERE nome = 'Loja Teste';

-- Atualizar áreas das fazendas
UPDATE unidade SET 
    area_total = 1500.5,
    area_produtiva = 1200.3,
    foco_produtivo = 'gado'
WHERE nome = 'Fazenda Alpha';

UPDATE unidade SET 
    area_total = 980.75,
    area_produtiva = 760.0,
    foco_produtivo = 'grãos e cereais'
WHERE nome = 'Fazenda Gamma';

UPDATE unidade SET 
    area_total = 420.0,
    area_produtiva = 365.25,
    foco_produtivo = 'laticínios e gado'
WHERE nome = 'Fazenda Beta';

UPDATE unidade SET 
    area_total = 600.0,
    area_produtiva = 480.5,
    foco_produtivo = 'hortaliças e vegetais'
WHERE nome = 'Fazenda Delta';

UPDATE unidade SET 
    area_total = 50.0,
    area_produtiva = 40.0,
    foco_produtivo = 'laticínios e gado'
WHERE nome = 'Fazenda Teste';

-- ===== USUÁRIOS =====
-- Primeiro obter IDs dos perfis
SET @perfil_gerente_matriz = (SELECT id FROM perfil WHERE funcao = 'GERENTE_MATRIZ');
SET @perfil_gerente_fazenda = (SELECT id FROM perfil WHERE funcao = 'GERENTE_FAZENDA');
SET @perfil_gerente_loja = (SELECT id FROM perfil WHERE funcao = 'GERENTE_LOJA');
SET @perfil_func_loja = (SELECT id FROM perfil WHERE funcao = 'FUNCIONARIO_LOJA');
SET @perfil_func_fazenda = (SELECT id FROM perfil WHERE funcao = 'FUNCIONARIO_FAZENDA');

-- Obter IDs das unidades
SET @unidade_ruraltech = (SELECT id FROM unidade WHERE nome = 'RuralTech');
SET @unidade_sabor_campo = (SELECT id FROM unidade WHERE nome = 'Sabor do Campo Laticínios');
SET @unidade_casa_util = (SELECT id FROM unidade WHERE nome = 'Casa Útil Mercado');
SET @unidade_fazenda_beta = (SELECT id FROM unidade WHERE nome = 'Fazenda Beta');
SET @unidade_verdefresco = (SELECT id FROM unidade WHERE nome = 'VerdeFresco Hortaliças');
SET @unidade_loja_teste = (SELECT id FROM unidade WHERE nome = 'Loja Teste');
SET @unidade_agroboi = (SELECT id FROM unidade WHERE nome = 'AgroBoi');
SET @unidade_fazenda_teste = (SELECT id FROM unidade WHERE nome = 'Fazenda Teste');
SET @unidade_fazenda_gamma = (SELECT id FROM unidade WHERE nome = 'Fazenda Gamma');
SET @unidade_fazenda_delta = (SELECT id FROM unidade WHERE nome = 'Fazenda Delta');
SET @unidade_fazenda_alpha = (SELECT id FROM unidade WHERE nome = 'Fazenda Alpha');

-- Inserir usuários
INSERT INTO usuario (nome, email, senha, telefone, perfil_id, unidade_id, status, token_version, failed_attempts, criado_em, atualizado_em) VALUES
('Julia Alves', 'juliaalvesdeo447@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11987651001', @perfil_gerente_matriz, @unidade_ruraltech, 1, 0, 0, NOW(), NOW()),
('Renato Martins', 'renato.martins@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11987652001', @perfil_gerente_loja, @unidade_sabor_campo, 1, 0, 0, NOW(), NOW()),
('Maria Del Rey', 'mebdelrey@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11987653001', @perfil_gerente_loja, @unidade_casa_util, 1, 0, 0, NOW(), NOW()),
('Richard Souza', 'richardrrggts@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11916694683', @perfil_gerente_fazenda, @unidade_fazenda_beta, 1, 0, 0, NOW(), NOW()),
('Bruna Carvalho', 'bru.carvalho@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11988821353', @perfil_gerente_loja, @unidade_fazenda_beta, 1, 0, 0, NOW(), NOW()),
('Roberto Barros', 'robertbarros01@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11916683574', @perfil_gerente_loja, @unidade_verdefresco, 1, 0, 0, NOW(), NOW()),
('Lorena Oshiro', 'lorenaoshiro2007@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11944556677', @perfil_gerente_loja, @unidade_loja_teste, 1, 0, 0, NOW(), NOW()),
('Mariana Coelho', 'mari.coelho@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '1199637392', @perfil_func_loja, @unidade_loja_teste, 1, 0, 0, NOW(), NOW()),
('Jonatas Silva', 'jonatas91silva@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11958251620', @perfil_func_loja, @unidade_verdefresco, 1, 0, 0, NOW(), NOW()),
('Alice Chagas', 'chagas.alice@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11953821185', @perfil_func_loja, @unidade_agroboi, 1, 0, 0, NOW(), NOW()),
('Marco Lucca Costa', 'lucca.costa@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11942221116', @perfil_func_loja, @unidade_casa_util, 1, 0, 0, NOW(), NOW()),
('Lúcia Mello', 'luciamello11@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '1190086499', @perfil_func_loja, @unidade_sabor_campo, 1, 0, 0, NOW(), NOW()),
('Bruno Tavares', 'bruno.tavares@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11987654321', @perfil_func_fazenda, @unidade_fazenda_teste, 1, 0, 0, NOW(), NOW()),
('Camila Duarte', 'camila.duarte@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11999887766', @perfil_func_fazenda, @unidade_fazenda_gamma, 1, 0, 0, NOW(), NOW()),
('Eduardo Lima', 'edu.lima@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11988776655', @perfil_func_fazenda, @unidade_fazenda_delta, 1, 0, 0, NOW(), NOW()),
('Fernanda Rocha', 'fernanda.rocha@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11977665544', @perfil_func_fazenda, @unidade_fazenda_alpha, 1, 0, 0, NOW(), NOW()),
('Rafael Nunes', 'rafael.nunes@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11966554433', @perfil_func_fazenda, @unidade_fazenda_beta, 1, 0, 0, NOW(), NOW()),
('Usuario Ficticio', 'user.teste@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11995251689', @perfil_gerente_fazenda, @unidade_fazenda_teste, 1, 0, 0, NOW(), NOW()),
('Otávio Viana', 'otavio.viana89@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11999215361', @perfil_gerente_fazenda, @unidade_fazenda_gamma, 1, 0, 0, NOW(), NOW()),
('Kátia Oliveira', 'oliveirakatia09@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11924245261', @perfil_gerente_fazenda, @unidade_fazenda_delta, 1, 0, 0, NOW(), NOW()),
('Juliana Correia', 'correiajuh@gmail.com', SHA2(CONCAT('123456', 'salt_secret'), 256), '11958283626', @perfil_gerente_fazenda, @unidade_fazenda_alpha, 1, 0, 0, NOW(), NOW());

-- =====  ATUALIZAR GERENTES DAS UNIDADES =====
-- Obter IDs dos usuários gerentes
SET @gerente_julia = (SELECT id FROM usuario WHERE nome = 'Julia Alves');
SET @gerente_renato = (SELECT id FROM usuario WHERE nome = 'Renato Martins');
SET @gerente_maria = (SELECT id FROM usuario WHERE nome = 'Maria Del Rey');
SET @gerente_richard = (SELECT id FROM usuario WHERE nome = 'Richard Souza');
SET @gerente_bruna = (SELECT id FROM usuario WHERE nome = 'Bruna Carvalho');
SET @gerente_roberto = (SELECT id FROM usuario WHERE nome = 'Roberto Barros');
SET @gerente_lorena = (SELECT id FROM usuario WHERE nome = 'Lorena Oshiro');
SET @gerente_ficticio = (SELECT id FROM usuario WHERE nome = 'Usuario Ficticio');
SET @gerente_otavio = (SELECT id FROM usuario WHERE nome = 'Otávio Viana');
SET @gerente_katia = (SELECT id FROM usuario WHERE nome = 'Kátia Oliveira');
SET @gerente_juliana = (SELECT id FROM usuario WHERE nome = 'Juliana Correia');

-- Atualizar unidades com gerente_id e matriz_id
UPDATE unidade SET 
    gerente_id = @gerente_julia,
    matriz_id = NULL
WHERE nome = 'RuralTech';

UPDATE unidade SET 
    gerente_id = @gerente_ficticio,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Fazenda Teste';

UPDATE unidade SET 
    gerente_id = @gerente_renato,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Sabor do Campo Laticínios';

UPDATE unidade SET 
    gerente_id = @gerente_otavio,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Fazenda Gamma';

UPDATE unidade SET 
    gerente_id = @gerente_richard,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Fazenda Beta';

UPDATE unidade SET 
    gerente_id = @gerente_katia,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Fazenda Delta';

UPDATE unidade SET 
    gerente_id = @gerente_maria,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Casa Útil Mercado';

UPDATE unidade SET 
    gerente_id = @gerente_bruna,
    matriz_id = @unidade_ruraltech
WHERE nome = 'AgroBoi';

UPDATE unidade SET 
    gerente_id = @gerente_roberto,
    matriz_id = @unidade_ruraltech
WHERE nome = 'VerdeFresco Hortaliças';

UPDATE unidade SET 
    gerente_id = @gerente_juliana,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Fazenda Alpha';

UPDATE unidade SET 
    gerente_id = @gerente_lorena,
    matriz_id = @unidade_ruraltech
WHERE nome = 'Loja Teste';

-- =====  FORNECEDORES EXTERNOS =====
INSERT INTO fornecedor_externo (nome_empresa, descricao_empresa, cnpj_cpf, email, telefone, status, endereco, criado_em, atualizado_em) VALUES
('AgroFornecimentos Ltda', 'Fornece rações e insumos', '12345678000190', 'contato@agrofornece.com', '11999001122', 'ATIVO', 'Rua do Agronegócio, 100', NOW(), NOW()),
('NutriBov Distribuidora', 'Distribuição de ração bovina e suplementos', '10111213000144', 'vendas@nutribov.com', '11988882211', 'ATIVO', 'Rua NutriBov, 123', NOW(), NOW()),
('BovinoPrime Reprodutores', 'Fornecimento de gado de corte e reprodutores certificados, com seleção genética.', '23242526000177', 'comercial@bovinoprime.com.br', '11993004567', 'ATIVO', 'Rod. Rural BR-050, km 200, Galpão 3', NOW(), NOW()),
('Sementes Brasil', 'Venda de sementes selecionadas', '11121314000155', 'contato@sementesbrasil.com', '19997773344', 'ATIVO', 'Av. Sementes, 200', NOW(), NOW()),
('AgroGrãos Comercial', 'Comercialização de farelos e grãos', '12131415000166', 'vendas@agrograos.com', '21996664455', 'ATIVO', 'Rua Grãos, 50', NOW(), NOW()),
('FertSul Distribuição', 'Distribuição de fertilizantes e corretivos', '13141516000177', 'contato@fertsul.com', '51995555566', 'ATIVO', 'Av. Fertilizantes, 300', NOW(), NOW()),
('BioInsumos Ltda', 'Produtos biológicos e microbianos', '14151617000188', 'contato@bioinsumos.com', '51994446677', 'ATIVO', 'Rua Bio, 77', NOW(), NOW()),
('AgroLácteos Suprimentos', 'Insumos para laticínios: coalho, culturas lácteas, consumíveis de processo e embalagens.', '15161718000199', 'vendas@agrolacteos.com', '11993334455', 'ATIVO', 'Av. Laticínios, 45', NOW(), NOW()),
('Lácteos & Tecnologia Ltda', 'Fornece starter cultures, enzimas, embalagens térmicas e equipamentos de pequeno porte para produção de queijo e iogurte.', '16171819000100', 'contato@lacteostec.com.br', '11992223344', 'ATIVO', 'Rua do Leite, 200', NOW(), NOW()),
('AgroBov Genetics', 'Fornecedor de animais reprodutores, touros de alto desempenho e serviços de inseminação artificial.', '17181920000111', 'contato@agrobovgenetics.com.br', '11991112233', 'ATIVO', 'Estrada da Cria, 500', NOW(), NOW()),
('VetBov Serviços e Insumos', 'Vacinas, medicamentos veterinários, assistência técnica e serviços de saúde animal.', '18192021000122', 'vendas@vetbov.com.br', '11994445566', 'ATIVO', 'Rua Veterinária, 77', NOW(), NOW()),
('PastosVerde Nutrição Animal', 'Produção e fornecimento de silagem, feno e suplementos minerais para bovinos.', '19192122000133', 'contato@pastosverde.com.br', '11993332211', 'ATIVO', 'Rodovia Rural, km 12', NOW(), NOW()),
('GenBov Melhoramento Genético', 'Serviços de melhoramento genético, inseminação artificial e fornecimento de animais reprodutores.', '20212223000144', 'vendas@genbov.com.br', '11992221100', 'ATIVO', 'Estrada da Pecuária, 88', NOW(), NOW()),
('AgroVet Saúde Animal', 'Medicamentos veterinários, vacinas e kits de diagnóstico para rebanhos bovinos.', '21222324000155', 'contato@agrovetsaude.com.br', '11991114455', 'ATIVO', 'Av. Veterinária, 300', NOW(), NOW()),
('CampoForte Equipamentos', 'Equipamentos para manejo de gado: balanças, troncos de contenção e bebedouros automáticos.', '22232425000166', 'suporte@campoforte.com.br', '11990002233', 'ATIVO', 'Rua Agroindústria, 150', NOW(), NOW());

-- ===== CONTRATOS =====
-- Obter IDs dos fornecedores
SET @fornecedor_agrofornecimentos = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'AgroFornecimentos Ltda');
SET @fornecedor_nutribov = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'NutriBov Distribuidora');
SET @fornecedor_bovinoprime = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'BovinoPrime Reprodutores');
SET @fornecedor_sementes = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'Sementes Brasil');
SET @fornecedor_agrograos = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'AgroGrãos Comercial');
SET @fornecedor_fertsul = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'FertSul Distribuição');
SET @fornecedor_bioinsumos = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'BioInsumos Ltda');
SET @fornecedor_agrolacteos = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'AgroLácteos Suprimentos');
SET @fornecedor_lacteostec = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'Lácteos & Tecnologia Ltda');
SET @fornecedor_agrobov = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'AgroBov Genetics');
SET @fornecedor_vetbov = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'VetBov Serviços e Insumos');
SET @fornecedor_pastosverde = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'PastosVerde Nutrição Animal');
SET @fornecedor_genbov = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'GenBov Melhoramento Genético');
SET @fornecedor_agrovet = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'AgroVet Saúde Animal');
SET @fornecedor_campoforte = (SELECT id FROM fornecedor_externo WHERE nome_empresa = 'CampoForte Equipamentos');

-- Inserir contratos
INSERT INTO contrato (unidade_id, fornecedor_externo_id, fornecedor_unidade_id, descricao, data_inicio, data_fim, data_envio, status, frequencia_entregas, dia_pagamento, forma_pagamento, valor_total) VALUES
-- Fazenda Alpha com fornecedores externos
(@unidade_fazenda_alpha, @fornecedor_agrofornecimentos, NULL, NULL, '2024-01-01', '2025-12-31', '2024-01-05 08:00:00', 'ATIVO', 'MENSALMENTE', '30', 'PIX', 0.00),
(@unidade_fazenda_alpha, @fornecedor_nutribov, NULL, NULL, '2024-02-01', '2025-12-31', '2024-02-03 07:30:00', 'ATIVO', 'MENSALMENTE', '15', 'PIX', 0.00),
(@unidade_fazenda_alpha, @fornecedor_bovinoprime, NULL, NULL, '2025-02-01', '2026-01-31', '2025-02-03 08:00:00', 'ATIVO', 'MENSALMENTE', '20', 'PIX', 24500.00),

-- Fazenda Gamma com fornecedores externos
(@unidade_fazenda_gamma, @fornecedor_sementes, NULL, NULL, '2024-03-01', '2025-12-31', '2024-03-05 09:00:00', 'ATIVO', 'MENSALMENTE', '10', 'PIX', 0.00),
(@unidade_fazenda_gamma, @fornecedor_agrograos, NULL, NULL, '2024-04-01', '2025-12-31', '2024-04-03 08:30:00', 'ATIVO', 'MENSALMENTE', '05', 'PIX', 0.00),

-- Fazenda Delta com fornecedores externos
(@unidade_fazenda_delta, @fornecedor_fertsul, NULL, NULL, '2024-01-15', '2025-12-31', '2024-01-20 06:00:00', 'ATIVO', 'MENSALMENTE', '20', 'PIX', 0.00),
(@unidade_fazenda_delta, @fornecedor_bioinsumos, NULL, NULL, '2024-02-10', '2025-12-31', '2024-02-12 07:00:00', 'ATIVO', 'MENSALMENTE', '10', 'PIX', 0.00),

-- Fazenda Beta com fornecedores externos
(@unidade_fazenda_beta, @fornecedor_agrolacteos, NULL, NULL, '2024-07-15', '2025-12-31', '2024-07-18 08:00:00', 'ATIVO', 'MENSALMENTE', '10', 'PIX', 835.00),
(@unidade_fazenda_beta, @fornecedor_lacteostec, NULL, NULL, '2024-07-20', '2025-12-31', '2024-07-22 07:30:00', 'ATIVO', 'MENSALMENTE', '15', 'PIX', 740.00),
(@unidade_fazenda_beta, @fornecedor_agrobov, NULL, NULL, '2024-09-01', '2026-08-31', '2024-09-03 06:00:00', 'ATIVO', 'TRIMESTRAL', '30', 'PIX', 21330.00),
(@unidade_fazenda_beta, @fornecedor_vetbov, NULL, NULL, '2024-08-01', '2025-12-31', '2024-08-05 07:00:00', 'ATIVO', 'MENSALMENTE', '15', 'PIX', 414.00),

-- Fazenda Teste com fornecedores externos
(@unidade_fazenda_teste, @fornecedor_pastosverde, NULL, NULL, '2024-10-01', '2025-12-31', '2024-10-03 09:00:00', 'ATIVO', 'MENSALMENTE', '10', 'PIX', 139.20),
(@unidade_fazenda_teste, @fornecedor_genbov, NULL, NULL, '2024-11-01', '2026-10-31', '2024-11-04 08:30:00', 'ATIVO', 'TRIMESTRAL', '20', 'PIX', 17875.00),
(@unidade_fazenda_teste, @fornecedor_agrovet, NULL, NULL, '2024-12-01', '2025-12-31', '2024-12-05 07:45:00', 'ATIVO', 'MENSALMENTE', '25', 'PIX', 130.50),
(@unidade_fazenda_teste, @fornecedor_campoforte, NULL, NULL, '2025-01-10', '2026-12-31', '2025-01-12 10:00:00', 'ATIVO', 'SEMESTRAL', '05', 'PIX', 10220.00),

-- Contratos entre unidades (lojas <- fazendas)
(@unidade_verdefresco, NULL, @unidade_fazenda_delta, NULL, '2025-05-01', '2026-04-30', '2025-05-02 06:00:00', 'ATIVO', 'SEMANALMENTE', '15', 'PIX', 3147.20),
(@unidade_agroboi, NULL, @unidade_fazenda_alpha, NULL, '2025-05-10', '2026-05-09', '2025-05-12 08:00:00', 'ATIVO', 'MENSALMENTE', '30', 'PIX', 19403.00),
(@unidade_casa_util, NULL, @unidade_fazenda_gamma, NULL, '2025-04-15', '2026-04-14', '2025-04-18 09:00:00', 'ATIVO', 'MENSALMENTE', '15', 'PIX', 31898.00),
(@unidade_casa_util, NULL, @unidade_fazenda_alpha, NULL, '2025-04-01', '2026-03-31', '2025-04-03 08:00:00', 'ATIVO', 'MENSALMENTE', '30', 'PIX', 0.00),
(@unidade_casa_util, NULL, @unidade_fazenda_teste, NULL, '2025-03-01', '2026-02-28', '2025-03-02 09:00:00', 'ATIVO', 'MENSALMENTE', '05', 'PIX', 0.00),
(@unidade_sabor_campo, NULL, @unidade_fazenda_beta, NULL, '2025-05-05', '2026-05-04', '2025-05-06 07:30:00', 'ATIVO', 'SEMANALMENTE', '30', 'PIX', 7863.80),
(@unidade_loja_teste, NULL, @unidade_fazenda_teste, NULL, '2025-06-01', '2026-05-31', '2025-06-03 10:00:00', 'ATIVO', 'MENSALMENTE', '10', 'PIX', 872.00);

-- Obter IDs dos contratos criados
SET @contrato_fazenda_beta_agrolacteos = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_beta AND fornecedor_externo_id = @fornecedor_agrolacteos);
SET @contrato_fazenda_beta_lacteostec = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_beta AND fornecedor_externo_id = @fornecedor_lacteostec);
SET @contrato_fazenda_beta_agrobov = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_beta AND fornecedor_externo_id = @fornecedor_agrobov);
SET @contrato_fazenda_beta_vetbov = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_beta AND fornecedor_externo_id = @fornecedor_vetbov);
SET @contrato_fazenda_teste_pastosverde = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_teste AND fornecedor_externo_id = @fornecedor_pastosverde);
SET @contrato_fazenda_teste_genbov = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_teste AND fornecedor_externo_id = @fornecedor_genbov);
SET @contrato_fazenda_teste_agrovet = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_teste AND fornecedor_externo_id = @fornecedor_agrovet);
SET @contrato_fazenda_teste_campoforte = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_teste AND fornecedor_externo_id = @fornecedor_campoforte);
SET @contrato_fazenda_alpha_bovinoprime = (SELECT id FROM contrato WHERE unidade_id = @unidade_fazenda_alpha AND fornecedor_externo_id = @fornecedor_bovinoprime);

-- ===== CONTRATO ITENS =====
-- Inserir itens de insumos
INSERT INTO contrato_itens (contrato_id, produto_id, nome, quantidade, unidade_medida) VALUES
-- Fazenda Beta - AgroLácteos Suprimentos
(@contrato_fazenda_beta_agrolacteos, NULL, 'Culturas lácteas (starter) - pacote', 10, 'KG'),
(@contrato_fazenda_beta_agrolacteos, NULL, 'Embalagem PET 1L (unidade)', 100, 'KG'),
(@contrato_fazenda_beta_agrolacteos, NULL, 'Etiquetas / rótulos (pacote 1000 uni)', 10, 'KG'),

-- Fazenda Beta - Lácteos & Tecnologia Ltda
(@contrato_fazenda_beta_lacteostec, NULL, 'Filtro micro/ultra para pasteurização (unidade)', 1, 'KG'),
(@contrato_fazenda_beta_lacteostec, NULL, 'Produto de limpeza CIP (litro)', 20, 'LITRO'),
(@contrato_fazenda_beta_lacteostec, NULL, 'Kits de calibragem Válvulas / sensores (unidade)', 2, 'KG'),

-- Fazenda Beta - AgroBov Genetics
(@contrato_fazenda_beta_agrobov, NULL, 'Sêmen congelado Holandês (ampola)', 6, 'KG'),
(@contrato_fazenda_beta_agrobov, NULL, 'Embrião (Holandês) - unidade', 1, 'KG'),

-- Fazenda Beta - VetBov Serviços e Insumos
(@contrato_fazenda_beta_vetbov, NULL, 'Vacina contra brucelose (dose)', 20, 'KG'),
(@contrato_fazenda_beta_vetbov, NULL, 'Antibiótico injetável (frasco)', 8, 'KG'),
(@contrato_fazenda_beta_vetbov, NULL, 'Seringas agulha (pacote 100 uni)', 5, 'KG'),

-- Fazenda Teste - PastosVerde Nutrição Animal
(@contrato_fazenda_teste_pastosverde, NULL, 'Feno (fardo 20kg)', 400, 'KG'),
(@contrato_fazenda_teste_pastosverde, NULL, 'Silagem', 800, 'KG'),
(@contrato_fazenda_teste_pastosverde, NULL, 'Suplemento mineral (kg)', 1, 'KG'),

-- Fazenda Teste - GenBov Melhoramento Genético
(@contrato_fazenda_teste_genbov, NULL, 'Sêmen congelado Angus (ampola)', 1, 'KG'),

-- Fazenda Teste - AgroVet Saúde Animal
(@contrato_fazenda_teste_agrovet, NULL, 'Vacina múltipla (dose)', 3, 'KG'),
(@contrato_fazenda_teste_agrovet, NULL, 'Antiparasitário oral (unidade embalagem)', 3, 'KG'),
(@contrato_fazenda_teste_agrovet, NULL, 'Kits de primeiros socorros (unidade)', 1, 'KG'),

-- Fazenda Teste - CampoForte Equipamentos
(@contrato_fazenda_teste_campoforte, NULL, 'Balança de piso animal (unidade)', 1, 'KG'),
(@contrato_fazenda_teste_campoforte, NULL, 'Tronco / brete de contenção (unidade)', 1, 'KG'),
(@contrato_fazenda_teste_campoforte, NULL, 'Bebedouro automático (unidade)', 1, 'KG'),

-- Fazenda Alpha - BovinoPrime Reprodutores
(@contrato_fazenda_alpha_bovinoprime, NULL, 'Touro reprodutor Nelore (adulto)', 2, 'CABECA'),
(@contrato_fazenda_alpha_bovinoprime, NULL, 'Vaca reprodutora Nelore (multipar)', 6, 'CABECA'),
(@contrato_fazenda_alpha_bovinoprime, NULL, 'Bezerro reprodutor (macho, desmama)', 4, 'CABECA'),

-- Fazenda Beta - AgroBov Genetics (continuação)
(@contrato_fazenda_beta_agrobov, NULL, 'Touro reprodutor Holandês', 2, 'CABECA'),
(@contrato_fazenda_beta_agrobov, NULL, 'Vaca reprodutora Holandesa', 5, 'CABECA'),

-- Fazenda Teste - GenBov Melhoramento Genético (continuação)
(@contrato_fazenda_teste_genbov, NULL, 'Touro reprodutor Angus (adulto, PO)', 1, 'CABECA'),
(@contrato_fazenda_teste_genbov, NULL, 'Vaca reprodutora Angus (multipar, PO)', 4, 'CABECA');

-- ===== ESTOQUES DAS UNIDADES =====
INSERT INTO estoque (unidade_id, descricao, qntd_itens, criado_em, atualizado_em) VALUES
(@unidade_fazenda_beta, 'Estoque principal - Fazenda Beta', 0, NOW(), NOW()),
(@unidade_fazenda_teste, 'Estoque principal - Fazenda Teste', 0, NOW(), NOW()),
(@unidade_loja_teste, 'Estoque principal - Loja Teste', 0, NOW(), NOW()),
(@unidade_casa_util, 'Estoque principal - Casa Útil Mercado', 0, NOW(), NOW());

-- ===== ANIMAIS =====
INSERT INTO animal (especie, raca, sexo, sku, data_nasc, fornecedor_id, peso, forma_aquisicao, custo, unidade_id, lote_id) VALUES
('BOVINO', 'Holandês', 'FEMEA', 'ANM-FAZ8-HOL-0001', '2024-09-05', NULL, '600', 'COMPRA', 2400.00, @unidade_fazenda_beta, NULL),
('BOVINO', 'Holandês', 'MACHO', 'ANM-FAZ8-HOL-0002', '2024-09-01', NULL, '850', 'COMPRA', 3200.00, @unidade_fazenda_beta, NULL),
('BOVINO', 'Angus', 'MACHO', 'ANM-FAZ10-ANG-0001', '2024-09-07', NULL, '950', 'COMPRA', 5500.00, @unidade_fazenda_teste, NULL),
('BOVINO', 'Angus', 'FEMEA', 'ANM-FAZ10-ANG-0002', '2024-09-08', NULL, '600', 'COMPRA', 3200.00, @unidade_fazenda_teste, NULL);

-- ===== LOTE DE PRODUÇÃO =====
-- Primeiro criar um lote para a Fazenda Beta
INSERT INTO lote (unidade_id, responsavel_id, nome, tipo, unidade_medida, preco, observacoes, status_qualidade, status_lote, data_criacao, contrato_id) VALUES
(@unidade_fazenda_beta, @gerente_richard, 'Lote Laticínios - Sabor do Campo', 'LEITE', 'LITRO', 7863.80, 'Lote de produtos lácteos para Sabor do Campo Laticínios', 'PROPRIO', 'PRONTO', NOW(), 
    (SELECT id FROM contrato WHERE unidade_id = @unidade_sabor_campo AND fornecedor_unidade_id = @unidade_fazenda_beta));

SET @lote_fazenda_beta = LAST_INSERT_ID();

-- ===== PRODUÇÃO =====
-- Criar produção para o lote
INSERT INTO producao (lote_id, tipo_produto, quantidade_bruta, quantidade_liquida, unidade_medida, perda_percent, custo_mao_obra, outros_custos, custo_total, custo_unitario, data_inicio, data_fim, data_colheita, data_registro, status, metodo, responsavel_id, destino_unidade_id, unidade_id, observacoes) VALUES
(@lote_fazenda_beta, 'Laticínios', 1000.00, 950.00, 'LITRO', 5.0, 1500.00, 800.00, 5500.00, 5.79, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 'FINALIZADA', 'INDUSTRIAL', @gerente_richard, @unidade_sabor_campo, @unidade_fazenda_beta, 'Produção de laticínios para Sabor do Campo');

-- ===== PRODUTOS PARA VENDA =====
-- Criar produtos para venda nas lojas
INSERT INTO produto (unidade_id, origem_unidade_id, nome, sku, categoria, descricao, preco, data_fabricacao, data_validade, unidade_medida, peso_unidade, is_for_sale, criado_em, atualizado_em) VALUES
-- Produtos para Sabor do Campo Laticínios
(@unidade_sabor_campo, @unidade_fazenda_beta, 'Leite Pasteurizado 1L', 'VENDA-SCL-001', 'Laticínios', 'Leite pasteurizado integral', 4.50, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 'LITRO', 1.000, 1, NOW(), NOW()),
(@unidade_sabor_campo, @unidade_fazenda_beta, 'Queijo Mussarela 500g', 'VENDA-SCL-002', 'Laticínios', 'Queijo mussarela fresco', 22.00, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 25 DAY), 'KG', 0.500, 1, NOW(), NOW()),
(@unidade_sabor_campo, @unidade_fazenda_beta, 'Iogurte Natural 170g', 'VENDA-SCL-003', 'Laticínios', 'Iogurte natural', 3.50, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 15 DAY), 'UNIDADE', 0.170, 1, NOW(), NOW()),

-- Produtos para Loja Teste
(@unidade_loja_teste, @unidade_fazenda_teste, 'Leite 1L (teste)', 'VENDA-LT-001', 'Laticínios', 'Leite para teste', 4.00, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 'LITRO', 1.000, 1, NOW(), NOW()),
(@unidade_loja_teste, @unidade_fazenda_teste, 'Queijo Fresco 500g (teste)', 'VENDA-LT-002', 'Laticínios', 'Queijo fresco para teste', 22.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 'KG', 0.500, 1, NOW(), NOW()),
(@unidade_loja_teste, @unidade_fazenda_teste, 'Carne Bovina 1kg', 'VENDA-LT-003', 'Carnes', 'Carne bovina corte dianteiro', 40.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 'KG', 1.000, 1, NOW(), NOW());

-- ===== CAIXAS PARA LOJAS =====
INSERT INTO caixa (unidade_id, usuario_id, status, saldo_inicial, aberto_em) VALUES
-- Caixa para Loja Teste
(@unidade_loja_teste, @gerente_lorena, 1, 1000.00, NOW()),

-- Caixa para Sabor do Campo Laticínios
(@unidade_sabor_campo, @gerente_renato, 1, 1000.00, NOW());

SET @caixa_loja_teste = LAST_INSERT_ID();

-- =====  VENDAS DE HOJE =====
-- Criar algumas vendas para hoje
INSERT INTO venda (nome_cliente, caixa_id, usuario_id, unidade_id, total, pagamento, status, criado_em) VALUES
('João Silva', @caixa_loja_teste, @gerente_lorena, @unidade_loja_teste, 86.00, 'PIX', 'OK', CONCAT(CURDATE(), ' 10:30:00')),
('Maria Santos', @caixa_loja_teste, @gerente_lorena, @unidade_loja_teste, 62.00, 'CARTAO', 'OK', CONCAT(CURDATE(), ' 14:15:00')),
(NULL, @caixa_loja_teste, @gerente_lorena, @unidade_loja_teste, 44.00, 'DINHEIRO', 'OK', CONCAT(CURDATE(), ' 16:45:00'));

SET @venda_1 = LAST_INSERT_ID() - 2;
SET @venda_2 = LAST_INSERT_ID() - 1;
SET @venda_3 = LAST_INSERT_ID();

-- ===== 15. ITENS DE VENDA =====
-- Obter IDs dos produtos
SET @produto_leite_lt = (SELECT id FROM produto WHERE sku = 'VENDA-LT-001');
SET @produto_queijo_lt = (SELECT id FROM produto WHERE sku = 'VENDA-LT-002');
SET @produto_carne_lt = (SELECT id FROM produto WHERE sku = 'VENDA-LT-003');

-- Inserir itens de venda
INSERT INTO itens_vendas (venda_id, produto_id, quantidade, preco_unitario, desconto, subtotal) VALUES
(@venda_1, @produto_leite_lt, 2, 4.00, 0, 8.00),
(@venda_1, @produto_queijo_lt, 1, 22.00, 0, 22.00),
(@venda_1, @produto_carne_lt, 1, 40.00, 0, 40.00),

(@venda_2, @produto_leite_lt, 3, 4.00, 0, 12.00),
(@venda_2, @produto_queijo_lt, 2, 22.00, 0, 44.00),

(@venda_3, @produto_carne_lt, 1, 40.00, 0, 40.00);

-- =====  FINANCEIRO =====
-- Primeiro criar categorias
INSERT INTO categoria (unidade_id, nome, tipo_movimento, descricao, ativa, criado_em, atualizado_em) VALUES
(@unidade_ruraltech, 'Folha', 'SAIDA', 'Despesas com folha de pagamento', 1, NOW(), NOW()),
(@unidade_ruraltech, 'Receita', 'ENTRADA', 'Receitas diversas', 1, NOW(), NOW()),
(@unidade_fazenda_teste, 'Sanidade', 'SAIDA', 'Despesas com saúde animal', 1, NOW(), NOW()),
(@unidade_fazenda_beta, 'Venda', 'ENTRADA', 'Receitas de vendas', 1, NOW(), NOW()),
(@unidade_sabor_campo, 'Compras', 'SAIDA', 'Despesas com compras', 1, NOW(), NOW()),
(@unidade_loja_teste, 'Vendas', 'ENTRADA', 'Receitas de vendas da loja', 1, NOW(), NOW()),
(@unidade_fazenda_alpha, 'Equipamentos', 'SAIDA', 'Despesas com equipamentos', 1, NOW(), NOW());

-- Obter IDs das categorias
SET @categoria_folha = (SELECT id FROM categoria WHERE unidade_id = @unidade_ruraltech AND nome = 'Folha');
SET @categoria_receita = (SELECT id FROM categoria WHERE unidade_id = @unidade_ruraltech AND nome = 'Receita');
SET @categoria_sanidade = (SELECT id FROM categoria WHERE unidade_id = @unidade_fazenda_teste AND nome = 'Sanidade');
SET @categoria_venda_fazenda = (SELECT id FROM categoria WHERE unidade_id = @unidade_fazenda_beta AND nome = 'Venda');
SET @categoria_compras = (SELECT id FROM categoria WHERE unidade_id = @unidade_sabor_campo AND nome = 'Compras');
SET @categoria_vendas_loja = (SELECT id FROM categoria WHERE unidade_id = @unidade_loja_teste AND nome = 'Vendas');
SET @categoria_equipamentos = (SELECT id FROM categoria WHERE unidade_id = @unidade_fazenda_alpha AND nome = 'Equipamentos');

-- Inserir lançamentos financeiros
INSERT INTO financeiro (unidade_id, categoria_id, criado_por_id, descricao, tipo_movimento, forma_pagamento, valor, vencimento, status, documento, criado_em, atualizado_em) VALUES
(@unidade_ruraltech, @categoria_folha, @gerente_julia, 'Folha de pagamento - Novembro/2025', 'SAIDA', 'PIX', 12000.00, '2025-11-30', 'PENDENTE', 'FOLHA-202511', NOW(), NOW()),
(@unidade_ruraltech, @categoria_receita, @gerente_julia, 'Receita venda institucional', 'ENTRADA', 'PIX', 3500.00, DATE_SUB(NOW(), INTERVAL 10 DAY), 'PAGA', 'REC-MATRIZ-202511', NOW(), NOW()),
(@unidade_fazenda_teste, @categoria_sanidade, @gerente_ficticio, 'Compra de medicamentos veterinários', 'SAIDA', 'PIX', 1800.00, DATE_ADD(NOW(), INTERVAL 7 DAY), 'PENDENTE', 'NFVET-FT-202511', NOW(), NOW()),
(@unidade_fazenda_beta, @categoria_venda_fazenda, @gerente_richard, 'Venda de leite cru', 'ENTRADA', 'PIX', 4200.00, DATE_SUB(NOW(), INTERVAL 5 DAY), 'PAGA', 'NFV-FAZB-202511', NOW(), NOW()),
(@unidade_sabor_campo, @categoria_compras, @gerente_renato, 'Pagamento a fornecedor (Fazenda Beta)', 'SAIDA', 'PIX', 2600.00, DATE_ADD(NOW(), INTERVAL 3 DAY), 'PENDENTE', 'PAG-FB-202511', NOW(), NOW()),
(@unidade_loja_teste, @categoria_vendas_loja, @gerente_lorena, 'Recebimento venda - vendas em caixa', 'ENTRADA', 'CARTAO', 1800.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'PAGA', 'REC-LT-202511', NOW(), NOW()),
(@unidade_fazenda_alpha, @categoria_equipamentos, @gerente_juliana, 'Parcelamento equipamento - parcela 2/12', 'SAIDA', 'PIX', 500.00, DATE_ADD(NOW(), INTERVAL 15 DAY), 'PENDENTE', 'EQP-ALPHA-202511', NOW(), NOW());

-- ===== 17. ATIVIDADES ANIMAIS =====
-- Criar atividades para os animais
INSERT INTO atvd_animalia (animal_id, descricao, tipo, lote_id, data_inicio, data_fim, responsavel_id, status) VALUES
((SELECT id FROM animal WHERE sku = 'ANM-FAZ8-HOL-0001'), 'Manejo geral do lote', 'MANEJO_GERAL', @lote_fazenda_beta, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), @gerente_richard, 'CONCLUIDA'),
((SELECT id FROM animal WHERE sku = 'ANM-FAZ8-HOL-0001'), 'Preparação nutricional para produção', 'NUTRICAO', @lote_fazenda_beta, DATE_SUB(NOW(), INTERVAL 8 DAY), NULL, @gerente_richard, 'ATIVA'),
((SELECT id FROM animal WHERE sku = 'ANM-FAZ8-HOL-0001'), 'Pesagem pré-produção', 'MANEJO_PESAGEM', @lote_fazenda_beta, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), @gerente_richard, 'CONCLUIDA'),
((SELECT id FROM animal WHERE sku = 'ANM-FAZ8-HOL-0001'), 'Ordenha diária', 'ORDENHA_DIARIA', @lote_fazenda_beta, DATE_SUB(NOW(), INTERVAL 10 DAY), NULL, @gerente_richard, 'ATIVA');

-- ===== 18. DADOS GERAIS DAS UNIDADES =====
INSERT INTO dado_geral_unidade (unidade_id, dado, valor, descricao, criado_em, atualizado_em) VALUES
(@unidade_ruraltech, 'Fundação', '2020', 'Ano de fundação da empresa', NOW(), NOW()),
(@unidade_fazenda_beta, 'Capacidade Leiteira', '5000 litros/dia', 'Capacidade máxima de produção de leite', NOW(), NOW()),
(@unidade_loja_teste, 'Horário de Funcionamento', '10:00 às 20:00', 'Horário de atendimento ao público', NOW(), NOW());

