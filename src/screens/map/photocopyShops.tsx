import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/photoCopyShops.json'
import { FloatingRef } from '../floating'

export interface PhotocopyShopsInterface {
  floatingRef: RefObject<FloatingRef>
}

const PhotocopyShops: FunctionComponent<PhotocopyShopsInterface> = () => {
  const shape: any = GeoJSON

  return (
    <MapboxGL.ShapeSource
      id='photocopys-shop'
      shape={shape}
      onPress={() => console.log(1)}
    >
      <MapboxGL.FillLayer
        id='photocopys-shop-fill-layer'
        style={{ fillColor: '#2ECC40' }}
      />
      <MapboxGL.LineLayer
        id='photocopys-line-layer'
        style={{ lineWidth: 1, lineColor: '#1d8229' }}
      />
    </MapboxGL.ShapeSource>
  )
}

export default PhotocopyShops
