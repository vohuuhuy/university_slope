import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Loading } from './src/components'
import Home from './src/screens/home'

const Stack = createStackNavigator()

const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Main' mode='card'>
          <Stack.Screen name='Home'>
            {props => <Home {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </React.Suspense>
  )
}

export default App
