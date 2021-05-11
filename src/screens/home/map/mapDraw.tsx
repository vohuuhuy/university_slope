import React, { FunctionComponent } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Text } from 'react-native'

const MapDraw: FunctionComponent<any> = (props) => {

  const clickFeature = (key: any) => {
    props?.navigation?.navigate('Detail', { keyData: key })
  }

  return (
    <>
      {
        Object.keys(props?.data)?.map((key: string) => {
          const data = { ...props?.data[key] }
          return (
            data?.map
            && (
              <MapboxGL.ShapeSource
                key={key}
                id={`map-${key}`}
                shape={data?.map}
                {
                  ...data.title
                  ? {
                    onPress: () => clickFeature(key)
                  } : {}
                }
              >
                <MapboxGL.FillLayer
                  id={`fill-${key}`}
                  style={data?.style?.fill || {}}
                />
                <MapboxGL.LineLayer
                  id={`line-${key}`}
                  style={data?.style?.line || {}}
                />
              </MapboxGL.ShapeSource>
            )
          )}
        )
      }
      {
        Object.keys(props?.data)?.map((key: string) => {
          const data = Object.assign({}, props?.data[key])
          return data?.name
            && (
              <MapboxGL.PointAnnotation
                key={key}
                id={`name-${key}`}
                coordinate={data.name.coordinate}
                children={
                  <Text
                    style={{
                      color: '#6b3c4c'
                    }}
                  >
                    {data.name.name}
                  </Text>
                }
              />
            )
        })
      }
    </>
  )
}

export default MapDraw
