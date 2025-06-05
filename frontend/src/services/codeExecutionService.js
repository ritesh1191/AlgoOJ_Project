import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/code';

// Language IDs for Judge0 API
export const LANGUAGE_IDS = {
    python: 71,  // Python (3.8.1)
    cpp: 54,     // C++ (GCC 9.2.0)
    java: 62,    // Java (OpenJDK 13.0.1)
};

// Run code with single input
export const runCode = async (code, language, input) => {
    try {
        const response = await axios.post(`${API_URL}/execute`, {
            code,
            language,
            input
        }, { headers: authHeader() });

        return {
            output: response.data.output || '',
            time: 0, // We're not tracking execution time for now
            memory: 0 // We're not tracking memory usage for now
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error executing code');
    }
};

// Submit code and check against all test cases
export const submitAndEvaluate = async (code, language, testCases) => {
    try {
        const response = await axios.post(`${API_URL}/evaluate`, {
            code,
            language,
            testCases
        }, { headers: authHeader() });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error evaluating code');
    }
}; 