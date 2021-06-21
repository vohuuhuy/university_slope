import React from 'react'
import styled from 'styled-components/native'

const HeaderTitleContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
`

export const Logo = styled.Image`
  width: 50px;
  height: 50px;
`

export const Logo75 = styled.Image`
  width: 75px;
  height: 75px;
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
      <Logo source={require('../../assets/NTULogo50.png')} />
      <RigthContent>
        {rightContent}
      </RigthContent>
    </HeaderTitleContent>
  )
}

export default HeaderTitle
