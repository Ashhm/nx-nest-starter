import { User } from './user.interface';

export interface UpdateUser extends Pick<User, 'firstName' | 'lastName'> {}
