import { create } from 'zustand';
import { Task, ViewMode, TaskType } from './types';

interface TaskStore {
  tasks: Task[];
  taskTypes: TaskType[];
  viewMode: ViewMode;
  currentDate: Date;
  rightPanelWidth: number;
  addTask: (title: string, typeId?: string) => void;
  addTaskType: (name: string, color: string) => void;
  deleteTaskType: (id: string) => void;
  updateTaskDate: (taskId: string, date: string | null) => void;
  updateTaskSchedule: (taskId: string, time: string | undefined) => void;
  toggleTaskComplete: (taskId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  setRightPanelWidth: (width: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  taskTypes: [
    { id: 'work', name: 'Work', color: '#3b82f6' },
    { id: 'study', name: 'Study', color: '#10b981' },
    { id: 'personal', name: 'Personal', color: '#8b5cf6' },
  ],
  viewMode: 'week',
  currentDate: new Date(),
  rightPanelWidth: 400,
  addTask: (title, typeId) =>
    set((state) => ({
      tasks: [...state.tasks, { 
        id: crypto.randomUUID(), 
        title, 
        typeId: typeId || state.taskTypes[0].id, 
        date: null,
        completed: false 
      }],
    })),
  addTaskType: (name, color) =>
    set((state) => ({
      taskTypes: [...state.taskTypes, { id: crypto.randomUUID(), name, color }],
    })),
  deleteTaskType: (id) =>
    set((state) => ({
      taskTypes: state.taskTypes.filter(type => type.id !== id),
      tasks: state.tasks.filter(task => task.typeId !== id),
    })),
  updateTaskDate: (taskId, date) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, date, scheduledTime: undefined } : task
      ),
    })),
  updateTaskSchedule: (taskId, time) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, scheduledTime: time } : task
      ),
    })),
  toggleTaskComplete: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
}));