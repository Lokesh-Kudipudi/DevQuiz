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

const generateCodingQuestions = async (topic, difficulty, count) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using a capable model

        const prompt = `Generate ${count} coding problems about "${topic}" at "${difficulty}" difficulty level.
        Return the response strictly in JSON format array.
        
        CRITICAL INSTRUCTION FOR C++ STARTER CODE:
        The "starterCode" MUST be a complete, compilable C++ program.
        It MUST include:
        1. All necessary headers (iostream, vector, string, algorithm, map, etc.)
        2. A "Solution" class with the logic.
        3. A "int main()" function that:
           - Reads input from 'cin' (standard input).
           - Instantiates the Solution class.
           - Calls the solution method.
           - Prints the result to 'cout' (standard output).
        
        The user should only need to fill in the "solve" function logic. The main function should be pre-written to handle the test case input format.

        Each object in the array should have:
        - title: String
        - description: String (Markdown supported, clear problem statement)
        - difficulty: String (Easy, Medium, or Hard)
        - topic: String (e.g., Arrays, DP)
        - starterCode: String (The complete compilable C++ code)
        - testCases: Array of 3 objects, each having:
            - input: String (e.g., "2 3")
            - expectedOutput: String
            - isHidden: Boolean (make the last one true)

        Example format:
        [
            {
                "title": "Sum of Two",
                "description": "Given two integers...",
                "difficulty": "Easy",
                "topic": "Math",
                "starterCode": "#include <iostream>\\nusing namespace std;\\n\\nclass Solution {\\npublic:\\n    int solve(int a, int b) {\\n        // Your code here\\n        return a + b;\\n    }\\n};\\n\\nint main() {\\n    int a, b;\\n    if (cin >> a >> b) {\\n        Solution sol;\\n        cout << sol.solve(a, b) << endl;\\n    }\\n    return 0;\\n}",
                "testCases": [
                    { "input": "2 3", "expectedOutput": "5", "isHidden": false }
                ]
            }
        ]
        Do not add any markdown formatting like \`\`\`json. Just the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini API Error (Coding):", error);
        throw new Error("Failed to generate coding questions");
    }
};

module.exports = { generateQuizQuestions, generateCodingQuestions };
