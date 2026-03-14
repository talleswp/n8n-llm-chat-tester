# N-Space — n8n LLM Chat

Interface web completa para interagir com assistentes de IA através de workflows do n8n, com autenticação, gerenciamento de conversas (threads) e suporte a RAG (Retrieval-Augmented Generation).

## 📋 Sobre o Projeto

N-Space é uma aplicação React full-featured que se conecta a um backend n8n via webhooks para oferecer uma experiência de chat com LLMs. A infraestrutura roda em containers Docker (PostgreSQL + n8n + Caddy) e o frontend pode ser implantado em Azure Static Web Apps ou qualquer servidor estático.

### Características Principais

- 🔐 **Autenticação JWT** — Login, registro de usuários e validação de token
- 💬 **Chat com Threads** — Conversas organizadas com histórico persistente no banco
- 📎 **Upload de Imagens** — Anexe imagens ao chat via drag & drop ou seleção
- 📄 **RAG (Upload de Documentos)** — Envie PDF, DOCX, DOC, TXT e CSV para enriquecer o contexto da IA
- 🗂️ **Sidebar com Histórico** — Lista de threads com renomear, excluir e buscar
- 📱 **Responsivo** — Interface adaptável para desktop e mobile
- ⚡ **Performance** — Construído com Vite 7 e React 19

## 🚀 Tecnologias

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19.2, Vite 7.2, Bootstrap 5.3, Bootstrap Icons |
| **Backend / Orquestração** | n8n (workflows via webhooks) |
| **Banco de Dados** | PostgreSQL 18 |
| **Proxy Reverso** | Caddy (HTTPS automático) |
| **Containerização** | Docker Compose |
| **Deploy Frontend** | Azure Static Web Apps (opcional) |

---

## 📦 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/n8n-llm-chat-tester.git
cd n8n-llm-chat-tester

# Instale as dependências do frontend
npm install
```

---

## ⚙️ Variáveis de Ambiente

O projeto possui **dois** arquivos `.env.example` — um para o frontend (raiz) e outro para a infraestrutura Docker.

### 1. Frontend — `.env.example` (raiz do projeto)

Copie para `.env` na raiz e configure:

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL base do backend n8n (webhook). Em dev usa o proxy do Vite; em prod aponta direto para o webhook. | `https://localhost:5678/webhook-test` (dev) ou `https://seu-dominio.com/webhook` (prod) |

> **Como funciona:** O `api.service.js` usa `VITE_API_BASE_URL` como prefixo de todos os endpoints. Em desenvolvimento, o Vite proxeia as requisições `/api` para o n8n (configurado em `vite.config.js`) evitando problemas de CORS.

### 2. Infraestrutura Docker — `Docker/.env.example`

Copie para `Docker/.env` e configure:

```bash
cp Docker/.env.example Docker/.env
```

| Variável | Descrição | Exemplo / Padrão |
|---|---|---|
| **Banco de Dados** | | |
| `POSTGRES_USER` | Usuário do PostgreSQL | `n8n_admin` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `admin` |
| `POSTGRES_DB` | Nome do banco de dados | `n8n_production` |
| **Segurança n8n** | | |
| `N8N_ENCRYPTION_KEY` | Chave para criptografar credenciais no banco. Gere com: `openssl rand -hex 24` | `8f3a2c5e1b...` |
| `REACT_SWA_URL` | URL do frontend (usado em `N8N_CORS_ALLOWED_ORIGINS`) | `https://seu-app.azurestaticapps.net` |
| **Networking / Webhooks** | | |
| `WEBHOOK_URL` | URL pública do n8n (obrigatória para webhooks e OAuth) | `https://seu-dominio.com:5678/` |
| `N8N_SECURE_COOKIE` | Habilita cookies seguros (HTTPS) | `true` |
| **Performance** | | |
| `N8N_RUNNERS_ENABLED` | Habilita runners externos para workflows pesados | `false` |
| `N8N_RUNNERS_MODE` | Modo dos runners (`internal` / `external`) | `internal` |
| `N8N_RUNNERS_AUTH_TOKEN` | Token de autenticação dos runners | (gere com `openssl rand -hex 24`) |
| `GENERIC_TIMEZONE` | Fuso horário para agendamentos | `America/Sao_Paulo` |

