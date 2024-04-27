import {IMenu} from "./i-menu";

export interface IRole {
  roleId?: number;
  roleName?: string;
  menuModel?: IMenu[];
  createdAt?: string;
  updatedAt?: string;
}
