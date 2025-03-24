import React from 'react';
import { useDrop } from 'react-dnd';
import { Task } from '../types';
import { TaskBlock } from './TaskBlock';
import { useTaskStore } from '../store';

interface DayColumnProps {
  day: string;
  tasks: Task[];
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, tasks }) => {
  const updateTaskDay = useTaskStore((state) => state.updateTaskDay);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: Task) => {
      updateTaskDay(item.id, day);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex flex-col gap-2 p-4 rounded-lg ${
        isOver ? 'bg-zinc-800/50' : 'bg-zinc-900'
      }`}
    >
      <h3 className="text-zinc-400 font-medium mb-2">{day}</h3>
      {tasks.map((task) => (
        <TaskBlock key={task.id} task={task} />
      ))}
    </div>
  );
};