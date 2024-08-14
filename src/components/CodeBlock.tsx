import React from 'react';
import { CodeBlockProps } from '../types';

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, highlightedLine }) => (
  <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
    <code>
      {code.split('\n').map((line, index) => (
        <div key={index} className={index === highlightedLine ? 'bg-yellow-500 text-black' : ''}>
          {line}
        </div>
      ))}
    </code>
  </pre>
);
