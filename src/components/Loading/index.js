import React from 'react'
import * as Progress from 'react-native-progress'
import styled from 'styled-components/native'

const LoadingContent = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`

const Loading = () => {
  return (
    <LoadingContent>
      <Progress.Circle size={30} indeterminate={true} color='blue' />
    </LoadingContent>
  )
}

export default Loading
