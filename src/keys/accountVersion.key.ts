import { accountVersionApi } from '@/apis'
import { defineQuery } from '@/utils/helpers'

export const accountVersionKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountVersionKeys.all, 'list'] as const,
  list: (accountId: string) =>
    defineQuery([...accountVersionKeys.lists(), accountId], () => accountVersionApi.getAccountVersions(accountId))
}
