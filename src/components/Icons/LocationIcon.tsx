import { View } from 'native-base'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const LocationICon = ({ stroke = '', size = 's', style = {} }) => {
  const d1 = 'M25 42.5l-.8-.9C23.7 41.1 12 27.3 12 19c0-7.2 5.8-13 13-13s13 5.8 13 13c0 8.3-11.7 22.1-12.2 22.7l-.8.8zM25 8c-6.1 0-11 4.9-11 11 0 6.4 8.4 17.2 11 20.4 2.6-3.2 11-14 11-20.4 0-6.1-4.9-11-11-11z'
  const d2 = 'M25 24c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z'

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
      <Svg viewBox='0 0 50 50'>
        <Path
          d={d1}
          fill={stroke}
          stroke={stroke || 'red'}
        />
        <Path
          d={d2}
          fill={stroke}
          stroke={stroke || 'red'}
        />
      </Svg>
    </View>
  )
}

export default LocationICon
