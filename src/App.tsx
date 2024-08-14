import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Minus, RefreshCw } from 'lucide-react';
import { Block } from './components/Block';
import { Element } from './components/Element';
import { CodeBlock } from './components/CodeBlock';
import { Explanation } from './components/Explanation';
import { MemoryStats } from './components/MemoryStats';
import { BLOCK_SIZE, ELEMENT_SIZE, allocCode, freeCode } from './utils/constants';
import { Block as BlockType } from './types';

const BlkpoolAdvancedInteractive: React.FC = () => {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [nextAddress, setNextAddress] = useState(1000);
    const [executedCode, setExecutedCode] = useState('');
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [explanation, setExplanation] = useState('');
    const [newBlockIndex, setNewBlockIndex] = useState(-1);
    const [newElementIndex, setNewElementIndex] = useState(-1);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
    const [freedElementIndex, setFreedElementIndex] = useState(-1);
    const [totalMemory, setTotalMemory] = useState(0);
    const [usedMemory, setUsedMemory] = useState(0);
    const [autoMode, setAutoMode] = useState(false);

    const addElement = () => {
        setExecutedCode(allocCode);
        setHighlightedLine(0);
        setExplanation("Starting allocation process...");

        const newElement = `Elem${blocks.reduce((acc, block) => acc + block.elements.length, 0) + 1}`;
        const newBlocks = [...blocks];
        
        if (newBlocks.length === 0 || newBlocks[newBlocks.length - 1].elements.length === BLOCK_SIZE) {
            newBlocks.push({ address: nextAddress, elements: [newElement], isFree: false });
            setNextAddress(nextAddress + 1000);
            setNewBlockIndex(newBlocks.length - 1);
            setNewElementIndex(0);
            setTotalMemory(totalMemory + BLOCK_SIZE * ELEMENT_SIZE);
        } else {
            newBlocks[newBlocks.length - 1].elements.push(newElement);
            setNewBlockIndex(newBlocks.length - 1);
            setNewElementIndex(newBlocks[newBlocks.length - 1].elements.length - 1);
        }
        
        setBlocks(newBlocks);
        setUsedMemory(usedMemory + ELEMENT_SIZE);

        // Simulate code execution
        setTimeout(() => {
            setHighlightedLine(1);
            setExplanation("Allocating memory for the new element...");
        }, 1000);
        setTimeout(() => {
            setHighlightedLine(3);
            setExplanation("Calling the constructor for the new element...");
        }, 2000);
        setTimeout(() => {
            setHighlightedLine(5);
            setExplanation("Returning the newly allocated and constructed element.");
        }, 3000);
        setTimeout(() => {
            setHighlightedLine(-1);
            setExplanation("Allocation complete!");
            setNewBlockIndex(-1);
            setNewElementIndex(-1);
        }, 4000);
    };

    const removeElement = () => {
        if (blocks.length === 0) {
            setExplanation("No elements to remove.");
            return;
        }

        setExecutedCode(freeCode);
        setHighlightedLine(0);
        setExplanation("Starting deallocation process...");

        const newBlocks = [...blocks];
        const lastBlock = newBlocks[newBlocks.length - 1];
        if (lastBlock.elements.length > 0) {
            setFreedElementIndex(lastBlock.elements.length - 1);
            lastBlock.elements.pop();
            setUsedMemory(usedMemory - ELEMENT_SIZE);
        }
        if (lastBlock.elements.length === 0) {
            newBlocks.pop();
            setTotalMemory(totalMemory - BLOCK_SIZE * ELEMENT_SIZE);
        }
        setBlocks(newBlocks);

        // Simulate code execution
        setTimeout(() => {
            setHighlightedLine(2);
            setExplanation("Calling the destructor for the element...");
        }, 1000);
        setTimeout(() => {
            setHighlightedLine(3);
            setExplanation("Freeing the memory used by the element...");
        }, 2000);
        setTimeout(() => {
            setHighlightedLine(-1);
            setExplanation("Deallocation complete!");
            setFreedElementIndex(-1);
        }, 3000);
    };

    const resetSimulation = () => {
        setBlocks([]);
        setNextAddress(1000);
        setTotalMemory(0);
        setUsedMemory(0);
        setExplanation("Simulation reset. Start with an empty Blkpool.");
    };

    useEffect(() => {
        if (autoMode) {
            const timer = setInterval(() => {
                if (Math.random() > 0.3) {
                    addElement();
                } else {
                    removeElement();
                }
            }, 2000);
            return () => clearInterval(timer);
        }
    }, [autoMode, blocks]);

    return (
        <div className="p-4 bg-gray-100 rounded-xl shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Advanced Interactive Blkpool Memory Allocator</h2>
            <div className="flex justify-center space-x-4 mb-4">
            <button onClick={addElement} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <Plus size={20} className="mr-2" /> Add Element
        </button>
            <button onClick={removeElement} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
            <Minus size={20} className="mr-2" /> Remove Element
        </button>
            <button onClick={() => setAutoMode(!autoMode)} className={`${autoMode ? 'bg-yellow-500' : 'bg-blue-500'} text-white px-4 py-2 rounded flex items-center`}>
            <RefreshCw size={20} className="mr-2" /> {autoMode ? 'Stop Auto' : 'Start Auto'}
        </button>
            <button onClick={resetSimulation} className="bg-gray-500 text-white px-4 py-2 rounded">
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

export default BlkpoolAdvancedInteractive;
