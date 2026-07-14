import { User } from '../../shared/models/user.models';

export interface AuthToken {
  success: boolean;
  message: string;
  data: {
    token: string;
    user:User;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  first_name: string;
  last_name?: string;
  country?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
