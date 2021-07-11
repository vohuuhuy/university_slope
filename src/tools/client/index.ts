import axios, { AxiosRequestConfig } from 'axios'

interface GraphQLClientRequestOptions {
  variables: any,
  onDownloadProgress?: (e: any) => void
}

interface GraphQLClientQueryOptions extends GraphQLClientRequestOptions {
  query: any
}

interface GraphQLClientMutationOptions extends GraphQLClientRequestOptions {
  mutation: any
}

class GraphQLClient {
  axios

  constructor({ baseURL, headers }: AxiosRequestConfig) {
    this.axios = axios.create({
      baseURL,
      headers,
      timeout: 5000
    })
  }

  query({ query, variables, onDownloadProgress }: GraphQLClientQueryOptions) {
    return this.axios.post('', {
      query,
      variables,
      onDownloadProgress
    })
  }

  mutate({ mutation, variables, onDownloadProgress }: GraphQLClientMutationOptions) {
    return this.axios.post('', {
      query: mutation,
      variables,
      onDownloadProgress
    })
  }
}

const Client = new GraphQLClient({
  baseURL: 'http://ntumap.tk/graphql',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getMedia = (names: string[]) => {
  return names.map(name => ({ uri: `http://ntumap.tk/media/${name}` })).concat(require('../../assets/image-not-found.png'))
}

export default Client
