import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step.component.html',
  styleUrl: './step.component.css'
})
export class StepComponent {
  @Input() step!: Step;
  @Input() stepNumber!: number;
  @Output() toggleExpand = new EventEmitter<string>();
  @Output() subTaskToggled = new EventEmitter<void>();

  onToggle(): void {
    if (!this.step.locked) {
      this.toggleExpand.emit(this.step.id);
    }
  }

  toggleSubTask(index: number): void {
    if (this.step.subTasks[index] && !this.step.locked) {
      this.step.subTasks[index].completed = !this.step.subTasks[index].completed;
      this.subTaskToggled.emit();
    }
  }
}
