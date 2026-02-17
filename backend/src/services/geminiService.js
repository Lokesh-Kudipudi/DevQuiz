const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuizQuestions = async (topic, difficulty, count) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate ${count} multiple choice questions about "${topic}" at "${difficulty}" difficulty level.
        Return the response strictly in JSON format array. 
        Each object in the array should have:
        - question: String
        - options: Array of 4 strings
        - correctAnswer: String (must be one of the options)
        
        Example format:
        [
            {
                "question": "What is ...?",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": "A"
            }
        ]
        Do not add any markdown formatting like \`\`\`json. Just the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up markdown if present (just in case)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate quiz");
    }
};

module.exports = { generateQuizQuestions };
