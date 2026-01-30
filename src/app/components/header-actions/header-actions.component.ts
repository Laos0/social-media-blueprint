import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-actions',
  imports: [CommonModule, FormsModule],
  templateUrl: './header-actions.component.html',
  styleUrl: './header-actions.component.css'
})
export class HeaderActionsComponent {
  @Input() totalSteps = 0;
  @Input() isUnlockedAll = false;
  @Input() hasProgress = false;

  @Output() jumpToStep = new EventEmitter<number>();
  @Output() unlockAllToggle = new EventEmitter<void>();
  @Output() resetProgress = new EventEmitter<void>();

  jumpToStepNumber = '';

  onJumpToStep(): void {
    const stepNum = parseInt(this.jumpToStepNumber, 10);
    if (stepNum > 0 && stepNum <= this.totalSteps) {
      this.jumpToStep.emit(stepNum);
      this.jumpToStepNumber = '';
    }
  }

  onUnlockAllToggle(): void {
    this.unlockAllToggle.emit();
  }

  onResetProgress(): void {
    this.resetProgress.emit();
  }
}
