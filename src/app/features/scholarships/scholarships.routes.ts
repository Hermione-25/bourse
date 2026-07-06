import { Route } from '@angular/router';
import { ScholarshipsListComponent } from './pages/scholarship-list/scholarship-list-page.component';

export const scholarshipsRoutes: Route[] = [
  {
    path: 'scholarships',
    children: [
      {
        path: '',
        component: ScholarshipsListComponent,
      },
    ],
  },
];
