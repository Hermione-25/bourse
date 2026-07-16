export interface PersonalInfo {
    first_name?:string;
    last_name?:string;
    photo?:File | string
    birth_date?:string;
    gender?:string;
    email?:string;
    phone?:string;
    address?:string;
}


export interface Education{
    degree?:string;
    school?:string;
    city?:string;
    start_date?:string;
    end_date?:string;
    description?:string;
    
}

export interface Experience {
    company?:string;
    position?:string;
    city?:string;
    start_date?:string;
    end_date?:string;
    description?:string;
    
}
type level = "Débutant" | "Intermédiaire" | "Avancé" | "Expert";

export interface Skill{
    name?:string;
    level?:level;
}

type LanguageLevel = "Passable" | "Bon" | "Très-bon" ;
export interface Language{
    language_name?:string;
    language_level?:LanguageLevel;
}

export interface Interest{
    name?:string;
}

export interface Cv{
    id?:number;
    template_id?:number;
    title?:string;
    created_at?:string;
    updated_at?:string;
    personal_info?:PersonalInfo;
    summary?:string;
    educations?:Education[];
    experiences?:Experience[];
    skills?:Skill[];
    languages?:Language[];
    interests?:Interest[];
}

export interface CvTemplate {
    id: number;                      
    name: string;
    slug: string;
    description: string;
    preview_image: string;
    is_active: boolean;
    color_slots: {
            key:string;
            default:string;
    }[];
}

export interface CvPayload {
  template_id: number;
  data: Cv;
  name:string;
}
	


