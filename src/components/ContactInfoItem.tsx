import React from 'react'
import { Button, Dropdown, MenuProps } from 'antd'

import { icons } from '@/utils/icons'
import { IContactInfoDataResponse } from '@/interfaces'

type ContactInfoItemProps = {
  contactInfo: IContactInfoDataResponse
  handleConfirmUpdateContactInfo: (contactInfo: IContactInfoDataResponse) => void
  handleConfirmDeleteContactInfo: (contactInfoId: string) => void
}

export const ContactInfoItem: React.FC<ContactInfoItemProps> = ({
  contactInfo,
  handleConfirmUpdateContactInfo,
  handleConfirmDeleteContactInfo
}) => {
  const createActionContactInfo = (data: IContactInfoDataResponse): MenuProps['items'] => [
    {
      key: 'edit',
      label: (
        <span className='flex items-center text-slate-700 text-base font-normal'>
          <span className='mr-2'>{icons.edit}</span>
          Edit
        </span>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onActionContactInfoClick('edit', data)
      }
    },
    {
      key: 'delete',
      label: (
        <span className='flex items-center text-red-500 text-base font-normal'>
          <span className='mr-2'>{icons.trash}</span>
          Delete
        </span>
      ),
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onActionContactInfoClick('delete', data)
      }
    }
  ]

  const onActionContactInfoClick = (key: string, contactInfo: IContactInfoDataResponse) => {
    switch (key) {
      case 'edit': {
        handleConfirmUpdateContactInfo(contactInfo)
        break
      }
      case 'delete': {
        handleConfirmDeleteContactInfo(contactInfo.id)
        break
      }
    }
  }

  return (
    <li className='flex justify-between items-center bg-white rounded-md p-2 border border-gray-200 transition group hover:bg-blue-50 hover:cursor-pointer'>
      <div className='flex flex-1 items-center p-2'>
        <span className='mr-3 cursor-pointer p-1 rounded-sm'>
          <span className='text-primary-800 text-3xl align-middle'>{icons.contactFill}</span>
        </span>
        <div className='relative text-left flex-1'>
          <div className='transition-all duration-500 text-base text-slate-800 text-left opacity-100 text-ellipsis text-nowrap overflow-hidden xs:w-[200px] md:w-[150px] lg:w-[180px]'>
            {contactInfo.title}
          </div>
          <div className='text-left text-base font-medium text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap text-nowrap xs:w-[200px] md:w-[150px] lg:w-[180px]'>
            {`${contactInfo.firstName} ${contactInfo.midName} ${contactInfo.lastName}`}
          </div>
        </div>
      </div>
      <Dropdown
        menu={{ items: createActionContactInfo(contactInfo) }}
        placement='bottomRight'
        arrow
        trigger={['click']}
      >
        <Button className='bg-none outline-none border-none cursor-pointer mr-2 shadow-none bg-transparent'>
          <span className='text-primary-800 text-base'>{icons.moreAlt}</span>
        </Button>
      </Dropdown>
    </li>
  )
}
