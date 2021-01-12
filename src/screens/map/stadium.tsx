import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/stadium.json'
import { Text } from 'react-native'
import { FloatingRef } from '../floating'
import { getFooterInfo } from './common'

export interface StadiumInterface {
  floatingRef: RefObject<FloatingRef>
}

const Stadium: FunctionComponent<StadiumInterface> = (props) => {
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
        id='stadium-shop'
        shape={shape}
        onPress={clickFeature}
      >
        <MapboxGL.FillLayer
          id='stadium-shop-fill-layer'
          style={{ fillColor: '#3d997063' }}
        />
        <MapboxGL.LineLayer
          id='stadium-line-layer'
          style={{ lineWidth: 1, lineColor: '#276247' }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.PointAnnotation
        id='stadium-name'
        coordinate={[109.20311719179153, 12.268311423019295]}
        children={
          <Text
            style={{
              color: '#276247'
            }}
          >
            Sân vận động
          </Text>
        }
      />
    </>
  )
}

export default Stadium
