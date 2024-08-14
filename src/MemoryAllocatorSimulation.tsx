import React, { useState, useCallback, useEffect } from 'react';
import { BaseAllocator } from './BaseAllocator';
import { AllocatorFactory, AllocatorType } from './AllocatorFactory';
import MemoryAllocatorView from './MemoryAllocatorView';

const MemoryAllocatorSimulation: React.FC = () => {
  const [allocator, setAllocator] = useState<BaseAllocator>(
    AllocatorFactory.createAllocator(AllocatorType.Blkpool)
  );
  const [allocatorType, setAllocatorType] = useState<AllocatorType>(AllocatorType.Blkpool);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [autoMode, setAutoMode] = useState(false);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const handleAllocatorChange = useCallback((newType: AllocatorType) => {
    setAllocatorType(newType);
    setAllocator(AllocatorFactory.createAllocator(newType));
    setAutoMode(false);
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
    setAutoMode(false);
    forceUpdate();
  }, [allocator, forceUpdate]);

  const toggleAutoMode = useCallback(() => {
    setAutoMode(prev => !prev);
  }, []);

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
  }, [autoMode, addElement, removeElement]);

  return (
    <MemoryAllocatorView
      blocks={allocator.getBlocks()}
      onAddElement={addElement}
      onRemoveElement={removeElement}
      onReset={reset}
      allocatorType={allocatorType}
      onAllocatorChange={handleAllocatorChange}
      getExecutedCode={() => allocator.getExecutedCode()}
      getHighlightedLine={() => allocator.getHighlightedLine()}
      getExplanation={() => allocator.getExplanation()}
      getNewBlockIndex={() => allocator.getNewBlockIndex()}
      getNewElementIndex={() => allocator.getNewElementIndex()}
      getFreedElementIndex={() => allocator.getFreedElementIndex()}
      autoMode={autoMode}
      onToggleAutoMode={toggleAutoMode}
    />
  );
};

export default MemoryAllocatorSimulation;
