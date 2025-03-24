import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TaskType, Task } from '../types';
import { useTaskStore } from '../store';
import { TaskBlock } from './TaskBlock';

interface TaskTypeCardProps {
  type: TaskType;
}

export const TaskTypeCard: React.FC<TaskTypeCardProps> = ({ type }) => {
  const [title, setTitle] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { addTask, deleteTaskType } = useTaskStore();
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

  const handleDelete = () => {
    deleteTaskType(type.id);
    setShowConfirmDelete(false);
  };

  return (
    <div 
      className="p-4 rounded-lg relative group"
      style={{ backgroundColor: `${type.color}10` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-medium"
          style={{ color: type.color }}
        >
          {type.name}
        </h3>
        <button
          onClick={() => setShowConfirmDelete(true)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {showConfirmDelete && (
        <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center gap-4">
          <p className="text-center text-zinc-300">
            Are you sure you want to delete this category?
            <br />
            <span className="text-sm text-zinc-500">All associated tasks will be deleted.</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          <TaskBlock key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};