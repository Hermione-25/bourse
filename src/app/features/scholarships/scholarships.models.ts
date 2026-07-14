export enum FundingType {
  FULL = 'full',
  PARTIAL = 'partial',
  UNFUNDED = 'unfunded',
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  university: string;
  country?: string;
  region?:string;
  domain?: string;
  funding_type?: FundingType;
  amount?: string;
  benefits?: string;
  requirement?: string;
  image?: string;
  link?: string;
  source?: string;
  deadline?: string;
  days_remaining?: number;
  compatibility_score?: number;
}

export interface ScholarshipDto {
  title: string;
  country: string;
  university: string;
  domain: string;
  deadline: string;
  description: string;
  funding_type: FundingType;
  amount?: string | null;
  benefits?: string;
  requirement?: string;
  image?: string;
  link: string;
  source?: string;
  
}