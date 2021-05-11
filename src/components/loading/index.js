import React from 'react'
import { StyleSheet, View } from 'react-native'
import * as Progress from 'react-native-progress'

const Loading = () => {
  return (
    <View style={style.loading}>
      <Progress.Circle size={30} indeterminate={true} color='blue' />
    </View>
  )
}

const style = StyleSheet.create({
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})

export default Loading
