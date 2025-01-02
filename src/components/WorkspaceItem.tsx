import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown, MenuProps } from 'antd'

import { icons } from '@/utils/icons'
import { useAuth, useBoolean } from '@/hooks'
import { checkRoleAccess } from '@/utils/helpers'
import { PATH, STATUS_2FA } from '@/utils/constants'
import { IWorkspaceDataResponse } from '@/interfaces'

import { ModalVerifyHighPassword } from './ModalVerifyHighPassword'

type WorkspaceItemProps = {
  workspace: IWorkspaceDataResponse
  handleConfirmDelete: (workspceId: string) => void
  handleConfirmUpdate: (workspace: IWorkspaceDataResponse) => void
  handleOpenShare: (workspace: IWorkspaceDataResponse) => void
}

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  handleConfirmDelete,
  handleConfirmUpdate,
  handleOpenShare
}) => {
  const navigate = useNavigate()

  const { currentUser } = useAuth()

  const { showAction, showShare, showEdit, showDelete } = checkRoleAccess(currentUser?.id as string, workspace)

  const [actionKey, setActionKey] = useState<string>('')

  const { value: isOpenVerifyHighPassword, toggle: toggleOpenVerifyHighPassword } = useBoolean(false)

  const onActionWorkspaceClick = (key: string) => {
    if (currentUser && currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)) {
      setActionKey(key)
      toggleOpenVerifyHighPassword()
    } else {
      handleActionAccountByKey(key)
    }
  }

  const createActionWorkspace = (): MenuProps['items'] => {
    const items = [
      showShare && {
        key: 'share',
        label: (
          <span className='flex items-center text-slate-700 text-lg font-normal'>
            <span className='mr-2'>{icons.share}</span>
            Share
          </span>
        ),
        onClick: () => onActionWorkspaceClick('share')
      },
      showEdit && {
        key: 'edit',
        label: (
          <span className='flex items-center text-slate-700 text-lg font-normal'>
            <span className='mr-2'>{icons.edit}</span>
            Edit
          </span>
        ),
        onClick: () => onActionWorkspaceClick('edit')
      },
      showDelete && {
        key: 'delete',
        label: (
          <span className='flex items-center text-red-500 text-lg font-normal'>
            <span className='mr-2'>{icons.trash}</span>
            Delete
          </span>
        ),
        onClick: () => onActionWorkspaceClick('delete')
      }
    ]
    return items.filter(Boolean) as MenuProps['items']
  }

  const handleActionAccountByKey = (key: string) => {
    switch (key) {
      case 'edit': {
        handleConfirmUpdate(workspace)
        break
      }
      case 'delete': {
        handleConfirmDelete(workspace.id)
        break
      }
      case 'share': {
        handleOpenShare(workspace)
      }
    }
  }

  const handleNavigate = () => {
    const url = `${PATH.VAULT_WORKSPACES}/${workspace.id}`
    navigate(url)
  }

  const handleCancelVerifyHighPassowrd = () => {
    toggleOpenVerifyHighPassword()
    setActionKey('')
  }

  return (
    <li className='flex justify-between items-center bg-white rounded-md p-2 border border-gray-200 transition hover:cursor-pointer hover:bg-blue-50 group'>
      <div className='flex flex-1 items-center py-2 px-1' onClick={handleNavigate}>
        <span className='text-3xl mr-3 text-[#ffd100e8] p-1'>
          {workspace?.members?.length > 0 ? icons.folderShared : icons.folder}
        </span>
        <span className='text-slate-700 text-base font-medium group-hover:text-primary-500 group-hover:underline'>
          {workspace.name} ({workspace?.accounts?.length})
        </span>
      </div>
      {showAction && (
        <Dropdown menu={{ items: createActionWorkspace() }} placement='bottomRight' arrow trigger={['click']}>
          <Button className='outline-none border-none cursor-pointer mr-2 shadow-none bg-transparent'>
            <span className='text-primary-800 text-base'>{icons.moreAlt}</span>
          </Button>
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
