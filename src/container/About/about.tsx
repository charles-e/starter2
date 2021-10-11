import React from 'react'

import Welcome from '@/Welcome'

export default function About() {
  return (
    <div className="container mx-auto text-center dark:bg-gray-700 bg-white">
      <div className="mt-4 text-6xl font-extrabold">About</div>
      <div className="py-32 text-center bg-red-100 rounded">
        <h2 className="text-4xl font-bold">
          <Welcome name="World"></Welcome>
        </h2>
      </div>
      <div className="py-32 text-center bg-blue-100 rounded">
        <h2 className="text-4xl font-bold">
          <Welcome name="World"></Welcome>
        </h2>
      </div>
      <div className="py-32 text-center bg-green-100 rounded">
        <h2 className="text-4xl font-bold">
          <Welcome name="World"></Welcome>
        </h2>
      </div>
    </div>
  )
}
