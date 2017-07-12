const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const { tmpdir } = require('os')
const dir = tmpdir()

app.use(express.static(dir))

app.get('/', async (req, res) => {
  try {
    const result = await jokerify(req, res)
    const { filename } = result.attachments[0]
    res.sendFile(filename, {
      root: dir
    })
  } catch(err) {
    res.status(500)
       .send(err)
  }
})

app.get('/api/slack', async (req, res) => {
  try {
    const result = await jokerify(req, res)
    res.send(result)
  } catch(err) {
    res.status(500)
       .send(err)
  }
})

app.listen(8080, () => console.log('listening on port 8080'))
