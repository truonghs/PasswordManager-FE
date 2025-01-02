import { Layout, Menu } from 'antd'
import { NavLink } from 'react-router-dom'

import logo from '@/assets/images/secure.png'
import { SIDEBAR_SYSTEM_MENU } from '@/utils/constants'

const { Sider } = Layout

const siderStyle: React.CSSProperties = {
  backgroundColor: '#fafafa'
}

export function Sidebar() {
  const menuItems = SIDEBAR_SYSTEM_MENU.map((item) => ({
    key: item.key,
    label: (
      <NavLink to={item.to} className={`flex items-center w-full`}>
        <span className='text-2xl text-primary-500 p-2 rounded-md mr-2'>{item.icon}</span>
        <span className='text-slate-600 font-normal text-lg'>{item.text}</span>
      </NavLink>
    ),
    style: { marginBottom: '15px' }
  }))

  return (
    <Sider style={siderStyle} className='bg-system-primary'>
      <div className='flex items-center m-4'>
        <img src={logo} alt='logo' className='w-12' />
        <h2 className='text-2xl font-bold text-blue-600'>GoPass</h2>
      </div>
      <Menu className='bg-system-primary' mode='vertical' items={menuItems} defaultSelectedKeys={['1']} />
    </Sider>
  )
}
