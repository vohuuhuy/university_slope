import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import FooterInfo, { FooterInfoRef } from './footerInfo'
import NotiFooter, { NotiFooterRef } from './notiFooter'

export interface FloatingRef {
  notiFooterRef: React.RefObject<NotiFooterRef>
  footerInfoRef: React.RefObject<FooterInfoRef>
}

const Floating = forwardRef<FloatingRef, any>((props, ref) => {
  const notiFooterRef = useRef<NotiFooterRef>(null)
  const footerInfoRef = useRef<FooterInfoRef>(null)

  useImperativeHandle(ref, () => ({
    notiFooterRef,
    footerInfoRef
  }))

  return (
    <>
      <NotiFooter ref={notiFooterRef} />
      <FooterInfo ref={footerInfoRef} notiFooterRef={notiFooterRef} />
    </>
  )
})

export default Floating
