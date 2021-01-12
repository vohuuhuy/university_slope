import React, { FunctionComponent, RefObject, useEffect, useReducer } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Dimensions, StyleSheet, View } from 'react-native'
import NTUBorder from './ntuBorder'
import MeAnnotation from './meAnnotation'
import { reducer } from '../../library/utils'
import mapSetting from './mapSetting.json'
import { FloatingRef } from '../floating'
// import PhotocopyShops from './photocopyShops'
import Gs from './gs'
import Ks from './ks'
import Library from './library'
import Stadium from './stadium'
import Gates from './gates'
import Admin from './admin'

MapboxGL.setAccessToken('pk.eyJ1Ijoidm9odXVodXkwMTAzMTk5OSIsImEiOiJja2pvaDB3YmowZGd0MnpsMWx4ejBtcnpzIn0.nKEnGnYEi12fqlyvscYxhw')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
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

export interface MapProps {
  floatingRef: RefObject<FloatingRef>
}

let isFirstSaveCamera = false
const cameraMaxBounds: {ne: [number, number]; sw: [number, number]} | any = mapSetting.maxBounds

const Map: FunctionComponent<MapProps> = (props) => {
  const { floatingRef } = props

  const [state, setState] = useReducer(reducer, {
    camera: null
  })

  useEffect(() => {
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
          ref={c => {
            if (!isFirstSaveCamera) {
              setState({ camera: c })
              isFirstSaveCamera = true
            }
          }}
          zoomLevel={17}
          maxZoomLevel={18}
          minZoomLevel={17}
          maxBounds={cameraMaxBounds}
          animationMode='flyTo'
          followUserMode='normal'
        />
        <NTUBorder />
        <MeAnnotation
          floatingRef={floatingRef}
          camera={state.camera}
        />
        {/* <PhotocopyShops /> */}
        <Gs floatingRef={floatingRef} />
        <Ks floatingRef={floatingRef} />
        <Library floatingRef={floatingRef} />
        <Stadium floatingRef={floatingRef} />
        <Gates floatingRef={floatingRef} />
        <Admin floatingRef={floatingRef} />
      </MapboxGL.MapView>
    </View>
  )
}

export default Map
