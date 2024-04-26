import axios from 'axios';

const BASE_URL = 'https://expovar.com.br/wp-json/wp/v2';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para obter o token JWT
export async function getJWTToken(username, password) {
  try {
    const response = await axios.post(
      'https://expovar.com.br/wp-json/jwt-auth/v1/token',
      {
        username,
        password,
      }
    );
    return response.data.token; // Retorna o token JWT
  } catch (error) {
    console.error('Erro ao obter token JWT:', error);
    throw error; // Lança o erro para tratamento
  }
}

// Configura a instância de axios com o token JWT
export function setAuthorization(token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
