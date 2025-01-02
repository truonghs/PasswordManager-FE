import { instance as axiosClient } from '@/config'

import {
  ICurrentUser,
  IDataResponse,
  IListUsersWithPaginate,
  IPaginationParams,
  IUpdateProfileData
} from '@/interfaces'

export const userApi = {
  getUsers: async (query: IPaginationParams) => {
    const { data } = await axiosClient.get<IListUsersWithPaginate>('/users', {
      params: query
    })
    return data
  },

  getCurrentUser: async () => {
    const { data } = await axiosClient.get<ICurrentUser>('/users/currentUser')
    return data
  },

  updateProfile: async (updateProfileData: IUpdateProfileData) => {
    const { data } = await axiosClient.patch<ICurrentUser>('users/update-profile', updateProfileData)
    return data
  },

  deactivateUser: async (userId: string) => {
    const { data } = await axiosClient.delete<IDataResponse>(`users/deactivate/${userId}`)
    return data
  },

  activeUser: async (userId: string) => {
    const { data } = await axiosClient.patch<IDataResponse>(`users/active/${userId}`)
    return data
  },

  skipTwoFa: async () => {
    const { data } = await axiosClient.patch<string>('users/skip-twofa')
    return data
  },
}
