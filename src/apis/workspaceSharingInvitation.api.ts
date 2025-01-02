import { instance as axiosClient } from '@/config'
import { IDataResponse, IWorkspaceSharingInvitationData } from '@/interfaces'

export const workspaceSharingInvitationApi = {
  create: async (workspaceSharingInvitationData: IWorkspaceSharingInvitationData) => {
    const { data } = await axiosClient.post<IDataResponse>(`workspaces-sharing/create`, workspaceSharingInvitationData)
    return data
  },

  confirm: async (inviteId: string) => {
    const { data } = await axiosClient.post('workspaces-sharing/confirm-invitation', { inviteId })
    return data
  },

  decline: async (inviteId: string) => {
    const response = await axiosClient.patch<IDataResponse>(`workspaces-sharing/decline-invitation/${inviteId}`)
    return response.data
  }
}
