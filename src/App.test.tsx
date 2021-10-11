import { render } from '@testing-library/react'
import * as React from 'react'

import App from '@/App'

test('renders Hello, World link', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/Hello, World/i)
  expect(linkElement).toBeInTheDocument()
})

test('does not render an learn angular link', () => {
  const { queryByText } = render(<App />)
  const linkElement = queryByText(/learn angular/i)
  expect(linkElement).not.toBeInTheDocument()
})
