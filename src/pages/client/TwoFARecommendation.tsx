import { AxiosError } from 'axios'
import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Radio, Typography, Steps, Row, Col, Result, message, Grid } from 'antd'

import { userApi } from '@/apis'
import { QRCode } from '@/pages'
import { userKeys } from '@/keys'
import { CustomBtn } from '@/components'
import { IErrorResponse } from '@/interfaces'
import { PATH, TWO_FACTOR_AUTHEN_OPTIONS } from '@/utils/constants'

import { VerifyTokenTwoFa } from './VerifyTokenTwoFa'

const { Title, Text } = Typography
const { Step } = Steps

export const TwoFARecommendation: React.FC = () => {
  const location = useLocation()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const screens = Grid.useBreakpoint()

  const isInVaultPage = location.pathname.includes(PATH.VAULT)

  const [currentStep, setCurrentStep] = useState(0)

  const [twoFaMethod, setTwoFaMethod] = useState<string>('authApp')

  const handleNext = useCallback(() => {
    console.log({ currentStep, stepsContent: stepsContent.length - 1 })
    if (currentStep === stepsContent.length - 1) {
      if (isInVaultPage) {
        queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
      } else {
        navigate(PATH.VAULT)
      }
    } else {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }, [currentStep])

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1)
  }

  const handleSkip = () => {
    mutateSkipTwoFa()
  }

  const { mutate: mutateSkipTwoFa, isPending } = useMutation<string, AxiosError<IErrorResponse>>({
    mutationFn: userApi.skipTwoFa,
    onSuccess: () => {
      navigate(PATH.VAULT)
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Something was failed ' + errorMessage)
    }
  })

  const stepsContent = [
    {
      title: 'Choose Method',
      content: (
        <div className='flex flex-col'>
          <Title level={4} className='!text-primary-800'>
            Choose an authentication method
          </Title>
          <Text className='!text-slate-700 text-lg'>
            To sign in, you'll need your username, password, and a code from an app or SMS.
            <br />
            You can download{' '}
            <a
              href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en'
              target='_blank'
              className='!hover:underline'
            >
              Google Authenticator{' '}
            </a>
            here.
          </Text>
          <Radio.Group
            onChange={(e) => setTwoFaMethod(e.target.value)}
            value={twoFaMethod}
            className='flex flex-col justify-center gap-6 mt-4'
          >
            {TWO_FACTOR_AUTHEN_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className={`gap-2 !p-4 border text-lg rounded-md ${option.value === twoFaMethod ? 'border-primary-800 bg-blue-50' : 'border-gray-500 '}`}
              >
                <Text
                  strong
                  className={`text-lg ${option.value === twoFaMethod ? 'text-primary-800 ' : 'text-slate-800'}`}
                >
                  {option.title}
                </Text>
                <br />
                <Text className='text-base'>{option.description}</Text>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      )
    },
    {
      title: 'Scan QR',
      content: (
        <div className='flex flex-col'>
          <Title level={4} className='!text-primary-800'>
            Scan this QR with your google authenticator App
          </Title>
          <Text className='!text-slate-700 text-lg'>Open your google authentication app and scan this QR below.</Text>
          <QRCode />
        </div>
      )
    },
    {
      title: 'Verify',
      content: (
        <div className='flex flex-1 flex-col'>
          <Title level={4} className='!text-primary-800'>
            Verify OTP
          </Title>
          <Text className='!text-slate-700 text-lg'>Enter your OTP in google authenticator app</Text>
          <VerifyTokenTwoFa showHeader={false} onVerifySuccess={handleNext} />
        </div>
      )
    },
    {
      title: 'Done',
      content: (
        <div className='flex flex-1 items-center'>
          <Result
            status='success'
            title='Successfully set up two factor authentication!'
            subTitle='For subsequent logins, you will need to enter the code obtained from the Google Authenticator app to authenticate the login session.'
          />
        </div>
      )
    }
  ]

  return (
    <section className={`flex bg-white  ${isInVaultPage ? '' : 'justify-center xs:p-6'}`}>
      <div
        className={`flex gap-8 flex-col  ${isInVaultPage ? 'xl:flex-row justify-between flex-1' : 'justify-center xl:min-w-[60%]'}`}
      >
        {!isInVaultPage && (
          <article
            className={`flex flex-col justify-start text-slate-800 text-lg  ${isInVaultPage ? 'xl:w-[22%] md:w-full' : 'xs:w-ful lg:w-[45%]'}`}
          >
            <h3 className='font-semibold'>Enhance security</h3>
            <span> Setup two factor authentication .</span>
          </article>
        )}

        <Row className='min-h-[450px] flex lg:flex-nowrap flex-1 md:flex-row xs:flex-col justify-center lg:justify-start'>
          <Col
            span={screens.md ? 24 : 28}
            className='flex flex-col justify-between lg:border-r border-slate-200 lg:max-w-[210px]'
          >
            <Steps
              direction={!screens.lg ? 'horizontal' : 'vertical'}
              current={currentStep}
              className='gap-5'
              labelPlacement={screens.md ? 'vertical' : 'horizontal'}
            >
              {stepsContent.map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
            {currentStep < stepsContent.length - 2 && !isInVaultPage && (
              <CustomBtn
                title='Skip for now'
                className='lg:!my-0 xs:my-4 !w-fit '
                onClick={handleSkip}
                loading={isPending}
              />
            )}
          </Col>

          <Col
            span={isInVaultPage ? (screens.xs ? 25 : !screens.lg ? 25 : 14) : screens.xs ? 25 : 16}
            className={`flex flex-1 flex-col justify-between sm:pt-6 ${isInVaultPage ? 'md:p-6' : ''} lg:p-0 lg:pl-16`}
          >
            {stepsContent[currentStep].content}
            <div className='flex xs:gap-x-4 sm:gap-x-8 mt-4'>
              {currentStep > 0 && currentStep < stepsContent.length - 1 && (
                <CustomBtn title='Back' className='!mt-0 sm:w-fit w-[120px]' onClick={handleBack} />
              )}

              {currentStep !== 2 && (
                <CustomBtn
                  type='primary'
                  title={currentStep === stepsContent.length - 1 ? 'Finish' : 'Next'}
                  className='!mt-0 sm:w-fit w-[120px]'
                  onClick={handleNext}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
