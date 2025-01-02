import { instance as axiosClient } from '@/config'
import { ICreateHighLevelPassword, IDataResponse, IVerifyHighLevelPassword } from '@/interfaces'

export const highLevelPasswordApi = {
  create: async (createHighLevelPasswordData: ICreateHighLevelPassword) => {
    const { data } = await axiosClient.post<IDataResponse>('high-level-passwords', createHighLevelPasswordData)
    return data
  },

  toggle: async () => {
    const { data } = await axiosClient.patch<IDataResponse>('high-level-passwords')
    return data
  },

  verify: async (verifyHighLevelPasswordData: IVerifyHighLevelPassword) => {
    const { data } = await axiosClient.post<IDataResponse>('high-level-passwords/verify', verifyHighLevelPasswordData)
    return data
  }
}
