import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import type { Experience } from '../../models/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class ExperienceComponent {
  private readonly ps = inject(PortfolioService);
  readonly experience = this.ps.experience;

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  formatDateRange(exp: Experience): string {
    const start = this.formatDate(exp.startDate);
    const end   = this.formatDate(exp.endDate);
    if (!start && !end) return '';
    if (!end) return `${start} – Present`;
    return `${start} – ${end}`;
  }
}
