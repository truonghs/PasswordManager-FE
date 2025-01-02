import { userApi } from '@/apis'
import { defineQuery } from '@/utils/helpers'
import { IPaginationParams } from '@/interfaces'

export const userKeys = {
  all: ['users'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: () => defineQuery([...userKeys.profiles()], userApi.getCurrentUser),
  lists: () => [...userKeys.all, 'list'] as const,
  list: (query: IPaginationParams) => defineQuery([...userKeys.lists(), query], () => userApi.getUsers(query))
}
