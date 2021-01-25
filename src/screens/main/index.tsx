import React, { useRef } from 'react'
import Map from './map'

const Main = (props: any) => {
  const modalBottomRef: any = useRef()

  return (
    <Map
      {...props}
      modalBottomRef={modalBottomRef}
    />
  )
}

export default Main
