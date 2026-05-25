
import axios from 'axios';

const configuredBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, '');

const API = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

export default API;
