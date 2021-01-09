import React from 'react'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Map from '../map'

const style = StyleSheet.create({
  main: {
    width: '100%',
    height: Dimensions.get('window').height
  },
  header: {
    width: '100%',
    height: 40,
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
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={style.main}>
          <View style={style.header}>
            <Text style={style.headerText}>Dốc Đại Học</Text>
          </View>
          <Map />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Main
