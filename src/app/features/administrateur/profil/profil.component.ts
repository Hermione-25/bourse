import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {

  private authService = inject(AuthService);

  adminInfo = {
    first_name: '',
    last_name: '',
    email: '',
    role: 'admin',
    country: '',
    initials: '',
  };

  ngOnInit(): void {
    this.authService.authState$.subscribe((auth) => {

      if (!auth) return;

      const user = auth;

      this.adminInfo = {
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        role: user.role ?? 'admin',
        country: user.country ?? '',
        initials: (
          (user.first_name?.charAt(0) ?? '') +
          (user.last_name?.charAt(0) ?? '')
        ).toUpperCase(),
      };
    });
  }

  get fullName(): string {
    return `${this.adminInfo.first_name} ${this.adminInfo.last_name}`.trim();
  }

}