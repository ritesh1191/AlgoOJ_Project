import axios from 'axios';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPID_API_KEY = '187350c721mshf723c36c213e29ap18fee7jsnd6404b9e0a2a';
const RAPID_API_HOST = 'judge0-ce.p.rapidapi.com';

const headers = {
    'X-RapidAPI-Key': RAPID_API_KEY,
    'X-RapidAPI-Host': RAPID_API_HOST,
    'Content-Type': 'application/json'
};

// Language IDs for Judge0 API
export const LANGUAGE_IDS = {
    python: 71,  // Python (3.8.1)
    cpp: 54,     // C++ (GCC 9.2.0)
    java: 62,    // Java (OpenJDK 13.0.1)
};

// Submit code for execution
const submitCode = async (sourceCode, languageId, stdin) => {
    try {
        // Create submission
        const submission = await axios.post(`${JUDGE0_API_URL}/submissions`, {
            source_code: sourceCode,
            language_id: languageId,
            stdin: stdin,
        }, { headers });

        const token = submission.data.token;

        // Poll for result
        let result;
        do {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const response = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`, { headers });
            result = response.data;
        } while (result.status?.id <= 2); // 1: In Queue, 2: Processing

        return result;
    } catch (error) {
        console.error('Code execution error:', error);
        throw new Error(error.response?.data?.message || 'Error executing code');
    }
};

// Run code with single input
export const runCode = async (code, language, input) => {
    const languageId = LANGUAGE_IDS[language];
    const result = await submitCode(code, languageId, input);
    
    if (result.status.id !== 3) { // 3 means Accepted
        throw new Error(result.status.description + '\n' + (result.compile_output || result.stderr || ''));
    }

    return {
        output: result.stdout || '',
        time: result.time,
        memory: result.memory
    };
};

// Submit code and check against all test cases
export const submitAndEvaluate = async (code, language, testCases) => {
    const languageId = LANGUAGE_IDS[language];
    const results = [];
    let allTestsPassed = true;

    for (const testCase of testCases) {
        try {
            const result = await submitCode(code, languageId, testCase.input);
            
            const testResult = {
                passed: false,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: '',
                error: null,
                isHidden: testCase.isHidden
            };

            if (result.status.id === 3) { // Accepted
                const actualOutput = (result.stdout || '').trim();
                const expectedOutput = testCase.output.trim();
                testResult.passed = actualOutput === expectedOutput;
                testResult.actualOutput = actualOutput;
            } else {
                testResult.error = result.status.description + '\n' + (result.compile_output || result.stderr || '');
            }

            results.push(testResult);
            if (!testResult.passed) allTestsPassed = false;

        } catch (error) {
            results.push({
                passed: false,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: '',
                error: error.message,
                isHidden: testCase.isHidden
            });
            allTestsPassed = false;
        }
    }

    return {
        success: allTestsPassed,
        results: results
    };
}; 