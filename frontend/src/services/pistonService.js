import axios from '../api/axios';

const LANGUAGE_VERSIONS = {
    javascript: '18.15.0',
    python: '3.10.0',
    java: '15.0.2',
    c: '10.2.0',
    cpp: '10.2.0',
};

export const executeCode = async (language, sourceCode, stdin = '') => {
    try {
        const response = await axios.post('/api/piston/execute', {
            language: language,
            version: LANGUAGE_VERSIONS[language] || '*',
            files: [
                {
                    content: sourceCode
                }
            ],
            stdin: stdin
        });

        return response.data;
    } catch (error) {
        console.error('Error executing code:', error);
        throw error;
    }
};

export const getRuntimes = async () => {
    try {
        const response = await axios.get('/api/piston/runtimes');
        return response.data;
    } catch (error) {
        console.error('Error fetching runtimes:', error);
        return [];
    }
};
