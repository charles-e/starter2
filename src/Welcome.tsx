import React from 'react'

interface IProps {
  name: string
}

function Welcome(props: IProps) {
  const time = new Date().toLocaleTimeString()

  return (
    <div>
      Hello, {props.name}: {time}
    </div>
  )
}

export default Welcome
