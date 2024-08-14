import React from 'react';
import { BaseAllocator } from './BaseAllocator';
import { Block, MemoryStats } from './types';
import { AllocatorType } from './AllocatorFactory';

export class LaryAllocator extends BaseAllocator {
    private lary: (Block | null)[];
    private currentLevel: number;
    private nextAddress: number;
    private elementCounter: number;

  constructor() {
      super();
      this.lary = new Array(32).fill(null);
      this.currentLevel = 0;
      this.nextAddress = 0;
      this.elementCounter = 0;
  }

    private getNextAddress(): number {
        const address = this.nextAddress;
        this.nextAddress += Math.pow(2, this.currentLevel) * 2; // Assuming each element takes 2 bytes
        return address;
    }
    
    addElement(): void {
        if (!this.lary[this.currentLevel] || this.lary[this.currentLevel]!.elements.length === Math.pow(2, this.currentLevel)) {
            this.currentLevel++;
            this.lary[this.currentLevel] = {
                address: this.getNextAddress(),
                elements: [],
                isFree: false,
            };
        }
        this.lary[this.currentLevel]!.elements.push(this.elementCounter.toString());
        this.elementCounter++;
        this.usedMemory += 2;  // Assuming each element takes 2 bytes
        this.totalMemory = Math.max(this.totalMemory, this.usedMemory);
        this.executedCode = `lary[${this.currentLevel}].push(${this.elementCounter - 1})`;
        this.highlightedLine = 2;
        this.explanation = `Added element ${this.elementCounter - 1} to level ${this.currentLevel}`;
    }
    
    removeElement(): void {
        if (this.currentLevel >= 0 && this.lary[this.currentLevel] && this.lary[this.currentLevel]!.elements.length > 0) {
            this.lary[this.currentLevel]!.elements.pop();
            this.elementCounter--;
            this.usedMemory -= 2;  // Assuming each element takes 2 bytes
            this.executedCode = `lary[${this.currentLevel}].pop()`;
            this.highlightedLine = 3;
            this.explanation = `Removed element from level ${this.currentLevel}`;
            if (this.lary[this.currentLevel]!.elements.length === 0) {
                this.lary[this.currentLevel] = null;
                this.currentLevel--;
            }
        } else {
            this.executedCode = '// Cannot remove element: Lary is empty';
            this.highlightedLine = 0;
            this.explanation = 'Cannot remove element: Lary is empty';
        }
    }

  reset(): void {
    this.lary = new Array(32).fill(null);
    this.currentLevel = 0;
    this.elementCounter = 0;
    this.usedMemory = 0;
    this.totalMemory = 0;
    this.executedCode = '// Lary reset';
    this.highlightedLine = 0;
    this.explanation = 'Lary has been reset';
  }

  getBlocks(): Block[] {
    return this.lary.filter((block): block is Block => block !== null);
  }

  getStats(): MemoryStats {
    return {
      totalMemory: this.totalMemory,
      usedMemory: this.usedMemory,
      freeMemory: this.totalMemory - this.usedMemory,
    };
  }
    getType(): AllocatorType {
        return AllocatorType.Blkpool;
    }
}
