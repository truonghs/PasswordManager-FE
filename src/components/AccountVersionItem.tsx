import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { Dropdown, message, Typography } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountKeys } from '@/keys'
import { icons } from '@/utils/icons'
import { useAuth, useBoolean } from '@/hooks'
import { STATUS_2FA } from '@/utils/constants'
import { decryptPassword } from '@/utils/helpers'
import { accountApi, accountVersionApi } from '@/apis'
import { IAccountVersionDataResponse, IDataResponse, IErrorResponse } from '@/interfaces'

import { ModalVerifyHighPassword } from './ModalVerifyHighPassword'

type AccountVersionItemProps = {
  accountVersion: IAccountVersionDataResponse
  version?: number
  showAction?: boolean
}

export const AccountVersionItem: React.FC<AccountVersionItemProps> = ({
  accountVersion,
  version,
  showAction = true
}) => {
  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const [actionKey, setActionKey] = useState<string>('')

  const { value: isShowPassword, toggle: toggleShowPassword } = useBoolean(false)

  const { value: isOpenVerifyHighPassword, toggle: toggleOpenVerifyHighPassword } = useBoolean(false)

  const actionAccountVersion = [
    {
      key: 'restore',
      label: (
        <span className='flex gap-2 items-center text-slate-700 text-lg font-normal'>
          <span>{icons.restore}</span>
          Restore
        </span>
      ),
      onClick: () => handleActionAccountClick('restore')
    },
    {
      key: 'password',
      label: (
        <span className='flex gap-2 items-center text-slate-700 text-lg font-normal'>
          <span>{isShowPassword ? icons.eyeOff : icons.eye}</span>
          {isShowPassword ? 'Hide passowrd' : 'Show password'}
        </span>
      ),
      onClick: () => handleActionAccountClick('password')
    },
    {
      key: 'delete',
      label: (
        <span className='flex gap-2 items-center text-red-500 text-lg font-normal'>
          <span>{icons.trash}</span>
          Delete
        </span>
      ),
      onClick: () => handleActionAccountClick('delete')
    }
  ]

  const handleActionAccountClick = (key: string) => {
    if (currentUser && currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)) {
      setActionKey(key)
      toggleOpenVerifyHighPassword()
    } else {
      handleActionAccountByKey(key)
    }
  }

  const handleCancelVerifyHighPassowrd = () => {
    toggleOpenVerifyHighPassword()
    setActionKey('')
  }

  const { mutate: mutateRollbackAccountVersion } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: accountApi.rollback,
    onSuccess: () => {
      message.success('Rollback account successfully')
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
    onError: (error) => {
      console.log('error', error)
    }
  })

  const { mutate: mutateDeleteAccountVersion } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: accountVersionApi.deleteAccountVersion,
    onSuccess: () => {
      message.success('Delete account version successfully')
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
    onError: (error) => {
      console.log('error', error)
    }
  })

  const handleActionAccountByKey = (key: string) => {
    switch (key) {
      case 'restore': {
        mutateRollbackAccountVersion(accountVersion.id)
        break
      }
      case 'password': {
        toggleShowPassword()
        break
      }
      case 'delete': {
        mutateDeleteAccountVersion(accountVersion.id)
        break
      }
    }
  }

  return (
    <li key={accountVersion.id} className='flex justify-between items-center py-4 border-t border-t-slate-200'>
      <div className='pr-4'>
        <span className='rounded-sm text-primary-800 text-3xl'>{icons.lockFill}</span>
      </div>

      <div className='flex-1'>
        <div className='flex flex-col'>
          <Typography.Text className='font-medium text-base px-2 text-slate-950'>
            {version ? `Version: ${version}` : 'Current version'} {accountVersion.username}
          </Typography.Text>

          <Typography.Text className='font-medium text-base px-2 text-slate-950'>
            Password: {isShowPassword ? decryptPassword(accountVersion.password) : '********'}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text className='font-semibold px-2'>
            {dayjs(accountVersion.updatedAt || accountVersion.createdAt).format('MMM D, h:mm A')}
          </Typography.Text>
          <Typography.Text className='text-base'>
            {version ? (accountVersion as IAccountVersionDataResponse)?.actor?.name : accountVersion?.owner?.name}
          </Typography.Text>
        </div>
      </div>

      {showAction && (
        <Dropdown menu={{ items: actionAccountVersion }} placement='bottomRight' arrow trigger={['click']}>
          <div className='p-3 rounded-full cursor-pointer hover:bg-gray-100'>
            <span className='text-xl'>{icons.moreFi}</span>
          </div>
        </Dropdown>
      )}
    
      <ModalVerifyHighPassword
        isOpen={isOpenVerifyHighPassword}
        handleCancel={handleCancelVerifyHighPassowrd}
        handleVerifySuccess={() => handleActionAccountByKey(actionKey)}
      />
    </li>
  )
}
