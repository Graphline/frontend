// import readdir from 'recursive-readdir'
import createClient from '@/apollo/clients/default'
import entryBySlug from '@/apollo/queries/entry-by-slug.gql'

const client = createClient()

export default async ({app, server,}) => {
  app.use(async (req, res) => {
    // const files = await readdir('./views/')
    const requestPath = req.path.substring(1, req.path.length)

    // const name = files.find((file) => {
    //   const filePath = file.substring(file.indexOf('/') + 1)
    //   const fileRoute = filePath.split('\.')[0]
    //   const isIndex = fileRoute.split('/').reverse()[0] === 'index'
    //
    //   let route = fileRoute.replace(/^index$/g, '')
    //
    //   if (isIndex) {
    //     route = route.split(/\/index$/g)[0]
    //   }
    //
    //   return `${route}` === requestPath
    // })

    const {data,} = await client.query({
      'query':     entryBySlug,
      'variables': {
        'slug': requestPath,
      },
    })

    // if (!name) {
    //   return res.status(404).render('views/status/404', {
    //     req,
    //   })
    // }

    try {
      return res.render('views/entry', {
        req,
        data,
      })
    } catch (error) {
      return res.json({
        'error': error.message,
      })
    }
  })
}
