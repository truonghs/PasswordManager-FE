import { Button, message, Typography } from 'antd'

import { FeatureProps, IPricingPlanItem } from '@/interfaces'
import { icons } from '@/utils/icons'
import { useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '@/apis'
import { subscriptionKeys } from '@/keys/subscription.key'

const { Title, Text } = Typography

type PricingPlanProps = {
  pricingPlanItem: IPricingPlanItem
}

export const CardPricingPlan: React.FC<PricingPlanProps> = ({ pricingPlanItem }) => {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  const { mutate: mutateUpgradeSubscription, isPending: isPendingUpgradeSubscription } = useMutation({
    mutationFn: subscriptionApi.upgradeSubscription,
    onSuccess: (data) => {
      window.location.href = data
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists(), refetchType: 'all' })
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const navigate = useNavigate()
  const handleUpgradeSubscription = () => {
    if (currentUser) {
      mutateUpgradeSubscription(pricingPlanItem.title)
    } else {
      navigate('/login')
    }
  }
  return (
    <li
      className={`flex flex-col h-[680px] p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow-md dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white justify-between ${(currentUser?.subscriptionDetail.weights && pricingPlanItem.weights === currentUser?.subscriptionDetail.weights) || (!currentUser && pricingPlanItem.title === 'FREE') ? 'border-2 border-yellow-500' : 'border border-yellow-200'}`}
    >
      <div>
        <Title level={3} className='mb-4 text-2xl font-semibold'>
          {pricingPlanItem.title}
        </Title>
        <span className='font-light text-gray-500 sm:text-lg dark:text-gray-400'>{pricingPlanItem.description}</span>
        <div className='flex justify-center items-baseline my-8'>
          <Text className='mr-2 text-5xl font-extrabold'>{pricingPlanItem.price}</Text>
        </div>

        <ul role='list' className='mb-8 space-y-4 text-left'>
          {pricingPlanItem.features?.map((feature: FeatureProps) => (
            <li className='flex items-center space-x-3' key={feature.text}>
              <span className={`text-lg ${feature.icon === icons.checkmark ? 'text-green-500' : 'text-red-500'}`}>
                {feature.icon}
              </span>
              <span className='text-base'>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      {((currentUser?.subscriptionDetail.weights &&
        pricingPlanItem.weights > currentUser?.subscriptionDetail.weights) ||
        (!currentUser && pricingPlanItem.title !== 'FREE')) && (
        <Button
          size='large'
          className='bg-yellow-500 text-white hover:!border-yellow-500 hover:!text-yellow-500 font-semibold text-xl'
          onClick={handleUpgradeSubscription}
          loading={isPendingUpgradeSubscription}
        >
          Subscribe
        </Button>
      )}
    </li>
  )
}
