import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publications.html',
  styleUrl: './publications.css',
})
export class PublicationsComponent {
  private readonly ps = inject(PortfolioService);
  readonly publications = this.ps.publications;
}
