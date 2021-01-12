import React, { forwardRef, RefObject, useEffect, useImperativeHandle, useReducer } from 'react'
import { Text, View } from 'react-native'
import { Animation } from '../../library/components'
import { reducer } from '../../library/utils'
import { NotiFooterRef } from './notiFooter'

export interface FooterInfoProps {
  notiFooterRef?: React.RefObject<NotiFooterRef>
  visible?: boolean
  title?: string
}

export interface FooterInfoRef {
  open?: (info: FooterInfoProps) => void
}

const FooterInfo = forwardRef<FooterInfoRef, FooterInfoProps>((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    visible: props.visible,
    info: {},
    paddingBottom: 0
  })

  const open = (info: FooterInfoProps) => {
    const objState: any = { info, visible: true }
    if (props.notiFooterRef?.current?.isVisible) {
      objState.paddingBottom = 42
    }
    setState(objState)
  }

  const close = () => {
    setState({ visible: false })
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  useEffect(() => {
    if (state.visible !== props.visible) setState({ visible: props.visible })
  }, [props.visible])

  useEffect(() => {
    if (props.notiFooterRef?.current?.isVisible && !state.paddingBottom) {
      if (!state.paddingBottom) {
        setState({ paddingBottom: 42 })
      }
    } else {
      setState({ paddingBottom: 0 })
    }
  }, [props.notiFooterRef?.current?.isVisible])

  if (!state.visible) return <></>

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: state.paddingBottom,
        backgroundColor: '#fff',
        zIndex: 1
      }}
    >
      <Animation.AnimationHeight
        initValue={0}
        value={400}
        duration={300}
        style={{
          maxHeight: '50%',
          width: '100%'
        }}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#AAAAAA',
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: 10,
            position: 'relative'
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14
            }}
          >
            { state.info.title }
          </Text>
          <Text
            style={{
              position: 'absolute',
              fontSize: 12,
              right: 10,
              color: 'red'
            }}
            onPress={close}
          >
            Đóng
          </Text>
        </View>
        <Text>Footer Info</Text>
      </Animation.AnimationHeight>
    </View>
  )
})

export default FooterInfo
