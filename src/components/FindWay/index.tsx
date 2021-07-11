import React from 'react'
import { useImperativeHandle } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native'
import { ModalContent, SlideAnimation, BottomModal } from 'react-native-modals'
import styled from 'styled-components/native'
import { reducer, unsignString } from '../../utils'
import { LocationIcon, RemoveIcon } from '../Icons'
import HideKeyBoard from '../HideKeyBoard'
import { useEffect } from 'react'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  flex: 1;
`

const FormContainer = styled.View`
  padding: 20px;
  background-color: #dcf5ff;
`

const LocationContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const LocationLabel = styled.Text`
  font-size: 20px;
  height: 40px;
  line-height: 40px;
  font-weight: 700;
  color: #5e5e5e;
`

const LocationInput = styled.TextInput`
  border: 1.5px solid #da251b88;
  border-radius: 7.5px;
  padding: 0;
  font-size: 20px;
  height: 40px;
  line-height: 20px;
  padding: 10px;
  margin-bottom: 10px;
  color: #5e5e5e;
`

const SearchOptionContainer = styled.View`
  background-color: #fff;
  margin-top: 20px;
  padding: 10px;
`

const SearchOption = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  background: #dcf5ff;
  margin-bottom: 10px;
`

const SearchOptionText = styled.Text`
  font-size: 20px;
`

let searchTimeOut: NodeJS.Timeout | null = null

const coors = [109.20153066515921, 12.267970043270468]