---

## 🐳 Infraestrutura Docker

A pasta `Docker/` contém toda a infraestrutura necessária para rodar o backend.

### Arquivos na pasta `Docker/`

| Arquivo | Descrição |
|---|---|
| `docker-compose.yml` | Orquestra 3 serviços: **PostgreSQL 18** (rede interna), **n8n** e **Caddy** (proxy reverso → n8n) |
| `.env.example` | Template das variáveis de ambiente da infraestrutura |
| `Database.sql` | Script SQL para criação das tabelas `users` e `threads` |
| `Caddyfile.txt` | Configuração do Caddy como proxy reverso com HTTPS automático |

### Serviços do Docker Compose

```
                    rede pública                 rede interna
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Caddy     │────▶│     n8n     │────▶│  PostgreSQL  │
│  :80 / :443 │     │   :5678     │     │   :5432      │
│ HTTPS auto   │     │  Webhooks   │     │ (não exposto)│
│ proxy reverso│     │  Workflows  │     │  users +     │
│  ──▶ n8n    │     │             │     │  threads     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │              O Caddy só redireciona    │ rede interna
   Internet           tráfego para o n8n.       │ (não acessível
                      PostgreSQL fica em rede   │  externamente)
                      interna isolada.          ▼
```

### Subir a infraestrutura

```bash
cd Docker

# Crie o .env a partir do template
cp .env.example .env
# Edite o .env com suas configurações

# Suba os containers
docker compose up -d

# Verifique os logs
docker compose logs -f
```

### Configuração do Caddy

Edite `Docker/Caddyfile.txt` substituindo `seu-enderec0.com` pelo seu domínio real:

```
seu-dominio.com {
    reverse_proxy n8n:5678
}
```

O Caddy provisiona certificados SSL automaticamente via Let's Encrypt.

### Banco de Dados

Após subir os containers, execute o script SQL para criar as tabelas:

```bash
docker exec -i n8n_postgres_db psql -U n8n_admin -d n8n_production < Database.sql
```

**Tabelas criadas:**

- **`users`** — `id` (UUID), `email`, `password_hash`, `name`, `created_at`
- **`threads`** — `id` (UUID), `user_id` (FK → users), `name`, `created_at`

---

## 🔄 Fluxo n8n (Workflow)

O arquivo `fluxo_n8n/llm-chat-SQLS.json` contém o workflow completo do n8n que deve ser importado na sua instância.

### Como importar

1. Acesse o painel do n8n (ex: `https://seu-dominio.com`)
2. Vá em **Workflows → Import from File**
3. Selecione o arquivo `fluxo_n8n/llm-chat-SQLS.json`
4. Configure as credenciais (banco PostgreSQL, provider de LLM, etc.)
5. **Ative** o workflow

### Endpoints expostos pelo workflow

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `POST` | `/llmchat/auth` | Login (retorna JWT + user) | ❌ |
| `POST` | `/user/create` | Registro de novo usuário | ❌ |
| `POST` | `/llmchat/auth/validate-token` | Valida token JWT | ✅ Bearer |
| `POST` | `/llmchat/chat` | Envia mensagem ao LLM (FormData) | ✅ Bearer |
| `GET` | `/llmchat/threads` | Lista threads do usuário | ✅ Bearer |
| `GET` | `/llmchat/threads/{threadId}` | Histórico de uma thread | ✅ Bearer |
| `POST` | `/llmchat/rag/` | Upload de documento para RAG | ✅ Bearer |

> Consulte [API_ENDPOINTS.md](API_ENDPOINTS.md) para detalhes completos de request/response de cada endpoint.

---

## 🎮 Desenvolvimento

### Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173`. O Vite proxeia automaticamente `/api/*` para o n8n (configurado em `vite.config.js`).

### Build para produção

```bash
npm run build
```

Gera os arquivos otimizados na pasta `dist/`.

### Preview da build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Estrutura do Projeto

