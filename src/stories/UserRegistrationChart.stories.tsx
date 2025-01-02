/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRegistrationChart } from '@/components';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const meta: Meta = {
  title: 'Components/UserRegistrationChart', 
  component: UserRegistrationChart
};

export default meta;

const mockChartData = {
  data: [
    { year: 2024, month: 'January', value: 50 },
    { year: 2024, month: 'February', value: 75 },
    { year: 2024, month: 'March', value: 100 },
    { year: 2024, month: 'April', value: 125 }
  ],
  years: [2023, 2024, 2025]
};

const initialState = { 
  dashboard: {
    chartDataUsersRegistered: mockChartData 
  }
};

const mockReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const mockStore = createStore(mockReducer);

const Template: StoryFn = () => (
  <Provider store={mockStore}>
    <UserRegistrationChart />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