const FindWay = React.forwardRef((props: any, ref) => {
  const inputStartRef = React.useRef<any>()
  const inputEndRef = React.useRef<any>()
  const sourceInfo = React.useRef<any>()
  const destinationInfo = React.useRef<any>()

  const [state, setState] = React.useReducer(reducer, {
    visibe: false,
    focus: false,
    inputName: '',
    searchOptions: []
  })

  const open = () => {
    setState({ visibe: true })
  }

  const close = () => {
    Keyboard.dismiss()
    setState({
      visibe: false,
      focus: false,
      inputName: ''
    })
  }

  const inputFocus = (inputName: string) => {
    setState({
      focus: true,
      inputName
    })
  }

  const inputBlur = (inputName: string = state.inputName) => {
    setState({
      focus: false,
      inputName: '',
      searchOptions: []
    })

    if (inputName === 'start') {
      if (sourceInfo.current) {
        inputStartRef.current.setNativeProps({ text: sourceInfo.current.text })
      } else {
        inputStartRef.current.setNativeProps({ text: '' })
      }
    }

    if (inputName === 'end') {
      if (destinationInfo.current) {
        inputEndRef.current.setNativeProps({ text: destinationInfo.current.text })
      } else {
        inputEndRef.current.setNativeProps({ text: '' })
      }
    }
  }

  const inputChange = (text: string) => {
    if (searchTimeOut) clearTimeout(searchTimeOut)

    if (!text) setState({ searchOptions: [] })

    searchTimeOut = setTimeout(() => {
      const searchOptions = props?.mapRef?.current?.getComponents()?.filter(
        (component: any) => component?.search?.data?.includes(unsignString(text.toLocaleLowerCase()))
      )
        .map((component: any) => (
          <TouchableWithoutFeedback onPress={() => searchOptionsPress(component)}>
            <SearchOption>
              <SearchOptionText>
                {component?.name}
              </SearchOptionText>
              <LocationIcon size='s' stroke='#da251b' style={{ marginLeft: 10 }} />
            </SearchOption>
          </TouchableWithoutFeedback>
        ))

      setState({ searchOptions })
    }, 100)
  }

  const myLocationPress = () => {
    const info = {
      text: 'Vị trí hiện tại',
      coors,
      wayIns: [],
      isCurrentLocation: true
    }

    if (state.inputName === 'start') {
      inputStartRef.current.setNativeProps({ text: info.text })
      inputStartRef.current.blur()
      sourceInfo.current = info
    }

    if (state.inputName === 'end') {
      inputEndRef.current.setNativeProps({ text: info.text })
      inputEndRef.current.blur()
      destinationInfo.current = info
    }

    if (destinationInfo.current && sourceInfo.current) {
      setTimeout(() => {
        props?.mapRef?.current?.getRoute(sourceInfo.current, destinationInfo.current)
        sourceInfo.current = null
        destinationInfo.current = null
      }, 200)
    }
  }

  const searchOptionsPress = (component: any) => {
    const info = {
      text: component?.name,
      coors: component.coordinate,
      wayIns: component?.wayIns,
      isCurrentLocation: false
    }

    if (state.inputName === 'start') {
      inputStartRef.current.setNativeProps({ text: info.text })
      sourceInfo.current = info
      inputStartRef.current.blur()
    }

    if (state.inputName === 'end') {
      inputEndRef.current.setNativeProps({ text: info.text })
      destinationInfo.current = info
      inputEndRef.current.blur()
    }

    if (destinationInfo.current && sourceInfo.current) {
      close()
      setTimeout(() => {
        props?.mapRef?.current?.getRoute(sourceInfo.current, destinationInfo.current)
        sourceInfo.current = null
        destinationInfo.current = null
      }, 200)
    }
  }

  const removeLocationPress = () => {
    if (state.inputName === 'start') {
      inputStartRef.current.setNativeProps({ text: '' })
      inputStartRef.current = null
    }

    if (state.inputName === 'end') {
      inputEndRef.current.setNativeProps({ text: '' })
      inputEndRef.current = null
    }

    inputChange('')
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  return (
    <BottomModal
      onTouchOutside={close}
      onSwipeOut={close}
      visible={state.visibe}
      modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
      swipeDirection={['up', 'down']}
      swipeThreshold={200}
      style={{ zIndex: 1000 }}
      height={1}
      width={1}
      rounded
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ModalContent>
          <HideKeyBoard>
            <Container style={{ width: windowWidth, height: windowHeight }}>
              <FormContainer>
                <LocationContainer>
                  <LocationLabel style={{ width: 70 }}>
                    Bắt đầu
                  </LocationLabel>
                  <LocationInput
                    onFocus={() => inputFocus('start')}
                    onChangeText={inputChange}
                    onBlur={() => inputBlur('start')}
                    ref={inputStartRef}
                    style={{ width: windowWidth - 130 }}
                    selectTextOnFocus
                  />
                  {state.focus && state.inputName === 'start' && (
                    <TouchableOpacity onPress={removeLocationPress}>
                      <RemoveIcon size='s' stroke='#da251b' style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  )}
                </LocationContainer>

                <LocationContainer>
                  <LocationLabel style={{ width: 70 }}>
                    Kết thúc
                  </LocationLabel>
                  <LocationInput
                    onFocus={() => inputFocus('end')}
                    onChangeText={inputChange}
                    onBlur={() => inputBlur('end')}
                    ref={inputEndRef}
                    style={{ width: windowWidth - 130 }}
                    selectTextOnFocus
                  />
                  {state.focus && state.inputName === 'end' && (
                    <TouchableOpacity onPress={removeLocationPress}>
                      <RemoveIcon size='s' stroke='#da251b' style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  )}
                </LocationContainer>
              </FormContainer>

              {state.focus && (
                <SearchOptionContainer>
                  {state.inputName === 'start' && (
                    <TouchableWithoutFeedback onPress={myLocationPress}>
                      <SearchOption>
                        <SearchOptionText>
                          Vị trí hiện tại
                        </SearchOptionText>
                        <LocationIcon size='s' stroke='#da251b' style={{ marginLeft: 10 }} />
                      </SearchOption>
                    </TouchableWithoutFeedback>
                  )}
                  {state.searchOptions?.length > 0 && (
                    <>{state.searchOptions}</>
                  )}
                </SearchOptionContainer>
              )}
            </Container>
          </HideKeyBoard>
        </ModalContent>
      </KeyboardAvoidingView>
    </BottomModal>
  )
})

export default FindWay
