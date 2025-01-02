import { dashboardApi } from '@/apis'
import { QuantityType } from '@/interfaces'
import { defineQuery } from '@/utils/helpers'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  statistics: () => [...dashboardKeys.all, 'statistics'] as const,
  accountsOfUsers: () =>
    defineQuery([...dashboardKeys.statistics(), 'accountsOfUsers'], dashboardApi.getStatisticAccountsOfUsers),
  usersRegistered: () =>
    defineQuery([...dashboardKeys.statistics(), 'usersRegistered'], dashboardApi.getStatisticUsersRegistered),
  quantities: () => [...dashboardKeys.statistics(), 'quantities'],
  quantity: (type: QuantityType) =>
    defineQuery([...dashboardKeys.quantities(), type], () => dashboardApi.getStatisticQuantity(type))
}
