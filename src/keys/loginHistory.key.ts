import { loginHistoryApi } from '@/apis'
import { defineQuery } from '@/utils/helpers'
import { IQueryLoginHistory } from '@/interfaces'

export const loginHistoryKeys = {
  all: ['login-histories'] as const,
  lists: () => [...loginHistoryKeys.all, 'list'] as const,
  list: (query: IQueryLoginHistory) =>
    defineQuery([...loginHistoryKeys.lists(), query], () => loginHistoryApi.getLoginLocationByUser(query))
}
