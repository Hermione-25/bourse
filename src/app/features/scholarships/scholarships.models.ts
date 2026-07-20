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
  domain?: string;
  funding_type?: FundingType;
  benefits?: string;
  requirement?: string;
  image?: string;
  link?: string;
  source?: string;
  deadline?: string;
  days_remaining?: number;
  compatibility_score?: number;
  required_documents?: string;
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
  required_documents?: string;
  
}