import { BaseAllocator } from './BaseAllocator';
import { AllocatorType } from './AllocatorFactory';
import { BLOCK_SIZE, ELEMENT_SIZE, allocCode, freeCode } from './utils/constants';

export class BlkpoolAllocator extends BaseAllocator {
    private nextAddress: number = 1000;
    
    addElement(): void {
        this.executedCode = allocCode;
        this.highlightedLine = 0;
        this.explanation = "Starting allocation process...";
        
        const newElement = `Elem${this.blocks.reduce((acc, block) => acc + block.elements.length, 0) + 1}`;
        
        if (this.blocks.length === 0 || this.blocks[this.blocks.length - 1].elements.length === BLOCK_SIZE) {
            this.blocks.push({ address: this.nextAddress, elements: [newElement], isFree: false });
            this.nextAddress += 1000;
            this.newBlockIndex = this.blocks.length - 1;
            this.newElementIndex = 0;
            this.totalMemory += BLOCK_SIZE * ELEMENT_SIZE;
        } else {
            this.blocks[this.blocks.length - 1].elements.push(newElement);
            this.newBlockIndex = this.blocks.length - 1;
            this.newElementIndex = this.blocks[this.blocks.length - 1].elements.length - 1;
        }
        
        this.usedMemory += ELEMENT_SIZE;
        
        // Simulate code execution
        setTimeout(() => {
            this.highlightedLine = 1;
            this.explanation = "Allocating memory for the new element...";
        }, 1000);
        setTimeout(() => {
            this.highlightedLine = 3;
            this.explanation = "Calling the constructor for the new element...";
        }, 2000);
        setTimeout(() => {
            this.highlightedLine = 5;
            this.explanation = "Returning the newly allocated and constructed element.";
        }, 3000);
        setTimeout(() => {
            this.highlightedLine = -1;
            this.explanation = "Allocation complete!";
            this.newBlockIndex = -1;
            this.newElementIndex = -1;
        }, 4000);
    }
    
    removeElement(): void {
        if (this.blocks.length === 0) {
            this.explanation = "No elements to remove.";
            return;
        }
        
        this.executedCode = freeCode;
        this.highlightedLine = 0;
        this.explanation = "Starting deallocation process...";
        
        const lastBlock = this.blocks[this.blocks.length - 1];
        if (lastBlock.elements.length > 0) {
            this.freedElementIndex = lastBlock.elements.length - 1;
            lastBlock.elements.pop();
            this.usedMemory -= ELEMENT_SIZE;
        }
        if (lastBlock.elements.length === 0) {
            this.blocks.pop();
            this.totalMemory -= BLOCK_SIZE * ELEMENT_SIZE;
        }
        
        // Simulate code execution
        setTimeout(() => {
            this.highlightedLine = 2;
            this.explanation = "Calling the destructor for the element...";
        }, 1000);
        setTimeout(() => {
            this.highlightedLine = 3;
            this.explanation = "Freeing the memory used by the element...";
        }, 2000);
        setTimeout(() => {
            this.highlightedLine = -1;
            this.explanation = "Deallocation complete!";
            this.freedElementIndex = -1;
        }, 3000);
    }
    
    reset(): void {
        this.blocks = [];
        this.nextAddress = 1000;
        this.totalMemory = 0;
        this.usedMemory = 0;
        this.explanation = "Simulation reset. Start with an empty Blkpool.";
    }
    
    getType(): AllocatorType {
        return AllocatorType.Blkpool;
    }
}
