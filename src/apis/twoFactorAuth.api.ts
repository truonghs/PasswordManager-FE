import { IDataResponse } from '@/interfaces'
import { instance as axiosClient } from '@/config'

export const twoFactorAuthApi = {
  disableTwoFa: async () => {
    const { data } = await axiosClient.patch<IDataResponse>('two-factor-auth/disable-twofa')
    return data
  }
}
