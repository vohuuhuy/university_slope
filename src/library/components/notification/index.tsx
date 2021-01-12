import React, {  forwardRef, FunctionComponent } from 'react'
import { Text, TextProps, View, ViewProps } from 'react-native'

export interface NotificationProps extends ViewProps {
  title?: string | null,
  titleProps?: TextProps
}

const Notification = forwardRef<any, NotificationProps>((props, ref) => {
  const {
    title,
    titleProps,
    ...rest
  } = props

  return (
    <View {...rest}>
      <Title {...titleProps}>{ title }</Title>
    </View>
  )
})

export default Notification

const Title: FunctionComponent = props => {
  const { children } = props
  if (!children) return <></>

  return (
    <Text {...props}>{ children }</Text>
  )
}
