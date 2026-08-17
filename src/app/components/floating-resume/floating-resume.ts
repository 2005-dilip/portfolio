import { Component, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-floating-resume',
  standalone: true,
  templateUrl: './floating-resume.html',
  styleUrl: './floating-resume.css',
})
export class FloatingResumeComponent {
  private readonly ps = inject(PortfolioService);

  readonly resumeUrl = computed(() => {
    return this.ps.profile().resumeUrl || 'https://drive.google.com/file/d/1SgCFXdRm7x_omH08BvqMU_s_luNVBTM5/view?usp=sharing';
  });

  readonly downloadUrl = computed(() => {
    const url = this.resumeUrl();
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  });
}
