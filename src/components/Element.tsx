import React from 'react';
import { ElementProps } from '../types';

export const Element: React.FC<ElementProps> = ({ value, address, isNew, isFreed }) => (
  <div className={`${isNew ? 'bg-green-200 animate-pulse' : isFreed ? 'bg-red-200 animate-pulse' : 'bg-blue-200'} rounded p-2 text-center`}>
    <div className="text-xs text-gray-500">0x{address.toString(16).padStart(8, '0')}</div>
    {value}
  </div>
);
