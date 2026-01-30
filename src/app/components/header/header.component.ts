import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderActionsComponent } from '../header-actions/header-actions.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, HeaderActionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title = '';
  @Input() totalSteps = 0;
  @Input() isUnlockedAll = false;
  @Input() hasProgress = false;

  @Output() jumpToStep = new EventEmitter<number>();
  @Output() unlockAllToggle = new EventEmitter<void>();
  @Output() resetProgress = new EventEmitter<void>();

  onJumpToStep(stepNumber: number): void {
    this.jumpToStep.emit(stepNumber);
  }

  onUnlockAllToggle(): void {
    this.unlockAllToggle.emit();
  }

  onResetProgress(): void {
    this.resetProgress.emit();
  }
}
