import React, { FunctionComponent, useEffect, useReducer, useRef } from 'react'
import { StyleSheet } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import styled from 'styled-components/native'
import Component from './Component'
import RoadDirections from './RoadDirections'
import Camera from './Camera'
import UserLocation from './UserLocation'
import LengthOfPath from './LengthOfPath'
import { reducer } from '../../utils'
import { Loading } from '../index'
import { useImperativeHandle } from 'react'
import { Schemas } from '../../tools/realm'
import { REALM_VERSION } from '../../constants'

MapboxGL.setAccessToken('pk.eyJ1Ijoidm9odXVodXkwMTAzMTk5OSIsImEiOiJja2pvaDB3YmowZGd0MnpsMWx4ejBtcnpzIn0.nKEnGnYEi12fqlyvscYxhw')

const ContainerMap = styled.View`
  position: relative;
`

const Map: FunctionComponent<any> = React.forwardRef((props, ref) => {
  const setDataForRefs = useRef(false)
  const cameraApiRef = useRef()
  const blocksRef = useRef<any>()
  const roadDirectionsRef = useRef<any>()
  const lengthOfPathRef = useRef<any>()
  const userLocationRef = useRef<any>()

  const [state, setState] = useReducer(reducer, {
    mapLoading: true
  })

  const setMapLoading = (mapLoading: boolean) => setState({ mapLoading })

  useImperativeHandle(ref, () => ({
    getRoute: roadDirectionsRef.current?.getRoute,
    getPaths: roadDirectionsRef.current?.getPaths,
    getComponents: blocksRef.current?.getComponents
  }))

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false)
  }, [])

  useEffect(() => {
    if (
      blocksRef?.current?.setComponents &&
      roadDirectionsRef?.current?.setPaths &&
      !setDataForRefs.current
    ) {
      const init = async () => {
        const realm = await Realm.open({
          schema: Schemas,
          schemaVersion: REALM_VERSION
        })

        const realmComponents = realm.objects('Component')
        const realmPaths = realm.objects('Path')

        const components = realmComponents.map((component: any) => JSON.parse(JSON.stringify({
          _id: component._id,
          code: component.code,
          name: component.name,
          coordinate: component.coordinate,
          images: component.images,
          zooms: component.zooms,
          titleZooms: component.titleZooms,
          search: component.search ? JSON.parse(component.search) : null,
          map: component.map ? JSON.parse(component.map) : null,
          style: component.style ? JSON.parse(component.style) : null,
          childs: component.childs ? JSON.parse(component.childs) : null,
          wayIns: component.wayIns ? JSON.parse(component.wayIns) : null,
          type: component.type,
          info: component.info
        })))

        const paths = realmPaths.map((path: any) => JSON.parse(JSON.stringify({
          _id: path._id,
          coordinates: JSON.parse(path.coordinates)
        })))

        roadDirectionsRef?.current?.setPaths(paths)
        blocksRef?.current?.setComponents(components)
        setDataForRefs.current = true

        realm.close()
      }

      init()
    }
  }, [JSON.stringify(blocksRef?.current), JSON.stringify(roadDirectionsRef?.current)])

  return (
    <ContainerMap>
      {state.mapLoading && <Loading />}
      <LengthOfPath
        ref={lengthOfPathRef}
        roadDirectionsRef={roadDirectionsRef}
      />
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
        <Camera
          onReady={(api: any) => cameraApiRef.current = api}
        />
        <RoadDirections
          ref={roadDirectionsRef}
          cameraRef={cameraApiRef.current}
          lengthOfPathRef={lengthOfPathRef}
          setMapLoading={setMapLoading}
        />
        <Component
          ref={blocksRef}
          componentInfoRef={props.componentInfoRef}
          userLocationRef={userLocationRef}
          roadDirectionsRef={roadDirectionsRef}
        />
        <UserLocation
          ref={userLocationRef}
        />
      </MapboxGL.MapView>
    </ContainerMap>
  )
})

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    zIndex: 1
  }
})

export default Map
