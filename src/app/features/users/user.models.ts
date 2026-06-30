export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserDto {
  first_name: string;
  last_name: string;
  email: string;
  country?: string;
  role?: string;
}