import React from 'react'
import MapboxGL, { FillLayerStyle } from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/mapBorder.json'
import { StyleProp } from 'react-native';

const smileyFace: StyleProp<FillLayerStyle> = {
  fillOutlineColor: '#ed0000',
  fillColor: '#ffffff00',
};

const MapBorder = () => {
  const shape: GeoJSON.FeatureCollection | any = GeoJSON

  return (
    <MapboxGL.ShapeSource
      id='map-border'
      shape={shape}
    >
      <MapboxGL.FillLayer
        id='map-border-fill-layer'
        style={smileyFace}
      />
    </MapboxGL.ShapeSource>
  )
}

export default MapBorder
