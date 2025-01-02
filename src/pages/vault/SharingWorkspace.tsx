import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Modal, message, notification } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks'
import { workspaceKeys } from '@/keys'
import { ROLE_ACCESS, VALIDATION_REGEX } from '@/utils/constants'
import { CardSharingMember, CustomBtn, CustomInput } from '@/components'
import { workspaceSharingInvitationApi, workspaceSharingMemberApi } from '@/apis'
import { IWorkspaceDataResponse, IErrorResponse, IWorkspaceSharingMemberInfo } from '@/interfaces'

type SharingWorkspaceProps = {
  currentWorkspace?: IWorkspaceDataResponse
  isShowShare: boolean
  toggleShowShare: () => void
  handleCancel?: () => void
}

export const SharingWorkspace: React.FC<SharingWorkspaceProps> = ({
  currentWorkspace,
  isShowShare = false,
  toggleShowShare,
  handleCancel
}) => {
  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const [emailMember, setEmailMember] = useState<string>('')

  const [sharingMembers, setSharingMembers] = useState<IWorkspaceSharingMemberInfo[]>([])

  const [api, contextHolder] = notification.useNotification({ maxCount: 3 })

  const handleOpenNotification = (description: string) => {
    api.warning({
      description,
      message: 'Warning',
      placement: 'topRight'
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (!inputValue.startsWith(' ')) {
      setEmailMember(inputValue)
    }
  }

  const handleAddMember = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      const trimmedEmail = emailMember.trim()

      if (!trimmedEmail || !VALIDATION_REGEX.EMAIL_REGEX.test(trimmedEmail)) {
        handleOpenNotification('Please enter a valid email')
        return
      }
      const isEmailExists = sharingMembers.some((member) => member.email === trimmedEmail)
      const isOwnerEmail = trimmedEmail === currentWorkspace?.owner.email

      if (isEmailExists || isOwnerEmail) {
        handleOpenNotification('This email was existed')
        return
      }
      const newSharingMember = {
        email: trimmedEmail,
        roleAccess: ROLE_ACCESS.READ
      }
      setSharingMembers((prev) => [...prev, newSharingMember])
      setEmailMember('')
    }
  }

  const handleChangeMemberRoleAccess = (member: IWorkspaceSharingMemberInfo) => {
    const updateSharingMembers = sharingMembers.map((currentMember) => {
      if (currentMember.email === member.email) {
        return {
          ...currentMember,
          roleAccess: member.roleAccess
        }
      }
      return currentMember
    })

    setSharingMembers(updateSharingMembers)
  }

  const handleRemoveMember = (member: IWorkspaceSharingMemberInfo) => {
    const updateSharingMembers = sharingMembers.filter((currentMember) => currentMember.email !== member.email)
    setSharingMembers(updateSharingMembers)
  }

  const { mutate: mutateSharingWorkspace, isPending: isPendingSharingWorkspace } = useMutation({
    mutationFn: workspaceSharingInvitationApi.create,
    onSuccess: () => {
      setSharingMembers([])
      toggleShowShare()
      message.success('Share workspace successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const { mutate: mutateUpdateRoleAccess, isPending: isPendingUpdateRoleAccess } = useMutation({
    mutationFn: workspaceSharingMemberApi.updateRoleAccess,
    onSuccess: () => {
      toggleShowShare()
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      message.success('Update role access workspace successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const handleDoneSharingAccount = () => {
    if (currentWorkspace)
      if (sharingMembers?.length > currentWorkspace?.members.length) {
        mutateSharingWorkspace({
          workspaceId: currentWorkspace.id,
          ownerId: currentWorkspace.owner.id as string,
          sharingMembers
        })
      } else {
        mutateUpdateRoleAccess({
          workspaceId: currentWorkspace.id,
          ownerId: currentWorkspace.owner.id as string,
          sharingMembers
        })
      }
  }

  const hasSharingMembersChanged = (): boolean => {
    if (!currentWorkspace?.members) return false
    if (sharingMembers.length !== currentWorkspace.members.length) return true
    return sharingMembers.some(
      (member, index) =>
        (member.email === currentWorkspace.members[index].email &&
          member.roleAccess !== currentWorkspace.members[index].roleAccess) ||
        member.email !== currentWorkspace.members[index].email
    )
  }

  const handleCloseShare = () => {
    if (handleCancel) handleCancel()
    toggleShowShare()
  }

  useEffect(() => {
    if (currentWorkspace) {
      setSharingMembers(currentWorkspace?.members)
    }
  }, [isShowShare])

  return (
    <Modal open={isShowShare} footer={null} onCancel={handleCloseShare}>
      {contextHolder}
      <h2 className='text-2xl text-slate-800 font-normal'>Share "{currentWorkspace?.name}"</h2>
      <div className='mt-5'>
        <CustomInput
          name='email'
          size='large'
          placeholder='Add people'
          value={emailMember}
          onChange={handleChange}
          onKeyDown={handleAddMember}
          className='text-lg font-medium h-full px-5 py-3.5 border-1 border-slate-500 rounded-md hover:border-primary-800 focus-within:shadow-custom'
        />
      </div>
      {currentWorkspace && (
        <div className='mt-4 max-h-[500px] overflow-y-auto'>
          <h2 className='font-medium text-lg'>People with access</h2>
          <ul className='mt-2'>
            <CardSharingMember type='owner' member={currentWorkspace.owner} />
            {sharingMembers.length > 0 &&
              sharingMembers.map((member) => (
                <CardSharingMember
                  key={member.email}
                  type='member'
                  member={member}
                  roleAccess={member.roleAccess}
                  disableChangeRoleAccess={
                    member.roleAccess === ROLE_ACCESS.MANAGE &&
                    currentWorkspace.members.some(
                      (existedMember) =>
                        existedMember.email === member.email && existedMember.roleAccess === ROLE_ACCESS.MANAGE
                    ) &&
                    currentUser?.id !== currentWorkspace.owner.id
                  }
                  handleRemoveMember={handleRemoveMember}
                  handleChangeMemberRoleAccess={handleChangeMemberRoleAccess}
                />
              ))}
          </ul>
        </div>
      )}

      <CustomBtn
        title='Done'
        type='primary'
        className='!text-lg mt-4'
        onClick={handleDoneSharingAccount}
        loading={isPendingSharingWorkspace || isPendingUpdateRoleAccess}
        disabled={!hasSharingMembersChanged() || isPendingSharingWorkspace || isPendingUpdateRoleAccess}
      />
    </Modal>
  )
}
