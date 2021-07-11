import React from 'react'
import {
  Dimensions,
  Keyboard,
  View
} from 'react-native'
import {
  ModalContent,
  SlideAnimation,
  BottomModal,
  ModalTitle
} from 'react-native-modals'
import styled from 'styled-components/native'
import Image from '../Image'
import { getMedia } from '../../tools/client'
import { reducer } from '../../utils'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
const percentHeight = 350 / windowHeight

const ImageComponentContainer = styled.ScrollView`
  position: absolute;
  top: 0;
  left: 0;
  height: 150px;
  padding: 5px 0;
  display: flex;
  flex-direction: row;
`

const ImageContainer = styled.View`
  height: 140px;
  width: 224px;
  background-color: #dcf5ff44;
  margin-right: 5px;
`

const InfoContainer = styled.View`
  margin-top: 160px;
`

const InfoRow = styled.View`
  height: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
`

const InfoRowTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  width: 110px;
`

const InfoRowContent = styled.Text`
  font-size: 16px;
`

const ComponentInfo = React.forwardRef((props: any, ref) => {
  const [state, setState] = React.useReducer(reducer, {
    visibe: false,
    title: '',
    type: '',
    info: '',
    range: '',
    images: [],
    haveRange: false
  })

  const open = (block: any) => {
    const title = block?.title || ''
    const type = block?.type || 'Chưa xác định'
    const info = block?.info || ''
    const range = block?.range || 'Chưa xác định'
    const haveRange = block?.haveRange || false
    const images = block?.images || []

    setState({
      visibe: true,
      title,
      type,
      info,
      range,
      haveRange,
      images
    })
  }

  const close = () => {
    Keyboard.dismiss()

    setState({ visibe: false })
  }

  React.useImperativeHandle(ref, () => ({
    open,
    close
  }))

  return (
    <BottomModal
      onTouchOutside={close}
      modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
      modalTitle={
        <ModalTitle
          title={state.title}
          style={{
            backgroundColor: '#dcf5ff',
            borderBottomColor: '#da251b',
            height: 50
          }}
          textStyle= {{
            color: '#727267'
          }}
        />
      }
      visible={state.visibe}
      height={Math.min(percentHeight, windowHeight)}
      width={1}
      rounded
    >
      <ModalContent>
        <View style={{ alignItems: 'center', justifyContent: 'center' }} />
        <ImageComponentContainer
          style={{ width: windowWidth }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {state.images?.map((image: string, index: number) => (
            <ImageContainer
              style={{
                marginLeft: !index ? 5 : 0
              }}
            >
              <Image
                sources={getMedia([image])}
                style={{ width: '100%', height: '100%' }}
                resizeMode='cover'
              />
            </ImageContainer>
          ))}
        </ImageComponentContainer>
        <InfoContainer>
          <InfoRow>
            <InfoRowTitle>Phân loại:</InfoRowTitle>
            <InfoRowContent>{state.type}</InfoRowContent>
          </InfoRow>
          <InfoRow>
            <InfoRowTitle>Khoảng cách:</InfoRowTitle>
            <InfoRowContent>{state.range}</InfoRowContent>
          </InfoRow>
          <InfoRow>
            <InfoRowTitle>Thông tin khác:</InfoRowTitle>
            <InfoRowContent>{state.info}</InfoRowContent>
          </InfoRow>
        </InfoContainer>
      </ModalContent>
    </BottomModal>
  )
})

export default ComponentInfo
