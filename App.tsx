import React from 'react'
import Loading from './src/components/loading'
const Main = React.lazy(() => import('./src/components/main'))

const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Main />
    </React.Suspense>
  )
}

export default App
