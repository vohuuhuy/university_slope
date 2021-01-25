import React from 'react'
import { Body, Button, Card, CardItem, Container, Content, Text } from 'native-base'

const RegisterSuccess = (props) => {

  return (
    <Container>
      <Content>
        <Card>
          <CardItem>
            <Body>
              <Text>
                Đăng ký thành công với tài khoản {props.route?.params?.userName}
              </Text>
            </Body>
          </CardItem>
        </Card>
        <Button
          transparent
          info
          bordered
          full
          style={{ margin: 5 }}
        >
          <Text>Đăng nhập</Text>
        </Button>
      </Content>
    </Container>
  )
}

export default RegisterSuccess
