export interface Scholarship {
  id: string;
  title: string;
  description: string;
  universityName: string;
  deadline: string;
  location?: string;
}

export interface ScholarshipDto {
  title: string;
  description: string;
  universityId: string;
  deadline: string;
  location?: string;
}