```
n8n-llm-chat-tester/
├── .env.example                 # Variáveis do frontend (VITE_API_BASE_URL)
├── index.html                   # Template HTML (Bootstrap 5 via CDN)
├── package.json                 # Dependências e scripts
├── vite.config.js               # Config Vite + proxy para n8n em dev
├── staticwebapp.config.json     # Config Azure Static Web Apps (SPA fallback)
├── API_ENDPOINTS.md             # Documentação detalhada da API
│
├── Docker/                      # 🐳 Infraestrutura completa
│   ├── .env.example             # Variáveis do Docker (PostgreSQL, n8n, Caddy)
│   ├── docker-compose.yml       # PostgreSQL 18 + n8n + Caddy
│   ├── Database.sql             # DDL das tabelas users e threads
│   └── Caddyfile.txt            # Proxy reverso com HTTPS automático
│
├── fluxo_n8n/                   # 🔄 Workflow do n8n
│   └── llm-chat-SQLS.json      # Importar no n8n (auth, chat, threads, RAG)
│
├── public/                      # Arquivos estáticos (favicon, imagens)
│
└── src/
    ├── main.jsx                 # Entry point React
    ├── App.jsx                  # Roteamento por autenticação
    ├── index.css                # Estilos globais
    │
    ├── components/
    │   ├── chat/                # Chat principal + modal de RAG
    │   │   ├── Chat.jsx
    │   │   ├── Chat.css
    │   │   └── RagUploadModal.jsx
    │   ├── login/               # Tela de login
    │   │   ├── Login.jsx
    │   │   └── Login.css
    │   ├── register/            # Tela de registro
    │   │   ├── Register.jsx
    │   │   └── Register.css
    │   ├── sidebar/             # Sidebar com threads
    │   │   ├── Sidebar.jsx
    │   │   ├── Sidebar.css
    │   │   ├── ThreadItem.jsx
    │   │   ├── ThreadItem.css
    │   │   └── UserMenu.jsx
    │   └── common/              # Componentes reutilizáveis
    │       ├── button/Button.jsx
    │       └── input/FormInput.jsx
    │
    ├── context/                 # React Contexts
    │   ├── AuthContext.jsx       # Provider de autenticação
    │   ├── authContext.js        # createContext de auth
    │   ├── ThreadContext.jsx     # Provider de threads
    │   └── threadContext.js      # createContext de threads
    │
    ├── hooks/                   # Custom Hooks
    │   ├── useAuth.js           # Acesso ao AuthContext
    │   ├── useChat.js           # Lógica completa do chat
    │   ├── useRag.js            # Upload de documentos RAG
    │   └── useThreads.js        # Acesso ao ThreadContext
    │
    ├── services/
    │   └── api.service.js       # Chamadas HTTP centralizadas
    │
    └── utils/
        └── dateUtils.js         # Utilitários de data
```

---

## 🎨 Funcionalidades da Interface

- **Autenticação** — Login e registro com persistência via `localStorage`
- **Envio de Mensagens** — Enter para enviar, Shift+Enter para nova linha
- **Anexar Imagens** — Clique no ícone ou arraste para a área de input (aceita `image/*`)
- **Upload de Documentos (RAG)** — Modal dedicado para enviar PDF, DOCX, DOC, TXT, CSV
- **Threads** — Sidebar com lista de conversas, renomear e excluir
- **Textarea Expansível** — Auto-resize até 150px de altura
- **Estado Vazio** — Tela de boas-vindas personalizada com nome do usuário
- **Loading States** — Feedback visual durante envio e carregamento

---

## 🚢 Deploy

### Azure Static Web Apps

O projeto inclui `staticwebapp.config.json` com fallback SPA configurado. No build do GitHub Actions, defina a variável:

```
VITE_API_BASE_URL=https://seu-dominio.com/webhook
```

### Self-hosted

1. Suba a infraestrutura Docker (seção acima)
2. Faça `npm run build`
3. Sirva a pasta `dist/` com qualquer servidor estático (Nginx, Caddy, etc.)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues ou envie pull requests.

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🔗 Links Úteis

- [n8n Documentation](https://docs.n8n.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
