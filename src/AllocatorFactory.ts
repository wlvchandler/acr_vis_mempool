import { BaseAllocator } from './BaseAllocator';
import { BlkpoolAllocator } from './BlkpoolAllocator';


export enum AllocatorType {
    Blkpool, Delptr, Inlary, Lary, Lpool,
    Malloc, Sbrk, Tary, Tpool, Val
}

export class AllocatorFactory {
    static createAllocator(_type: AllocatorType): BaseAllocator {
        switch (_type) {
            case AllocatorType.Blkpool:
                return new BlkpoolAllocator();
            default:
                throw new Error(`Allocator type ${_type} not implemented`);
        }
    }
}


