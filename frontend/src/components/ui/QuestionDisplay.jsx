import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import "highlight.js/styles/atom-one-dark.css";

const QuestionDisplay = ({ content }) => {
  return (
    <div className="prose max-w-none text-[var(--color-text-base)] prose-headings:text-[var(--color-text-base)] prose-strong:text-[var(--color-text-base)] prose-code:text-[var(--color-text-base)] prose-a:text-[var(--color-accent)] prose-pre:bg-[var(--color-surface2)] prose-pre:border prose-pre:border-[var(--color-text-base)]/[0.14]">
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
