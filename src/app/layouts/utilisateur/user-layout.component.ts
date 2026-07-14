import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DropdownSelectComponent } from '../../shared';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DropdownSelectComponent,FormsModule],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
})
export class UserLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

 choix: string = '';

onChoixChange(value: string) {
  switch (value) {
    case 'Profil':
      this.router.navigate(['/user/profil']);
      break;
    case 'Deconnexion':
      this.logout();
      break;
    case 'Accueil':
      this.router.navigate(['/landing-page']);
      break;
  }
}

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
}
