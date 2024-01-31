import { UserPayload } from './UserPayload';

export interface UserFromJwt extends UserPayload {
  id?: string;
}
