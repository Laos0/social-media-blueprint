import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { StepsListComponent } from '../steps-list/steps-list.component';
import { FooterComponent } from '../footer/footer.component';
import { ResetModalComponent } from '../reset-modal/reset-modal.component';
import { StepManagementService } from '../../services/step-management.service';
import { ProgressStorageService } from '../../services/progress-storage.service';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-main',
  imports: [CommonModule, HeaderComponent, StepsListComponent, FooterComponent, ResetModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  protected readonly title = signal('Social Media Blueprint');
  protected showResetModal = false;

  // Sample data - developers can easily add more steps here
  private readonly initialSteps: Step[] = [
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

  constructor(
    private stepManagementService: StepManagementService,
    private progressStorageService: ProgressStorageService
  ) {
    this.initializeApp();
    this.setupAutoSave();
  }

  // Expose service signals to template via getters
  protected get steps() {
    return this.stepManagementService.steps;
  }

  protected get isUnlockedAll() {
    return this.stepManagementService.isUnlockedAll;
  }

  protected get hasAnyProgress() {
    return this.stepManagementService.hasAnyProgress;
  }

  private initializeApp(): void {
    // Load saved progress or use initial steps
    const savedProgress = this.progressStorageService.loadProgress();

    if (savedProgress) {
      // Restore progress to initial steps
      savedProgress.steps.forEach((savedStep, index) => {
        if (this.initialSteps[index] && this.initialSteps[index].id === savedStep.id) {
          this.initialSteps[index].expanded = savedStep.expanded;
          savedStep.subTasks.forEach((savedTask, taskIndex) => {
            if (this.initialSteps[index].subTasks[taskIndex]) {
              this.initialSteps[index].subTasks[taskIndex].completed = savedTask.completed;
            }
          });
        }
      });

      // Initialize service with restored data
      this.stepManagementService.initializeSteps(this.initialSteps);

      // Restore unlock state
      if (savedProgress.isUnlockedAll) {
        this.stepManagementService.unlockAll();
      }
    } else {
      // Initialize with fresh data
      this.stepManagementService.initializeSteps(this.initialSteps);
    }
  }

  private setupAutoSave(): void {
    // Auto-save whenever steps change
    effect(() => {
      const steps = this.steps();
      const isUnlockedAll = this.isUnlockedAll();
      this.progressStorageService.saveProgress(steps, isUnlockedAll);
    });
  }

  protected onToggleStep(stepId: string): void {
    this.stepManagementService.toggleStep(stepId);
  }

  protected onSubTaskToggle(): void {
    this.stepManagementService.updateStepLocks();
  }

  protected onJumpToStep(stepNumber: number): void {
    this.stepManagementService.jumpToStep(stepNumber);
  }

  protected onUnlockAllToggle(): void {
    this.stepManagementService.unlockAll();
  }

  protected onOpenResetModal(): void {
    this.showResetModal = true;
  }

  protected onCloseResetModal(): void {
    this.showResetModal = false;
  }

  protected onConfirmReset(): void {
    this.stepManagementService.resetProgress();
    this.progressStorageService.clearProgress();
    this.showResetModal = false;
  }
}
