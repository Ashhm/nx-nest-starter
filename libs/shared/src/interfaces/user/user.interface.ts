import { UserRole } from '../../enums/';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
