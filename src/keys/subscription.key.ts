import { subscriptionApi } from '@/apis'
import { defineQuery } from '@/utils/helpers'

export const subscriptionKeys = {
  all: ['subscriptionPlans'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: () => defineQuery([...subscriptionKeys.lists()], () => subscriptionApi.getSubscriptionPlans()),
  verify: () => defineQuery([...subscriptionKeys.all, 'verify'], () => subscriptionApi.verifyPayment())
}
