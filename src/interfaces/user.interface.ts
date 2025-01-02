import { ICurrentUser } from './auth.interface'

export interface IUserInfo {
  id: string
  name: string
  email: string
  isauthenticated: boolean
  accountscount: string
  workspacescount: string
  subscription: string
  deleted: string
}
export interface IChangePassWordData {
  currentPassword: string
  newPassword: string
}

export type IUpdateProfileData = Omit<ICurrentUser, 'id' | 'role' | 'email' | 'highLevelPasswords'>

export interface IListUsersWithPaginate {
  listUsers: IUserInfo[]
  totalItems: number
  currentPage: number
  totalPages: number
}
