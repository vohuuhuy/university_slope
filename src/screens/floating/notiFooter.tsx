import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Notification } from '../../library/components'
import { NotificationProps } from '../../library/components/notification'
import { reducer } from '../../library/utils'

const style = StyleSheet.create({
  noti: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 10,
    width: '100%',
    zIndex: 2
  },
  notiTitle: {
    color: '#fff'
  }
})

export interface NotiFooterProps extends NotificationProps {
  visible?: boolean
}

export interface NotiFooterRef {
  open?: (noti: NotificationProps) => void
  isVisible?: boolean
}

const NotiFooter = forwardRef<NotiFooterRef, NotiFooterProps>((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    visible: props.visible,
    noti: {}
  })

  const open = (noti: NotiFooterProps) => {
    setState({ visible: true, noti })
  }

  useImperativeHandle(ref, () => ({
    open,
    isVisible: state.visible
  }))

  useEffect(() => {
    if (state.visible !== props.visible) setState({ visible: props.visible })
  }, [props.visible])

  if (!state.visible) return <></>

  return (
    <Notification
      {...props}
      {...state.noti}
      style={style.noti}
      titleProps={{
        style: style.notiTitle
      }}
      ref={ref}
    />
  )
})

export default NotiFooter
