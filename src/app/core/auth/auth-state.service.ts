// ❌ SUPPRIMÉ — Ce service était un doublon d'AuthService.
// AuthService expose déjà authState$ et isAuthenticated$.
// Les guards utilisent maintenant AuthService directement.
// Ce fichier est conservé vide pour éviter les erreurs de compilation sur d'éventuels
// imports non encore migrés. À supprimer complètement une fois tous les imports nettoyés.

// Si vous avez besoin de l'état auth, importez AuthService :
//   import { AuthService } from './auth.service';
//   authService.authState$ / authService.isAuthenticated$
