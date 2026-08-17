import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the profile name in the hero', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dilip Kumar S');
  });

  it('should render all main portfolio sections', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'achievements',
      'certifications',
      'publications',
      'contact',
    ];

    for (const id of sectionIds) {
      const section = compiled.querySelector(`#${id}`);
      expect(section, `missing section #${id}`).toBeTruthy();
    }
  });
});
