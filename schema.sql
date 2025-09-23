-- schema.sql (Versão Final para MySQL)

CREATE TABLE COLABORADORES (
    id_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone_whatsapp VARCHAR(20) UNIQUE NOT NULL,
    departamento VARCHAR(100),
    pontos_gamificacao INT DEFAULT 0 NOT NULL,
    chatbot_state VARCHAR(50),
    chatbot_context VARCHAR(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NEWSLETTERS (
    id_newsletter INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo_clob TEXT,
    data_envio_programada DATE,
    status_envio VARCHAR(50) DEFAULT 'Pendente'
);

CREATE TABLE INTERACOES (
    id_interacao INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    id_newsletter_origem INT,
    tipo_interacao VARCHAR(100) NOT NULL,
    mensagem_clob TEXT,
    data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interacao_colaborador FOREIGN KEY (id_colaborador) REFERENCES COLABORADORES(id_colaborador)
);

CREATE TABLE IDEIAS (
    id_ideia INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    titulo_ideia VARCHAR(255),
    descricao_ideia_clob TEXT NOT NULL,
    status_ideia VARCHAR(50) DEFAULT 'Submetida',
    data_submissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pontos_atribuidos INT DEFAULT 0,
    CONSTRAINT fk_ideia_colaborador FOREIGN KEY (id_colaborador) REFERENCES COLABORADORES(id_colaborador)
);

CREATE TABLE GAMIFICACAO_LOG (
    id_log_pontos INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    id_referencia INT,
    tipo_referencia VARCHAR(50),
    pontos_ganhos INT NOT NULL,
    data_concessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao_motivo VARCHAR(255),
    CONSTRAINT fk_gamelog_colaborador FOREIGN KEY (id_colaborador) REFERENCES COLABORADORES(id_colaborador)
);