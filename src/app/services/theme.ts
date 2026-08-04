import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkSignal = signal(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      this.darkSignal.set(true);
    }
  }

  toggleTheme(): void {
    const isDark = document.documentElement.classList.toggle('dark');
    this.darkSignal.set(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.darkSignal();
  }

}