import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import dataJson from '../../screens/main/map/data/index.json'
import Detail from '../../screens/detail'
import Register from '../../screens/register'
import RegisterSuccess from '../../screens/registerSuccess'
import Login from '../../screens/login'
import Search from '../../screens/search'
import HomeScreen from '../../screens/main'

const data = dataJson
const Stack = createStackNavigator()

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main' mode='card'>
        <Stack.Screen name='Home'>
          {props => <HomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name='Detail'
          component={Detail}
          options={(props) => {
            return ({
              title: data[props.route?.params?.keyData]?.title || ''
            })
          }}
        />
        <Stack.Screen
          name='Register'
          component={Register}
          options={() => ({
            title: 'Đăng ký'
          })}
        />
        <Stack.Screen
          name='RegisterSuccess'
          component={RegisterSuccess}
          options={() => ({
            title: 'Đăng ký thành công'
          })}
        />
        <Stack.Screen
          name='Login'
          options={() => ({
            title: 'Đăng nhập'
          })}
        >
          {props => (
            <Login
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name='Search'
          options={{
            title: 'Tìm kiếm'
          }}
        >
          {props => (
            <Search
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
