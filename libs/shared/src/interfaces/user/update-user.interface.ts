import { User } from './user.interface';

export interface UpdateUser extends Partial<Pick<User, 'firstName' | 'lastName' | 'role'>> {}
