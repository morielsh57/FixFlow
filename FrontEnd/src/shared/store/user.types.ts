import { IDepartment } from './departments/departments.types';

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  department: IDepartment | null;
}

export interface IGetUsersResponse {
  data: IUser[];
  msg: string;
}

export interface IGetUserByIdResponse {
  data: IUser;
  msg: string;
}