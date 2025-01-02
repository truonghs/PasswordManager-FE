import { icons } from '@/utils/icons'

export const SIDEBAR_SYSTEM_MENU = [
  {
    key: '1',
    to: '/admin',
    icon: icons.dashboard,
    text: 'Dashboard'
  },
  {
    key: '2',
    to: '/admin/users',
    icon: icons.users,
    text: 'Users'
  },
  {
    key: '3',
    to: '/admin/profile',
    icon: icons.profile,
    text: 'Profile'
  }
]
