import { CardPricingPlan } from '@/components/CardPricingPlan'
import { PRICING_PLAN_ITEMS } from '@/utils/constants'
import { Modal } from 'antd'
import React from 'react'

type ModalProps = {
  modalControl: any
}

export const UpgradeSubscription: React.FC<ModalProps> = ({ modalControl }) => {
  return (
    <Modal
      open={modalControl.value}
      onCancel={() => modalControl.setFalse()}
      footer={[]}
      height={100}
      width={1700}
      styles={{
        content: {
          backgroundColor: '#e2e8f0'
        }
      }}
    >
      <div className='flex gap-2 flex-wrap justify-between p-6 text-sl'>
        {PRICING_PLAN_ITEMS.map((pricingPlanItem) => (
          <div className='max-w-96 h-max'>
            <CardPricingPlan key={pricingPlanItem.title} pricingPlanItem={pricingPlanItem} />
          </div>
        ))}
      </div>
    </Modal>
  )
}
