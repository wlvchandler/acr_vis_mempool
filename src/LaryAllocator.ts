import React from 'react';
import { BaseAllocator } from './BaseAllocator';
import { Block } from './types';
import { AllocatorType } from './AllocatorFactory';

export class LaryAllocator extends BaseAllocator {
  private lary: (Block | null)[];
  private elementCount: number;    // Total number of elements currently in the Lary
  private elementCounter: number;  // Unique identifier for each element added
  private nextAddress: number;     // Next available memory address
  private currentLevel: number;    // Current highest level in use

  constructor() {
    super();
    this.lary = new Array(32).fill(null);
    this.elementCount = 0;
    this.elementCounter = 0;
    this.nextAddress = 0;
    this.currentLevel = 0;
    this.initializeLary();
  }

  private initializeLary() {
    // Pre-allocate the first 4 levels
    for (let i = 0; i < 4; i++) {
      this.lary[i] = {
        address: this.getNextAddress(),
        elements: new Array(1 << i).fill(""),
        isFree: false,
      };
      this.currentLevel = Math.max(this.currentLevel, i);
    }
  }

  private getNextAddress(): number {
    const address = this.nextAddress;
    this.nextAddress += 1 << this.currentLevel; // Increment by current level size
    return address;
  }

  private getBitScanReverse(n: number): number {
    return 31 - Math.clz32(n);
  }

  addElement(): void {
    const newElementCount = this.elementCount + 1;
    const bsr = this.getBitScanReverse(newElementCount);
    const base = 1 << bsr;
    const index = newElementCount - base;

    if (!this.lary[bsr]) {
      this.lary[bsr] = {
        address: this.getNextAddress(),
        elements: new Array(1 << bsr).fill(""),
        isFree: false,
      };
      this.currentLevel = Math.max(this.currentLevel, bsr);
    }

    this.lary[bsr]!.elements[index] = this.elementCounter.toString();
    this.elementCount = newElementCount;
    this.elementCounter++;
    this.usedMemory += 2;  // Assuming each element takes 2 bytes
    this.totalMemory = Math.max(this.totalMemory, this.usedMemory);
    
    this.executedCode = `lary[${bsr}][${index}] = ${this.elementCounter - 1}`;
    this.highlightedLine = 2;
    this.explanation = `Added element ${this.elementCounter - 1} to level ${bsr}, index ${index}`;
  }

  removeElement(): void {
    if (this.elementCount > 0) {
      const bsr = this.getBitScanReverse(this.elementCount);
      const base = 1 << bsr;
      const index = this.elementCount - base - 1;

      if (this.lary[bsr] && this.lary[bsr]!.elements[index] !== "") {
        this.lary[bsr]!.elements[index] = "";
        this.elementCount--;
        this.usedMemory -= 2;  // Assuming each element takes 2 bytes

        this.executedCode = `lary[${bsr}][${index}] = ""`;
        this.highlightedLine = 3;
        this.explanation = `Removed element from level ${bsr}, index ${index}`;

        // Update currentLevel if necessary
        while (this.currentLevel > 0 && this.lary[this.currentLevel]!.elements.every(e => e === "")) {
          this.currentLevel--;
        }
      }
    } else {
      this.executedCode = '// Cannot remove element: Lary is empty';
      this.highlightedLine = 0;
      this.explanation = 'Cannot remove element: Lary is empty';
    }
  }

  reset(): void {
    this.lary = new Array(32).fill(null);
    this.elementCount = 0;
    this.elementCounter = 0;
    this.nextAddress = 0;
    this.currentLevel = 0;
    this.usedMemory = 0;
    this.totalMemory = 0;
    this.initializeLary();
    this.executedCode = '// Lary reset';
    this.highlightedLine = 0;
    this.explanation = 'Lary has been reset';
  }

  getBlocks(): Block[] {
    return this.lary.filter((block): block is Block => block !== null);
  }

  getType(): AllocatorType {
    return AllocatorType.Lary;
  }
}
