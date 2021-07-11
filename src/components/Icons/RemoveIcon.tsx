import React from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const RemoveIcon = ({ stroke = '', size = 's', style = {} }) => {
  const d = 'M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59 L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z'

  let width = 25
  let height = 25

  if (size === 'm') {
    width = 50
    height = 50
  }

  if (size === 'l') {
    width = 75
    height = 75
  }

  return (
    <View style={{ ...style, width, height }}>
      <Svg viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={d}
          fill={stroke}
          stroke={stroke || 'red'}
        />
      </Svg>
    </View>
  )
}

export default RemoveIcon
