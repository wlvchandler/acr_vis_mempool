import React from 'react';
import { ArrowRight, Plus, Minus, RefreshCw } from 'lucide-react';
import { Block } from './components/Block';
import { Element } from './components/Element';
import { CodeBlock } from './components/CodeBlock';
import { Explanation } from './components/Explanation';
import { MemoryStats } from './components/MemoryStats';
import { Block as BlockType } from './types';
import { BLOCK_SIZE } from './utils/constants';

interface BlkpoolViewProps {
    blocks: BlockType[];
    totalMemory: number;
    usedMemory: number;
    explanation: string;
    executedCode: string;
    highlightedLine: number;
    newBlockIndex: number;
    newElementIndex: number;
    currentBlockIndex: number;
    freedElementIndex: number;
    autoMode: boolean;
    onAddElement: () => void;
    onRemoveElement: () => void;
    onToggleAutoMode: () => void;
    onResetSimulation: () => void;
}




const BlkpoolView: React.FC<BlkpoolViewProps> = ({
    blocks,
    totalMemory,
    usedMemory,
    explanation,
    executedCode,
    highlightedLine,
    newBlockIndex,
    newElementIndex,
    currentBlockIndex,
    freedElementIndex,
    autoMode,
    onAddElement,
    onRemoveElement,
    onToggleAutoMode,
    onResetSimulation
}) => {
    return (
        <div className="p-4 bg-gray-100 rounded-xl shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Advanced Interactive Blkpool Memory Allocator</h2>
            <div className="flex justify-center space-x-4 mb-4">
            <button onClick={onAddElement} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <Plus size={20} className="mr-2" /> Add Element
        </button>
            <button onClick={onRemoveElement} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
            <Minus size={20} className="mr-2" /> Remove Element
        </button>
        <button onClick={onToggleAutoMode} className={`${autoMode ? 'bg-yellow-500' : 'bg-blue-500'} text-white px-4 py-2 rounded flex items-center`}>
            <RefreshCw size={20} className="mr-2" /> {autoMode ? 'Stop Auto' : 'Start Auto'}
        </button>
            <button onClick={onResetSimulation} className="bg-gray-500 text-white px-4 py-2 rounded">
            Reset Simulation
        </button>
            </div>
            <MemoryStats totalMemory={totalMemory} usedMemory={usedMemory} freeMemory={totalMemory - usedMemory} />
            <Explanation text={explanation} />
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
            {blocks.map((block, blockIndex) => (
                <Block
                key={block.address}
                address={block.address}
                isNew={blockIndex === newBlockIndex}
                isCurrent={blockIndex === currentBlockIndex}
                isFree={block.isFree}
                    >
                    {[...Array(BLOCK_SIZE)].map((_, i) => (
                        <Element
                        key={i}
                        value={block.elements[i] || ''}
                        address={block.address + i * 10}
                        isNew={blockIndex === newBlockIndex && i === newElementIndex}
                        isFreed={blockIndex === blocks.length - 1 && i === freedElementIndex}
                            />
                    ))}
                {blockIndex < blocks.length - 1 && (
                    <div className="col-span-2 flex justify-center my-2">
                        <ArrowRight size={24} className="text-gray-500" />
                        </div>
                )}
                </Block>
            ))}
        </div>
            <div>
            <h3 className="text-lg font-semibold mb-2">Executed Code:</h3>
            <CodeBlock code={executedCode} highlightedLine={highlightedLine} />
            </div>
            </div>
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">How Blkpool Works:</p>
            <ul className="list-disc list-inside">
            <li>Allocates memory in blocks, each holding up to {BLOCK_SIZE} elements</li>
            <li>New blocks are created when the current one is full</li>
            <li>Elements are added to the last block until it\'s full</li>
            <li>Removing an element frees space in the last block</li>
            <li>Empty blocks are removed from the pool</li>
            <li>Efficient for FIFO-style allocation and deallocation</li>
            <li>Can lead to fragmentation if elements are freed out of order</li>
            </ul>
            </div>
            </div>
    );
};

export default BlkpoolView;
