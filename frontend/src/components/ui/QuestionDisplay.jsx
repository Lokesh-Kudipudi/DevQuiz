import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import 'highlight.js/styles/atom-one-dark.css';

const QuestionDisplay = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeHighlight]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default QuestionDisplay;
