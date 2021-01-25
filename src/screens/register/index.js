import React, { useReducer } from 'react'
import { Button, Form, Icon, Input, Item, Label, Text, Toast } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import { reducer, toastErr, validateForm } from '../../library/utils'
import { client } from '../../tools/apollo'
import { MUTATION_REGISTER } from '../../tools/apollo/mutations'

const Register = (props) => {
  const [state, setState] = useReducer(reducer, {
    errors: {
      firstName: validateForm('', 'required'),
      lastName: validateForm('', 'required'),
      userName: validateForm('', 'required'),
      password: validateForm('', 'required'),
      rePassword: validateForm('', 'required'),
      email: validateForm('', 'required')
    },
    values: {
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      rePassword: '',
      email: ''
    }
  })

  const changeForm = (field, value, types) => {
    const errors = state.errors
    const values = state.values

    const error = types.map(type => validateForm(value, type)).filter(err => err).join('\n')

    values[field] = value
    errors[field] = error

    if (field === 'rePassword' && state.values.password !== state.values.rePassword) {
      errors[field] += errors[field] ? '\nXác nhận mật khẩu không chính xác.' : 'Xác nhận mật khẩu không chính xác.'
    }

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

  const register = () => {
    client.mutate({
      mutation: MUTATION_REGISTER,
      variables: {
        inputUser: {
          firstName: state.values.firstName,
          lastName: state.values.lastName,
          userName: state.values.userName,
          password: state.values.password,
          email: state.values.email,
        }
      }
    })
      .then(({ data }) => {
        if (data.register) {
          props?.navigation?.navigate('RegisterSuccess', { userName: state.values.userName })
        }
      })
      .catch(err => toastErr(err))
  }

  const forwardLogin = () => {
    props?.navigation?.navigate('Login')
  }

  return (
    <ScrollView style={{ width: '100%' }}>
      <Form>
        <Item
          error={Boolean(state.errors.firstName)}
          success={Boolean(!state.errors.firstName && state.values.firstName)}
        >
          <Label>Họ</Label>
          <Input
            autoCapitalize='none'
            onChangeText={value => changeForm('firstName', value, ['text', 'required'])}
          />
          {
            state.values.firstName && !state.errors.firstName ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.firstName ? (
              <Icon
                name='close-circle'
                onPress={() => showError('firstName')}
              />
            ) : <></>
          }
        </Item>
        <Item
          error={Boolean(state.errors.lastName)}
          success={Boolean(!state.errors.lastName && state.values.lastName)}
        >
          <Label>Tên</Label>
          <Input
            autoCapitalize='none'
            onChangeText={value => changeForm('lastName', value, ['text', 'required'])}
          />
          {
            state.values.lastName && !state.errors.lastName ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.lastName ? (
              <Icon
                name='close-circle'
                onPress={() => showError('lastName')}
              />
            ) : <></>
          }
        </Item>
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
          error={Boolean(state.errors.email)}
          success={Boolean(!state.errors.email && state.values.email)}
        >
          <Label>Email</Label>
          <Input
            autoCapitalize='none'
            onChangeText={value => changeForm('email', value, ['email', 'required'])}
          />
          {
            state.values.email && !state.errors.email ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.email ? (
              <Icon
                name='close-circle'
                onPress={() => showError('email')}
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
        <Item
          error={Boolean(state.errors.rePassword)}
          success={Boolean(!state.errors.rePassword && state.values.rePassword)}
        >
          <Label>Xác nhận</Label>
          <Input
            secureTextEntry
            autoCapitalize='none'
            onChangeText={value => changeForm('rePassword', value, ['password', 'required'])}
          />
          {
            state.values.rePassword && !state.errors.rePassword ? (
              <Icon name='checkmark-circle' />
            ) : <></>
          }
          {
            state.errors.rePassword ? (
              <Icon
                name='close-circle'
                onPress={() => showError('rePassword')}
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
        onPress={register}
      >
        <Text>Đăng ký</Text>
      </Button>
      <Button
        bordered
        info
        full
        large
        style={{ marginRight: 10, marginLeft: 10, marginTop: 25 }}
        onPress={forwardLogin}
      >
        <Text>Đăng nhập</Text>
      </Button>
    </ScrollView>
  )
}

export default Register
