import axios from 'axios';

// Função inteligente que escolhe o URL correto da API
const getApiUrl = () => {
  // Quando o projeto está em produção na Vercel, process.env.NODE_ENV será 'production'
  if (process.env.NODE_ENV === 'production') {
    // Usa o URL público do teu back-end no Render
    return 'https://barbearia-backend-ex7b.onrender.com';
  }
  
  // Em qualquer outro caso (no teu computador), usa o localhost
  return 'http://localhost:8000';
};

// Cria a instância do axios com o URL correto
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação (isto já estava correto)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
