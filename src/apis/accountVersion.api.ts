import { instance as axiosClient } from '@/config'
import { IAccountVersionDataResponse, IDataResponse } from '@/interfaces'

export const accountVersionApi = {
  getAccountVersions: async (accountId: string) => {
    const { data } = await axiosClient.get<IAccountVersionDataResponse[]>(`/account-version/${accountId}`)
    return data
  },

  deleteAccountVersion: async (versionId: string) => {
    const { data } = await axiosClient.delete<IDataResponse>(`/account-version/${versionId}`)
    return data
  }
}
