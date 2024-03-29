import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootSiblingParent } from 'react-native-root-siblings'
import { ModalPortal } from 'react-native-modals'
import Home from './src/screens/home'
import VersionCheck from './src/screens/versionCheck'

const Stack = createStackNavigator()

const App = () => {
  return (
    <>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='VersionCheck'   mode='card'>
            <Stack.Screen name='VersionCheck' options={{ headerShown: false }}>
              {props => <VersionCheck {...props} />}
            </Stack.Screen>
            <Stack.Screen name='Home'>
              {props => <Home {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
      <ModalPortal />
    </>
  )
}

export default App
