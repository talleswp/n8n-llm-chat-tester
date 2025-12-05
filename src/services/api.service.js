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
   * @param {string} sessionId - ID da sessão
   * @param {File} file - Arquivo anexado (opcional)
   * @param {string} token - Token JWT de autenticação
   * @returns {Promise<object>}
   */
  async sendMessage(chatInput, sessionId, file = null, token = null) {
    const formData = new FormData();
    formData.append('chatInput', chatInput);
    formData.append('sessionId', sessionId);
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
