import React from 'react';
import { MemoryStatsProps } from '../types';

export const MemoryStats: React.FC<MemoryStatsProps> = ({ totalMemory, usedMemory, freeMemory }) => (
  <div className="bg-gray-100 p-4 rounded-lg mb-4">
    <h3 className="text-lg font-semibold mb-2">Memory Statistics</h3>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Total Memory</p>
        <p className="text-lg font-semibold">{totalMemory} bytes</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Used Memory</p>
        <p className="text-lg font-semibold">{usedMemory} bytes</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Free Memory</p>
        <p className="text-lg font-semibold">{freeMemory} bytes</p>
      </div>
    </div>
    <div className="mt-2 bg-gray-200 rounded-full h-4 overflow-hidden">
      <div 
        className="bg-blue-500 h-4" 
        style={{ width: `${(usedMemory / totalMemory) * 100}%` }}
      ></div>
    </div>
  </div>
);
