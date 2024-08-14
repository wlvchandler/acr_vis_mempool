import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Minus, RefreshCw } from 'lucide-react';
import { Block } from './components/Block';
import { Element } from './components/Element';
import { CodeBlock } from './components/CodeBlock';
import { Explanation } from './components/Explanation';
import { MemoryStats } from './components/MemoryStats';
import { BLOCK_SIZE, ELEMENT_SIZE, allocCode, freeCode } from './utils/constants';
import { Block as BlockType } from './types';
import BlkpoolView from './BlkpoolView'

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
        <BlkpoolView
        blocks={blocks}
        totalMemory={totalMemory}
        usedMemory={usedMemory}
        explanation={explanation}
        executedCode={executedCode}
        highlightedLine={highlightedLine}
        newBlockIndex={newBlockIndex}
        newElementIndex={newElementIndex}
        currentBlockIndex={currentBlockIndex}
        freedElementIndex={freedElementIndex}
        autoMode={autoMode}
        onAddElement={addElement}
        onRemoveElement={removeElement}
        onToggleAutoMode={() => setAutoMode(!autoMode)}
        onResetSimulation={resetSimulation}
            />
    );
};

export default BlkpoolAdvancedInteractive;
