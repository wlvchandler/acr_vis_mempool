import { BaseAllocator } from './BaseAllocator';
import { Block, MemoryStats } from './types';
import { BLOCK_SIZE, ELEMENT_SIZE } from './utils/constants';
import { AllocatorType } from './AllocatorFactory';

export class BlkpoolAllocator extends BaseAllocator {
    private nextAddress: number = 1000;

    addElement(): void {}
    removeElement(): void {}

    getStats(): MemoryStats {
        return {
            totalMemory: this.totalMemory,
            usedMemory: this.usedMemory,
            freeMemory: this.calculateFreeMemory()
        };
    }

    getBlocks(): Block[] {
        return this.blocks;
    }

    reset(): void {
        this.blocks = [];
        this.nextAddress = 1000;
        this.totalMemory = 0;
        this.usedMemory = 0;
    }

    getType(): AllocatorType {
        return AllocatorType.Blkpool;
    }
}
