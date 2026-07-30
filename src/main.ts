import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

  export const environment={
    production: false,
    apiUrl: 'https://next-api.qcdigitalhub.com/api',
    googleClientId:'1080337599273-a7vv9ddqo537lp8cd6agbkcgjv03ojm2.apps.googleusercontent.com'
  }