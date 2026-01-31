import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from '../step/step.component';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-steps-list',
  imports: [CommonModule, StepComponent],
  templateUrl: './steps-list.component.html',
  styleUrl: './steps-list.component.css'
})
export class StepsListComponent {
  @Input() currentStep: Step | null = null;
  @Input() currentStepNumber = 1;

  @Output() toggleExpand = new EventEmitter<string>();
  @Output() subTaskToggled = new EventEmitter<void>();

  onToggleStep(stepId: string): void {
    this.toggleExpand.emit(stepId);
  }

  onSubTaskToggle(): void {
    this.subTaskToggled.emit();
  }
}
