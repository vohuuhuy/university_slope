import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/ks.json'
import GeoJSONNames from './geoJsons/kNames.json'
import { Text } from 'react-native'
import { FloatingRef } from '../floating'
import { getFooterInfo } from './common'

export interface KsInterface {
  floatingRef: RefObject<FloatingRef>
}

const Ks: FunctionComponent<KsInterface> = (props) => {
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
        id='ks'
        shape={shape}
        onPress={clickFeature}
      >
        <MapboxGL.FillLayer
          id='ks-fill-layer'
          style={{ fillColor: '#0074d95c' }}
        />
        <MapboxGL.LineLayer
          id='ks-line-layer'
          style={{ lineWidth: 1, lineColor: '#0056a2' }}
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
                color: '#0056a2'
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

export default Ks
