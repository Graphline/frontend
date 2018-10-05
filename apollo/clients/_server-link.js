import {HttpLink,} from 'apollo-link-http'
import {onError,} from 'apollo-link-error'
import {RetryLink,} from 'apollo-link-retry'
import {from,} from 'apollo-link'

import pkg from '@/package.json'

export const link = () => {
  const errorLink = onError(({graphQLErrors, networkError, response = {},}) => {
    if (response && networkError) {
      response.errors = null
    }
  })

  const uaLink = (operation, forward) => {
    operation.setContext((context) => {
      context.headers = {
        'user-agent': `graphline-ssr/${pkg.version} (+https://github.com/Graphline)`,
      }

      return context
    })

    return forward(operation)
  }

  const retryLink = new RetryLink({
    'delay': {
      'initial': 500,
      'max':     2000,
      'jitter':  true,
    },
    'attempts': {
      'max':     3,
      'retryIf': (error) => !error,
    },
  })

  const httpLink = new HttpLink({
    'uri': process.env.API_HTTP,
  })

  return from([
    errorLink,
    uaLink,
    retryLink,
    httpLink,
  ])
}
