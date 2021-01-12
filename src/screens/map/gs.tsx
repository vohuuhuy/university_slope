import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import { Text } from 'react-native'
import GeoJSON from './geoJsons/gs.json'
import GeoJSONNames from './geoJsons/gNames.json'
import { FloatingRef } from '../floating'
import footerInfo from './data/footerInfo.json'
import { getFooterInfo } from './common'

export interface GsInterface {
  floatingRef: RefObject<FloatingRef>
}

const Gs: FunctionComponent<GsInterface> = (props) => {
  const shape: any = GeoJSON

  const clickFeature = (event: OnPressEvent) => {
    const { features } = event
    const [feature] = features
    const { id } = feature
    if (props?.floatingRef?.current) {
      const { footerInfoRef } = props.floatingRef.current
      if (footerInfoRef?.current?.open) {
        if (id) {
          footerInfoRef.current.open(getFooterInfo(id))
        }
      }
    }
  }

  return (
    <>
      <MapboxGL.ShapeSource
        id='gs'
        shape={shape}
        onPress={clickFeature}
      >
        <MapboxGL.FillLayer
          id='gs-fill-layer'
          style={{ fillColor: '#ff851b59' }}
        />
        <MapboxGL.LineLayer
          id='gs-line-layer'
          style={{ lineWidth: 1, lineColor: '#c76815' }}
        />
      </MapboxGL.ShapeSource>
      {GeoJSONNames?.length && (GeoJSONNames.map(GeoJSONName => (
        <MapboxGL.PointAnnotation
          key={GeoJSONName.name}
          id={GeoJSONName.name}
          coordinate={GeoJSONName.coordinate}
          children={
            <Text
              style={{
                color: '#c76815'
              }}
            >
              {GeoJSONName.name}
            </Text>
          }
        />
      )))}
    </>
  )
}

export default Gs
