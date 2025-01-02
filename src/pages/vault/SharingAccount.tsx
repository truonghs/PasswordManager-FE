import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Modal, message, notification } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks'
import { accountKeys } from '@/keys'
import { ROLE_ACCESS, VALIDATION_REGEX } from '@/utils/constants'
import { CardSharingMember, CustomBtn, CustomInput } from '@/components'
import { accountSharingInvitationApi, accountSharingMemberApi } from '@/apis'
import { IAccountDataResponse, IAccountSharingMemberInfo, IErrorResponse } from '@/interfaces'

type SharingAccountProps = {
  currentAccount?: IAccountDataResponse
  isShowShareAccount: boolean
  toggleShowShareAccount: () => void
  handleCancelUpdateAccount?: () => void
}

export const SharingAccount: React.FC<SharingAccountProps> = ({
  currentAccount,
  isShowShareAccount,
  toggleShowShareAccount,
  handleCancelUpdateAccount
}) => {
  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const [emailMember, setEmailMember] = useState<string>('')

  const [sharingMembers, setSharingMembers] = useState<IAccountSharingMemberInfo[]>([])

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
      const isOwnerEmail = trimmedEmail === currentAccount?.owner.email

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

  const handleChangeMemberRoleAccess = (member: IAccountSharingMemberInfo) => {
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

  const handleRemoveMember = (member: IAccountSharingMemberInfo) => {
    const updateSharingMembers = sharingMembers.filter((currentMember) => currentMember.email !== member.email)
    setSharingMembers(updateSharingMembers)
  }

  const { mutate: mutateSharingAccount, isPending: isPendingSharingAccount } = useMutation({
    mutationFn: accountSharingInvitationApi.create,
    onSuccess: () => {
      setSharingMembers([])
      toggleShowShareAccount()
      message.success('Share account successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const { mutate: mutateUpdateRoleAccess, isPending: isPendingUpdateRoleAccess } = useMutation({
    mutationFn: accountSharingMemberApi.updateRoleAccess,
    onSuccess: () => {
      toggleShowShareAccount()
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      message.success('Update role access account successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const handleDoneSharingAccount = () => {
    if (currentAccount)
      if (sharingMembers?.length > currentAccount?.members.length) {
        mutateSharingAccount({
          accountId: currentAccount.id,
          ownerId: currentAccount.owner.id as string,
          sharingMembers
        })
      } else {
        mutateUpdateRoleAccess({
          accountId: currentAccount.id,
          ownerId: currentAccount.owner.id as string,
          sharingMembers
        })
      }
  }

  const hasSharingMembersChanged = (): boolean => {
    if (!currentAccount?.members) return false
    if (sharingMembers.length !== currentAccount.members.length) return true
    return sharingMembers.some(
      (member, index) =>
        member.email === currentAccount.members[index].email &&
        member.roleAccess !== currentAccount.members[index].roleAccess
    )
  }

  const handleCloseShare = () => {
    if (handleCancelUpdateAccount) handleCancelUpdateAccount()
    toggleShowShareAccount()
  }

  useEffect(() => {
    if (currentAccount) {
      setSharingMembers(currentAccount?.members)
    }
  }, [currentAccount])

  return (
    <Modal open={isShowShareAccount} footer={null} onCancel={handleCloseShare}>
      {contextHolder}
      <h2 className='text-2xl text-slate-800 font-normal text-wrap max-w-[470px]'>Share "{currentAccount?.username}"</h2>
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
      {currentAccount && (
        <div className='mt-4 max-h-[500px] overflow-y-auto'>
          <h2 className='font-medium text-lg'>People with access</h2>
          <ul className='mt-2'>
            <CardSharingMember type='owner' member={currentAccount.owner} />
            {sharingMembers?.length > 0 &&
              sharingMembers?.map((member) => (
                <CardSharingMember
                  key={member.email}
                  type='member'
                  member={member}
                  roleAccess={member.roleAccess}
                  disableChangeRoleAccess={
                    member.roleAccess === ROLE_ACCESS.MANAGE &&
                    currentAccount.members.some((existedMember) => existedMember.email === member.email) &&
                    currentUser?.id !== currentAccount.owner.id
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
        loading={isPendingSharingAccount || isPendingUpdateRoleAccess}
        disabled={!hasSharingMembersChanged() || isPendingSharingAccount || isPendingUpdateRoleAccess}
      />
    </Modal>
  )
}
