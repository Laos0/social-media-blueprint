import { Injectable, signal, computed } from '@angular/core';
import { Step } from '../models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class StepManagementService {
  private stepsSignal = signal<Step[]>([]);
  private isUnlockedAllSignal = signal<boolean>(false);
  private currentStepIndexSignal = signal<number>(0);

  // Public read-only access to signals
  readonly steps = this.stepsSignal.asReadonly();
  readonly isUnlockedAll = this.isUnlockedAllSignal.asReadonly();
  readonly currentStepIndex = this.currentStepIndexSignal.asReadonly();

  // Computed signals
  readonly hasAnyProgress = computed(() => {
    return this.stepsSignal().some(step =>
      step.subTasks.some(task => task.completed)
    );
  });

  readonly currentStep = computed(() => {
    const steps = this.stepsSignal();
    const index = this.currentStepIndexSignal();
    return steps[index] || null;
  });

  readonly totalSteps = computed(() => this.stepsSignal().length);

  readonly canGoBack = computed(() => this.currentStepIndexSignal() > 0);

  readonly canGoNext = computed(() => {
    const currentIndex = this.currentStepIndexSignal();
    const totalSteps = this.stepsSignal().length;
    const currentStep = this.stepsSignal()[currentIndex];

    // Can always go next if unlocked all
    if (this.isUnlockedAllSignal()) {
      return currentIndex < totalSteps - 1;
    }

    // Can go next if current step is complete and not on last step
    return currentIndex < totalSteps - 1 && (!currentStep || this.isStepComplete(currentStep));
  });

  readonly progressPercentage = computed(() => {
    const steps = this.stepsSignal();
    if (steps.length === 0) return 0;

    const completedSteps = steps.filter(step => this.isStepComplete(step)).length;
    return Math.round((completedSteps / steps.length) * 100);
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

    // Reset to first step
    this.currentStepIndexSignal.set(0);

    // Update steps
    this.stepsSignal.set(resetSteps);

    // Re-apply normal locking
    this.updateStepLocks();
  }

  nextStep(): void {
    const currentIndex = this.currentStepIndexSignal();
    const totalSteps = this.stepsSignal().length;

    if (this.canGoNext()) {
      this.currentStepIndexSignal.set(currentIndex + 1);
      this.scrollToTop();
    }
  }

  previousStep(): void {
    const currentIndex = this.currentStepIndexSignal();

    if (this.canGoBack()) {
      this.currentStepIndexSignal.set(currentIndex - 1);
      this.scrollToTop();
    }
  }

  goToStep(stepNumber: number): void {
    const stepIndex = stepNumber - 1; // Convert 1-based to 0-based
    const steps = this.stepsSignal();

    if (stepIndex >= 0 && stepIndex < steps.length) {
      const targetStep = steps[stepIndex];

      // Allow if unlocked all, or if step is not locked
      if (this.isUnlockedAllSignal() || !targetStep.locked) {
        this.currentStepIndexSignal.set(stepIndex);
        this.scrollToTop();
      }
    }
  }

  setCurrentStepIndex(index: number): void {
    const steps = this.stepsSignal();
    if (index >= 0 && index < steps.length) {
      this.currentStepIndexSignal.set(index);
    }
  }

  private scrollToTop(): void {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Legacy method for backward compatibility (now uses goToStep)
  jumpToStep(stepNumber: number): void {
    this.goToStep(stepNumber);
  }
}
