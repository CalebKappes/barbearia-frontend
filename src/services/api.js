import axios from 'axios';

// Cria uma instância do axios que será usada em todo o aplicativo
const api = axios.create({
  // CORREÇÃO: Colocamos a URL do back-end Django diretamente aqui.
  // Isso garante que o front-end sempre se comunicará com o servidor correto.
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona o token de autenticação em TODAS as requisições
// que saírem da nossa aplicação para o backend.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Se o token existir, adiciona o header de autorização
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Retorna a configuração modificada para a chamada
}, error => {
  // Faz algo com o erro da requisição
  return Promise.reject(error);
});

export default api;
