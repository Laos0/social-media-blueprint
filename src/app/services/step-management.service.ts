import { Injectable, signal, computed } from '@angular/core';
import { Step } from '../models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class StepManagementService {
  private stepsSignal = signal<Step[]>([]);
  private isUnlockedAllSignal = signal<boolean>(false);

  // Public read-only access to signals
  readonly steps = this.stepsSignal.asReadonly();
  readonly isUnlockedAll = this.isUnlockedAllSignal.asReadonly();

  // Computed signal to check if there's any progress
  readonly hasAnyProgress = computed(() => {
    return this.stepsSignal().some(step =>
      step.subTasks.some(task => task.completed)
    );
  });

  initializeSteps(steps: Step[]): void {
    this.stepsSignal.set(steps);
    this.updateStepLocks();
  }

  setSteps(steps: Step[]): void {
    this.stepsSignal.set(steps);
  }

  isStepComplete(step: Step): boolean {
    return step.subTasks.length > 0 && step.subTasks.every(task => task.completed);
  }

  updateStepLocks(): void {
    // Don't update locks if everything is unlocked
    if (this.isUnlockedAllSignal()) {
      return;
    }

    // Create a new array with new object references to force change detection
    const updatedSteps = this.stepsSignal().map((step, i) => {
      if (i === 0) {
        // First step is always unlocked
        return { ...step, locked: false };
      } else {
        // Lock step if any previous step is incomplete
        const allPreviousComplete = this.stepsSignal()
          .slice(0, i)
          .every(s => this.isStepComplete(s));
        return { ...step, locked: !allPreviousComplete };
      }
    });

    this.stepsSignal.set(updatedSteps);
  }

  toggleStep(stepId: string): void {
    const currentSteps = this.stepsSignal();
    const step = currentSteps.find(s => s.id === stepId);

    if (step && !step.locked) {
      const wasExpanded = step.expanded;

      // Close all steps (accordion behavior)
      const updatedSteps = currentSteps.map(s => ({
        ...s,
        expanded: s.id === stepId ? !wasExpanded : false
      }));

      this.stepsSignal.set(updatedSteps);
    }
  }

  unlockAll(): void {
    const newUnlockedState = !this.isUnlockedAllSignal();
    this.isUnlockedAllSignal.set(newUnlockedState);

    if (newUnlockedState) {
      // Unlock everything
      const unlockedSteps = this.stepsSignal().map(step => ({
        ...step,
        locked: false,
        subTasks: step.subTasks.map(task => ({
          ...task,
          locked: false
        }))
      }));
      this.stepsSignal.set(unlockedSteps);
    } else {
      // Return to normal locked state based on completion
      this.updateStepLocks();
      // Trigger subtask lock updates by creating new references
      const relockedSteps = this.stepsSignal().map(step => ({
        ...step,
        subTasks: [...step.subTasks]
      }));
      this.stepsSignal.set(relockedSteps);
    }
  }

  resetProgress(): void {
    // Reset all completion states
    const resetSteps = this.stepsSignal().map(step => ({
      ...step,
      expanded: false,
      subTasks: step.subTasks.map(task => ({
        ...task,
        completed: false,
        locked: false
      }))
    }));

    // Reset unlock state
    this.isUnlockedAllSignal.set(false);

    // Update steps
    this.stepsSignal.set(resetSteps);

    // Re-apply normal locking
    this.updateStepLocks();
  }

  jumpToStep(stepNumber: number): void {
    const currentSteps = this.stepsSignal();

    if (stepNumber > 0 && stepNumber <= currentSteps.length) {
      const step = currentSteps[stepNumber - 1];

      if (!step.locked) {
        const updatedSteps = currentSteps.map((s, index) => ({
          ...s,
          expanded: index === stepNumber - 1
        }));
        this.stepsSignal.set(updatedSteps);

        // Wait for DOM to update then scroll
        setTimeout(() => {
          const element = document.getElementById(`step-${step.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }
}
