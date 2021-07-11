import React, { useReducer, useImperativeHandle } from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { RemoveIcon } from '../Icons'
import { reducer } from '../../utils'

const Container = styled.View`
  position: absolute;
  z-index: 999;
  top: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const Content = styled.Text`
  height: 40px;
  width: 100px;
  padding: 10px;
  line-height: 20px;
  text-align: center;
  background-color: #dcf5ff;
  border: 2px solid #d3eef8;
  border-radius: 10px;
  color: #d13d3d;
  font-weight: 700;
`

const LengthOfPath = React.forwardRef((props: any, ref) => {
  const [state, setState] = useReducer(reducer, {
    visible: false,
    content: ''
  })

  const removePath = () => {
    props?.roadDirectionsRef?.current?.removeRoute()
    setState({
      visible: false,
      content: ''
    })
  }

  useImperativeHandle(ref, () => ({
    set: setState
  }))

  if (!state.visible) return (<></>)

  return (
    <Container>
      <Content>{state.content}</Content>
      <TouchableOpacity onPress={removePath}>
        <RemoveIcon size='s' stroke='#da251b' style={{ marginLeft: 3 }} />
      </TouchableOpacity>
    </Container>
  )
})

export default LengthOfPath
