import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepComponent } from './components/step/step.component';
import { Step } from './models/checklist.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, StepComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Social Media Blueprint');
  protected jumpToStepNumber = '';
  protected isUnlockedAll = false;
  protected showResetModal = false;

  // Sample data - developers can easily add more steps here
  protected steps: Step[] = [
    {
      id: '1',
      topic: 'Set Up Your Facebook Account',
      description: 'Before creating pages, ensure you have an active personal Facebook account. This is required to create and manage pages.',
      expanded: false,
      locked: false,
      subTasks: [
        {
          title: 'Create or Log Into Facebook',
          description: 'You need a personal Facebook account to create and manage pages.',
          completed: false
        },
        {
          title: 'Verify Your Account',
          description: 'Ensure your account is in good standing with verified email/phone.',
          completed: false
        }
      ]
    },
    {
      id: '2',
      topic: 'Create Your First Facebook Page',
      description: 'Learn how to create a professional Facebook page from your personal profile. Pages are free, unlimited, and completely anonymous.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Navigate to Page Creation',
          description: 'Create a page from your personal profile. It\'s free and you can create unlimited pages. No one will know who created it.',
          completed: false
        },
        {
          title: 'Choose Your Content Niche',
          description: 'Decide what your page will focus on: trending news, memes, AI-generated content, animals, motivation, etc.',
          completed: false
        },
        {
          title: 'Select a Unique Page Name',
          description: 'Take 5-30 minutes to pick a unique name. Avoid generic names already taken (conflicts with search algorithms). Example: "gumgumAi" instead of "AI Page 123".',
          completed: false
        },
        {
          title: 'Verify Name Availability',
          description: 'Search Facebook to ensure your name isn\'t already taken or too similar to existing pages.',
          completed: false
        },
        {
          title: 'Avoid Numbered Names',
          description: 'Never add numbers to differentiate (e.g., "The Academy 123"). This looks unprofessional and hurts discoverability.',
          completed: false
        },
        {
          title: 'Keep Name Concise',
          description: 'Avoid super long names. Short, memorable names perform better.',
          completed: false
        },
        {
          title: 'Consider Personal Branding',
          description: 'Only include your name if building personal brand (e.g., "John the Joker"). Never use first + last name as Facebook treats this as a personal account, not a page.',
          completed: false
        },
        {
          title: 'Complete Page Setup',
          description: 'Add profile picture, cover photo, description, and category to complete your page.',
          completed: false
        }
      ]
    },
    {
      id: '3',
      topic: 'Scale With Multiple Pages',
      description: 'Don\'t limit yourself to one page. Create 1-5 additional pages to maximize your reach, diversify content, and scale your income potential.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Create 1-5 Additional Pages',
          description: 'If posting takes 5-10 minutes per page, spend an hour managing 5+ pages instead of just one.',
          completed: false
        },
        {
          title: 'Diversify Content Topics',
          description: 'Create pages for different niches: animals, motivation, memes, news, etc. Don\'t worry if similar pages exist - make yours unique.',
          completed: false
        },
        {
          title: 'Think Long-Term Scaling',
          description: 'If one page can eventually make $1k per post, imagine having 5 pages. Start building your portfolio early.',
          completed: false
        },
        {
          title: 'Give Each Page a Unique Name',
          description: 'Just because "Meme Central" exists doesn\'t mean you can\'t create a meme page. Make yours unique with a different name.',
          completed: false
        },
        {
          title: 'Maximize Posting Efficiency',
          description: 'Batch your content creation and posting across all pages to save time and maintain consistency.',
          completed: false
        }
      ]
    }
  ];

  constructor() {
    this.loadProgress();
    this.updateStepLocks();
  }

  saveProgress(): void {
    const progress = {
      isUnlockedAll: this.isUnlockedAll,
      steps: this.steps.map(step => ({
        id: step.id,
        expanded: step.expanded,
        subTasks: step.subTasks.map(task => ({
          completed: task.completed
        }))
      }))
    };
    localStorage.setItem('socialMediaBlueprint_progress', JSON.stringify(progress));
  }

  loadProgress(): void {
    const savedProgress = localStorage.getItem('socialMediaBlueprint_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);

        // Handle both old and new format
        const steps = progress.steps || progress;
        this.isUnlockedAll = progress.isUnlockedAll || false;

        steps.forEach((savedStep: any, index: number) => {
          if (this.steps[index] && this.steps[index].id === savedStep.id) {
            this.steps[index].expanded = savedStep.expanded;
            savedStep.subTasks.forEach((savedTask: any, taskIndex: number) => {
              if (this.steps[index].subTasks[taskIndex]) {
                this.steps[index].subTasks[taskIndex].completed = savedTask.completed;
              }
            });
          }
        });
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }

  isStepComplete(step: Step): boolean {
    return step.subTasks.length > 0 && step.subTasks.every(task => task.completed);
  }

  updateStepLocks(): void {
    // Don't update locks if everything is unlocked
    if (this.isUnlockedAll) {
      return;
    }

    // Create a new array with new object references to force change detection
    this.steps = this.steps.map((step, i) => {
      if (i === 0) {
        // First step is always unlocked
        return { ...step, locked: false };
      } else {
        // Lock step if any previous step is incomplete
        const allPreviousComplete = this.steps
          .slice(0, i)
          .every(s => this.isStepComplete(s));
        return { ...step, locked: !allPreviousComplete };
      }
    });
  }

  toggleStep(stepId: string): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step && !step.locked) {
      const wasExpanded = step.expanded;

      // Close all steps
      this.steps.forEach(s => s.expanded = false);

      // Toggle the clicked step (if it was closed, open it)
      step.expanded = !wasExpanded;

      this.saveProgress();
    }
  }

  onSubTaskToggle(): void {
    // Update locks whenever a subtask is toggled
    this.updateStepLocks();
    this.saveProgress();
  }

  jumpToStep(): void {
    const stepNum = parseInt(this.jumpToStepNumber, 10);
    if (stepNum > 0 && stepNum <= this.steps.length) {
      const step = this.steps[stepNum - 1];

      if (!step.locked) {
        step.expanded = true;

        // Wait for DOM to update then scroll
        setTimeout(() => {
          const element = document.getElementById(`step-${step.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }

      this.jumpToStepNumber = '';
    }
  }

  addNewStep(topic: string, description: string): void {
    const newId = (this.steps.length + 1).toString();
    const newStep: Step = {
      id: newId,
      topic: topic,
      description: description,
      expanded: false,
      locked: false,
      subTasks: []
    };
    this.steps.push(newStep);
    this.updateStepLocks();
  }

  unlockAll(): void {
    this.isUnlockedAll = !this.isUnlockedAll;

    if (this.isUnlockedAll) {
      // Unlock everything
      this.steps = this.steps.map(step => ({
        ...step,
        locked: false,
        subTasks: step.subTasks.map(task => ({
          ...task,
          locked: false
        }))
      }));
    } else {
      // Return to normal locked state based on completion
      this.updateStepLocks();
      // Trigger subtask lock updates by creating new references
      this.steps = this.steps.map(step => ({
        ...step,
        subTasks: [...step.subTasks]
      }));
    }

    this.saveProgress();
  }

  hasAnyProgress(): boolean {
    return this.steps.some(step =>
      step.subTasks.some(task => task.completed)
    );
  }

  openResetModal(): void {
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
  }

  confirmReset(): void {
    // Reset all completion states
    this.steps = this.steps.map(step => ({
      ...step,
      expanded: false,
      subTasks: step.subTasks.map(task => ({
        ...task,
        completed: false,
        locked: false
      }))
    }));

    // Reset unlock state
    this.isUnlockedAll = false;

    // Clear localStorage
    localStorage.removeItem('socialMediaBlueprint_progress');

    // Re-apply normal locking
    this.updateStepLocks();

    // Close modal
    this.showResetModal = false;
  }
}
