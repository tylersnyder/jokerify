const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const path = require('path')
const { tmpdir } = require('os')

app.use(express.static(tmpdir()))
app.get('/', jokerify)
app.listen(8080, () => console.log('listening on port 8080'))
