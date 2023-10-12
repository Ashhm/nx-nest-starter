import { User } from './user.interface';

export interface CreateUser extends Pick<User, 'username' | 'firstName' | 'lastName' | 'password'> {}
