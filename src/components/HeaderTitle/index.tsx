import React from 'react'
import styled from 'styled-components/native'

const HeaderTitleContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
`

const Logo = styled.Image`
  width: 50px;
  height: 50px;
`

const RigthContent = styled.View`
  min-width: 200px;
  height: 100%;
  padding: 3px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderTitle = (props: any) => {
  const {
    rightContent = <></>
  } = props
  return (
    <HeaderTitleContent>
      <Logo source={require('../../assets/NTULogo.png')} />
      <RigthContent>
        {rightContent}
      </RigthContent>
    </HeaderTitleContent>
  )
}

export default HeaderTitle
