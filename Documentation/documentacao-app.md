# 📩 Cinexa – Plataforma de Engajamento via WhatsApp

> Sistema Node.js para engajamento de colaboradores, com chatbot interativo no WhatsApp, submissão de ideias e gamificação. Hospedado 100% na nuvem com Azure.

## 📑 Visão Geral

Este projeto é um back-end robusto para a plataforma Cinexa, projetada para aumentar o engajamento de colaboradores em empresas como a Eurofarma. A comunicação principal é feita através de um chatbot interativo no WhatsApp, que permite aos funcionários:

-   Navegar por funcionalidades usando um menu com botões e listas.
-   Submeter ideias de inovação diretamente pelo chat.
-   Consultar sua pontuação e o ranking de gamificação.
-   Receber newsletters enviadas por administradores através de um painel web seguro.

A aplicação utiliza **Node.js**, **Express** e **MySQL**, com a infraestrutura totalmente hospedada no **Microsoft Azure**.

---

## 🚀 Funcionalidades Principais

-   **Chatbot Interativo no WhatsApp**: Utiliza menus de lista e botões de resposta para uma navegação intuitiva, com gerenciamento de estado para conversas com múltiplos passos.
-   **Gestão de Ideias**: Permite que colaboradores submetam, visualizem e editem suas ideias diretamente pelo chatbot.
-   **Envio de Newsletters**: API segura (`/api/newsletters`) para que um painel de administração externo possa disparar o envio de newsletters para todos os colaboradores cadastrados.
-   **Gamificação**: Sistema de pontos por submissão de ideias, com ranking e consulta de pontuação, registrando tudo em um log para auditoria.
-   **API RESTful Segura**: Endpoints protegidos por Chave de API para integração segura com o front-end de administração.

---

## 🗂️ Estrutura de Pastas


cinexa-app/
├── src/
│   ├── controllers/       # Lógica que lida com as requisições
│   │   ├── ideaController.js
│   │   ├── newsletterController.js
│   │   └── whatsappController.js
│   ├── middleware/        # Funções de verificação (ex: segurança da API)
│   │   └── apiKeyAuth.js
│   ├── routes/            # Definição das rotas da API
│   │   ├── ideaRoutes.js
│   │   ├── newsletterRoutes.js
│   │   └── whatsappRoutes.js
│   └── services/          # Lógica de negócios e comunicação externa
│       ├── chatbotService.js
│       ├── database.js
│       └── whatsappService.js
├── .env                   # Arquivo com as variáveis de ambiente (local)
├── .gitignore
├── app.js                 # Ponto de entrada da aplicação
├── package.json
└── schema.sql             # Script de criação das tabelas para MySQL

---

## ⚙️ Pré-requisitos

-   **Node.js** >= 18.x
-   Uma conta no **Microsoft Azure** para hospedar a aplicação (App Service) e o banco de dados (Azure Database for MySQL).
-   Uma conta de desenvolvedor na **Meta (Facebook)** para a API do WhatsApp Business.
-   Variáveis de ambiente configuradas no Azure App Service. Para desenvolvimento local, crie um arquivo `.env`:

```env
# Variáveis de Ambiente para Azure e Desenvolvimento Local

# Conexão com o Banco de Dados MySQL no Azure
DB_HOST=cinexa-mysql-server.mysql.database.azure.com
DB_USER=admincinexa
DB_PASSWORD=sua_senha_segura_do_banco
DB_DATABASE=flexibleserverdb

# Chave de API para o Painel Web de Admin
API_KEY=sua_chave_de_api_secreta

# Credenciais da API do WhatsApp
WHATSAPP_ACCESS_TOKEN=seu_token_de_acesso_permanente_da_meta
WHATSAPP_PHONE_NUMBER_ID=id_do_seu_numero_no_whatsapp
WHATSAPP_VERIFY_TOKEN=seu_token_secreto_para_verificar_o_webhook


📦 Dependências Principais
express: Framework web para criar o servidor e as rotas da API.

mysql2: Driver moderno para conexão com o banco de dados MySQL.

axios: Cliente HTTP para fazer requisições à API do WhatsApp.

dotenv: Para carregar as variáveis de ambiente do arquivo .env em desenvolvimento.

cors: Para permitir que o painel web de administração se comunique com esta API.

nodemon: (Desenvolvimento) Reinicia o servidor automaticamente a cada alteração no código.


🛠️ Instalação Local
Clone o repositório:

Bash

git clone https://github.com/CintiaAngelo/cinexa.git
cd cinexa
Instale as dependências:

Bash

npm install
Crie um arquivo .env na raiz do projeto e preencha-o com as suas credenciais, seguindo o exemplo acima.


▶️ Uso
Rodando em modo desenvolvimento (local):
Este comando usa o nodemon para reiniciar o servidor automaticamente quando você salva um arquivo.

Bash

npm run start:dev
Rodando em produção (o Azure faz isso por você):
Bash

npm start
Endpoints da API:
Método	Endpoint	Descrição	Protegido?
GET	/api/health	Verifica se a aplicação está online.	Não
GET	/api/ideas	Lista todas as ideias submetidas.	Não
GET	/api/ideas/:id	Busca uma ideia específica pelo ID.	Não
GET	/api/newsletters	Lista as newsletters cadastradas.	Sim
POST	/api/newsletters	Cria uma nova newsletter no banco.	Sim
POST	/api/newsletters/send/:id	Dispara o envio de uma newsletter para todos.	Sim
GET	/api/whatsapp/webhook	Verificação do webhook pela Meta.	Não
POST	/api/whatsapp/webhook	Recebe as mensagens e eventos do WhatsApp.	Não

Exportar para as Planilhas
Obs: As rotas protegidas exigem uma Chave de API no cabeçalho X-API-KEY da requisição.


💬 Interação com o Chatbot
O chatbot foi projetado para ser intuitivo. Qualquer mensagem inicial (como "Oi" ou "Olá") irá acionar o Menu Principal Interativo. A partir dele, o usuário pode navegar pelas funcionalidades usando os botões.

Os comandos de texto também funcionam:

nova ideia

minhas ideias

editar <ID>

meus pontos

ranking

ajuda ou menu (para reabrir o menu principal)


🤝 Contribuindo
Faça um fork do projeto.

Crie uma branch (git checkout -b feature/minha-feature).

Faça commit das suas mudanças (git commit -m 'Adiciona minha-feature').

Faça push para a branch (git push origin feature/minha-feature).

Abra um Pull Request.

📄 Licença
Este projeto está sob a licença ISC.