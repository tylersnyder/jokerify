const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const path = require('path')
const { tmpdir } = require('os')

app.use(express.static(tmpdir()))

app.get('/', async (req, res) => {
  const jokerified = await jokerify(req, res)
  res.send(jokerified)
})

app.get('/view', async (req, res) => {
	const jokerified = await jokerify(req, res)
  const image = jokerified.attachments[0]
	res.send(`<img src="${image.image_url}" width="${image.width}" height="${image.height}" />`)
})

app.listen(8080, () => console.log('listening on port 8080'))
