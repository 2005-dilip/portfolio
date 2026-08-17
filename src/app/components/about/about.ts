import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  private readonly ps = inject(PortfolioService);

  readonly profile    = this.ps.profile;
  readonly education  = this.ps.education;
  readonly socialLinks = this.ps.socialLinks;
}
