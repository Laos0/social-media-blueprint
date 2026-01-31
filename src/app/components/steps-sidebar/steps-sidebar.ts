import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-steps-sidebar',
  imports: [CommonModule],
  templateUrl: './steps-sidebar.html',
  styleUrl: './steps-sidebar.css',
})
export class StepsSidebar {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex = 0;
  @Input() isUnlockedAll = false;
  @Input() mobileOpen = false;

  @Output() navigateToStep = new EventEmitter<number>();
  @Output() closeSidebar = new EventEmitter<void>();

  isStepComplete(step: Step): boolean {
    return step.subTasks.length > 0 && step.subTasks.every(task => task.completed);
  }

  getCompletedSubtasksCount(step: Step): number {
    return step.subTasks.filter(task => task.completed).length;
  }

  canNavigateToStep(step: Step): boolean {
    return this.isUnlockedAll || !step.locked;
  }

  onStepClick(stepIndex: number): void {
    const step = this.steps[stepIndex];
    if (this.canNavigateToStep(step)) {
      this.navigateToStep.emit(stepIndex + 1); // Convert to 1-based
    }
  }
}
