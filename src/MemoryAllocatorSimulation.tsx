import React, { useState, useCallback } from 'react';
import { BaseAllocator } from './BaseAllocator';
import { AllocatorFactory, AllocatorType } from './AllocatorFactory';
import MemoryAllocatorView from './MemoryAllocatorView';

const MemoryAllocatorSimulation: React.FC = () => {
    const [allocator, setAllocator] = useState<BaseAllocator>(
        AllocatorFactory.createAllocator(AllocatorType.Blkpool)
    );

    const [updateTrigger, setUpdateTrigger] = useState(0);

    const forceUpdate = useCallback(() => {
        setUpdateTrigger(prev => prev + 1);
    }, []);

    const handleAllocatorChange = useCallback((newType: AllocatorType) => {
        setAllocator(AllocatorFactory.createAllocator(newType));
    }, []);
    
    const addElement = useCallback(() => {
        allocator.addElement();
        forceUpdate();
    }, [allocator, forceUpdate]);

    const removeElement = useCallback(() => {
        allocator.removeElement();
        forceUpdate();
    }, [allocator, forceUpdate]);

    const reset = useCallback(() => {
        allocator.reset();
        forceUpdate();
    }, [allocator, forceUpdate]);

    return (
        <MemoryAllocatorView
        blocks={allocator.getBlocks()}
        stats={allocator.getStats()}
        onAddElement={addElement}
        onRemoveElement={removeElement}
        onReset={reset}
        allocatorType={allocator.getType()}
        onAllocatorChange={handleAllocatorChange}
      />
    );
};

export default MemoryAllocatorSimulation;
