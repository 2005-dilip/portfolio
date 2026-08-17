import { Component, inject, computed, ElementRef, HostListener, signal } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-floating-resume',
  standalone: true,
  templateUrl: './floating-resume.html',
  styleUrl: './floating-resume.css',
})
export class FloatingResumeComponent {
  private readonly ps = inject(PortfolioService);
  private readonly el = inject(ElementRef);

  readonly transformStyle = signal('translate3d(0px, 0px, 0px) scale(1)');

  readonly resumeUrl = computed(() => {
    return this.ps.profile().resumeUrl || 'https://drive.google.com/file/d/1SgCFXdRm7x_omH08BvqMU_s_luNVBTM5/view?usp=sharing';
  });

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (window.innerWidth < 768 || !window.matchMedia('(pointer: fine)').matches) {
      this.transformStyle.set('none');
      return;
    }

    const badge = this.el.nativeElement.querySelector('.resume-badge');
    if (!badge) return;

    const rect = badge.getBoundingClientRect();
    const badgeCenterX = rect.left + rect.width / 2;
    const badgeCenterY = rect.top + rect.height / 2;

    const distanceX = event.clientX - badgeCenterX;
    const distanceY = event.clientY - badgeCenterY;
    const distance = Math.hypot(distanceX, distanceY);

    const magneticRadius = 140; // Activation distance in px

    if (distance < magneticRadius) {
      const pullFactor = 1 - distance / magneticRadius;
      const moveX = (distanceX / distance) * pullFactor * 8;
      const moveY = (distanceY / distance) * pullFactor * 8;
      const scale = 1 + pullFactor * 0.04;

      this.transformStyle.set(
        `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0px) scale(${scale.toFixed(3)})`
      );
    } else {
      this.transformStyle.set('translate3d(0px, 0px, 0px) scale(1)');
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    if (window.innerWidth >= 768) {
      this.transformStyle.set('translate3d(0px, 0px, 0px) scale(1)');
    }
  }
}
