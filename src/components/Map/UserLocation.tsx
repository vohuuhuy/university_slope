import React, { useEffect } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { PermissionsAndroid } from 'react-native'
import { useImperativeHandle } from 'react'
import { reducer } from '../../utils'

const UserLocation = React.forwardRef((props: any, ref) => {
  const coordinateRef = React.useRef<any>(null)

  const [state, setState] = React.useReducer(reducer, {
    haveLocationPermission: false
  })

  const check = () => state.haveLocationPermission

  const update = (location: any) => {
    coordinateRef.current = [location?.coords?.longitude, location?.coords?.latitude]
  }

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
        setState({ haveLocationPermission: granted === PermissionsAndroid.RESULTS.GRANTED })
      })
  }, [])

  useImperativeHandle(ref, () => ({
    check,
    get: () => coordinateRef.current
  }))

  return (
    <MapboxGL.UserLocation
      onUpdate={update}
      renderMode='normal'
      showsUserHeadingIndicator
      visible
    />
  )
})

export default UserLocation
