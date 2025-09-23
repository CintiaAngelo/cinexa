# 🚀 Cinexa – Plataforma de Engajamento via WhatsApp

> Back-end para a plataforma de inovação Cinexa, com um chatbot interativo no WhatsApp e uma API segura para administração. Projeto desenvolvido com Node.js, Express, MySQL e hospedado no Microsoft Azure.

## 📑 Visão Geral

A solução Cinexa é uma iniciativa para aumentar o engajamento dos colaboradores e gerenciar programas de inovação dentro de uma organização como a Eurofarma. O projeto utiliza o WhatsApp como principal canal de comunicação, permitindo que os funcionários interajam com um chatbot para submeter ideias, acompanhar sua pontuação em um sistema de gamificação e receber comunicados.

Este repositório contém o código-fonte do **back-end** da aplicação, responsável por toda a lógica de negócios, comunicação com a API do WhatsApp e interação com o banco de dados.

## ✨ Funcionalidades Principais

-   **Chatbot Interativo no WhatsApp**: Utiliza menus de lista e botões de resposta para uma navegação intuitiva e gerenciamento de estado para conversas com múltiplos passos.
-   **Gestão de Ideias**: Permite que colaboradores submetam, visualizem e editem suas ideias diretamente pelo chatbot.
-   **Gamificação**: Sistema de pontos por submissão de ideias, com ranking e consulta de pontuação.
-   **API RESTful Segura**: Endpoints protegidos por Chave de API para integração com um front-end de administração, permitindo a criação e o envio de newsletters.

---

## 🛠️ Tecnologias Utilizadas

-   **Back-end**: Node.js, Express.js
-   **Banco de Dados**: MySQL (hospedado no Azure Database for MySQL)
-   **Hospedagem**: Microsoft Azure App Service
-   **API de Mensagens**: WhatsApp Business Cloud API
-   **Ferramentas**: Git, VS Code, Postman

---

## 🗂️ Estrutura do Projeto

cinexa/
├── src/
│   ├── controllers/       # Lógica que lida com as requisições
│   ├── middleware/        # Funções de verificação (ex: segurança da API)
│   ├── routes/            # Definição das rotas da API
│   └── services/          # Lógica de negócios e comunicação externa
├── .env                   # Arquivo local com as variáveis de ambiente
├── .gitignore
├── app.js                 # Ponto de entrada da aplicação
├── package.json
└── schema.sql             # Script de criação das tabelas para MySQL


---

## ⚙️ Configuração e Instalação

### Pré-requisitos
-   Node.js (versão 18 ou superior)
-   Conta no Microsoft Azure
-   Conta de Desenvolvedor da Meta (Facebook)

### Passos para Instalação Local

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/CintiaAngelo/cinexa.git](https://github.com/CintiaAngelo/cinexa.git)
    cd cinexa
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e preencha-o com suas credenciais, seguindo o modelo abaixo. Para produção, estas variáveis devem ser configuradas no Azure App Service.

    ```env
    # Conexão com o Banco de Dados MySQL no Azure
    DB_HOST=seu_servidor.mysql.database.azure.com
    DB_USER=seu_usuario_admin
    DB_PASSWORD=sua_senha_do_banco
    DB_DATABASE=flexibleserverdb

    # Chave de API para o Painel Web de Admin
    API_KEY=crie_uma_chave_secreta_longa

    # Credenciais da API do WhatsApp
    WHATSAPP_ACCESS_TOKEN=seu_token_de_acesso_permanente_da_meta
    WHATSAPP_PHONE_NUMBER_ID=id_do_seu_numero_no_whatsapp
    WHATSAPP_VERIFY_TOKEN=seu_token_secreto_para_o_webhook
    ```

4.  **Prepare o Banco de Dados:**
    Conecte-se ao seu servidor MySQL no Azure e execute o script `schema.sql` para criar todas as tabelas.

---

## ▶️ Rodando a Aplicação

### Modo de Desenvolvimento
Este comando usa o `nodemon` para reiniciar o servidor automaticamente a cada alteração no código.
```bash
npm run start:dev
Modo de Produção
Este comando é usado pelo Azure para iniciar a aplicação.

Bash

npm start
Para testar o webhook do WhatsApp localmente, é necessário usar uma ferramenta como o 

ngrok.

🌐 Endpoints da API
Método	Endpoint	Descrição	Protegido?
GET	/api/health	Verifica se a aplicação está online.	Não
GET	/api/ideas	Lista todas as ideias submetidas.	Não
GET	/api/ideas/:id	Busca uma ideia específica pelo ID.	Não
GET	/api/newsletters	Lista as newsletters cadastradas.	Sim
POST	/api/newsletters	Cria uma nova newsletter no banco.	Sim
POST	/api/newsletters/send/:id	Dispara o envio de uma newsletter para todos.	Sim
GET	/api/whatsapp/webhook	Verificação do webhook pela Meta.	Não
POST	/api/whatsapp/webhook	Recebe as mensagens e eventos do WhatsApp.	Não
As rotas protegidas exigem uma Chave de API no cabeçalho X-API-KEY da requisição.

💬 Interação com o Chatbot
O chatbot foi projetado para ser intuitivo. Qualquer mensagem inicial (como "Oi" ou "Olá") ou um comando não reconhecido irá acionar o Menu Principal Interativo. A partir dele, o usuário pode navegar pelas funcionalidades usando os botões de lista. Após cada ação, um botão de "Voltar ao Menu" é apresentado para facilitar a navegação.

Os comandos de texto também funcionam:

nova ideia

minhas ideias

editar <ID>

meus pontos

ranking

ajuda ou menu (para reabrir o menu principal)

🤝 Contribuição
Contribuições são bem-vindas! Por favor, siga os passos abaixo:

Faça um fork do projeto.

Crie uma branch para sua feature (git checkout -b feature/MinhaNovaFeature).

Faça commit das suas mudanças (git commit -m 'Adiciona MinhaNovaFeature').

Faça push para a branch (git push origin feature/MinhaNovaFeature).

Abra um Pull Request.

📄 Licença
Este projeto está sob a licença ISC.
