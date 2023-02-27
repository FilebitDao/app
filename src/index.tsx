import React from 'react'
import ReactDOM from 'react-dom'

import BigNumber from 'bignumber.js'

import 'translation'

import 'assets/styles/index.scss'

import App from './App'

// Initialize BigNumber format
BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSize: 3,
    groupSeparator: ','
  }
})

ReactDOM.render(<App />, document.getElementById('root'))
