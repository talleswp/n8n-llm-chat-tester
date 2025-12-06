# n8n LLM Chat Tester

Interface web moderna para testar e interagir com workflows de LLM/AI configurados no n8n através de webhooks.

## 📋 Sobre o Projeto

Este projeto é uma aplicação React que fornece uma interface de chat elegante e funcional para testar integrações com modelos de linguagem (LLMs) através de workflows do n8n. A aplicação permite enviar mensagens de texto e anexar arquivos, simulando um assistente de IA completo.

### Características Principais

- ✨ **Interface Moderna**: Design limpo inspirado em aplicações de chat profissionais
- 💬 **Chat em Tempo Real**: Troca de mensagens com feedback visual de carregamento
- 📎 **Upload de Arquivos**: Suporte para anexar arquivos via drag & drop ou seleção
- 🔄 **Sessões Únicas**: Cada instância gera um ID de sessão único para rastreamento
- 📱 **Responsivo**: Interface adaptável para diferentes tamanhos de tela
- ⚡ **Performance**: Construído com Vite e React 19 para máxima velocidade

## 🚀 Tecnologias

- **React 19.2.0** - Biblioteca JavaScript para interfaces
- **Vite 7.2.4** - Build tool moderna e rápida
- **ESLint** - Linting e qualidade de código
- **CSS Moderno** - Estilização customizada

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/n8n-llm-chat-tester.git

# Entre no diretório
cd n8n-llm-chat-tester

# Instale as dependências
npm install
```

## ⚙️ Configuração

Antes de usar, configure a URL do webhook do n8n no arquivo `src/App.jsx`:

```javascript
const WEBHOOK_URL = 'https://http://localhost:5678
/webhook/llm-chat';
```

Substitua pela URL do seu webhook n8n que processa as requisições de chat.

### Requisitos do Webhook n8n

O webhook deve:
- Aceitar requisições POST com `multipart/form-data`
- Receber os campos: `chatInput`, `sessionId`, e opcionalmente `file`
- Retornar JSON com a resposta no formato: `{ "message": "resposta da IA" }`
- Ter CORS configurado para permitir requisições do frontend

## 🎮 Como Usar

### Desenvolvimento

```bash
npm run dev
```

Abre a aplicação em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Gera os arquivos otimizados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🎨 Funcionalidades da Interface

- **Envio de Mensagens**: Digite e pressione Enter ou clique no botão de envio
- **Anexar Arquivos**: Clique no ícone de clipe ou arraste arquivos para a área de input
- **Textarea Expansível**: O campo de texto se expande automaticamente conforme você digita
- **Histórico Visual**: Mensagens do usuário e da IA claramente diferenciadas
- **Indicador de Carregamento**: Feedback visual enquanto aguarda resposta

## 📁 Estrutura do Projeto

```
n8n-llm-chat-tester/
├── public/           # Arquivos estáticos
├── src/
│   ├── App.jsx       # Componente principal do chat
│   ├── App.css       # Estilos da aplicação
│   ├── main.jsx      # Entry point
│   └── index.css     # Estilos globais
├── index.html        # Template HTML
├── package.json      # Dependências e scripts
└── vite.config.js    # Configuração do Vite
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🔗 Links Úteis

- [n8n Documentation](https://docs.n8n.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
