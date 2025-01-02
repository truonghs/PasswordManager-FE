import { LogoCarousel } from '@/components'; 
import { Meta, StoryFn } from '@storybook/react';

// Define meta for the component
const meta: Meta = {
  title: 'Components/LogoCarousel', 
  component: LogoCarousel,
};

export default meta;

const Template: StoryFn = () => <LogoCarousel />;

export const Default = Template.bind({});
Default.args = {};
