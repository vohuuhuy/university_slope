import React from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/ntuBorder.json'

const NTUBorder = () => {
  const shape: any = GeoJSON

  return (
    <MapboxGL.ShapeSource
      id='ntu-border'
      shape={shape}
      onPress={() => console.log(1)}
    >
      <MapboxGL.FillLayer
        id='ntu-border-fill-layer'
        style={{ fillColor: '#fff0' }}
      />
      <MapboxGL.LineLayer
        id='ntu-border-line-layer'
        style={{ lineWidth: 1.5, lineColor: '#36d4ffab' }}
      />
    </MapboxGL.ShapeSource>
  )
}

export default NTUBorder
