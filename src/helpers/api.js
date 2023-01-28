import axios from 'axios';

const ENVATO_BASE_URL = 'https://api.envato.com/v3';

const api = axios.create({
  baseURL: ENVATO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.ENVATO_API}`,
  },
  withCredentials: true,
});

export default api;
