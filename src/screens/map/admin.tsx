import React, { FunctionComponent, RefObject } from 'react'
import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps'
import GeoJSON from './geoJsons/admin.json'
import { Text } from 'react-native'
import { FloatingRef } from '../floating'
import { getFooterInfo } from './common'

export interface AdminInterface {
  floatingRef: RefObject<FloatingRef>
}

const Admin: FunctionComponent<AdminInterface> = (props) => {
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
        id='admin-shop'
        shape={shape}
        onPress={clickFeature}
      >
        <MapboxGL.FillLayer
          id='admin-shop-fill-layer'
          style={{ fillColor: '#a25b7347' }}
        />
        <MapboxGL.LineLayer
          id='admin-line-layer'
          style={{ lineWidth: 1, lineColor: '#6b3c4c' }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.PointAnnotation
        id='admin-name'
        coordinate={[109.20197188854218, 12.26741898596725]}
        children={
          <Text
            style={{
              color: '#6b3c4c'
            }}
          >
            Khu hành chính
          </Text>
        }
      />
    </>
  )
}

export default Admin
