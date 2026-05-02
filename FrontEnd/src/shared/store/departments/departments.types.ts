export interface IDepartment {
  id: number;
  title: string;
}

export interface IGetDepartmentsResponse {
  data: IDepartment[];
  msg: string;
}
