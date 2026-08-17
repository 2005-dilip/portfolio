/**
 * Portfolio data models.
 * These interfaces mirror the structure of portfolio.json.
 * All components and services consume these types — never the raw JSON directly.
 *
 * Future migration note:
 *   When a REST API replaces local JSON, only the service layer needs updating.
 *   Components and models remain unchanged.
 */

export interface Portfolio {
  profile: Profile;
  education: Education[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Certification[];
  publications: Publication[];
  contact: Contact;
  socialLinks: SocialLinks;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface Profile {
  name: string;
  professionalTitle: string;
  summary: string;
  focus: string[];
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export interface Education {
  id: string;
  degree: string;
  field: string | null;
  institution: string;
  status: string;
  performance: string | null;
  graduationYear: string | number | null;
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface Skills {
  languagesAndFrameworks: string[];
  aiAndLlm: string[];
  dataAndVisualization: string[];
  cloudAndDevOps: string[];
  tools: string[];
}

/** A named skill category, used when rendering skill groups in the UI. */
export interface SkillGroup {
  label: string;
  items: string[];
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export interface Experience {
  id: string;
  organization: string;
  role: string;
  /** Free-form area description, e.g. "AI / Machine Learning / Computer Vision" */
  area?: string;
  /** Programme name if applicable, e.g. "Cognizant Digital Nurture 4.0" */
  program?: string;
  /** Track within the programme, e.g. "Java Full Stack Engineering" */
  track?: string;
  /** Descriptive status, e.g. "Selected through campus hiring for a full-time opportunity" */
  status?: string;
  technologies: string[];
  /** ISO date string "YYYY-MM-DD" or null if unknown */
  startDate: string | null;
  /** ISO date string "YYYY-MM-DD" or null if ongoing/unknown */
  endDate: string | null;
  /** Additional context note, e.g. "AICTE-associated internship" */
  context: string | null;
  /** Key accomplishments in this role */
  highlights?: string[];
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface GalleryImage {
  url: string;
  alt: string;
}

/** Flexible key-value map for project performance metrics. */
export interface ProjectMetrics {
  [key: string]: string | number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  highlights: string[];
  /** Primary cover image URL, or null if not available. */
  image: string | null;
  gallery: GalleryImage[];
  githubUrl: string | null;
  liveUrl: string | null;
  externalUrl: string | null;
  metrics: ProjectMetrics;
  featured: boolean;
  /** Present only on in-progress projects, e.g. "In progress". */
  status?: string;
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export interface Achievement {
  id: string;
  title: string;
  /** References a Project.id if the achievement is tied to a specific project. */
  associatedProject: string | null;
  organization: string | null;
  date: string | null;
  gallery: GalleryImage[];
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export interface Certification {
  name: string;
  issuer: string;
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  url: string;
  type: 'Publication' | 'Article';
  date: string | null;
}

// ---------------------------------------------------------------------------
// Social / Contact
// ---------------------------------------------------------------------------

export interface SocialLinks {
  linkedin: string | null;
  github: string | null;
  geeksforgeeks: string | null;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface Contact {
  email: string | null;
  mobile: string | null;
}
