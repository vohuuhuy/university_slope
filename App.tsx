import React, { useEffect, useReducer, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Button, Container, Content, Drawer, Icon, Left, List, ListItem, Right, Root, Text, Header, Row, Toast } from 'native-base'
import { reducer } from './src/library/utils'
import dataJson from './src/screens/main/map/data/index.json'
import Main from './src/screens/main'
import Detail from './src/screens/detail'
import Register from './src/screens/register'
import RegisterSuccess from './src/screens/registerSuccess'
import Login from './src/screens/login'
import { client } from './src/tools/apollo'
import { QUERY_ME } from './src/tools/apollo/query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Share } from 'react-native'
import Search from './src/screens/search'

const data: any = dataJson
const Stack = createStackNavigator()

const App = () => {
  const [state, setState] = useReducer(reducer, {
    user: {}
  })

  let drawerRef = useRef<any>(null).current
  let navigationRef = useRef<any>(null).current

  const navigaTo = (screen: string) => {
    drawerRef?._root?.close()
    navigationRef.navigate(screen)
  }

  const loginSuccess = (callBack = () => {}) => {
    client.query({
      query: QUERY_ME,
      fetchPolicy: 'no-cache'
    })
      .then(({ data }) => {
        if (data.me) {
          setState({ user: data.me })
          callBack()
        }
      })
  }

  const logOut = () => {
    AsyncStorage.removeItem('authorization')
      .then(() => {
        setState({ user: {} })
      })
  }

  const share = () => {
    const { user } = state
    user.isLive = !user.isLive
    setState({ user })
  }

  const search = () => {}

  useEffect(() => {
    loginSuccess()
  }, [])

  return (
    <>
      <Drawer
        ref={(ref) => { drawerRef = ref }}
        type='overlay'
        openDrawerOffset={0.3}
        panCloseMask={0.3}
        content={
          <Container style={{backgroundColor: '#fff'}}>
            {state?.user?._id ? (
              <Header transparent>
                <Left>
                  <Icon name='person-circle-outline' />
                </Left>
                <Right>
                  <Row>
                    <Text>{`${state.user.firstName} ${state.user.lastName}`}</Text>
                  </Row>
                  <Row>
                    <Text>({state.user.userName})</Text>
                  </Row>
                </Right>
              </Header>
            ): (
              <></>
            )}
            <Content>
              <List>
                {state?.user?._id ? (
                  <>
                    <ListItem onPress={share}>
                      <Left>
                        <Text>Chia sẽ vị trí</Text>
                      </Left>
                      <Right>
                        <Icon name='wifi' style={{ color: state.user?.isLive ? 'green' : undefined }} />
                      </Right>
                    </ListItem>
                    <ListItem onPress={logOut}>
                      <Left>
                        <Text>Đăng xuất</Text>
                      </Left>
                      <Right>
                        <Icon name='arrow-forward' />
                      </Right>
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem onPress={() => navigaTo('Login')}>
                      <Left>
                        <Text>Đăng nhập</Text>
                      </Left>
                      <Right>
                        <Icon name='arrow-forward' />
                      </Right>
                    </ListItem>
                    <ListItem onPress={() => navigaTo('Register')}>
                      <Left>
                        <Text>Đăng ký</Text>
                      </Left>
                      <Right>
                        <Icon name='arrow-forward' />
                      </Right>
                    </ListItem>
                  </>
                )}
              </List>
            </Content>
          </Container>
        }
      >
        <NavigationContainer>
          <Root>
            <Stack.Navigator initialRouteName='Main' mode='card'>
              <Stack.Screen
                name='Main'
                component={Main}
                options={(props) => {
                  navigationRef = props.navigation
                  return {
                    title: 'Dốc đại học',
                    headerLeft: () => (
                      <Button
                        transparent
                        onPress={() => drawerRef?._root?.open()}
                      >
                        <Icon name='menu' />
                      </Button>
                    ),
                    headerRight: () => (
                      <Button
                        transparent
                        onPress={() => navigaTo('Search')}
                      >
                        <Icon name='search' />
                      </Button>
                    )
                  }
                }}
              />
              <Stack.Screen
                name='Detail'
                component={Detail}
                options={(props: any) => {
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
                    loginSuccess={loginSuccess}
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
          </Root>
        </NavigationContainer>
      </Drawer>
    </>
  )
}

export default App
