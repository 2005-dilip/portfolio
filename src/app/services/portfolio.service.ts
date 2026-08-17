import { Injectable, signal, computed } from '@angular/core';
import type {
  Portfolio,
  Profile,
  Education,
  Skills,
  SkillGroup,
  Experience,
  Project,
  Achievement,
  Certification,
  Publication,
  Contact,
  SocialLinks,
} from '../models/portfolio.models';
import portfolioData from '../data/portfolio.json';

/**
 * PortfolioService
 *
 * Single source of truth for all portfolio data consumed by components.
 * Currently loads from local JSON. To migrate to a REST API, replace the
 * signal initialisation with an HTTP call — components need no changes.
 *
 * Usage in a component:
 *   private readonly ps = inject(PortfolioService);
 *   profile = this.ps.profile;
 *   projects = this.ps.projects;
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  // Cast the imported JSON to the typed Portfolio interface once, centrally.
  private readonly data = signal<Portfolio>(portfolioData as Portfolio);

  // ---------------------------------------------------------------------------
  // Top-level sections — each is a computed signal derived from the data store.
  // ---------------------------------------------------------------------------

  readonly profile = computed<Profile>(() => this.data().profile);

  readonly education = computed<Education[]>(() => this.data().education);

  readonly skills = computed<Skills>(() => this.data().skills);

  /**
   * Skills grouped into labelled categories, ready for template iteration.
   * Order here determines display order in the UI.
   */
  readonly skillGroups = computed<SkillGroup[]>(() => {
    const s = this.data().skills;
    return [
      { label: 'Languages & Frameworks', items: s.languagesAndFrameworks },
      { label: 'AI & LLM', items: s.aiAndLlm },
      { label: 'Data & Visualisation', items: s.dataAndVisualization },
      { label: 'Cloud & DevOps', items: s.cloudAndDevOps },
      ...(s.tools.length ? [{ label: 'Tools', items: s.tools }] : []),
    ];
  });

  readonly experience = computed<Experience[]>(() => this.data().experience);

  readonly projects = computed<Project[]>(() => this.data().projects);

  readonly featuredProjects = computed<Project[]>(() =>
    this.data().projects.filter((p) => p.featured),
  );

  readonly achievements = computed<Achievement[]>(() => this.data().achievements);

  readonly certifications = computed<Certification[]>(() => this.data().certifications);

  readonly publications = computed<Publication[]>(() => this.data().publications);

  readonly contact = computed<Contact>(() => this.data().contact);

  readonly socialLinks = computed<SocialLinks>(() => this.data().socialLinks);

  // ---------------------------------------------------------------------------
  // Lookup helpers
  // ---------------------------------------------------------------------------

  /** Find a single project by its id. Returns undefined if not found. */
  getProjectById(id: string): Project | undefined {
    return this.data().projects.find((p) => p.id === id);
  }
}
