import React, { useState } from 'react'
import { Button, Dropdown, MenuProps, message } from 'antd'

import { icons } from '@/utils/icons'
import { useAuth, useBoolean } from '@/hooks'
import { STATUS_2FA } from '@/utils/constants'
import { IAccountDataResponse } from '@/interfaces'
import { checkRoleAccess, decryptPassword } from '@/utils/helpers'

import { ModalVerifyHighPassword } from './ModalVerifyHighPassword'
import { ModalAccountVersion } from './ModalAccountVersion'

type AccountItemProps = {
  account: IAccountDataResponse
  handleConfirmDeleteAccount: (accountId: string) => void
  handleConfirmUpdateAccount: (account: IAccountDataResponse) => void
  handleOpenShareAccount: (account: IAccountDataResponse) => void
}

export const AccountItem: React.FC<AccountItemProps> = ({
  account,
  handleConfirmDeleteAccount,
  handleConfirmUpdateAccount,
  handleOpenShareAccount
}) => {
  const { currentUser } = useAuth()

  const { showAction, showShare, showEdit, showDelete } = checkRoleAccess(currentUser?.id as string, account)

  const [actionKey, setActionKey] = useState<string>('')

  const { value: isOpenVerifyHighPassword, toggle: toggleOpenVerifyHighPassword } = useBoolean(false)

  const { value: isOpenAccountVersion, toggle: toggleOpenAccountVersion } = useBoolean(false)

  const onActionAccountClick = (key: string) => {
    if (currentUser && currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)) {
      setActionKey(key)
      toggleOpenVerifyHighPassword()
    } else {
      handleActionAccountByKey(key)
    }
  }

  const createMenuItems: MenuProps['items'] = [
    {
      key: 'username',
      label: <span className='text-sm'>Copy Username</span>,
      onClick: () => onActionAccountClick('username')
    },
    {
      key: 'password',
      label: <span className='text-sm'>Copy Password</span>,
      onClick: () => onActionAccountClick('password')
    }
  ]

  const createActionAccount = (): MenuProps['items'] => {
    const items = [
      showShare && {
        key: 'share',
        label: (
          <span className='flex items-center text-slate-700 text-base font-normal'>
            <span className='mr-2'>{icons.share}</span>
            Share
          </span>
        ),
        onClick: () => onActionAccountClick('share')
      },
      showEdit && {
        key: 'edit',
        label: (
          <span className='flex items-center text-slate-700 text-base font-normal'>
            <span className='mr-2'>{icons.edit}</span>
            Edit
          </span>
        ),
        onClick: () => onActionAccountClick('edit')
      },
      showDelete && {
        key: 'versions',
        label: (
          <span className='flex items-center text-slate-700 text-base font-normal w-[150px]'>
            <span className='mr-2'>{icons.version}</span>
            Versions
          </span>
        ),
        onClick: () => onActionAccountClick('versions')
      },
      showDelete && {
        key: 'delete',
        label: (
          <span className='flex items-center text-red-500 text-base font-normal'>
            <span className='mr-2'>{icons.trash}</span>
            Delete
          </span>
        ),
        onClick: () => onActionAccountClick('delete')
      }
    ]

    return items.filter(Boolean) as MenuProps['items']
  }

  const handleActionAccountByKey = (key: string) => {
    switch (key) {
      case 'edit': {
        handleConfirmUpdateAccount(account)
        break
      }
      case 'delete': {
        handleConfirmDeleteAccount(account.id)
        break
      }
      case 'share': {
        handleOpenShareAccount(account)
        break
      }
      case 'versions': {
        toggleOpenAccountVersion()
        break
      }
      case 'activity': {
        handleOpenShareAccount(account)
        break
      }
      case 'username': {
        message.success('Copy username to clipboard')
        navigator.clipboard.writeText(account.username)
        break
      }
      case 'password': {
        message.success('Copy password to clipboard')
        navigator.clipboard.writeText(decryptPassword(account.password))
        break
      }
    }
  }

  const handleOpenSite = (siteUrl: string) => () => {
    window.open(`https://${siteUrl}`)
  }

  const handleCancelVerifyHighPassowrd = () => {
    toggleOpenVerifyHighPassword()
    setActionKey('')
  }

  const handleCancelAccountVersion = () => {
    toggleOpenAccountVersion()
  }
  return (
    <li className='flex flex-wrap justify-between items-center bg-white rounded-md pr-2 py-2 border border-gray-200 transition group hover:bg-blue-50 hover:cursor-pointer'>
      <div className='flex flex-1 items-center p-2 max-w-14' onClick={handleOpenSite(account.domain)}>
        <span className='mr-3 cursor-pointer p-1 rounded-sm text-primary-800 text-3xl align-middle'>
          {account.members.length > 0 ? icons.lockShared : icons.lockFill}
        </span>
        <div className='relative text-left'>
          <span className='inline-block transition-all text-sm duration-300 text-slate-800 text-left opacity-100 text-ellipsis text-nowrap xs:w-[120px] md:w-[135px] lg:w-[180px] overflow-hidden group-hover:opacity-0 group-hover:transform group-hover:translate-y-2'>
            {account.domain}
          </span>
          <span className='absolute top-0 left-0 transition-all duration-300 text-sm font-bold opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-primary-500'>
            Launch
          </span>
          <div className='text-left text-base font-medium text-slate-800 text-ellipsis text-nowrap xs:w-[120px] md:w-[135px] lg:w-[180px] overflow-hidden'>
            {account.username}
          </div>
        </div>
      </div>
      <div className='flex pl-2 transition'>
        <Dropdown menu={{ items: createMenuItems }} placement='bottomRight' arrow trigger={['click']}>
          <Button className='outline-none border-none cursor-pointer shadow-none bg-transparent'>
            <span className='text-primary-800 text-base'>{icons.copy}</span>
          </Button>
        </Dropdown>
        {showAction && (
          <Dropdown menu={{ items: createActionAccount() }} placement='bottomRight' arrow trigger={['click']}>
            <Button className='outline-none border-none cursor-pointer shadow-none bg-transparent'>
              <span className='text-primary-800 text-base'>{icons.moreAlt}</span>
            </Button>
          </Dropdown>
        )}
      </div>
      <ModalVerifyHighPassword
        isOpen={isOpenVerifyHighPassword}
        handleCancel={handleCancelVerifyHighPassowrd}
        handleVerifySuccess={() => handleActionAccountByKey(actionKey)}
      />
      <ModalAccountVersion open={isOpenAccountVersion} account={account} handleCancel={handleCancelAccountVersion} />
    </li>
  )
}
