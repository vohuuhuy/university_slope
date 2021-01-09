import React, { useEffect, useReducer, useRef } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Dimensions, StyleSheet, View } from 'react-native'
import geolocation from '@react-native-community/geolocation'
import { reducer } from '../../library/utils'

MapboxGL.setAccessToken('pk.eyJ1Ijoidm9odXVodXkwMTAzMTk5OSIsImEiOiJja2pvaDB3YmowZGd0MnpsMWx4ejBtcnpzIn0.nKEnGnYEi12fqlyvscYxhw')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 40,
    width: '100%'
  },
  map: {
    width: '100%',
    height: '100%'
  },
  makerUser: {
    width: 8,
    height: 8,
    backgroundColor: 'blue',
    borderRadius: 50
  }
})

let camera: MapboxGL.Camera | null

const Map = () => {
  const [state, setState] = useReducer(reducer, {
    me: {
      latitude: 0,
      longitude: 0
    }
  })

  useEffect(() => {
    let first = true
    geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
      if (first) {
        first = false
        camera?.flyTo([longitude, latitude], 3000)
      }
      setState({ me: { latitude, longitude } })
    })
    MapboxGL.setTelemetryEnabled(false)
  }, [])

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Light}
        rotateEnabled={false}
        zoomEnabled
        scrollEnabled
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera
          ref={c => camera = c}
          zoomLevel={16}
          maxZoomLevel={17}
          minZoomLevel={16}
          maxBounds={{
            ne: [109.205393, 12.269989],
            sw: [109.197829, 12.267504],
          }}
          animationMode='flyTo'
          followUserMode='normal'
        />
        {state.me.longitude ? (
          <MapboxGL.PointAnnotation
            id='user'
            coordinate={[state.me.longitude, state.me.latitude]}
            children={<View style={styles.makerUser} />}
          />
        ) : <></>}
      </MapboxGL.MapView>
    </View>
  )
}

export default Map
