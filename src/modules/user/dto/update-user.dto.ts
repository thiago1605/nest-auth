import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  cell_phone_number?: string;
  email?: string;
  name?: string;
  password?: string;
  profile?: 'admin' | 'intern';
  status?: 'active' | 'inactive';
  contract_idd?: string;
}
