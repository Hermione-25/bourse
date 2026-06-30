export interface Scholarship {
  id: string;
  title: string;
  description: string;
  university: string;
  country?: string;
  region?: string;
  domain?: string;
  is_funded?: boolean;
  amount?: number;
  benefits?: string;
  requirement?: string;
  image?: string;
  link?: string;
  source?: string;
  deadline?: Date;
  days_remaining?: number;
}

export interface ScholarshipDto {
  title: string;
  country: string;
  region?: string;
  university: string;
  domain: string;
  deadline: string;
  description: string;
  is_funded: boolean;
  amount?: string | null;
  benefits?: string;
  requirement?: string;
  image?: string;
  link: string;
  source?: string;
}