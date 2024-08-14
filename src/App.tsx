import React from 'react';
import './App.css';
import MemoryAllocatorSimulation from './MemoryAllocatorSimulation';

const App: React.FC = () => {
  console.log('App component rendering');
  return (
      <main>
        <MemoryAllocatorSimulation />
      </main>
  );
};

export default App;

