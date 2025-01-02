import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { message, Modal, Space, Spin, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { icons } from '@/utils/icons'
import { contactInfoApi } from '@/apis'
import { contactInfoKeys } from '@/keys'
import { useAuth, useBoolean } from '@/hooks'
import emptyData from '@/lotties/emtpyContact.json'
import { IContactInfoDataResponse, IErrorResponse } from '@/interfaces'
import { ContactInfoItem, CustomBtn, CustomInput, CustomLottie } from '@/components'

import { CreateContactInfo } from './CreateContactInfo'

export const ListContactInfos = () => {
  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const [deleteContactInfoId, setDeleteContactInfoId] = useState<string>('')

  const [listSuggestContactInfos, setListSuggestContactInfos] = useState<IContactInfoDataResponse[]>([])

  const [currentContactInfo, setCurrentContactInfo] = useState<IContactInfoDataResponse>()

  const { value: open, setTrue: setOpen, setFalse: setClose } = useBoolean(false)

  const { value: isShowCreateContactInfoForm, toggle: toggleShowCreateContactInfoForm } = useBoolean(false)

  const { data: contactInfos = [], isLoading } = useQuery<IContactInfoDataResponse[], AxiosError<IErrorResponse>>(
    contactInfoKeys.list()
  )

  const handleCancel = () => {
    setDeleteContactInfoId('')
    setClose()
  }

  const handleDelete = () => {
    if (deleteContactInfoId) mutateDeleteContactInfo(deleteContactInfoId)
  }

  const { mutate: mutateDeleteContactInfo, isPending: isPendingDeleteContactInfo } = useMutation({
    mutationFn: contactInfoApi.delete,
    onSuccess: () => {
      message.success('Delete contact info successfully!')
      setClose()
      queryClient.invalidateQueries({ queryKey: contactInfoKeys.all, refetchType: 'all' })
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handleSearchContactInfo = (searchValue: string) => {
    const trimedSearchValue = searchValue.trim().toLowerCase()
    if (contactInfos) {
      const newListSuggestContactInfo = contactInfos.filter(
        (contactInfo) =>
          !trimedSearchValue ||
          ['title', 'firstName', 'midName', 'lastName'].some((key) => {
            const value = contactInfo[key as keyof IContactInfoDataResponse]
            return typeof value === 'string' && value.toLowerCase().includes(trimedSearchValue)
          })
      )
      setListSuggestContactInfos(newListSuggestContactInfo)
    }
  }

  const handleConfirmDeleteContactInfo = (contactInfoId: string) => {
    setOpen()
    setDeleteContactInfoId(contactInfoId)
  }

  const handleConfirmUpdateContactInfo = (contactInfo: IContactInfoDataResponse) => {
    toggleShowCreateContactInfoForm()
    setCurrentContactInfo(contactInfo)
  }

  const handleCancelUpdateContactInfo = () => {
    setCurrentContactInfo(undefined)
  }

  useEffect(() => {
    if (contactInfos) setListSuggestContactInfos(contactInfos)
  }, [contactInfos])

  return (
    <div className='xs:px-0 md:p-6 overflow-x-hidden'>
      <CreateContactInfo
        currentContactInfo={currentContactInfo}
        isShowCreateContactInfoForm={isShowCreateContactInfoForm}
        handleCancelUpdateContactInfo={handleCancelUpdateContactInfo}
        toggleShowCreateContactInfoForm={toggleShowCreateContactInfoForm}
      />
      {isLoading && (
        <div className='flex justify-center items-center mt-5 ab absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
          <Spin size='large' />
        </div>
      )}
      {!isLoading && contactInfos?.length > 0 && (
        <>
          <Modal
            open={open}
            title='Warning'
            onCancel={handleCancel}
            footer={() => (
              <Space className='flex items-center justify-end gap-x-4'>
                <CustomBtn title='Cancel' onClick={handleCancel} className='border !border-gray-500 !text-slate-800' />
                <CustomBtn
                  title='Delete'
                  type='primary'
                  onClick={handleDelete}
                  loading={isPendingDeleteContactInfo}
                  className='bg-red-500 hover:!bg-red-600'
                />
              </Space>
            )}
          >
            <span>This item will be permanently removed from your vault.</span>
          </Modal>
          <div className='flex items-center justify-between gap-4 pb-8 xs:flex-col md:flex-row'>
            <CustomInput
              name='searchValue'
              size='large'
              placeholder='Search contact info'
              className='!h-12 max-w-screen-md xs:mr-0 !text-base font-medium border border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
              onChange={(e: { target: { value: string } }) => handleSearchContactInfo(e.target.value)}
            />
            <Space className='flex xs:w-full md:w-auto xs:justify-between'>
              <CustomBtn
                title='Create'
                type='primary'
                className='!mt-0 !w-fit !h-12 !gap-2'
                children={<span className='text-2xl'>{icons.add}</span>}
                onClick={toggleShowCreateContactInfoForm}
              />
            </Space>
          </div>
          {listSuggestContactInfos.length > 0 && currentUser ? (
            <ul className='grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-8'>
              {listSuggestContactInfos.map((contactInfo) => (
                <ContactInfoItem
                  key={contactInfo.id}
                  contactInfo={contactInfo}
                  handleConfirmUpdateContactInfo={handleConfirmUpdateContactInfo}
                  handleConfirmDeleteContactInfo={handleConfirmDeleteContactInfo}
                />
              ))}
            </ul>
          ) : (
            <div className='flex flex-col justify-center items-center'>
              <CustomLottie animationData={emptyData} width={200} height={200} />
              <Typography.Text className='text-center text-lg text-slate-800'>No contact info found!</Typography.Text>
            </div>
          )}
        </>
      )}
      {!isLoading && contactInfos?.length === 0 && (
        <div className='flex flex-col justify-center items-center gap-2'>
          <CustomLottie animationData={emptyData} width={200} height={200} />
          <Typography.Text className='text-center text-lg text-slate-800'>
            There's no contact info for you to see yet!
            <br />
            If you want to create new contact info, just click
          </Typography.Text>
          <CustomBtn
            title='Create Contact'
            type='primary'
            className='mt-2 !w-fit !h-12 !gap-2'
            children={<span className='text-2xl'>{icons.add}</span>}
            onClick={toggleShowCreateContactInfoForm}
          />
        </div>
      )}
    </div>
  )
}
