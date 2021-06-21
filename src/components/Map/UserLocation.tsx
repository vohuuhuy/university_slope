import React, { FunctionComponent, useEffect } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { PermissionsAndroid } from 'react-native'

const UserLocation: FunctionComponent<any> = () => {

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
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('khong co quyen')
        }
      })
  }, [])

  return (
    <MapboxGL.UserLocation
      onUpdate={a => {}}
      renderMode='normal'
      showsUserHeadingIndicator
      visible
    />
  )
}

export default UserLocation
