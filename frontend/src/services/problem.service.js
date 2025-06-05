import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/problems';

const getProblems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getProblemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createProblem = async (problemData) => {
  try {
    const response = await axios.post(API_URL, problemData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateProblem = async (id, problemData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, problemData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteProblem = async (id) => {
  try {
    const headers = authHeader();
    if (!headers.Authorization) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.delete(`${API_URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Delete error details:', error.response || error);
    throw error.response?.data || error;
  }
};

const problemService = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
};

export default problemService; 