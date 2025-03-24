import React from 'react';
import { useTaskStore } from '../store';
import { TaskBlock } from './TaskBlock';
import { DayView } from './DayView';
import { useDrop } from 'react-dnd';
import { Task } from '../types';

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

const getWeekDates = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    return day;
  });
};

const getMonthDates = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysInMonth = getDaysInMonth(date);
  const startDay = start.getDay();
  
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(day.getDate() + (i - startDay));
    return day;
  });
};

interface DayProps {
  date: Date;
  isCurrentMonth: boolean;
  tasks: Task[];
  onDrop: (taskId: string, date: string) => void;
}

const Day: React.FC<DayProps> = React.memo(({ date, isCurrentMonth, tasks, onDrop }) => {
  const dateStr = date.toISOString().split('T')[0];
  const isToday = new Date().toDateString() === date.toDateString();
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: Task) => {
      onDrop(item.id, dateStr);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dateStr, onDrop]);

  return (
    <div
      ref={drop}
      className={`flex flex-col min-h-[120px] p-2 rounded-lg transition-colors ${
        isOver ? 'bg-zinc-800/50' : 'bg-zinc-900'
      } ${!isCurrentMonth ? 'opacity-50' : ''}`}
    >
      <div className={`text-sm mb-2 font-medium ${
        isToday ? 'text-blue-400' : 'text-zinc-400'
      }`}>
        {date.toLocaleDateString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
        })}
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskBlock key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
});

export const CalendarGrid: React.FC = () => {
  const { viewMode, currentDate, tasks, updateTaskDate } = useTaskStore();

  const handleDrop = React.useCallback((taskId: string, date: string) => {
    updateTaskDate(taskId, date);
  }, [updateTaskDate]);

  const renderGrid = () => {
    switch (viewMode) {
      case 'day':
        return <DayView date={currentDate} />;
      case 'week':
        return (
          <div className="grid grid-cols-7 gap-4">
            {getWeekDates(currentDate).map((date) => (
              <Day
                key={date.toISOString()}
                date={date}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                tasks={tasks.filter(task => task.date === date.toISOString().split('T')[0])}
                onDrop={handleDrop}
              />
            ))}
          </div>
        );
      case 'month':
        return (
          <div className="grid grid-cols-7 gap-4">
            {getMonthDates(currentDate).map((date) => (
              <Day
                key={date.toISOString()}
                date={date}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                tasks={tasks.filter(task => task.date === date.toISOString().split('T')[0])}
                onDrop={handleDrop}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return renderGrid();
};