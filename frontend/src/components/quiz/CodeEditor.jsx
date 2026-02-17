import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode } from '../../services/pistonService';

const CodeEditor = ({ initialCode, initialLanguage = 'cpp', onCodeChange }) => {
    const [code, setCode] = useState(initialCode || '// Write your code here');
    const [language, setLanguage] = useState(initialLanguage);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleEditorChange = (value) => {
        setCode(value);
        if (onCodeChange) {
            onCodeChange(value);
        }
    };

    const runCode = async () => {
        setIsLoading(true);
        setIsError(false);
        setOutput('Running...');
        try {
            const result = await executeCode(language, code);
            if (result.run.stderr) {
                setIsError(true);
                setOutput(result.run.stderr);
            } else {
                setOutput(result.run.stdout);
            }
        } catch (error) {
            setIsError(true);
            setOutput('Error connecting to execution server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full border border-gray-700 rounded-lg overflow-hidden bg-[#1e1e1e]">
            {/* Toolbar */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">Language:</span>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-[#3e3e3e] text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <button
                    onClick={runCode}
                    disabled={isLoading}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                        isLoading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isLoading ? 'Running...' : 'Run Code'}
                </button>
            </div>

            {/* Split View: Editor & Output */}
            <div className="flex flex-1 flex-col md:flex-row h-[500px]">
                {/* Editor Area */}
                <div className="flex-1 border-r border-gray-700">
                    <Editor
                        height="100%"
                        defaultLanguage="cpp"
                        language={language}
                        value={code}
                        theme="vs-dark"
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Output Area */}
                <div className="h-1/3 md:h-full md:w-1/3 bg-[#1e1e1e] flex flex-col">
                    <div className="px-4 py-2 bg-[#252526] border-b border-gray-700 text-gray-300 text-sm font-medium">
                        Output
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
                        {output ? (
                            <span className={isError ? 'text-red-400' : 'text-green-400'}>
                                {output}
                            </span>
                        ) : (
                            <span className="text-gray-500 italic">
                                Run your code to see output here...
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
