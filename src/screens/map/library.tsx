import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/library.json'
import { Text } from 'react-native'
import { FloatingRef } from '../floating'
import { getFooterInfo } from './common'

export interface LibraryInterface {
  floatingRef: RefObject<FloatingRef>
}

const Library: FunctionComponent<LibraryInterface> = (props) => {
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
        id='library-shop'
        shape={shape}
        onPress={clickFeature}
      >
        <MapboxGL.FillLayer
          id='library-shop-fill-layer'
          style={{ fillColor: '#a25b7347' }}
        />
        <MapboxGL.LineLayer
          id='library-line-layer'
          style={{ lineWidth: 1, lineColor: '#6b3c4c' }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.PointAnnotation
        id='library-name'
        coordinate={[109.20373544096947, 12.26954457996284]}
        children={
          <Text
            style={{
              color: '#6b3c4c'
            }}
          >
            Thư viện
          </Text>
        }
      />
    </>
  )
}

export default Library
