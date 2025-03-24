export interface Task {
  id: string;
  title: string;
  date: string | null;
  typeId: string;
  completed: boolean;
  scheduledTime?: string; // HH:mm format for scheduled tasks
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface DateRange {
  start: Date;
  end: Date;
}