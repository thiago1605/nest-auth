export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
  cell_phone_number: string;
  profile: 'admin' | 'intern';
  contract_id?: string;
}
