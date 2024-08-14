import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown, Plus, Minus, RefreshCw } from 'lucide-react';
import { Block, MemoryStats } from './types';
import { AllocatorType } from './AllocatorFactory';
import { BLOCK_SIZE } from './utils/constants';

interface MemoryAllocatorViewProps {
    blocks: Block[];
    stats: MemoryStats;
    onAddElement: () => void;
    onRemoveElement: () => void;
    onReset: () => void;
    allocatorType: AllocatorType;
    onAllocatorChange: (type: AllocatorType) => void;
    getExecutedCode: () => string;
    getHighlightedLine: () => number;
    getExplanation: () => string;
    getNewBlockIndex: () => number;
    getNewElementIndex: () => number;
    getFreedElementIndex: () => number;
    autoMode: boolean;
    onToggleAutoMode: () => void;
}

const MemoryAllocatorView: React.FC<MemoryAllocatorViewProps> = ({
    blocks,
    stats,
    onAddElement,
    onRemoveElement,
    onReset,
    allocatorType,
    onAllocatorChange,
    getExecutedCode,
    getHighlightedLine,
    getExplanation,
    getNewBlockIndex,
    getNewElementIndex,
    getFreedElementIndex,
    autoMode,
    onToggleAutoMode,
}) => {
    const [executedCode, setExecutedCode] = useState('');
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setExecutedCode(getExecutedCode());
            setHighlightedLine(getHighlightedLine());
            setExplanation(getExplanation());
        }, 100);

        return () => clearInterval(updateInterval);
    }, [getExecutedCode, getHighlightedLine, getExplanation]);

    const getElementAddress = (blockAddress: number, elemIndex: number) => {
        switch (allocatorType) {
            case AllocatorType.Blkpool:
                return blockAddress + elemIndex * 10;
            case AllocatorType.Lary:
                return blockAddress + elemIndex * 2;
            default:
                return blockAddress + elemIndex * 2; 
        }
    };
    
    const renderBlock = (block: Block, blockIndex: number) => (
        <div key={block.address} className="border-2 border-gray-300 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-500 mb-2">Address: 0x{block.address.toString(16).padStart(8, '0')}</div>
            <div className="grid grid-cols-2 gap-2">
        {[...Array(BLOCK_SIZE)].map((_, elemIndex) => {
            const elem = block.elements[elemIndex];
            const isNew = blockIndex === getNewBlockIndex() && elemIndex === getNewElementIndex();
            const isFreed = blockIndex === blocks.length - 1 && elemIndex === getFreedElementIndex();
            return (
                <div
                key={elemIndex}
                className={`${
elem ? (isNew ? 'bg-green-200 animate-pulse' : isFreed ? 'bg-red-200 animate-pulse' : 'bg-blue-200') : 'bg-gray-100'
} rounded p-2 text-center`}
                    >
                    <div className="text-xs text-gray-500">
                    0x{(block.address + elemIndex * 10).toString(16).padStart(8, '0')}
                </div>
                    {elem || ''}
                </div>
            );
        })}
        </div>
            {blockIndex < blocks.length - 1 && (
                <div className="flex justify-center my-2">
                    <ArrowDown size={24} className="text-gray-500" />
                    </div>
            )}
        </div>
    );

    const renderCodeBlock = () => (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Executed Code:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
            <code>
            {executedCode.split('\n').map((line, index) => (
                <div key={index} className={index === highlightedLine ? 'bg-yellow-500 text-black' : ''}>
                    {line}
                </div>
            ))}
        </code>
            </pre>
            </div>
    );

    return (
        <div className="p-4 bg-gray-100 rounded-xl shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Memory Allocator Simulation</h2>
            <select
        value={allocatorType}
        onChange={(e) => onAllocatorChange(Number(e.target.value) as AllocatorType)}
        className="mb-4 p-2 border rounded"
            >
            {Object.entries(AllocatorType)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => (
                    <option key={key} value={value}>
                        {key}
                    </option>
                ))}
        </select>
            <div className="flex justify-center space-x-4 mb-4">
            <button onClick={onAddElement} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <Plus size={20} className="mr-2" /> Add Element
        </button>
            <button onClick={onRemoveElement} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
            <Minus size={20} className="mr-2" /> Remove Element
        </button>
            <button onClick={onReset} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
            <RefreshCw size={20} className="mr-2" /> Reset
        </button>
            <button onClick={onToggleAutoMode} className={`${autoMode ? 'bg-yellow-500' : 'bg-blue-500'} text-white px-4 py-2 rounded flex items-center`}>
            <RefreshCw size={20} className="mr-2" /> {autoMode ? 'Stop Auto' : 'Start Auto'}
        </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Memory Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
            <div>
            <p className="text-sm font-medium text-gray-500">Total Memory</p>
            <p className="text-lg font-semibold">{stats.totalMemory} bytes</p>
            </div>
            <div>
            <p className="text-sm font-medium text-gray-500">Used Memory</p>
            <p className="text-lg font-semibold">{stats.usedMemory} bytes</p>
            </div>
            <div>
            <p className="text-sm font-medium text-gray-500">Free Memory</p>
            <p className="text-lg font-semibold">{stats.freeMemory} bytes</p>
            </div>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
        className="bg-blue-500 h-4" 
        style={{ width: `${(stats.usedMemory / stats.totalMemory) * 100}%` }}
            ></div>
            </div>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
            <p className="font-bold">Explanation</p>
            <p>{explanation}</p>
            </div>
            {renderCodeBlock()}
            <div className="space-y-4 max-h-96 overflow-y-auto">
            {blocks.map(renderBlock)}
        </div>
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">How {AllocatorType[allocatorType]} Works:</p>
            <ul className="list-disc list-inside">
            <li>Allocates memory in blocks, each holding multiple elements</li>
            <li>New blocks are created when the current one is full</li>
            <li>Elements are added to the last block until it's full</li>
<li>Removing an element frees space in the last block</li>
<li>Empty blocks are removed from the pool</li>
<li>Efficient for FIFO-style allocation and deallocation</li>
</ul>
</div>
</div>
);
};

export default MemoryAllocatorView;
