/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountDomainChart } from '@/components'
import { Meta, StoryFn } from '@storybook/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const meta: Meta = {
  title: 'Components/AccountDomainChart', 
  component: AccountDomainChart
}

export default meta

const mockChartData = [
  { domain: 'Domain A', value: 60 },
  { domain: 'Domain B', value: 30 },
  { domain: 'Domain C', value: 10 }
]

const initialState = { 
  dashboard: {
    chartDataAccountsOfUsers: mockChartData 
  }
}

const mockReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state
  }
}

const mockStore = createStore(mockReducer)

const Template: StoryFn = () => (
  <Provider store={mockStore}>
    <AccountDomainChart />
  </Provider>
)

export const Default = Template.bind({})
Default.args = {}
