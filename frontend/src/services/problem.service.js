import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/problems';

const getProblems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getProblemById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProblem = async (problemData) => {
  const response = await axios.post(API_URL, problemData, { headers: authHeader() });
  return response.data;
};

const updateProblem = async (id, problemData) => {
  const response = await axios.put(`${API_URL}/${id}`, problemData, { headers: authHeader() });
  return response.data;
};

const deleteProblem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  return response.data;
};

const problemService = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
};

export default problemService; 