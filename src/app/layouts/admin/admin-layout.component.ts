import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DropdownSelectComponent } from '../../shared/dropdown-select/dropdown-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DropdownSelectComponent, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }


  choix:string =''

  onChoixChange(value: string) {
  switch (value) {
    case 'Profil':
      this.router.navigate(['/admin/profil']);
      break;
    case 'Deconnexion':
      this.logout();
      break;
    case 'Accueil':
      this.router.navigate(['/landing-page']);
      break;
  }
}
}
