import {
  Component,
  inject,
  computed,
  signal,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly ps = inject(PortfolioService);
  private readonly zone = inject(NgZone);

  readonly profile = this.ps.profile;
  readonly socialLinks = this.ps.socialLinks;

  readonly focusTags = computed(() => this.profile().focus);

  /** Optional subtle laptop hover highlight (does NOT touch playback). */
  readonly laptopHovered = signal(false);

  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') sectionRef!: ElementRef<HTMLElement>;

  /** Scroll-scrubbing state */
  private readonly TOTAL_FRAMES = 240;
  private frames: HTMLImageElement[] = [];
  private targetProgress = 0;   // where scroll says we should be (0..1)
  private currentProgress = 0;  // smoothed value (0..1)
  private readonly smoothing = 0.08; // easing factor per frame
  private rafId: number | null = null;
  private lastDrawnFrame = -1;
  private reducedMotion = false;

  private scrollHandler = (): void => this.updateTargetProgress();
  private resizeHandler = (): void => {
    this.setupCanvas();
    this.updateTargetProgress();
    this.drawFrame(this.lastDrawnFrame >= 0 ? this.lastDrawnFrame : 0);
  };

  navigateTo(href: string): void {
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Preload frame images
    this.preloadFrames();

    // Setup canvas resolution matching CSS size & DPR
    this.setupCanvas();

    // Reduced motion: show initial frame only
    if (this.reducedMotion) {
      return;
    }

    // Run scroll/rAF work outside Angular to avoid change-detection churn.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.resizeHandler, { passive: true });
      this.updateTargetProgress();
      this.rafId = requestAnimationFrame(this.animate);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private preloadFrames(): void {
    for (let i = 1; i <= this.TOTAL_FRAMES; i++) {
      const img = new Image();
      const padIndex = String(i).padStart(4, '0');
      img.src = `frames/frame_${padIndex}.jpg`;
      img.onload = () => {
        if (i === 1) {
          this.drawFrame(0);
        }
      };
      this.frames.push(img);
    }
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = rect.width || 420;
    const height = rect.height || 420;

    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    this.lastDrawnFrame = -1;
  }

  private drawFrame(frameIndex: number): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = this.frames[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imgAspect = iw / ih;
    const canvasAspect = cw / ch;

    let renderableWidth: number;
    let renderableHeight: number;
    let xStart: number;
    let yStart: number;

    if (imgAspect > canvasAspect) {
      renderableHeight = ch;
      renderableWidth = ch * imgAspect;
      xStart = (cw - renderableWidth) / 2;
      yStart = 0;
    } else {
      renderableWidth = cw;
      renderableHeight = cw / imgAspect;
      xStart = 0;
      yStart = (ch - renderableHeight) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    this.lastDrawnFrame = frameIndex;
  }

  private isMobileView(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  /**
   * Compute Hero scroll progress (0..1) based on how far the Hero section
   * has scrolled through the viewport, with enhanced mobile mapping.
   */
  private updateTargetProgress(): void {
    const section = this.sectionRef?.nativeElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const isMobile = this.isMobileView();

    if (isMobile) {
      // On mobile, scale progress over a shorter scroll range so full animation plays while hero is visible
      const maxScroll = Math.max(1, window.innerHeight * 0.6);
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / maxScroll));
      this.targetProgress = progress;
    } else {
      const total = rect.height;
      const scrolled = -rect.top;
      const progress = total > 0 ? scrolled / total : 0;
      this.targetProgress = Math.min(1, Math.max(0, progress));
    }
  }

  /** rAF loop: smoothly ease currentProgress toward targetProgress or auto-cycle on mobile. */
  private animate = (): void => {
    const section = this.sectionRef?.nativeElement;
    const isMobile = this.isMobileView();

    if (isMobile && section) {
      const rect = section.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;

      if (inView) {
        // On mobile, smoothly advance progress continuously so all 240 frames play
        this.targetProgress += 0.003;
        if (this.targetProgress > 1) {
          this.targetProgress = 0;
          this.currentProgress = 0;
        }
      }
    }

    const diff = this.targetProgress - this.currentProgress;

    // Snap when close enough to avoid endless micro-updates.
    if (Math.abs(diff) < 0.0005) {
      this.currentProgress = this.targetProgress;
    } else {
      this.currentProgress += diff * this.smoothing;
    }

    const frameIndex = Math.min(
      this.TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(this.currentProgress * (this.TOTAL_FRAMES - 1)))
    );

    if (frameIndex !== this.lastDrawnFrame) {
      this.drawFrame(frameIndex);
    }

    this.rafId = requestAnimationFrame(this.animate);
  };


  onLaptopEnter(): void {
    this.laptopHovered.set(true);
  }

  onLaptopLeave(): void {
    this.laptopHovered.set(false);
  }
}
