import React from 'react';
import { useDrag } from 'react-dnd';
import { Task } from '../types';
import { GripVertical, Check } from 'lucide-react';
import { useTaskStore } from '../store';

interface TaskBlockProps {
  task: Task;
}

export const TaskBlock: React.FC<TaskBlockProps> = ({ task }) => {
  const { taskTypes, toggleTaskComplete } = useTaskStore((state) => ({
    taskTypes: state.taskTypes,
    toggleTaskComplete: state.toggleTaskComplete,
  }));

  const taskType = taskTypes.find((t) => t.id === task.typeId);

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
      className={`group flex items-center gap-2 p-3 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${task.completed ? 'opacity-50' : ''}`}
      style={{ 
        backgroundColor: taskType ? `${taskType.color}20` : 'bg-zinc-800',
        borderLeft: `4px solid ${taskType?.color || '#71717a'}`
      }}
    >
      <button
        onClick={() => toggleTaskComplete(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
          task.completed 
            ? 'bg-green-500 border-green-500' 
            : 'border-zinc-600 group-hover:border-zinc-500'
        }`}
      >
        {task.completed && <Check className="w-4 h-4 text-white" />}
      </button>
      <GripVertical className="w-4 h-4 text-zinc-400" />
      <span className={`text-zinc-200 ${task.completed ? 'line-through' : ''}`}>
        {task.title}
      </span>
      {task.scheduledTime && (
        <span className="ml-auto text-sm text-zinc-500">
          {task.scheduledTime}
        </span>
      )}
    </div>
  );
};