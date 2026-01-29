export interface SubTask {
  title: string;
  description: string;
  completed?: boolean;
  locked?: boolean;
}

export interface Step {
  id: string;
  topic: string;
  description: string;
  subTasks: SubTask[];
  expanded?: boolean;
  locked?: boolean;
}
