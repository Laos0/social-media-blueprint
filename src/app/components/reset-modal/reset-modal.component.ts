import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-modal',
  imports: [CommonModule],
  templateUrl: './reset-modal.component.html',
  styleUrl: './reset-modal.component.css'
})
export class ResetModalComponent {
  @Input() show = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onOverlayClick(): void {
    this.cancel.emit();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
