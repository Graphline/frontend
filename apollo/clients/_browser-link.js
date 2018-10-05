import {HttpLink,} from 'apollo-link-http'
import {onError,} from 'apollo-link-error'
import {RetryLink,} from 'apollo-link-retry'
import {from,} from 'apollo-link'

export const link = () => {
  const errorLink = onError(({graphQLErrors, networkError, response = {},}) => {
    if (response && networkError) {
      response.errors = null
    }
  })

  const retryLink = new RetryLink({
    'delay': {
      'initial': 500,
      'max':     5000,
      'jitter':  true,
    },
    'attempts': {
      'max':     Infinity,
      'retryIf': (error) => !error,
    },
  })

  const httpLink = new HttpLink({
    'uri': process.env.API_HTTP,
  })

  return from([
    errorLink,
    retryLink,
    httpLink,
  ])
}
