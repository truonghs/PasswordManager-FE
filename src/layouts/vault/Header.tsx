import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Layout, Dropdown, MenuProps, Badge, Drawer } from 'antd'

import { icons } from '@/utils/icons'
import { PATH } from '@/utils/constants'
import { notificationKeys } from '@/keys'
import { Notification } from '@/pages/vault'
import { useAuth, useBoolean } from '@/hooks'
import { CustomBreadcrumb } from '@/components'
import anonAvatar from '@/assets/images/anonAvatar.png'

const { Header } = Layout

export function VaultHeader() {
  const { currentUser, mutateLogout } = useAuth()

  const { data: notifications } = useQuery(notificationKeys.list())

  const { value: showNotification, toggle: toggleShowNotification } = useBoolean(false)

  const {
    value: isClickedNotification,
    setTrue: setIsClickedNotification,
    setFalse: resetIsClickedNotification
  } = useBoolean(false)

  const handleLogout = () => {
    mutateLogout()
  }

  const handleClickNotification = () => {
    setIsClickedNotification()
    toggleShowNotification()
  }

  const userAction: MenuProps['items'] = [
    {
      key: 'vault',
      label: (
        <span className='group'>
          <Link to={PATH.VAULT} className='flex items-center'>
            <span className='text-slate-800 text-xl group-hover:text-primary-500 mr-2'>{icons.vaultLine}</span>
            <span className='text-lg text-slate-800 group-hover:text-primary-500'>Vault</span>
          </Link>
        </span>
      )
    },
    {
      key: 'logout',
      label: (
        <button className='flex items-center group' onClick={handleLogout}>
          <span className='text-slate-800 text-xl group-hover:text-primary-500 mr-2'>{icons.logout}</span>
          <span className='text-lg text-slate-800 group-hover:text-primary-500'>Logout</span>
        </button>
      )
    }
  ]

  useEffect(() => {
    resetIsClickedNotification()
  }, [notifications])

  return (
    <Header className='flex justify-between items-center bg-white xs:px-5 xs:py-10 md:py-6 md:px-10'>
      <CustomBreadcrumb />
      {currentUser && (
        <div className='flex items-center gap-8 xs:pt-0 md:pt-4'>
          <Drawer
            closable
            destroyOnClose
            title='Notifications'
            placement='right'
            open={showNotification}
            onClose={toggleShowNotification}
          >
            <Notification />
          </Drawer>
          <Badge
            count={
              isClickedNotification ? 0 : notifications?.filter((notification) => !notification.isRead)?.length || 0
            }
            offset={[-15, 15]}
          >
            <span
              className='inline-block text-2xl p-3  rounded-full cursor-pointer hover:bg-gray-100'
              onClick={handleClickNotification}
            >
              {icons.bell}
            </span>
          </Badge>
          <Dropdown menu={{ items: userAction }} trigger={['click']}>
            <span className='flex items-center cursor-pointer'>
              <span className='text-lg font-medium mr-2 capitalize'>Hi, {currentUser?.name}</span>
              <img src={currentUser?.avatar || anonAvatar} alt='user-avatar' className='w-10 h-10 rounded-md' />
            </span>
          </Dropdown>
        </div>
      )}
    </Header>
  )
}
