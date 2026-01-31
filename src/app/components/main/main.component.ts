import { Component, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { StepsListComponent } from '../steps-list/steps-list.component';
import { StepNavigationComponent } from '../step-navigation/step-navigation.component';
import { StepsSidebar } from '../steps-sidebar/steps-sidebar';
import { FooterComponent } from '../footer/footer.component';
import { ResetModalComponent } from '../reset-modal/reset-modal.component';
import { StepManagementService } from '../../services/step-management.service';
import { ProgressStorageService } from '../../services/progress-storage.service';
import { Step } from '../../models/checklist.model';

@Component({
  selector: 'app-main',
  imports: [CommonModule, HeaderComponent, StepsListComponent, StepNavigationComponent, StepsSidebar, FooterComponent, ResetModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  protected readonly title = signal('Social Media Blueprint');
  protected showResetModal = false;
  protected sidebarMobileOpen = false;

  // Sample data - developers can easily add more steps here
  private readonly initialSteps: Step[] = [
    {
      id: '1',
      topic: 'Set Up Your Facebook Account',
      description: 'First things first—you need an active personal Facebook account. This will serve as the foundation for creating and managing your pages.',
      expanded: false,
      locked: false,
      subTasks: [
        {
          title: 'Create or Log Into Facebook',
          description: 'Sign up for a new account or log into your existing Facebook profile.',
          completed: false
        },
        {
          title: 'Verify Your Account',
          description: 'Ensure your account is in good standing with a verified email or phone number.',
          completed: false
        }
      ]
    },
    {
      id: '2',
      topic: 'Create Your Facebook Page',
      description: 'Transform your personal profile into a content powerhouse. Pages are free, unlimited, and completely anonymous—no one will know it\'s you behind the scenes.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Access Page Creation',
          description: 'Navigate to "Create" → "Page" from your personal profile. It\'s completely free and you can create as many as you want.',
          completed: false
        },
        {
          title: 'Choose Your Content Niche',
          description: 'Pick a focus: trending news, memes, AI-generated content, animals, motivation, photography, etc. This will guide all your content.',
          completed: false
        },
        {
          title: 'Craft a Unique Page Name',
          description: 'Spend 5-30 minutes choosing a memorable, unique name. Avoid generic names that conflict with existing pages. Example: "gumgumAi" not "AI Page 123".',
          completed: false
        },
        {
          title: 'Verify Name Availability',
          description: 'Search Facebook to confirm your chosen name isn\'t already taken or too similar to existing pages.',
          completed: false
        },
        {
          title: 'Avoid Numbered Suffixes',
          description: 'Never add numbers to differentiate your page (e.g., "The Academy 2" or "Memes 123"). This looks unprofessional and hurts discoverability.',
          completed: false
        },
        {
          title: 'Keep It Concise',
          description: 'Short, punchy names are easier to remember and share. Avoid overly long or complicated names.',
          completed: false
        },
        {
          title: 'Consider Personal Branding',
          description: 'Only include your name if you\'re building a personal brand (e.g., "John the Joker"). WARNING: Never use first + last name—Facebook will treat it as a personal profile, not a page.',
          completed: false
        },
        {
          title: 'Complete Your Page Profile',
          description: 'Add a profile picture, cover photo, compelling description, and select the appropriate category to finalize your page setup.',
          completed: false
        }
      ]
    },
    {
      id: '3',
      topic: 'Scale With Multiple Pages',
      description: 'Don\'t put all your eggs in one basket. If posting takes 5-10 minutes per page, why not manage 3-5 pages and multiply your reach and income potential?',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Create 2-5 Additional Pages',
          description: 'Diversify early. More pages = more opportunities. If one page takes 10 minutes, five pages take less than an hour.',
          completed: false
        },
        {
          title: 'Diversify Content Topics',
          description: 'Create pages for different niches: animals, motivation, memes, beautiful photography, trending news, etc. Competition exists everywhere—just make yours stand out.',
          completed: false
        },
        {
          title: 'Think Long-Term Revenue',
          description: 'If one mature page can earn $1,000 per post, five pages could earn $5,000. Start building your portfolio now.',
          completed: false
        },
        {
          title: 'Match Email Accounts to Pages',
          description: 'Pro tip: Create one email account per page for AI tools and organization. This helps you manage multiple AI generation limits effectively.',
          completed: false
        }
      ]
    },
    {
      id: '4',
      topic: 'Prep Your First Post With AI',
      description: 'Let AI do the heavy lifting. No more staring at a blank screen wondering what to post—use ChatGPT to generate content ideas in seconds.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Use ChatGPT for Content Ideas',
          description: 'Ask: "Give me 5 post ideas for my [topic] page today." For example: "Give me 5 ideas for my animal page" might return safety tips, before & after transformations, cute moments, etc.',
          completed: false
        },
        {
          title: 'Pick Your Favorite Idea',
          description: 'Don\'t overthink it—choose one idea that resonates. You can always use the others later.',
          completed: false
        },
        {
          title: 'Generate or Refine Description',
          description: 'Use the AI-suggested description as-is or ask ChatGPT to modify it to match your style.',
          completed: false
        },
        {
          title: 'Prepare for Visual Creation',
          description: 'With your idea and description ready, it\'s time to create the visual content using AI image/video tools.',
          completed: false
        }
      ]
    },
    {
      id: '5',
      topic: 'Generate AI Images',
      description: 'Transform text into stunning visuals using AI. No design skills required—just describe what you want and let the AI work its magic.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Choose Your AI Tool',
          description: 'Grok.com is the fastest free option. Download the app or use the web version. Sign in with any email (Google works great).',
          completed: false
        },
        {
          title: 'Understand Your Limits',
          description: 'Free Grok accounts get 20 images OR 20 videos per 24 hours. Plan wisely—don\'t waste credits on test generations.',
          completed: false
        },
        {
          title: 'Use Text-to-Image Generation',
          description: 'Example: "Create an image of a golden retriever jumping joyfully in a sunny park." The more detail, the better the result.',
          completed: false
        },
        {
          title: 'Iterate With Image Editing',
          description: 'Refine your image: "Make the dog stand on two legs and look directly at the camera." Small tweaks can make big differences.',
          completed: false
        },
        {
          title: 'Avoid Explicit Content',
          description: 'Steer clear of adult content, blood, gore, explosions, etc. These prompts waste credits by generating blurred images 80% of the time.',
          completed: false
        },
        {
          title: 'Scale With Multiple Accounts',
          description: 'Need more than 20 generations? Create 2-5 Gmail accounts and switch between them. Or upgrade to a paid tier for unlimited access.',
          completed: false
        }
      ]
    },
    {
      id: '6',
      topic: 'Generate AI Videos',
      description: 'Video is king for engagement. Turn your AI images into 6-8 second videos with one click and watch your view counts soar.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Prioritize Video Content',
          description: 'Videos get significantly more views, clicks, and watch time than images. Always aim for video when possible.',
          completed: false
        },
        {
          title: 'Convert Image to Video',
          description: 'In Grok, click the video generation button on any image to create a 6-8 second animated version. First generation is random.',
          completed: false
        },
        {
          title: 'Handle Generation Bugs',
          description: 'If the video doesn\'t appear after clicking, refresh the page—it\'s generating in the background and using your credit.',
          completed: false
        },
        {
          title: 'Refine With Text Prompts',
          description: 'Not happy with the first video? Use text prompts to describe what should happen: "Make the dog jump and spin around."',
          completed: false
        },
        {
          title: 'Download Your Content',
          description: 'Grok allows free downloads of all generated images and videos. Save them to your device for posting.',
          completed: false
        }
      ]
    },
    {
      id: '7',
      topic: 'Post Your Content Strategically',
      description: 'Posting isn\'t just uploading—it\'s about maximizing algorithmic reach. Always create a Reel first, then share it as a post for double the exposure.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Create a Reel First',
          description: 'Always upload your content as a Reel first. Switch to your page, find "Create" → "Reel", and upload your image or video.',
          completed: false
        },
        {
          title: 'Generate Engaging Descriptions',
          description: 'Ask ChatGPT: "I\'m posting a video of a cute dog jumping around. Give me descriptions with emojis and hashtags." Pick one or customize it.',
          completed: false
        },
        {
          title: 'Add Description and Tags',
          description: 'Copy your ChatGPT description into the Reel. Tags and emojis are crucial—they help the algorithm understand and promote your content.',
          completed: false
        },
        {
          title: 'Publish Your Reel',
          description: 'Submit your Reel and wait a few seconds for it to go live.',
          completed: false
        },
        {
          title: 'Share Reel as a Post',
          description: 'CRITICAL: Click "Share" on your Reel and post it to your timeline. This counts as separate engagement for the algorithm.',
          completed: false
        },
        {
          title: 'Use Different Description for Post',
          description: 'When sharing the Reel as a post, use a different but similar description. Ask ChatGPT for a variation to keep it fresh.',
          completed: false
        }
      ]
    },
    {
      id: '8',
      topic: 'Follow Platform Rules',
      description: 'The algorithm detects abuse instantly. One wrong move and your page could be shadowbanned, suspended, or blacklisted permanently. Play it safe.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Avoid Spam Posting',
          description: 'Never post more than 15 times per day per page—that\'s a red flag. Safe zone: 1-5 posts per day, spread throughout.',
          completed: false
        },
        {
          title: 'Maintain Minimum Activity',
          description: 'Bare minimum: 3 posts per week to keep your page healthy (e.g., Monday, Wednesday, Saturday).',
          completed: false
        },
        {
          title: 'Schedule Posts Wisely',
          description: 'Want to batch-create? Use Facebook\'s scheduler to space posts 2+ hours apart. Never post 5 times in 10 minutes.',
          completed: false
        },
        {
          title: 'Never Use "Like for Like"',
          description: 'Phrases like "Like my page and I\'ll like yours back" or "Share for a like" are instant red flags. Social media values authentic engagement.',
          completed: false
        },
        {
          title: 'Stay Professional',
          description: 'No vulgar language, no calling out other pages, no drama. Keep it positive and professional.',
          completed: false
        },
        {
          title: 'Protect Creator Privacy',
          description: 'Never reveal real names behind pages in comments or tags. Respect everyone\'s anonymity.',
          completed: false
        }
      ]
    },
    {
      id: '9',
      topic: 'Build Your Follower Base',
      description: 'Start with your network. A page with 40 followers looks infinitely better than one with 0-1. Leverage your group for mutual support.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Share Pages in Your Group',
          description: 'Post new page links in your group chat. Everyone should follow each other\'s pages gradually—not all at once to avoid flags.',
          completed: false
        },
        {
          title: 'Calculate Group Impact',
          description: 'Example: 8 people × 3 pages each = 24 instant followers per page. That\'s a solid foundation.',
          completed: false
        },
        {
          title: 'Recruit Family and Friends',
          description: 'Get family members to follow and like (adds 10-20 followers). Don\'t reveal you\'re the creator—just say it\'s an interesting page.',
          completed: false
        },
        {
          title: 'Target 40+ Initial Followers',
          description: 'With group + family support, each page can start with 40+ followers in week one. This builds credibility fast.',
          completed: false
        }
      ]
    },
    {
      id: '10',
      topic: 'Engage Authentically',
      description: 'Fake engagement gets you banned. The algorithm knows if you\'re not watching videos before liking. Always engage genuinely to build real credibility.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Watch Videos Completely',
          description: 'CRITICAL: Watch group members\' videos fully before liking or commenting. The algorithm tracks watch time vs. engagement.',
          completed: false
        },
        {
          title: 'Images Are Different',
          description: 'For image posts, you can like immediately—the algorithm understands there\'s no "watch time" requirement.',
          completed: false
        },
        {
          title: 'Leave Authentic Comments',
          description: 'Write real reactions: "So adorable!", "This made my day!", "Wow, I would never try that!" Make it feel human.',
          completed: false
        },
        {
          title: 'Answer Engagement Questions',
          description: 'If a Reel asks a question (e.g., "Which do you prefer?"), answer thoughtfully in the comments. This signals active engagement.',
          completed: false
        },
        {
          title: 'Avoid Bot-Like Behavior',
          description: 'Don\'t jump into 10 pages and rapid-fire like everything. The algorithm will flag your account as inauthentic.',
          completed: false
        }
      ]
    },
    {
      id: '11',
      topic: 'Maintain Consistency',
      description: 'Consistency beats perfection. Once you\'ve got the rhythm down, posting becomes a 5-10 minute routine. Stay committed and watch your pages grow.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Optimize Your Workflow',
          description: 'Keep browser tabs open for ChatGPT and Grok. Save prompts in a notepad for quick copy-paste. Streamline everything.',
          completed: false
        },
        {
          title: 'Post Consistently',
          description: 'Commit to at least 3 posts per week. Consistency trains the algorithm to promote your content regularly.',
          completed: false
        },
        {
          title: 'Aim for 10-15 Second Videos',
          description: 'Facebook\'s algorithm prioritizes 10-15 second videos. Stitch two 6-8 second clips together using a free video editing app.',
          completed: false
        },
        {
          title: 'Use Video Stitching Tools',
          description: 'Download free video editing apps on your phone or desktop. Combine clips after you\'re comfortable (around 10+ posts in).',
          completed: false
        },
        {
          title: 'Track Your Progress',
          description: 'Monitor which content performs best. Double down on what works and adjust what doesn\'t.',
          completed: false
        }
      ]
    },
    {
      id: '12',
      topic: 'Monetize Your Pages',
      description: 'The long game pays off. Facebook monitors your stats for weeks or months. Hit their thresholds and you\'ll receive an invitation to start earning real money.',
      expanded: false,
      locked: true,
      subTasks: [
        {
          title: 'Understand the Timeline',
          description: 'Monetization is slow but rewarding. Facebook evaluates views, followers, and engagement over weeks to months before sending invitations.',
          completed: false
        },
        {
          title: 'Wait for Facebook Invitation',
          description: 'When you hit Facebook\'s criteria (varies by region), you\'ll receive an invitation to join their monetization program. Accept it immediately.',
          completed: false
        },
        {
          title: 'Earn From Ad Revenue',
          description: 'Once monetized, ads appear on your posts and Reels. You earn per 1,000 views (typically ~$1 per 1,000 views).',
          completed: false
        },
        {
          title: 'Understand Revenue Scaling',
          description: '10,000 views = ~$10 | 100,000 views = ~$100 | 1 million views = ~$1,000. Scale your followers, scale your income.',
          completed: false
        },
        {
          title: 'Reach the 1,000 Follower Milestone',
          description: 'At 1,000+ followers, your posts get instant exposure to your audience plus algorithmic reach. Growth accelerates exponentially.',
          completed: false
        },
        {
          title: 'Leverage Multiple Pages',
          description: 'With 5 monetized pages each earning $1,000/post, you\'re looking at $5,000 per round of content. That\'s the power of scaling early.',
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

  protected get currentStep() {
    return this.stepManagementService.currentStep;
  }

  protected get currentStepIndex() {
    return this.stepManagementService.currentStepIndex;
  }

  protected get totalSteps() {
    return this.stepManagementService.totalSteps;
  }

  protected get isUnlockedAll() {
    return this.stepManagementService.isUnlockedAll;
  }

  protected get hasAnyProgress() {
    return this.stepManagementService.hasAnyProgress;
  }

  protected get canGoBack() {
    return this.stepManagementService.canGoBack;
  }

  protected get canGoNext() {
    return this.stepManagementService.canGoNext;
  }

  protected get progressPercentage() {
    return this.stepManagementService.progressPercentage;
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

      // Restore current step index
      if (savedProgress.currentStepIndex !== undefined) {
        this.stepManagementService.setCurrentStepIndex(savedProgress.currentStepIndex);
      }

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
    // Auto-save whenever steps or current step changes
    effect(() => {
      const steps = this.steps();
      const isUnlockedAll = this.isUnlockedAll();
      const currentStepIndex = this.currentStepIndex();
      this.progressStorageService.saveProgress(steps, isUnlockedAll, currentStepIndex);
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

  // Navigation handlers
  protected onNextStep(): void {
    this.stepManagementService.nextStep();
  }

  protected onPreviousStep(): void {
    this.stepManagementService.previousStep();
  }

  // Sidebar handlers
  protected onSidebarNavigate(stepNumber: number): void {
    this.stepManagementService.jumpToStep(stepNumber);
    this.sidebarMobileOpen = false; // Close sidebar on mobile after navigation
  }

  protected onCloseSidebar(): void {
    this.sidebarMobileOpen = false;
  }

  protected onToggleSidebar(): void {
    this.sidebarMobileOpen = !this.sidebarMobileOpen;
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent): void {
    // Don't trigger if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Don't trigger if modal is open
    if (this.showResetModal) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (this.canGoBack()) {
          this.onPreviousStep();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.canGoNext()) {
          this.onNextStep();
        }
        break;
    }
  }
}
