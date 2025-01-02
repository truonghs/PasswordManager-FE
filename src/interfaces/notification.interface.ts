import { RoleAccess } from "@/utils/constants"

export interface INotificationDataResponse {
  id: string
  receipient: string
  activityType: string
  isRead: boolean
  createdAt: string
  sender: {
    name: string
    avatar: string
  }
  notificationDetail: {
    accountSharingInvitation?: {
      id: string
      status: string
      roleAccess: RoleAccess
      account: {
        username: string
      }
    }
    workspaceSharingInvitation?: {
      id: string
      status: string
      roleAccess: RoleAccess
      workspace: {
        name: string
      }
    }
    memberActivityLog?: {
      account: {
        id: string
        username: string
        domain: string
      }
      workspace?: {
        name: string
      }
    }
  }
}
