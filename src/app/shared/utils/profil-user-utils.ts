import { EtudiantProfile } from "../models/profil-user.models";


export function calculerCompletionProfil(profile: EtudiantProfile | null): number {
  if (!profile) return 0;

  const champs = [
    profile.nationality,
    profile.birth_date,
    profile.gender,
    profile.study_level,
    profile.study_domain,
    profile.destination_countries
  ];

  const remplis = champs.filter(c => c !== null && c !== undefined && c !== '').length;
  return Math.round((remplis / champs.length) * 100);
}