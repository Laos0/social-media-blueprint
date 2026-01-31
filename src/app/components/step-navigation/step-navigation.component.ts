import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-navigation',
  imports: [CommonModule],
  templateUrl: './step-navigation.component.html',
  styleUrl: './step-navigation.component.css'
})
export class StepNavigationComponent {
  @Input() currentStepNumber = 1;
  @Input() totalSteps = 0;
  @Input() canGoBack = false;
  @Input() canGoNext = false;
  @Input() progressPercentage = 0;

  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  onNext(): void {
    if (this.canGoNext) {
      this.next.emit();
    }
  }

  onPrevious(): void {
    if (this.canGoBack) {
      this.previous.emit();
    }
  }
}
