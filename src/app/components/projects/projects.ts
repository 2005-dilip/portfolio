import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import type { Project, GalleryImage } from '../../models/portfolio.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  private readonly ps = inject(PortfolioService);
  readonly projects = this.ps.projects;

  /** Currently selected project for full detailed modal preview */
  readonly selectedProject = signal<Project | null>(null);

  /** Active gallery image index inside the detailed modal */
  readonly activeImageIndex = signal<number>(0);

  /** Lightbox state for full-screen image preview */
  readonly lightboxImage = signal<GalleryImage | null>(null);

  openModal(project: Project): void {
    this.selectedProject.set(project);
    this.activeImageIndex.set(0);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.selectedProject.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  selectGalleryImage(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.activeImageIndex.set(index);
  }

  activeImageUrl(proj: Project): string | null {
    if (proj.gallery && proj.gallery.length > 0) {
      const idx = this.activeImageIndex();
      if (idx >= 0 && idx < proj.gallery.length) {
        return proj.gallery[idx].url;
      }
    }
    return proj.image;
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.lightboxImage()) {
        this.closeLightbox();
      } else {
        this.closeModal();
      }
    }
  }

  hasMetrics(project: Project): boolean {
    return !!project.metrics && Object.keys(project.metrics).length > 0;
  }

  metricsEntries(project: Project): { key: string; value: string | number }[] {
    if (!project.metrics) return [];
    return Object.entries(project.metrics).map(([key, value]) => ({ key, value }));
  }

  primaryLink(project: Project): { url: string; label: string } | null {
    if (project.liveUrl) return { url: project.liveUrl, label: 'Live Demo' };
    if (project.externalUrl) {
      if (project.externalUrl.includes('drive.google.com') || project.externalUrl.includes('youtube.com')) {
        return { url: project.externalUrl, label: 'Watch Video' };
      }
      return { url: project.externalUrl, label: 'View Project' };
    }
    return null;
  }

  openLightbox(img: GalleryImage, event?: Event): void {
    if (event) event.stopPropagation();
    this.lightboxImage.set(img);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }
}
