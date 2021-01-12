import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/gates.json'
import { FloatingRef } from '../floating'

export interface GatesInterface {
  floatingRef: RefObject<FloatingRef>
}

const Gates: FunctionComponent<GatesInterface> = () => {
  const shape: any = GeoJSON

  return (
    <>
      <MapboxGL.ShapeSource
        id='gate'
        shape={shape}
        onPress={() => console.log(1)}
      >
        <MapboxGL.LineLayer
          id='gate-line-layer'
          style={{ lineWidth: 3, lineColor: 'red' }}
        />
      </MapboxGL.ShapeSource>
    </>
  )
}

export default Gates
