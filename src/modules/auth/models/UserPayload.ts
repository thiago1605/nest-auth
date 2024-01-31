export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  profile: 'admin' | 'intern' | 'master_admin';
  status: 'active' | 'inactive';
  cell_phone_number: string;
  iat?: number;
  exp?: number;
}
