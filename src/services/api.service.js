// Centraliza todas as chamadas HTTP para o backend

const API_BASE_URL = 'https://automacao.tizarlabs.app/webhook';

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Faz login com email e senha
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/llmchat/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha no login`);
    }

    return response.json();
  },

  /**
   * Valida o token JWT (opcional - se o backend tiver endpoint)
   * @param {string} token 
   * @returns {Promise<{valid: boolean, user: object}>}
   */
  async validateToken(token) {
    const response = await fetch(`${API_BASE_URL}/llmchat/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Token inválido - Status: ${response.status}`);
    }

    const responseText = await response.text();
    
    // Resposta vazia não é válida
    if (!responseText || responseText.trim() === '') {
      return { valid: false };
    }
    
    // Tenta fazer parse do JSON
    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error('Resposta inválida do servidor');
    }
  },
};

/**
 * Serviço de chat com LLM
 */
export const chatService = {
  /**
   * Envia mensagem para o webhook do n8n
   * @param {string} chatInput - Mensagem do usuário
   * @param {string} threadId - ID da thread (null para nova conversa)
   * @param {File} file - Arquivo anexado (opcional)
   * @param {string} token - Token JWT de autenticação
   * @returns {Promise<{message: string, thread_id: string}>}
   */
  async sendMessage(chatInput, threadId = null, file = null, token = null) {
    const formData = new FormData();
    formData.append('chatInput', chatInput);
    if (threadId) formData.append('thread_id', threadId);
    if (file) formData.append('file', file);

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/llmchat/chat`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText || 'Falha na requisição'}`);
    }

    return response.json();
  },
};

/**
 * Serviço de gerenciamento de threads
 */
export const threadService = {
  /**
   * Lista todas as threads do usuário
   * @param {string} token - Token JWT de autenticação
   * @returns {Promise<{data: Array<{id: string, created_at: string, name?: string}>}>}
   */
  async getThreads(token) {
    const response = await fetch(`${API_BASE_URL}/llmchat/threads`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao carregar threads`);
    }

    return response.json();
  },

  /**
   * Busca o histórico de uma thread específica
   * @param {string} threadId - ID da thread
   * @param {string} token - Token JWT de autenticação
   * @returns {Promise<{messages: Array<{human: string, ai: string}>, messagesCount: number}>}
   */
  async getThreadHistory(threadId, token) {
    const response = await fetch(`${API_BASE_URL}/f3c460d7-f14f-4eb2-96da-78800130644a/llmchat/threads/${threadId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao carregar histórico`);
    }

    return response.json();
  },
};
