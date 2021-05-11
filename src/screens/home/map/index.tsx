import React, { FunctionComponent, useEffect, useReducer } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { StyleSheet } from 'react-native'
import MeAnnotation from './meAnnotation'
import { reducer } from '../../../library/utils'
import mapSetting from './mapSetting.json'
import MapDraw from './mapDraw'
import GeoJSON from './data/index.json'
import { Loading } from '../../../components'

MapboxGL.setAccessToken('pk.eyJ1Ijoidm9odXVodXkwMTAzMTk5OSIsImEiOiJja2pvaDB3YmowZGd0MnpsMWx4ejBtcnpzIn0.nKEnGnYEi12fqlyvscYxhw')

let isFirstSaveCamera = false
const cameraMaxBounds: {ne: [number, number]; sw: [number, number]} | any = mapSetting.maxBounds

const Map: FunctionComponent<any> = (props) => {
  const [state, setState] = useReducer(reducer, {
    camera: null,
    mapLoading: true
  })

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false)
  }, [])

  useEffect(() => {
    if (props?.route?.params?.coordinate?.length === 2) {
      setTimeout(() => {
        state.camera?.setCamera({
          centerCoordinate: props.route.params.coordinate,
          animationDuration: 3000,
          zoomLevel: 17.5
        })
      }, 700)
    }
  }, [props?.route?.params?.coordinate])

  return (
    <>
      {state.mapLoading && <Loading />}
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Light}
        rotateEnabled
        zoomEnabled
        scrollEnabled
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => setState({ mapLoading: false })}
        onDidFailLoadingMap={() => console.log('onDidFailLoadingMap')}
      >
        <MapboxGL.Camera
          ref={c => {
            if (!isFirstSaveCamera) {
              setState({ camera: c })
              isFirstSaveCamera = true
            }
          }}
          zoomLevel={17}
          // maxZoomLevel={18}
          // minZoomLevel={17}
          maxBounds={cameraMaxBounds}
          animationMode='flyTo'
          followUserMode='normal'
        />
        <MeAnnotation camera={state.camera} />
        <MapDraw
          data={GeoJSON}
          modalBottomRef={props.modalBottomRef}
          {...props}
        />
      </MapboxGL.MapView>
    </>
  )
}

const styles = StyleSheet.create({
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

export default Map
