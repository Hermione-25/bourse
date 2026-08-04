import { Component,inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule} from '@angular/common';
import { ThemeService } from '../../services/theme';



@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css'],
})
export class PublicLayoutComponent {
  isMenuOpen = false;
  authService=inject(AuthService)
  themeService = inject(ThemeService);
  router=inject(Router)

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  espace(): void {
  this.authService.getCurrentUser().subscribe({
    next: (res) => {
      const isAdmin = res.data.role === 'admin';
      this.router.navigate([isAdmin ? '/admin' : '/user']);
    },
    error: () => {
      this.router.navigate(['/auth/login']);
    }
  });
}
}
