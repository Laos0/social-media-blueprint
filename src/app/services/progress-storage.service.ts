import { Injectable } from '@angular/core';
import { Step } from '../models/checklist.model';

export interface ProgressData {
  isUnlockedAll: boolean;
  steps: Array<{
    id: string;
    expanded: boolean;
    subTasks: Array<{
      completed: boolean;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressStorageService {
  private readonly STORAGE_KEY = 'socialMediaBlueprint_progress';

  saveProgress(steps: Step[], isUnlockedAll: boolean): void {
    const progress: ProgressData = {
      isUnlockedAll,
      steps: steps.map(step => ({
        id: step.id,
        expanded: step.expanded || false,
        subTasks: step.subTasks.map(task => ({
          completed: task.completed || false
        }))
      }))
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  loadProgress(): ProgressData | null {
    try {
      const savedProgress = localStorage.getItem(this.STORAGE_KEY);
      if (!savedProgress) {
        return null;
      }

      const progress = JSON.parse(savedProgress);

      // Handle both old and new format for backwards compatibility
      return {
        isUnlockedAll: progress.isUnlockedAll || false,
        steps: progress.steps || progress
      };
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }

  clearProgress(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }

  hasProgress(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
