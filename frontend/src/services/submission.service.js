import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/submissions';

const createSubmission = async (submissionData) => {
  try {
    console.log('Sending submission request with headers:', authHeader());
    console.log('Submission data:', submissionData);
    
    const response = await axios.post(API_URL, submissionData, { 
      headers: authHeader(),
      validateStatus: false // This will prevent axios from throwing errors for non-2xx status codes
    });
    
    console.log('Server response:', response);

    if (response.status !== 201) {
      throw new Error(response.data?.message || `Server returned status ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Submission error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || error;
  }
};

const getUserSubmissions = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-submissions`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getProblemSubmissions = async (problemId) => {
  try {
    const response = await axios.get(`${API_URL}/problem/${problemId}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getSubmissionById = async (submissionId) => {
  try {
    const response = await axios.get(`${API_URL}/${submissionId}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const submissionService = {
  createSubmission,
  getUserSubmissions,
  getProblemSubmissions,
  getSubmissionById,
};

export default submissionService; 