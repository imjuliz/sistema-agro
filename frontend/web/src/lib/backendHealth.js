/**
 * Helper para verificar se o backend está disponível antes de fazer requisições críticas
 * Isso ajuda a evitar erros ECONNREFUSED durante a apresentação
 */

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/';
const HEALTH_CHECK_ENDPOINT = `${BACKEND_BASE}health`;
const BACKEND_DIRECT_URL = process.env.NEXT_PUBLIC_BACKEND_DIRECT_URL || 'http://localhost:8080';

let healthCheckCache = {
  lastCheck: 0,
  isHealthy: false,
  checking: false,
};

const CACHE_DURATION = 5000; // 5 segundos

/**
 * Verifica se o backend está disponível
 * Usa cache para evitar múltiplas verificações simultâneas
 */
export async function checkBackendHealth(force = false) {
  const now = Date.now();
  
  // Se já verificamos recentemente e está saudável, retorna cache
  if (!force && healthCheckCache.isHealthy && (now - healthCheckCache.lastCheck) < CACHE_DURATION) {
    return true;
  }

  // Se já está verificando, aguarda o resultado
  if (healthCheckCache.checking) {
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!healthCheckCache.checking) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
    return healthCheckCache.isHealthy;
  }

  healthCheckCache.checking = true;

  try {
    // Tenta primeiro pelo proxy do Next.js usando um endpoint que sempre existe (auth/refresh ou root)
    // Se /health não existir, tenta /auth/refresh que é um endpoint comum
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos timeout

    try {
      // Tenta primeiro o endpoint /health se existir
      const res = await fetch(HEALTH_CHECK_ENDPOINT, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      
      // Qualquer resposta HTTP (incluindo 500) significa que o servidor está rodando
      // 500 = servidor rodando mas com erro, não servidor indisponível
      // 404 = endpoint não existe mas servidor está rodando
      // 200-299 = servidor saudável
      if (res.status >= 200 && res.status < 600) { // Qualquer status HTTP válido
        healthCheckCache.isHealthy = true;
        healthCheckCache.lastCheck = now;
        return true;
      }
    } catch (proxyErr) {
      clearTimeout(timeoutId);
      
      // Se /health não funcionou, tenta um endpoint que sabemos que existe (como root ou auth/refresh)
      // Mas só se for erro 404 (endpoint não existe), não se for erro de conexão
      if (proxyErr.name !== 'AbortError' && !proxyErr.message?.includes('ECONNREFUSED')) {
        // Pode ser que o endpoint não exista, mas o servidor está rodando
        // Tenta uma requisição simples para verificar se o servidor responde
        try {
          const testController = new AbortController();
          const testTimeout = setTimeout(() => testController.abort(), 1500);
          const testRes = await fetch(`${BACKEND_BASE}auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            signal: testController.signal,
            headers: { Accept: 'application/json' },
          });
          clearTimeout(testTimeout);
          
          // Se recebeu qualquer resposta HTTP válida (mesmo 401, 500, etc), significa que o servidor está rodando
          if (testRes.status >= 200 && testRes.status < 600) {
            healthCheckCache.isHealthy = true;
            healthCheckCache.lastCheck = now;
            return true;
          }
        } catch (testErr) {
          // Se falhou, continua para tentar conexão direta
        }
      }
      
      // Se o proxy falhou com erro de conexão, tenta conexão direta como fallback
      if (proxyErr.name === 'AbortError' || proxyErr.message?.includes('ECONNREFUSED')) {
        try {
          const directController = new AbortController();
          const directTimeout = setTimeout(() => directController.abort(), 1500);
          const directRes = await fetch(`${BACKEND_DIRECT_URL}/health`, {
            method: 'GET',
            signal: directController.signal,
            headers: { Accept: 'application/json' },
          });
          clearTimeout(directTimeout);
          
          // Qualquer status HTTP válido significa que o servidor está rodando
          if (directRes.status >= 200 && directRes.status < 600) {
            healthCheckCache.isHealthy = true;
            healthCheckCache.lastCheck = now;
            return true;
          }
        } catch (directErr) {
          // Se /health não existir, tenta root
          try {
            const rootController = new AbortController();
            const rootTimeout = setTimeout(() => rootController.abort(), 1500);
            const rootRes = await fetch(`${BACKEND_DIRECT_URL}/`, {
              method: 'GET',
              signal: rootController.signal,
            });
            clearTimeout(rootTimeout);
            
            if (rootRes.status >= 200 && rootRes.status < 600) {
              healthCheckCache.isHealthy = true;
              healthCheckCache.lastCheck = now;
              return true;
            }
          } catch (rootErr) {
            // Ambos falharam
            console.warn('[BackendHealth] Backend não está disponível:', rootErr.message);
          }
        }
      }
    }

    healthCheckCache.isHealthy = false;
    healthCheckCache.lastCheck = now;
    return false;
  } catch (err) {
    healthCheckCache.isHealthy = false;
    healthCheckCache.lastCheck = now;
    console.warn('[BackendHealth] Erro ao verificar saúde do backend:', err.message);
    return false;
  } finally {
    healthCheckCache.checking = false;
  }
}

/**
 * Aguarda o backend ficar disponível com retry
 */
export async function waitForBackend(maxAttempts = 10, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isHealthy = await checkBackendHealth(true);
    if (isHealthy) {
      return true;
    }
    
    if (attempt < maxAttempts) {
      console.log(`[BackendHealth] Aguardando backend... tentativa ${attempt}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return false;
}

/**
 * Wrapper para fetch com retry automático em caso de ECONNREFUSED
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Não bloqueia mais na verificação de saúde - apenas tenta fazer a requisição
      // A verificação de saúde é apenas informativa, não bloqueante

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      lastError = err;
      
      // Se for ECONNREFUSED ou erro de conexão, tenta novamente
      if (
        err.name === 'AbortError' ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError')
      ) {
        if (attempt < maxRetries) {
          const delay = Math.min(500 * attempt, 2000); // Delay exponencial com máximo de 2s
          console.log(`[fetchWithRetry] Erro de conexão (tentativa ${attempt}/${maxRetries}), aguardando ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // Se não for erro de conexão ou já tentou todas as vezes, lança o erro
      throw err;
    }
  }
  
  throw lastError || new Error('Falha após múltiplas tentativas');
}

