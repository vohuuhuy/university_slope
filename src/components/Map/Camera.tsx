import React, { FunctionComponent, useEffect, useReducer } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { reducer } from '../../utils'
const setting: any = require('./setting.json')

let isFirstSaveCamera = false
const cameraMaxBounds: {
  ne: [number, number],
  sw: [number, number]
} | any = setting.maxBounds

const Camera: FunctionComponent<any> = (props) => {

  const [state, setState] = useReducer(reducer, {
    camera: {
      followUserLocation: false,
      followUserMode: 'normal'
    },
    api: null
  })

  useEffect(() => {
    if (state.api) {
      if (typeof props.onReady === 'function') {
        props.onReady(state.api)
      }
    }
  }, [state.api])

  return (
    <MapboxGL.Camera
      ref={api => {
        if (!isFirstSaveCamera) {
          setState({ api })
          isFirstSaveCamera = true
        }
      }}
      maxZoomLevel={setting.maxZoom}
      minZoomLevel={setting.minZoom}
      animationMode='flyTo'
      defaultSettings={{
        centerCoordinate: [109.2019048333168, 12.267764953112714], // Vị trí camera
        heading: 0, // Độ xoay [0, 360]
        pitch: 0, // Độ nghiêng [0, 60]
        zoomLevel: setting.zoom // Độ phóng to [15, 19]
      }}
      maxBounds={cameraMaxBounds} // Độ phủ bản đồ
      followUserLocation={state.camera.followUserLocation}
      followUserMode={state.camera.followUserMode}
    />
  )
}

export default Camera
