import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskStore } from '../store';
import { ViewMode } from '../types';

const viewModeLabels: Record<ViewMode, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

export const CalendarHeader: React.FC = () => {
  const { viewMode, currentDate, setViewMode, setCurrentDate } = useTaskStore((state) => ({
    viewMode: state.viewMode,
    currentDate: state.currentDate,
    setViewMode: state.setViewMode,
    setCurrentDate: state.setCurrentDate,
  }));

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };

    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString(undefined, options);
      case 'week': {
        const start = new Date(currentDate);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${start.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
      }
      case 'month':
        return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Task Calendar</h1>
        <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1">
          {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {viewModeLabels[mode]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium min-w-48 text-center">
            {formatDateRange()}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Today
        </button>
      </div>
    </div>
  );
};