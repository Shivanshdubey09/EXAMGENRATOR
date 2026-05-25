
import axios from 'axios';

const configuredBaseUrl = process.env.REACT_APP_API_URL || 'https://examgen-backend-lem4.onrender.com';
const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, '');

const API = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

export default API;
