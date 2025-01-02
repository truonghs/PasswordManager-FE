import React from 'react'

import { icons } from '@/utils/icons'
import { formatLocaleTime } from '@/utils/helpers'
import { ILoginHistoryResponse } from '@/interfaces'

type LoginHistoryItemProps = {
  loginHistory: ILoginHistoryResponse
}

export const LoginHistoryItem: React.FC<LoginHistoryItemProps> = ({ loginHistory }) => {
  return (
    <li className='flex items-center border-t border-t-gray-200 bg-white p-4 cursor-pointer !mt-0 hover:bg-slate-50'>
      <div className='text-slate-800'>
        <p className='flex items-center text-sm gap-x-2'>
          <span className='font-medium text-2xl text-primary-800'>{icons.locationSharp}</span>
          {loginHistory.address}
        </p>
        <p className='flex items-center text-sm mt-2 gap-x-2'>
          <span className='font-medium text-2xl text-primary-800'>{icons.outlineDevicesOther}</span>
          {loginHistory.userAgent}
        </p>
        <p className='flex items-center text-sm mt-2 gap-x-2'>
          <span className='font-medium text-xl text-primary-800 ml-1'>{icons.clockFill}</span>
          {formatLocaleTime(loginHistory.loginTime)}
        </p>
      </div>
    </li>
  )
}
