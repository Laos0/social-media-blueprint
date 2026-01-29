import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step.component.html',
  styleUrl: './step.component.css'
})
export class StepComponent implements OnInit, OnChanges {
  @Input() step!: Step;
  @Input() stepNumber!: number;
  @Output() toggleExpand = new EventEmitter<string>();
  @Output() subTaskToggled = new EventEmitter<void>();

  ngOnInit(): void {
    this.updateSubTaskLocks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step']) {
      this.updateSubTaskLocks();
    }
  }

  onToggle(): void {
    if (!this.step.locked) {
      this.toggleExpand.emit(this.step.id);
    }
  }

  toggleSubTask(index: number): void {
    const subTask = this.step.subTasks[index];
    if (subTask && !this.step.locked && !subTask.locked) {
      subTask.completed = !subTask.completed;
      this.updateSubTaskLocks();
      this.subTaskToggled.emit();
    }
  }

  updateSubTaskLocks(): void {
    // Lock all subtasks after the first incomplete one
    let foundIncomplete = false;
    this.step.subTasks.forEach((subTask, i) => {
      if (!subTask.completed && !foundIncomplete) {
        // First incomplete task is unlocked
        subTask.locked = false;
        foundIncomplete = true;
      } else if (!subTask.completed && foundIncomplete) {
        // Subsequent incomplete tasks are locked
        subTask.locked = true;
      } else {
        // Completed tasks are unlocked (can be unchecked)
        subTask.locked = false;
      }
    });
  }
}
