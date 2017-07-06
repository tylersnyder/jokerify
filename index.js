const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const path = require('path')

app.use(express.static(path.join(__dirname, 'tmp')))
app.get('/', jokerify)
app.listen(8080, () => console.log('listening on port 8080'))
