import { AxiosError } from 'axios'
import { Modal, Spin, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'

import { accountVersionKeys } from '@/keys'
import { IAccountDataResponse, IAccountVersionDataResponse, IErrorResponse } from '@/interfaces'

import { AccountVersionItem } from './AccountVersionItem'

type ModalAccountVersionProps = {
  open: boolean
  account: IAccountDataResponse
  handleCancel: () => void
}

export const ModalAccountVersion: React.FC<ModalAccountVersionProps> = ({ open, account, handleCancel }) => {
  const { data: accountVersions = [], isLoading } = useQuery<IAccountVersionDataResponse[], AxiosError<IErrorResponse>>(
    {
      ...accountVersionKeys.list(account.id),
      enabled: open
    }
  )

  return (
    <Modal open={open} footer={null} onCancel={handleCancel}>
      <section>
        <Typography.Title level={3}>Manage versions</Typography.Title>

        <Typography.Text className='text-base text-slate-700 mb-4 inline-block'>
          Older versions of '{account.username}' may be deleted after 30 days or after 100 versions are stored.
        </Typography.Text>

        {isLoading && (
          <div className='flex justify-center items-center mt-5'>
            <Spin size='large' />
          </div>
        )}

        {!isLoading && (
          <AccountVersionItem accountVersion={account as IAccountVersionDataResponse} showAction={false} />
        )}

        {accountVersions.length > 0 && (
          <ul>
            {accountVersions.map((accountVersion, index) => (
              <AccountVersionItem key={accountVersion.id} accountVersion={accountVersion} version={index + 1} />
            ))}
          </ul>
        )}
      </section>
    </Modal>
  )
}
