import { Layout, Dropdown, MenuProps } from 'antd'

import { useAuth } from '@/hooks'
import { icons } from '@/utils/icons'
import { CustomBreadcrumb } from '@/components'

const { Header } = Layout

export function SystemHeader() {
  const { currentUser, mutateLogout } = useAuth()

  const handleLogout = () => {
    mutateLogout()
  }

  const userAction: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <button className='flex items-center text-slate-700'>
          <span className='text-slate-700 text-xl mr-2'>{icons.profile}</span>
          <span className='text-lg'>Profile</span>
        </button>
      )
    },
    {
      key: 'logout',
      label: (
        <button className='flex items-center text-slate-700' onClick={handleLogout}>
          <span className='text-slate-700 text-xl mr-2'>{icons.logout}</span>
          <span className='text-lg'>Logout</span>
        </button>
      )
    }
  ]

  return (
    <Header className='flex justify-between items-center bg-system-primary'>
      <CustomBreadcrumb />
      <div className='flex items-center'>
        {currentUser && (
          <Dropdown menu={{ items: userAction }} trigger={['click']}>
            <span className='flex items-center cursor-pointer'>
              <span className='text-lg mr-2'>{currentUser?.name}</span>
              <span className='text-primary-500 text-3xl'>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt='user-avatar' className='w-12 h-12 rounded-md' />
                ) : (
                  <span>{icons.userCircle}</span>
                )}
              </span>
            </span>
          </Dropdown>
        )}
      </div>
    </Header>
  )
}
