import { Block, MemoryStats } from './types';
import { AllocatorType } from './AllocatorFactory';

export abstract class BaseAllocator {
    protected blocks: Block[] = [];
    protected totalMemory: number = 0;
    protected usedMemory: number = 0;

    abstract addElement(): void;
    abstract removeElement(): void;
    abstract getStats(): MemoryStats;
    abstract getBlocks(): Block[];
    abstract reset(): void;
    abstract getType(): AllocatorType;

    protected calculateFreeMemory(): number {
        return this.totalMemory - this.usedMemory;
    }
}

