import { Element } from 'react-scroll'

import { CardPricingPlan } from '@/components'
import { PRICING_PLAN_ITEMS } from '@/utils/constants'
import { useEffect } from 'react'

export const Pricing = () => {
  useEffect(() => {})
  return (
    <Element name='pricing'>
      <section className='bg-[#e5f7f9]'>
        <div className='py-8 px-4 mx-auto max-w-screen-2xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-xl text-center mb-8 lg:mb-12'>
            <h2 className='mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'>
              Designed for business teams like yours
            </h2>
            <p className='mb-5 font-normal text-gray-700 sm:text-xl'>
              Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value
              and drive economic growth.
            </p>
          </div>
          <ul className='space-y-8 lg:grid lg:grid-cols-4 sm:gap-6 xl:gap-2 lg:space-y-0'>
            {PRICING_PLAN_ITEMS.map((pricingPlanItem) => (
              <CardPricingPlan key={pricingPlanItem.title} pricingPlanItem={pricingPlanItem} />
            ))}
          </ul>
        </div>
      </section>
    </Element>
  )
}
