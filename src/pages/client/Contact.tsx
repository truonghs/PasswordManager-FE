import * as yup from 'yup'
import { Element } from 'react-scroll'
import { Col, Form, Input, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { AUTH_FIELDS } from '@/utils/constants'
import { CustomInput, CustomBtn } from '@/components'

type SubscribeData = {
  name: string
  email: string
}

const schema = yup.object().shape({
  name: yup.string().required('Please input your name!'),
  email: yup.string().email('Please input a valid email!').required('Please input your email!'),
  message: yup.string().required('Please input your message!')
})

export const Contact = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })
  const handleSubscribe = (values: SubscribeData) => {
    console.log('Success:', values)
  }
  return (
    <Element name='contact'>
      <section className='py-16 bg-white xs:px-2'>
        <h2 className='text-center text-4xl font-bold mb-12'>Contact Us</h2>
        <Row justify='center' gutter={[32, 32]}>
          <Col xs={24} md={12} lg={10} className='border border-slate-200 pb-2'>
            <Form className='mt-6' onFinish={handleSubmit(handleSubscribe)} layout='vertical'>
              {AUTH_FIELDS.map((field) => {
                if (field.name === 'name' || field.name === 'email')
                  return (
                    <CustomInput
                      key={field.name}
                      size='large'
                      name={field.name}
                      label={field.label}
                      control={control}
                      errors={errors}
                      placeholder={field.placeholder}
                    />
                  )
              })}
              <Form.Item
                label={<span className='text-lg font-normal'>Message</span>}
                name='message'
                className='mt-4'
                validateStatus={errors['message'] ? 'error' : ''}
                help={errors['message']?.message}
              >
                <Controller
                  name='message'
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      rows={4}
                      className='text-lg font-medium border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
                    />
                  )}
                />
              </Form.Item>
              <CustomBtn title='Submit' type='primary' htmlType='submit' className='mt-0' />
            </Form>
          </Col>

          <Col xs={24} md={12} lg={12}>
            <div className='shadow-lg p-4 rounded-lg bg-white'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3454656782583!2d106.68764161526188!3d10.776888992320452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ebb16e5a1f7%3A0xf1f8e24b09f3ea6d!2sNotre-Dame%20Cathedral%20Basilica%20of%20Saigon!5e0!3m2!1sen!2s!4v1634821827745!5m2!1sen!2s'
                width='100%'
                height='445'
                className='rounded-lg'
                allowFullScreen
                loading='lazy'
                title='Google Map'
              />
            </div>
          </Col>
        </Row>
      </section>
    </Element>
  )
}
