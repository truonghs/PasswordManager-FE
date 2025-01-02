import { instance as axiosClient } from '@/config'
import { IDataResponse, ILoginHistoryData, ILoginHistoryResponse, IQueryLoginHistory } from '@/interfaces'

export const loginHistoryApi = {
  store: async (loginHistoryData: ILoginHistoryData) => {
    const { data } = await axiosClient.post<IDataResponse>('/login-history/store', loginHistoryData)
    return data
  },

  getLoginLocationByUser: async (query: IQueryLoginHistory) => {
    const { data } = await axiosClient.get<ILoginHistoryResponse[]>('/login-history', { params: query })
    return data
  },

  bulkSoftDelete: async (loginHistoryIds: string[]) => {
    return await axiosClient.delete('/login-history/bulk-soft-delete', { data: loginHistoryIds })
  }
}
