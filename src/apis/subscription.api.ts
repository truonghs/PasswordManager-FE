import { instance as axiosClient } from '@/config'

export const subscriptionApi = {
  getSubscriptionPlans: async () => {
    const { data } = await axiosClient.get('/subscriptions', {})
    return data
  },
  upgradeSubscription: async (name: string) => {
    const { data } = await axiosClient.post('/stripe/create-payment-url', { subscriptionPlanId: name })
    return data
  },
  verifyPayment: async () => {
    const { data } = await axiosClient.patch('/stripe/verify-payment')
    return data
  }
}
