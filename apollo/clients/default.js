import {ApolloClient,} from 'apollo-client'
import {InMemoryCache,} from 'apollo-cache-inmemory'
import fetch from 'isomorphic-unfetch'

import {link as browserLink,} from './_browser-link'
import {link as serverLink,} from './_server-link'

const isServer = typeof window === 'undefined'

export default () => new ApolloClient({
  'link': isServer
    ? serverLink()
    : browserLink(),

  'cache': new InMemoryCache(),
  fetch,

  'defaultOptions': {
    'watchQuery': {
      'fetchPolicy': 'no-cache',
      'errorPolicy': 'ignore',
    },
    'query': {
      'fetchPolicy': 'no-cache',
      'errorPolicy': 'all',
    },
  },
})
