export interface SignupRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  department: number | null;
  phone_number: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}