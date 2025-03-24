import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { TaskPanel } from './components/TaskPanel';
import { useTaskStore } from './store';

function App() {
  const rightPanelWidth = useTaskStore((state) => state.rightPanelWidth);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          <div className="flex-1 p-8" style={{ marginRight: `${rightPanelWidth}px` }}>
            <CalendarHeader />
            <CalendarGrid />
          </div>
          <div 
            className="fixed right-0 top-0 bottom-0 bg-zinc-900/50 backdrop-blur-sm border-l border-zinc-800"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <TaskPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;