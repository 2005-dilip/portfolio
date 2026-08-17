import {
  Component,
  HostListener,
  inject,
  signal,
  computed,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

const NAV_ITEMS = [
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact',      href: '#contact' },
] as const;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements AfterViewInit {
  private readonly ps = inject(PortfolioService);

  readonly profile = this.ps.profile;
  readonly socialLinks = this.ps.socialLinks;
  readonly contact = this.ps.contact;
  readonly navItems = NAV_ITEMS;

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly activeSection = signal<string>('#about');

  /** Initials derived from the profile name for the logo mark. */
  readonly initials = computed(() => {
    const parts = this.profile().name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0][0];
  });

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (typeof window !== 'undefined') {
      this.scrolled.set(window.scrollY > 20);
      this.updateActiveSection();
    }
  }

  private updateActiveSection(): void {
    if (typeof document === 'undefined') return;
    const sections = NAV_ITEMS.map((item) => item.href.substring(1));
    const scrollPosition = window.scrollY + 200;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollPosition) {
        this.activeSection.set(`#${sections[i]}`);
        break;
      }
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  navigateTo(href: string): void {
    this.closeMenu();
    this.activeSection.set(href);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  }
}
