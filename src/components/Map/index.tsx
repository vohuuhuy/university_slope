import React, { FunctionComponent, useEffect, useReducer, useRef } from 'react'
import { StyleSheet } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Blocks from './Blocks'
import RoadDirections from './RoadDirections'
import Camera from './Camera'
import UserLocation from './UserLocation'
import { reducer } from '../../utils'
import { Loading } from '../index'

MapboxGL.setAccessToken('pk.eyJ1Ijoidm9odXVodXkwMTAzMTk5OSIsImEiOiJja2pvaDB3YmowZGd0MnpsMWx4ejBtcnpzIn0.nKEnGnYEi12fqlyvscYxhw')

const Map: FunctionComponent<any> = props => {
  const cameraApiRef = useRef()
  const blocksRef = useRef<any>()

  const [state, setState] = useReducer(reducer, {
    mapLoading: true
  })

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false)
  }, [])

  return (
    <>
      {state.mapLoading && <Loading />}
      <MapboxGL.MapView
        onDidFinishLoadingMap={() => setState({ mapLoading: false })}
        onDidFailLoadingMap={() => console.log('onDidFailLoadingMap')}
        onRegionIsChanging={args => blocksRef.current.cameraZoomChange(args.properties.zoomLevel)}
        onRegionDidChange={args => blocksRef.current.cameraZoomChange(args.properties.zoomLevel)}
        styleURL={MapboxGL.StyleURL.Light}
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        rotateEnabled
        zoomEnabled
        scrollEnabled
        animated
      >
        <Camera onReady={(api: any) => cameraApiRef.current = api} />
        <RoadDirections />
        <Blocks ref={blocksRef} />
        <UserLocation />
      </MapboxGL.MapView>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    zIndex: 1
  }
})

export default Map
