import readdir from 'recursive-readdir'

export default async ({app, server,}) => {
  app.use(async (req, res) => {
    const files = await readdir('./views/')
    const name = files.find((file) => {
      const requestPath = req.path.substring(1, req.path.length)
      const filePath = file.substring(file.indexOf('/') + 1)
      const fileRoute = filePath.split('\.')[0]
      const isIndex = fileRoute.split('/').reverse()[0] === 'index'

      let route = fileRoute.replace(/^index$/g, '')

      if (isIndex) {
        route = route.split(/\/index$/g)[0]
      }

      return `${route}` === requestPath
    })

    if (!name) {
      return res.status(404).render('views/status/404', {
        req,
      })
    }

    try {
      return res.render(name, {
        req,
      })
    } catch (error) {
      return res.json({
        'error': error.message,
      })
    }
  })
}
