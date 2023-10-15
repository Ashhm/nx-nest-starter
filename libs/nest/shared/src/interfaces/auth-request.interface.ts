import { User } from '@libs/shared/interfaces';

export interface AuthRequest extends Request {
  user: Pick<User, 'id' | 'role'>;
}
