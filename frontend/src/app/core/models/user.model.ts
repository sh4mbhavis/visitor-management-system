export interface User {

  userId: number;

  fullName: string;

  email: string;

  mobile?: string;

  roleId: number;

  roleName: string;

  departmentId?: number;

  isActive: boolean;

  lastLoginAt?: string;

}