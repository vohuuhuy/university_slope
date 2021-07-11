import React, { useLayoutEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'
import FindWay from '../../components/FindWay'
import ComponentInfo from '../../components/ComponentInfo'
import { HeaderTitle, LocationIcon, Map } from '../../components'
import { defaultNavigationOptions } from '../../utils'

const SearchButtonContent = styled.View`
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #dcf5ff;
  border-radius: 10;
  padding-left: 25px;
`

const SearchButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #5e5e5e;
`

const Home = (props: any) => {
  const mapRef = React.useRef<any>(null)
  const findWayRef = React.useRef<any>(null)
  const componentInfoRef = React.useRef<any>(null)

  const findClick = () => {
    findWayRef.current?.open()
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      ...defaultNavigationOptions,
      headerTitle: (props: any) => {
        return (
          <HeaderTitle
            {...props}
            rightContent={(
              <TouchableWithoutFeedback
                onPress={findClick}
              >
                <SearchButtonContent>
                  <LocationIcon size='s' stroke='#da251b' style={{ marginRight: 3 }} />
                  <SearchButtonText>
                    Địa điểm, phòng học?
                  </SearchButtonText>
                </SearchButtonContent>
              </TouchableWithoutFeedback>
            )}
          />
        )
      },
      headerLeft: null
    })
  }, [])

  return (
    <>
      <Map
        {...props}
        ref={mapRef}
        componentInfoRef={componentInfoRef}
      />
      <FindWay
        ref={findWayRef}
        mapRef={mapRef}
      />
      <ComponentInfo
        ref={componentInfoRef}
      />
    </>
  )
}

export default Home
