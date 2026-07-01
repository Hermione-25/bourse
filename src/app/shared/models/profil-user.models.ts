export interface EtudiantProfile {
  nationality: string;
  birth_date: string; 
  gender: string;
  study_level: string;
  study_domain: string;
  average: number | null;
  languages: string[];
  skills: string[];
}