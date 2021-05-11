import React, { useLayoutEffect, useRef } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import styled from 'styled-components/native'
import { HeaderTitle, Loading, LocationIcon } from '../../components'
import { defaultNavigationOptions } from '../../utils'

const Map = React.lazy(() => import('./map'))

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
  const modalBottomRef: any = useRef()

  useLayoutEffect(() => {
    props.navigation.setOptions({
      ...defaultNavigationOptions,
      headerTitle: (props: any) => {
        return (
          <HeaderTitle
            {...props}
            rightContent={(
              <TouchableWithoutFeedback
                onPress={() => console.log(+new Date())}
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
      }
    })
  }, [])

  return (
    <React.Suspense fallback={<Loading />}>
      <Map
        {...props}
        modalBottomRef={modalBottomRef}
      />
    </React.Suspense>
  )
}

export default Home
