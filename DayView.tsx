import React from 'react';
import { useDrop } from 'react-dnd';
import { Task } from '../types';
import { useTaskStore } from '../store';
import { TaskBlock } from './TaskBlock';
import { Check } from 'lucide-react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DayView: React.FC<{ date: Date }> = ({ date }) => {
  const dateStr = date.toISOString().split('T')[0];
  const { tasks, updateTaskDate, updateTaskSchedule } = useTaskStore((state) => ({
    tasks: state.tasks.filter(task => task.date === dateStr),
    updateTaskDate: state.updateTaskDate,
    updateTaskSchedule: state.updateTaskSchedule,
  }));

  const unscheduledTasks = tasks.filter(task => !task.scheduledTime);
  const scheduledTasks = tasks.filter(task => task.scheduledTime);

  const handleUnscheduledDrop = React.useCallback((task: Task) => {
    updateTaskDate(task.id, dateStr);
  }, [dateStr, updateTaskDate]);

  const [{ isOver: isOverUnscheduled }, unscheduledDrop] = useDrop(() => ({
    accept: 'task',
    drop: handleUnscheduledDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [handleUnscheduledDrop]);

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      <div
        ref={unscheduledDrop}
        className={`bg-zinc-900/50 rounded-lg p-4 overflow-y-auto transition-colors ${
          isOverUnscheduled ? 'bg-zinc-800/50' : ''
        }`}
      >
        <h3 className="text-lg font-medium text-zinc-400 mb-4">Unscheduled Tasks</h3>
        <div className="space-y-2">
          {unscheduledTasks.map((task) => (
            <TaskBlock key={task.id} task={task} />
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-medium text-zinc-400 mb-4">Schedule</h3>
        <div className="space-y-1">
          {HOURS.map((hour) => (
            <TimeSlot
              key={hour}
              hour={hour}
              date={date}
              tasks={scheduledTasks.filter(
                task => task.scheduledTime?.split(':')[0] === hour.toString().padStart(2, '0')
              )}
              onDrop={(task) => {
                updateTaskDate(task.id, dateStr);
                updateTaskSchedule(task.id, `${hour.toString().padStart(2, '0')}:00`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TimeSlotProps {
  hour: number;
  date: Date;
  tasks: Task[];
  onDrop: (task: Task) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ hour, tasks, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: Task) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onDrop]);

  const formattedHour = new Date(2000, 0, 1, hour).toLocaleTimeString([], {
    hour: 'numeric',
    hour12: true,
  });

  return (
    <div
      ref={drop}
      className={`p-2 rounded-lg transition-colors ${
        isOver ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
      }`}
    >
      <div className="text-sm text-zinc-500 mb-1">{formattedHour}</div>
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskBlock key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};