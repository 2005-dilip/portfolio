import { Component } from '@angular/core';
import { NavbarComponent }        from './components/navbar/navbar';
import { HeroComponent }          from './components/hero/hero';
import { AboutComponent }         from './components/about/about';
import { SkillsComponent }        from './components/skills/skills';
import { ExperienceComponent }    from './components/experience/experience';
import { ProjectsComponent }      from './components/projects/projects';
import { AchievementsComponent }  from './components/achievements/achievements';
import { CertificationsComponent } from './components/certifications/certifications';
import { PublicationsComponent }  from './components/publications/publications';
import { ContactComponent }       from './components/contact/contact';
import { FloatingResumeComponent } from './components/floating-resume/floating-resume';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    AchievementsComponent,
    CertificationsComponent,
    PublicationsComponent,
    ContactComponent,
    FloatingResumeComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
