import React from 'react'
import { Link } from 'react-router-dom'

import { MoonIcon } from '@/icons/Moon'

function GlobalHeader() {
  function toggleDarkMode() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <div className="pb-10">
      <nav className="fixed inset-x-0 top-0 bg-gray-100">
        <div className="mx-auto max-w-5xl text-gray-300">
          <div className="flex justify-between">
            <div className="flex items-center hover:text-black text-gray-700 space-x-3">
              <Link className="" to="/">
                Home
              </Link>
              <Link className="" to="/about">
                About
              </Link>
            </div>
            <div className="flex px-2 py-6 hover:text-black text-gray-700 space-x-6">
              <Link className="flex items-center" to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-bold">React starter kit</span>
              </Link>
            </div>
            <div className="flex items-center hover:text-black text-gray-700">
              <Link className="px-3 py-5" to="/">
                Login
              </Link>
              <Link
                className="hover:bg-text-yellow-800 px-3 py-2 text-yellow-900 hover:bg-yellow-300 bg-yellow-400 rounded shadow transition duration-300"
                to="/about">
                Signup
              </Link>
              <button
                className="dark:hover:bg-gray-500 dark:hover:text-yellow-400 flex p-2 text-black dark:text-gray-700 hover:text-yellow-400 hover:bg-gray-700 rounded focus:outline-none"
                onClick={toggleDarkMode}>
                <MoonIcon></MoonIcon>
                Theme
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default GlobalHeader
