import { useState } from 'react'
import type { MenuProps } from 'antd'
import { scroller } from 'react-scroll'
import { useNavigate, Link } from 'react-router-dom'
import { Drawer, Dropdown, Layout, Menu } from 'antd'

import { icons } from '@/utils/icons'
import { CustomBtn } from '@/components'
import logo from '@/assets/images/secure.png'
import { useBoolean, useAuth } from '@/hooks'
import { PATH } from '@/utils/constants'
import anonAvatar from '@/assets/images/anonAvatar.png'

const { Header } = Layout

export const CustomHeader = () => {
  const navigate = useNavigate()

  const { currentUser, mutateLogout } = useAuth()

  const [selectedKey, setSelectedKey] = useState('home')

  const { value: showDrawer, toggle: setShowDrawer } = useBoolean(false)

  const handleLogout = () => {
    mutateLogout()
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

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
  }
  const handleScrollTo = (to: string) => () => {
    scroller.scrollTo(to, { smooth: true, duration: 500, offset: -80 })
    navigate('/')
  }
  const menuItems = [
    {
      key: 'home',
      label: 'Home',
      onClick: handleScrollTo('home')
    },
    {
      key: 'feature',
      label: 'Feature',
      onClick: handleScrollTo('feature')
    },
    {
      key: 'pricing',
      label: 'Pricing',
      onClick: handleScrollTo('pricing')
    },
    {
      key: 'contact',
      label: 'Contact',
      onClick: handleScrollTo('contact')
    }
  ]

  const handleOpenDrawer = () => {
    setShowDrawer()
  }

  const onClose = () => {
    setShowDrawer()
  }

  return (
    <Header className='bg-white shadow-md fixed w-full z-50 md:px-3 lg:px-5 flex justify-between items-center xs:px-1'>
      <div className={`flex items-center xs:pl-1 xs:w-[330px] md:w-40`}>
        <img src={logo} alt='logo' className='w-12' />
        <h2 className='text-2xl font-bold text-blue-800'>GoPass</h2>
      </div>
      <button className='xs:block md:hidden' onClick={handleOpenDrawer}>
        <span className='text-3xl text-primary-800'>{icons.menu}</span>
      </button>
      <Menu
        items={menuItems}
        onClick={onClick}
        mode='horizontal'
        selectedKeys={[selectedKey]}
        className='border-none flex-grow text-blue-500 justify-center text-lg font-medium xs:hidden md:flex'
      />

      <Drawer size='default' width={300} placement='right' closable={false} open={showDrawer} key='right'>
        <div className='flex items-center justify-between px-3 pt-3'>
          <img src={logo} alt='logo' className='w-12' />
          <button className='hover:bg-gray-300 cursor-pointer ' id='create-account-form-close' onClick={onClose}>
            <span className='text-3xl text-gray-700 font-semibold'>{icons.close}</span>
          </button>
        </div>
        {currentUser && (
          <div className='flex items-center justify-end cursor-pointer py-4 px-3 border-b border-b-gray-300'>
            <span className='text-lg font-medium mr-2 capitalize'>Hi, {currentUser?.name}</span>
            <span className='text-primary-500 text-3xl'>
              {currentUser?.avatar ? (
                <img src={currentUser?.avatar} alt='user-avatar' className='w-12 h-12 rounded-md' />
              ) : (
                <span>{icons.userCircle}</span>
              )}
            </span>
          </div>
        )}
        <ul>
          {menuItems.map((menuItem) => (
            <li
              key={menuItem.key}
              onClick={menuItem.onClick}
              className='text-xl text-slate-700 hover:text-primary-500 py-3 px-4 border-b border-gray-300 cursor-pointer '
            >
              {menuItem.label}
            </li>
          ))}
          {currentUser ? (
            <>
              <li className='text-xl text-slate-700 py-3 px-4 border-b border-gray-300 cursor-pointer group'>
                <span className='group'>
                  <Link to='/profile' className='flex items-center'>
                    <span className='text-xl text-slate-800 group-hover:text-primary-500'>Profile</span>
                  </Link>
                </span>
              </li>
              <li className='text-xl text-slate-700 py-3 px-4 border-b border-gray-300 cursor-pointer group'>
                <button className='flex items-center group' onClick={handleLogout}>
                  <span className='text-xl text-slate-800 group-hover:text-primary-500'>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <div className='flex flex-col px-2'>
              <CustomBtn title='Login' to={PATH.LOGIN} className='mr-2 h-11' />
              <CustomBtn title='Register' to={PATH.REGISTER} type='primary' className='h-11' />
            </div>
          )}
        </ul>
      </Drawer>
      {currentUser ? (
        <Dropdown menu={{ items: userAction }} trigger={['click']} className='xs:hidden md:flex'>
          <span className='flex items-center cursor-pointer'>
            <span className='text-lg font-medium mr-2 capitalize'>Hi, {currentUser?.name}</span>
            <img src={currentUser?.avatar || anonAvatar} alt='user-avatar' className='w-10 h-10 rounded-md' />
          </span>
        </Dropdown>
      ) : (
        <div className='md:flex xs:hidden'>
          <CustomBtn title='Login' to={PATH.LOGIN} className='mr-2 h-11' />
          <CustomBtn title='Register' to={PATH.REGISTER} type='primary' className='h-11' />
        </div>
      )}
    </Header>
  )
}
