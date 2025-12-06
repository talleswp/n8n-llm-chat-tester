# API Endpoints - n8n LLM Chat

Base URL: `https://automacao.tizarlabs.app/webhook`

## Autenticação

### POST `/llmchat/auth`
Realiza login do usuário.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Erros:**
- `400/401`: Credenciais inválidas
- `500`: Erro interno do servidor

---

### POST `/user/create`
Cria novo usuário na plataforma.

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 6 caracteres)"
}
```

**Response (200):**
```json
{
  "message": "string"
}
```

**Erros:**
- `400`: Dados inválidos ou email já cadastrado
- `500`: Erro interno do servidor

---

### POST `/llmchat/auth/validate-token`
Valida token JWT (opcional).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "email": "string"
  }
}
```

**Erros:**
- `401`: Token inválido ou expirado

---

## Chat

### POST `/llmchat/chat`
Envia mensagem para o assistente LLM.

**Headers:**
```
Authorization: Bearer {token}
```

**Request (FormData):**
```
chatInput: string (obrigatório)
thread_id: string (opcional - null para nova conversa)
file: File (opcional - apenas imagens)
```

**Response (200):**
```json
{
  "message": "string (resposta do LLM)",
  "thread_id": "string"
}
```

**Erros:**
- `401`: Token inválido
- `400`: Parâmetros inválidos
- `500`: Erro interno do servidor

---

## Threads

### GET `/llmchat/threads`
Lista todas as conversas (threads) do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "string",
      "created_at": "string (ISO 8601)",
      "name": "string (opcional)"
    }
  ]
}
```

**Erros:**
- `401`: Token inválido
- `500`: Erro interno do servidor

---

### GET `/f3c460d7-f14f-4eb2-96da-78800130644a/llmchat/threads/{threadId}`
Busca histórico completo de uma thread específica.

**Headers:**
```
Authorization: Bearer {token}
```

**Params:**
- `threadId`: ID da thread

**Response (200):**
```json
{
  "messages": [
    {
      "human": "string (mensagem do usuário)",
      "ai": "string (resposta do assistente)"
    }
  ],
  "messagesCount": number
}
```

**Erros:**
- `401`: Token inválido
- `404`: Thread não encontrada
- `500`: Erro interno do servidor

---

## Notas Importantes

1. **Autenticação**: Todos os endpoints (exceto `/llmchat/auth` e `/user/create`) requerem token JWT no header `Authorization: Bearer {token}`
2. **Token Storage**: O token é armazenado no `localStorage` com chave `auth_token`
3. **File Upload**: Apenas imagens são aceitas no campo `file` (validação: `accept="image/*"`)
4. **Thread ID**: Quando `null` ou ausente, o backend cria uma nova conversa
5. **Formato de Datas**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
