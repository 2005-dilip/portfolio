import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import type { GalleryImage } from '../../models/portfolio.models';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.css',
})
export class AchievementsComponent {
  private readonly ps = inject(PortfolioService);
  readonly achievements = this.ps.achievements;

  /** Lightbox state */
  readonly lightboxImage = signal<GalleryImage | null>(null);

  openLightbox(img: GalleryImage): void {
    this.lightboxImage.set(img);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  onLightboxKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeLightbox();
  }
}
