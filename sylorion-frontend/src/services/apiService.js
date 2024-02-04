import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; 

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

export const sendOcrData = async (data) => {
  try {
    const response = await apiService.post('/api/facture', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
