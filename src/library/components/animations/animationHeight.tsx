import React, { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

export default (props: any) => {
  const fadeAnim = useRef(new Animated.Value(props.initValue)).current

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: props.value,
        duration: props.duration,
        useNativeDriver: false
      }
    ).start()
  }, [fadeAnim])

  return (
    <Animated.View
      style={{
        ...props.style,
        height: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  )
}