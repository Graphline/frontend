export default async ({app, server,}) => {
  app.get('/', (req, res) => {
    return res.json({'hello': 'world',})
  })
}
