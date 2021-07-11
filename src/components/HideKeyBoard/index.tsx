import React from 'react'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

const HideKeyBoard = ({ children }: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default HideKeyBoard
