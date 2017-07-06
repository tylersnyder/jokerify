const app = require('express')()
const jokerify = require('./jokerify')

app.get('/', jokerify)
app.listen(8080, () => 'listening on port 8080')
