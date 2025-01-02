import type { Meta, StoryObj } from '@storybook/react'

import { CardPricingPlan } from '@/components'

import { IPricingPlanItem } from '@/interfaces'

import { icons } from '@/utils/icons'

const meta: Meta<typeof CardPricingPlan> = {
  title: 'Components/CardPricingPlan',
  component: CardPricingPlan,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

const pricingPlanItem: IPricingPlanItem = {
  title: 'Basic Plan',
  description: 'This is a basic plan for individuals.',
  price: '$10',
  FEATURES: [
    { text: 'Feature 1', icon: icons.checkmark },
    { text: 'Feature 2', icon: icons.checkmark },
    { text: 'Feature 3', icon: icons.checkmark }
  ]
}

export const Default: Story = {
  args: {
    pricingPlanItem
  }
}

export const Premium: Story = {
  args: {
    pricingPlanItem: {
      ...pricingPlanItem,
      title: 'Premium Plan',
      description: 'This is a premium plan for businesses.',
      price: '$30',
      FEATURES: [
        { text: 'Feature 1', icon: icons.checkmark },
        { text: 'Feature 2', icon: icons.checkmark },
        { text: 'Feature 3', icon: icons.checkmark },
        { text: 'Feature 4', icon: icons.checkmark }
      ]
    }
  }
}
