import React, { FunctionComponent, RefObject, useEffect, useReducer, useRef } from 'react'
import geolocation from '@react-native-community/geolocation'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { PermissionsAndroid, StyleSheet, View } from 'react-native'
import { reducer } from '../../library/utils'
import mapSetting from './mapSetting.json'
import { FloatingRef } from '../floating'

const styles = StyleSheet.create({
  makerUser: {
    width: 8,
    height: 8,
    backgroundColor: 'blue',
    borderRadius: 50
  }
})

export interface MeAnnotationInterface {
  floatingRef: RefObject<FloatingRef>
  camera: MapboxGL.Camera
}

const MeAnnotation: FunctionComponent<MeAnnotationInterface> = (props) => {
  const [state, setState] = useReducer(reducer, {
    latitude: 0,
    longitude: 0,
    isInSide: false
  })

  const isFlyTo = useRef(false)
  const isNotiOutSide = useRef(false)

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Quyền truy cập vị trí',
        message: 'Vui lòng cho phép Dốc đại học có quyền truy cập vị trí của bạn?',
        buttonNeutral: 'Hỏi lại sau',
        buttonNegative: 'Không',
        buttonPositive: 'Cho phép'
      }
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          geolocation.setRNConfiguration({ authorizationLevel: 'always', skipPermissionRequests: true })
          geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
            const isInSide = longitude >= mapSetting.maxBounds.ne[0] && longitude <= mapSetting.maxBounds.sw[0]
              && latitude >= mapSetting.maxBounds.ne[1] && longitude <= mapSetting.maxBounds.sw[1]
            setState({ latitude, longitude, isInSide })
          })
        } else {
          if (props.floatingRef?.current) {
            const { notiFooterRef } = props.floatingRef.current
            if (notiFooterRef.current?.open) {
              notiFooterRef.current.open({
                title: 'Vị trí không được phép truy cập'
              })
            }
          }
        }
      })
  }, [])

  useEffect(() => {
    if (state.longitude) {
      const { isInSide } = state
      if (isInSide) {
        if (!isFlyTo.current) {
          props.camera?.flyTo([state.longitude, state.latitude], 3000)
          isFlyTo.current = true
        }
        isNotiOutSide.current = false
      } else {
        if (!isNotiOutSide.current) {
          if (props.floatingRef?.current) {
            const { notiFooterRef } = props.floatingRef.current
            if (notiFooterRef.current?.open) {
              notiFooterRef.current.open({
                title: 'Bạn đang ngoài khu vực Dốc đại học'
              })
            }
          }
          isNotiOutSide.current = true
        }
        isFlyTo.current = false
      }
    }
  }, [props.camera, state.longitude])

  if (state.longitude && state.isInSide) return (
    <MapboxGL.PointAnnotation
      id='user'
      coordinate={[state.longitude, state.latitude]}
      children={<View style={styles.makerUser} />}
    />
  )

  return <></>
}

export default MeAnnotation
