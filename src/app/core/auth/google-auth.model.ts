export interface GoogleCredentialResponse {
  credential: string; // le JWT (ID token)
  select_by?: string;
}