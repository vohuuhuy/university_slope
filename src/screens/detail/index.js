import React from 'react'
import { Card, CardItem, Container, Content, DeckSwiper, Grid, Icon, Row, Text, View } from 'native-base'
import data from '../main/map/data/index.json'
import { Image } from 'react-native'
import { getImage } from '../../assets'

const Detail = props => {
  const { params: { keyData } } = props.route

  const generateDataImages = (images) => {
    return images.map(image => ({ src: image }))
  }

  return (
    <View style={{ width: '100%' }}>
      {
        data[keyData]?.images?.length
        ? (
          <Text style={{ padding: 10, fontSize: 14, fontWeight: 'bold' }}>
            {data[keyData].images.length} ảnh {data[keyData].images.length > 1 ? '(lướt để xem)' : '' }
          </Text>
        )
        : (
          <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>
            Khu vực chưa có hình ảnh
          </Text>
        )
      }
      <View>
        {
          data[keyData]?.images?.length > 1
          && (
            <DeckSwiper
              dataSource={generateDataImages(data[keyData].images)}
              renderItem={(item, idx) =>
                <Card key={idx} style={{ elevation: 2 }}>
                  <CardItem cardBody>
                    <Image
                      style={{ height: 300, flex: 1 }}
                      source={getImage(item.src)}
                      resizeMode='cover'
                    />
                  </CardItem>
                  <CardItem>
                    <Icon name='heart' style={{ color: 'red' }} />
                  </CardItem>
                </Card>
              }
            />
          )
        }
        {
          data[keyData]?.images?.length === 1
          && (
            <Card>
              <CardItem cardBody>
                <Image
                  style={{ height: 300, flex: 1 }}
                  source={getImage(data[keyData].images[0])}
                  resizeMode='cover'
                />
              </CardItem>
              <CardItem>
                <Icon name='heart' style={{ color: 'red' }} />
              </CardItem>
            </Card>
          )
        }
      </View>
    </View>
  )
}

export default Detail
