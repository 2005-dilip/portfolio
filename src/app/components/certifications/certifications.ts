import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.html',
  styleUrl: './certifications.css',
})
export class CertificationsComponent {
  private readonly ps = inject(PortfolioService);
  readonly certifications = this.ps.certifications;
}
