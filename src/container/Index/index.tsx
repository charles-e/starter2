import React, { useState } from 'react'

import logo from '@/logo.svg'
export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col min-h-screen text-center dark:bg-gray-700 bg-white">
      <nav className="flex items-center justify-end px-16 h-32"></nav>
      <header className="flex flex-col flex-grow items-center justify-center text-gray-700 dark:text-white text-2xl">
        <img src={logo} className="h-48 animate-spin-slow" alt="logo" />
        <p>Vite + React + Tailwind!</p>
        <div className="my-8">
          <button
            className="inline-flex items-center px-6 py-3 text-white text-base font-medium bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md focus:outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setCount((count) => count + 1)}>
            Tailwind button: {count}
          </button>
        </div>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="text-blue-400"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
          {' | '}
          <a
            className="text-blue-400"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer">
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}
