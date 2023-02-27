import { ComponentMeta } from '@storybook/react'
import React from 'react'

import AmountInput from './index'

export default {
  title: 'Components/AmountInput',
  component: AmountInput,
  argTypes: {}
} as ComponentMeta<typeof AmountInput>

export const Default = args => <AmountInput {...args} />
