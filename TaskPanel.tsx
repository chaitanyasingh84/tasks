import React, { useState } from 'react';
import { Plus, GripHorizontal } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { useTaskStore } from '../store';
import { Task, TaskType } from '../types';

export const TaskPanel: React.FC = () => {
  const { taskTypes, addTaskType, rightPanelWidth, setRightPanelWidth } = useTaskStore();
  const [isResizing, setIsResizing] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      setRightPanelWidth(Math.max(300, Math.min(600, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      addTaskType(newTypeName.trim(), color);
      setNewTypeName('');
      setShowNewTypeForm(false);
    }
  };

  return (
    <>
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-800">
          <GripHorizontal className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
      
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-200">Task Categories</h2>
          <button
            onClick={() => setShowNewTypeForm(true)}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showNewTypeForm && (
          <form onSubmit={handleAddType} className="p-4 rounded-lg bg-zinc-800/50">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Category name..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-zinc-200 placeholder-zinc-400"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewTypeForm(false)}
                className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4">
          {taskTypes.map((type) => (
            <TaskTypeCard key={type.id} type={type} />
          ))}
        </div>
      </div>
    </>
  );
};

interface TaskTypeCardProps {
  type: TaskType;
}

const TaskTypeCard: React.FC<TaskTypeCardProps> = ({ type }) => {
  const [title, setTitle] = useState('');
  const addTask = useTaskStore((state) => state.addTask);
  const tasks = useTaskStore((state) => 
    state.tasks.filter(task => task.typeId === type.id && !task.date)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title.trim(), type.id);
      setTitle('');
    }
  };

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ backgroundColor: `${type.color}10` }}
    >
      <h3 
        className="text-lg font-medium mb-4"
        style={{ color: type.color }}
      >
        {type.name}
      </h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 placeholder-zinc-500"
        />
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskBlock key={task.id} task={task} color={type.color} />
        ))}
      </div>
    </div>
  );
};

interface TaskBlockProps {
  task: Task;
  color: string;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ task, color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-3 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ 
        backgroundColor: `${color}20`,
        borderLeft: `4px solid ${color}`
      }}
    >
      <span className="text-zinc-200">{task.title}</span>
    </div>
  );
};