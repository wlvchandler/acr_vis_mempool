import React from 'react';
import { BlockProps } from '../types';

export const Block: React.FC<BlockProps> = ({ children, address, isNew, isCurrent, isFree }) => (
  <div className={`border-2 ${isNew ? 'border-green-500 animate-pulse' : isCurrent ? 'border-blue-500' : isFree ? 'border-yellow-500' : 'border-gray-300'} rounded-lg p-4 mb-4 transition-all duration-300`}>
    <div className="text-xs text-gray-500 mb-2">Address: 0x{address.toString(16).padStart(8, '0')}</div>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>
);
