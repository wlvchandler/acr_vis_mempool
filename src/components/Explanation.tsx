import React from 'react';
import { ExplanationProps } from '../types';

export const Explanation: React.FC<ExplanationProps> = ({ text }) => (
  <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
    <p className="font-bold">Explanation</p>
    <p>{text}</p>
  </div>
);
