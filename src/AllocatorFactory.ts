import { BaseAllocator } from './BaseAllocator';
import { BlkpoolAllocator } from './BlkpoolAllocator';
import { LaryAllocator } from './LaryAllocator';


export enum AllocatorType {
    Blkpool = 'Blkpool',
    Lary = 'Lary'
    //Delptr, Inlary, Lary, Lpool, Malloc, Sbrk, Tary, Tpool, Val
}

export class AllocatorFactory {
    static createAllocator(_type: AllocatorType): BaseAllocator {
        switch (_type) {
            case AllocatorType.Blkpool:
                return new BlkpoolAllocator();
            case AllocatorType.Lary:
                return new LaryAllocator();
            default:
                throw new Error(`Allocator type ${_type} not implemented`);
        }
    }
}


