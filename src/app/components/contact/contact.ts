import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  private readonly ps = inject(PortfolioService);
  readonly profile     = this.ps.profile;
  readonly contact     = this.ps.contact;
  readonly socialLinks = this.ps.socialLinks;
}
