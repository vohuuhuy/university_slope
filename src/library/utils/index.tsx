import { Toast } from "native-base";

export const reducer = (currentState: any, newState: any): any => ({
  ...currentState,
  ...newState
})

export const colors = {
  main: '#cd3a20'
}

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateUserName(userName: string) {
  const re = /^[a-zA-Z0-9]+$/
  return re.test(String(userName).toLowerCase());
}

function validatePassword(pw: string) {
  return /[A-Z]/.test(pw)
    && /[a-z]/.test(pw)
    && /[0-9]/.test(pw)
    && /[^A-Za-z0-9]/.test(pw)
    && pw.length > 6;

}

export const validateForm = (value: any, type: string) => {
  switch (type) {
    case 'email':
      return validateEmail(value) ? false : 'Địa chỉ email không hợp lệ.'
    case 'userName':
      return validateUserName(value) ? false : 'Tài khoản chỉ chứa các ký tự [a-Z] và số.'
    case 'password':
      return validatePassword(value) ? false : 'Mật khẩu chỉ chứa ít nhất 1 hoa, thường, số và 1 ký tự đặc biệt và có ít nhất 6 ký tự.'
    case 'required':
      return value ? false : 'Không được để trống.'
  }
  return false
}

export const toastErr = (err: any) => {
  const errStr = err.toString()
  if (errStr === 'Error: Network request failed') {
    Toast.show({
      text: 'Lỗi kết nối đến máy chủ',
      style: { backgroundColor: 'red' },
      textStyle: { color: '#fff' },
      duration: 10000
    })
  } else {
    Toast.show({
      text: errStr.replace('Error: Error: ', '').trim(),
      style: { backgroundColor: 'red' },
      textStyle: { color: '#fff' },
      duration: 10000
    })
  }
}

export const unsignString = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
