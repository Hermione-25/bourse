import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover  bg-center bg-no-repeat" style="background-image: url('/images/imlan.jpeg');">
      <!-- Effet de voile (Overlay) adapté -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0"></div>
      
      <!-- Conteneur avec effet glassmorphism pour faire ressortir le formulaire -->
      <div class="w-full max-w-md  backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 p-8 relative z-10 transition-all duration-300">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
