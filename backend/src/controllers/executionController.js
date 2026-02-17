const axios = require('axios');

const PISTON_URL = 'http://localhost:2000/api/v2';

// Execute code
exports.executeCode = async (req, res) => {
    try {
        const { language, version, files, stdin } = req.body;
        
        const response = await axios.post(`${PISTON_URL}/execute`, {
            language,
            version,
            files,
            stdin
        });

        res.json(response.data);
    } catch (error) {
        console.error('Piston Execution Error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to execute code' });
    }
};

// Get supported runtimes
exports.getRuntimes = async (req, res) => {
    try {
        const response = await axios.get(`${PISTON_URL}/runtimes`);
        res.json(response.data);
    } catch (error) {
        console.error('Piston Runtimes Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch runtimes' });
    }
};
