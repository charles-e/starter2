import { Button, Container } from '@mui/material'
import React, { useState } from 'react'
import logo from '@/logo.svg'
export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <Container fixed>
      <img src={logo} className="animate-spin-slow h-48" alt="logo" />
      <p>Vite + React + MUI!</p>
      <p>Hello, World.</p>
      <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
        MUI button: {count}
      </Button>
    </Container>
  )
}
