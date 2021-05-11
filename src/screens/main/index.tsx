import React, { useLayoutEffect, useRef } from 'react'
import Loading from '../../components/loading'

const Map = React.lazy(() => import('./map'))

const HomeScreen = (props: any) => {
  const modalBottomRef: any = useRef()

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'Dốc Đại Học'
    })
  }, [])

  return (
    <React.Suspense fallback={<Loading />}>
      <Map
        {...props}
        modalBottomRef={modalBottomRef}
      />
    </React.Suspense>
  )
}

export default HomeScreen
