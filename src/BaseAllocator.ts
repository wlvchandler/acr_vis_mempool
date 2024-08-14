import { Block, MemoryStats } from './types';
import { AllocatorType } from './AllocatorFactory';

export abstract class BaseAllocator {
  protected blocks: Block[] = [];
  protected totalMemory: number = 0;
  protected usedMemory: number = 0;
  protected executedCode: string = '';
  protected highlightedLine: number = -1;
  protected explanation: string = '';
  protected newBlockIndex: number = -1;
  protected newElementIndex: number = -1;
  protected freedElementIndex: number = -1;

  abstract addElement(): void;
  abstract removeElement(): void;
  abstract reset(): void;
  abstract getType(): AllocatorType;

  getStats(): MemoryStats {
    return {
      totalMemory: this.totalMemory,
      usedMemory: this.usedMemory,
      freeMemory: this.totalMemory - this.usedMemory
    };
  }

  getBlocks(): Block[] {
    return this.blocks;
  }

  getExecutedCode(): string {
    return this.executedCode;
  }

  getHighlightedLine(): number {
    return this.highlightedLine;
  }

  getExplanation(): string {
    return this.explanation;
  }

  getNewBlockIndex(): number {
    return this.newBlockIndex;
  }

  getNewElementIndex(): number {
    return this.newElementIndex;
  }

  getFreedElementIndex(): number {
    return this.freedElementIndex;
  }
}
