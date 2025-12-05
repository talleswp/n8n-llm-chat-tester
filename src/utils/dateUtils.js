/**
 * Formata uma data ISO para formato legível em português
 * @param {string} isoDate - Data no formato ISO (ex: "2025-12-04T21:06:38.777Z")
 * @returns {string} - Data formatada (ex: "04/12/2025 18:06" ou "Hoje 18:06")
 */
export const formatThreadDate = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const now = new Date();
  
  // Verifica se é hoje
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  
  // Verifica se foi ontem
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  
  // Formata hora (HH:MM)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  if (isToday) {
    return `Hoje ${timeStr}`;
  }
  
  if (isYesterday) {
    return `Ontem ${timeStr}`;
  }
  
  // Formata data completa (DD/MM/YYYY HH:MM)
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year} ${timeStr}`;
};

/**
 * Formata data de forma relativa (ex: "há 2 horas", "há 3 dias")
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} - Texto relativo
 */
export const formatRelativeDate = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'Agora';
  if (diffMin < 60) return `Há ${diffMin} min`;
  if (diffHour < 24) return `Há ${diffHour}h`;
  if (diffDay === 1) return 'Ontem';
  if (diffDay < 7) return `Há ${diffDay} dias`;
  if (diffDay < 30) return `Há ${Math.floor(diffDay / 7)} semanas`;
  if (diffDay < 365) return `Há ${Math.floor(diffDay / 30)} meses`;
  return `Há ${Math.floor(diffDay / 365)} anos`;
};
