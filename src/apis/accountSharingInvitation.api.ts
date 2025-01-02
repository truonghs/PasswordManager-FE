import { instance as axiosClient } from '@/config'
import { IAccountSharingInvitationData, IDataResponse } from '@/interfaces'

export const accountSharingInvitationApi = {
  create: async (accountSharingInvitationData: IAccountSharingInvitationData) => {
    const { data } = await axiosClient.post<IDataResponse>(`accounts-sharing/create`, accountSharingInvitationData)
    return data
  },

  confirm: async (inviteId: string) => {
    const response = await axiosClient.post<IDataResponse>('accounts-sharing/confirm-invitation', { inviteId })
    return response.data
  },

  decline: async (inviteId: string) => {
    const response = await axiosClient.patch<IDataResponse>(`accounts-sharing/decline-invitation/${inviteId}`)
    return response.data
  }
}
