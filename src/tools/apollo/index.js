import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const httpLink = new HttpLink({
  uri: 'http://devcloud3.digihcs.com:15333/graphql'
})

const asyncAuthLink = setContext((_, { headers }) =>
  AsyncStorage.getItem('authorization').then(value => {
    return ({
      headers: {
        ...headers,
        authorization: value || '',
      }
    })
  })
)

export const client = new ApolloClient({
  link: from([asyncAuthLink, httpLink]),
  cache: new InMemoryCache()
})