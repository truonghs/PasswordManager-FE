import { icons } from '@/utils/icons'
import { PATH } from './path'

export const SIDEBAR_VAULT_MENU = [
  {
    to: PATH.VAULT,
    iconInactive: icons.profileLine,
    iconActive: icons.profileFill,
    text: 'Profile'
  },
  {
    to: PATH.VAULT_ACCOUNTS,
    iconInactive: icons.lockLine,
    iconActive: icons.lockFill,
    text: 'Accounts'
  },
  {
    to: PATH.VAULT_CONTACT_INFOS,
    iconInactive: icons.contactLine,
    iconActive: icons.contactFill,
    text: 'Contacts'
  },
  {
    to: PATH.VAULT_WORKSPACES,
    iconInactive: icons.workspaceLine,
    iconActive: icons.workspaceFill,
    text: 'Workspaces'
  },
  {
    to: PATH.VAULT_LOGIN_HISTORY,
    iconInactive: icons.history,
    iconActive: icons.history,
    text: 'Login history'
  },
  {
    to: PATH.VAULT_SETTINGS,
    iconInactive: icons.settingLine,
    iconActive: icons.settingFill,
    text: 'Settings'
  },
]
