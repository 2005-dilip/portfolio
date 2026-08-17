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

  readonly localDownloadUrl = 'Dilip_Kumar_S_Resume.pdf';
}
