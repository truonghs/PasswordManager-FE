import { Result } from 'antd'
import { createBrowserRouter } from 'react-router-dom'

import {
  Register,
  Login,
  ConfirmEmail,
  ForgotPassword,
  Profile,
  Home,
  TwoFARecommendation,
  LoginHistoryMap,
  ConfirmAccountInvitation,
  ConfirmWorkspaceInvitation,
  ListAccounts,
  ListContactInfos,
  ListWorkspaces,
  Settings,
  WorkspaceDetail,
  VerifyPayment
} from '@/pages'
import { PATH } from '@/utils/constants'
import { Dashboard, ManageUsers } from '@/pages/admin'
import { AuthLayout, DefaultLayout, SystemLayout, VaultLayout } from '@/layouts'

import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <DefaultLayout />,
    children: [
      {
        path: PATH.HOME,
        element: <Home />
      },
      {
        path: PATH.TWO_FA_SUGGESTION,
        element: (
          <ProtectedRoute role='user'>
            <TwoFARecommendation />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: PATH.HOME,
    element: <AuthLayout />,
    children: [
      {
        path: PATH.LOGIN,
        element: <Login />
      },
      {
        path: PATH.REGISTER,
        element: <Register />
      },
      {
        path: PATH.CONFIRM_EMAIL,
        element: <ConfirmEmail />
      },
      {
        path: PATH.FORGOT_PASSWORD,
        element: <ForgotPassword />
      },
      {
        path: PATH.ADMIN_LOGIN,
        element: <Login />
      }
    ]
  },
  {
    path: PATH.ADMIN,
    element: (
      <ProtectedRoute role='admin'>
        <SystemLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PATH.ADMIN,
        element: (
          <ProtectedRoute role='admin'>
            <Dashboard />
          </ProtectedRoute>
        ),
        handle: { breadcrumb: 'Dashboard' }
      },
      {
        path: PATH.ADMIN_USERS,
        element: (
          <ProtectedRoute role='admin'>
            <ManageUsers />
          </ProtectedRoute>
        ),
        handle: { breadcrumb: 'Manage Users' }
      },
      {
        path: PATH.ADMIN_PROFILE,
        element: (
          <ProtectedRoute role='admin'>
            <Profile />
          </ProtectedRoute>
        ),
        handle: { breadcrumb: 'Profile' }
      }
    ]
  },
  {
    path: PATH.VAULT,
    element: (
      <ProtectedRoute role='user'>
        <VaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PATH.VAULT,
        element: <Profile />
      },
      {
        path: PATH.VAULT_ACCOUNTS,
        element: <ListAccounts />
      },
      {
        path: PATH.VAULT_CONTACT_INFOS,
        element: <ListContactInfos />
      },
      {
        path: PATH.VAULT_WORKSPACES,
        element: <ListWorkspaces />
      },
      {
        path: PATH.VAULT_WORKSPACE_DETAIL,
        element: <WorkspaceDetail />
      },
      {
        path: PATH.VAULT_SETTINGS,
        element: <Settings />
      }
    ]
  },
  {
    path: PATH.VERIFY_PAYMENT,
    element: <VerifyPayment />
  },
  {
    path: PATH.CONFIRM_ACCOUNT_INVITATION,
    element: <ConfirmAccountInvitation />
  },
  {
    path: PATH.CONFIRM_WORKSPACE_INVITATION,
    element: <ConfirmWorkspaceInvitation />
  },
  {
    path: PATH.VAULT_LOGIN_HISTORY,
    element: (
      <ProtectedRoute role='user'>
        <LoginHistoryMap />
      </ProtectedRoute>
    )
  },
  {
    path: PATH.NOT_FOUND,
    element: <Result status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />
  }
])
