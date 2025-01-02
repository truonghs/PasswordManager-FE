import { Layout, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { useBoolean } from '@/hooks'
import { icons } from '@/utils/icons'
import logo from '@/assets/images/secure.png'
import { LOCAL_STORAGE_KEYS, PATH, SIDEBAR_VAULT_MENU } from '@/utils/constants'

const { Sider } = Layout

const siderStyle: React.CSSProperties = {
  backgroundColor: '#fff'
}

export function Sidebar() {
  const location = useLocation()

  const [pathName, setPathName] = useState(location.pathname)

  const { value: drawerVisible, toggle: toggleDrawerVisible, setFalse: hiddenDrawer } = useBoolean(false)

  const handleSaveRoute = (pathName: string) => () => {
    hiddenDrawer()
    if (pathName !== PATH.VAULT_LOGIN_HISTORY) localStorage.setItem(LOCAL_STORAGE_KEYS.pathName, pathName)
  }

  useEffect(() => {
    setPathName(location.pathname)
  }, [location])

  const sidebarContent = (
    <>
      <Link to={PATH.HOME} className='p-0 xs:px-6'>
        <div className='flex items-center md:py-0 xs:justify-center lg:justify-start xs:py-4 lg:px-10 gap-x-2'>
          <img src={logo} alt='logo' className='w-10' />
          <h2 className='text-[22px] font-semibold text-slate-800 md:hidden lg:inline-block'>GoPass</h2>
        </div>
      </Link>
      <ul className='flex flex-col gap-4 w-full'>
        {SIDEBAR_VAULT_MENU.map((sideBarItem) => {
          const isActive = pathName === sideBarItem.to || pathName.split('/')[2] === sideBarItem.to.split('/')[2]
          return (
            <li key={sideBarItem.to} className='xs:px-4 lg:px-6'>
              <NavLink
                to={sideBarItem.to}
                className={`flex items-center lg:justify-start font-normal xs:p-3 md:justify-center lg:py-3 rounded-lg hover:text-current ${
                  isActive
                    ? 'bg-primary-800 !text-white !font-medium hover:text-white'
                    : 'hover:bg-slate-100 text-[#001d35]'
                }`}
                onClick={handleSaveRoute(sideBarItem.to)}
              >
                <span className='text-2xl xs:px-2 lg:px-4'>
                  {isActive ? sideBarItem.iconActive : sideBarItem.iconInactive}
                </span>
                <span className='text-base md:hidden lg:inline-block'>{sideBarItem.text}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </>
  )

  return (
    <nav className='h-full'>
      <aside className='flex items-center xs:block md:hidden'>
        <button className='fixed top-4 left-4 z-50 mt-2' onClick={toggleDrawerVisible}>
          <span className='text-3xl text-primary-800'>{icons.menu}</span>
        </button>
        <Drawer title='Navigtaion' width={250} placement='left' onClose={toggleDrawerVisible} open={drawerVisible}>
          <div className='flex flex-col items-start'>{sidebarContent}</div>
        </Drawer>
      </aside>
      <Sider
        style={siderStyle}
        className='!bg-white xs:!max-w-[80px] xs:!min-w-[80px] lg:!min-w-[265px] border-r border-r-gray-200 xs:hidden md:block h-full'
      >
        {sidebarContent}
      </Sider>
    </nav>
  )
}
