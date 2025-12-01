import { API_URL } from './api';

// Normaliza e constrói a URL final para imagens.
export function buildImageUrl(src) {
  if (!src) return '';
  const s = String(src);
  // Se já é URL absoluta, ou já aponta para a API ou é data: URI, retorna sem mudanças
  if (/^https?:\/\//.test(s) || s.startsWith('/api/') || s.startsWith('/uploads/') || s.startsWith('data:') || s.startsWith('blob:')) {
    return s;
  }
  // Remove barras iniciais e qualquer 'uploads/' duplicado, em seguida adiciona `/api/uploads/`.
  const cleaned = s.replace(/^\/+/, '').replace(/^uploads\/*/, '');
  return `${API_URL}uploads/${cleaned}`;
}

export default buildImageUrl;
