import React, { useRef } from 'react'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Floating, { FloatingRef } from '../floating'
import Map from '../map'

const style = StyleSheet.create({
  main: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'relative'
  },
  header: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10
  },
  headerText: {
    fontSize: 17.5,
    fontWeight: 'bold',
    color: '#001f3f'
  }
})

const Main = () => {
  const floatingRef = useRef<FloatingRef>(null)

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={style.main}>
          <View style={style.header}>
            <Text style={style.headerText}>Dốc Đại Học</Text>
          </View>
          <Map floatingRef={floatingRef} />
          <Floating ref={floatingRef} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Main
