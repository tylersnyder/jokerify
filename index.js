const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const { tmpdir } = require('os')

app.use(express.static(tmpdir()))

app.get('/', async (req, res) => {
  try {
    const jokerified = await jokerify(req, res)
    const image = jokerified.attachments[0]
    res.send(`<img src="${image.image_url}" width="${image.width}" height="${image.height}" />`)
  } catch(err) {
    res.status(500)
       .send(err)
  }
})

app.get('/api/slack', async (req, res) => {
  try {
    const jokerified = await jokerify(req, res)
    res.send(jokerified)
  } catch(err) {
    res.status(500)
       .send(err)
  }
})

app.listen(8080, () => console.log('listening on port 8080'))
