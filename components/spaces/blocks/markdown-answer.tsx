import React from "react";
import ReactMarkdown, { Components } from "react-markdown";

interface MarkdownAnswerProps {
  content: string;
}

const CustomComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="font-semibold text-lg mb-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-gray-900 font-semibold mt-2 mb-4" {...props} />
  ),
  p: ({ node, ...props }) => <p className="text-gray-900" {...props} />,
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-inside" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal list-inside" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li
      className="mb-2"
      style={{ textIndent: "-1em", paddingLeft: "1em" }}
      {...props}
    />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-blue-500 hover:underline" {...props} />
  ),
};

const MarkdownAnswer: React.FC<MarkdownAnswerProps> = ({ content }) => {
  return <ReactMarkdown components={CustomComponents}>{content}</ReactMarkdown>;
};

export default MarkdownAnswer;
