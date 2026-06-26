export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  roles?: string[];
  permissions?: string[];
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
  passwordConfirmation: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
