import { ReactElement } from 'react'

export interface FeatureProps {
  icon: ReactElement
  text: string
}
export interface IPricingPlanItem {
  title: string
  description: string
  price: string
  features: FeatureProps[]
  weights: number
}

export interface IVerifySubscriptionStatus {
  status: string
  message: string
}
