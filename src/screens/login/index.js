import React, { useReducer } from 'react'
import { Button, Form, Icon, Input, Item, Label, Text, Toast } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import { reducer, toastErr, validateForm } from '../../library/utils'
import { client } from '../../tools/apollo'
import { MUTATION_LOGIN } from '../../tools/apollo/mutations'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = (props) => {
  const [state, setState] = useReducer(reducer, {
    errors: {
      userName: validateForm('', 'required'),
      password: validateForm('', 'required')
    },
    values: {
      userName: '',
      password: ''
    }
  })

  const changeForm = (field, value, types) => {
    const errors = state.errors
    const values = state.values

    const error = types.map(type => validateForm(value, type)).filter(err => err).join('\n')

    values[field] = value
    errors[field] = error

    setState({ errors, values })
  }

  const showError = (field) => {
    Toast.show({
      text: state.errors[field],
      buttonText: 'Đóng',
      textStyle: { color: 'red', marginRight: 5 },
      style: { margin: 5, backgroundColor: '#fff' },
      buttonStyle: { backgroundColor: '#000', alignSelf: 'center' },
      duration: 10000
    })
  }

  const login = () => {
    client.mutate({
      mutation: MUTATION_LOGIN,
      variables: {
        userName: state.values.userName,
        password: state.values.password
      }
    })
      .then(({ data }) => {
        if (data?.login) {
          const { authorization } = data.login
          AsyncStorage.setItem('authorization', authorization)
            .then(() => {
              props.loginSuccess(props?.navigation?.navigate('Main'))
            })
        }
      })
      .catch(err => {
        console.log(err)
        toastErr(err)
      })
  }

  const forwardRegister = () => {
    props?.navigation?.navigate('Register')
  }

  return (
    <ScrollView style={{ width: '100%' }}>
      <Form>
        <Item
          error={Boolean(state.errors.userName)}
          success={Boolean(!state.errors.userName && state.values.userName)}
        >
          <Label>Tài khoản</Label>
          <Input
            autoCapitalize='none'
            onChangeText={value => changeForm('userName', value, ['userName', 'required'])}
          />
          {
            state.values.userName && !state.errors.userName ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.userName ? (
              <Icon
                name='close-circle'
                onPress={() => showError('userName')}
              />
            ) : <></>
          }
        </Item>
        <Item
          error={Boolean(state.errors.password)}
          success={Boolean(!state.errors.password && state.values.password)}
        >
          <Label>Mật khẩu</Label>
          <Input
            secureTextEntry
            autoCapitalize='none'
            onChangeText={value => changeForm('password', value, ['password', 'required'])}
          />
          {
            state.values.password && !state.errors.password ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.password ? (
              <Icon
                name='close-circle'
                onPress={() => showError('password')}
              />
            ) : <></>
          }
        </Item>
      </Form>
      <Button
        bordered
        success
        full
        large
        disabled={Object.values(state.errors).some(err => err)}
        style={{ marginRight: 10, marginLeft: 10, marginTop: 25 }}
        onPress={login}
      >
        <Text>Đăng nhập</Text>
      </Button>
      <Button
        bordered
        warning
        full
        large
        style={{ marginRight: 10, marginLeft: 10, marginTop: 25 }}
        onPress={forwardRegister}
      >
        <Text>Đăng ký</Text>
      </Button>
    </ScrollView>
  )
}

export default Login
