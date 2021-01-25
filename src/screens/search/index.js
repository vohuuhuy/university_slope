import React, { useReducer, useRef } from 'react'
import { Container, Content, Icon, Input, Item, Left, List, ListItem, Right, Text } from 'native-base'
import data from '../main/map/data/index.json'
import { reducer, unsignString } from '../../library/utils'
import { Keyboard } from 'react-native'

const Search = (props) => {
  const [state, setState] = useReducer(reducer, {
    items: []
  })

  let timeOut = useRef().current

  const search = value => {
    if (timeOut) clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      let items = []
      if (value) {
        value = unsignString(value)
        items = Object.values(data)?.filter(item => item.search?.data?.includes(value))
          ?.map(item => ({
            name: item?.title || '',
            coordinate: item.search?.coordinate
          })) || []
      }
      setState({ items })
    }, 500)
  }

  const move = coordinate => {
    Keyboard.dismiss()
    setTimeout(() => {
      props?.navigation?.navigate('Main', { coordinate })
    }, 300)
  }

  return (
    <Container>
      <Content>
        <Item regular style={{ margin: 5 }}>
          <Input
            placeholder='Nhập địa điểm ...'
            onChangeText={search}
            autoCapitalize='none'
          />
          <Icon active name='search' />
        </Item>
        <List style={{ marginTop: 15 }}>
          {state.items?.map((item, idx) => (
            <ListItem key={idx} onPress={() => move(item.coordinate)}>
              <Left>
                <Text>{item.name}</Text>
              </Left>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          ))}
        </List>
      </Content>
    </Container>
  )
}

export default Search
