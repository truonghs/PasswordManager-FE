import { instance as axiosClient } from '@/config'
import { IStatisticAccountOfUser, IStatisticUsersRegistered, QuantityType } from '@/interfaces'

export const dashboardApi = {
  getStatisticUsersRegistered: async () => {
    const { data } = await axiosClient.get<IStatisticUsersRegistered>('/dashboard/user-registrations')
    return data
  },

  getStatisticAccountsOfUsers: async () => {
    const { data } = await axiosClient.get<IStatisticAccountOfUser[]>('/dashboard/accounts-of-users')
    return data
  },

  getStatisticQuantity: async (type: QuantityType) => {
    const { data } = await axiosClient.get<number>(`/dashboard/quantity-${type}`)
    return data
  }
}
