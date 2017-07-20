const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const { tmpdir } = require('os')
const root = tmpdir()
const { post } = require('request')
const { parse } = require('url')

//discord
const { discord_driver } = require('./discord')
const { jokerify_handler } = require('./discord/jokerify_handler')

app.use(express.static(root))
let rootRequestHandler = async (req, res) => {
    try {
        const query = parse(req.url, true).query
        const result = await jokerify(query.text)

        res.sendFile(`${req.protocol}://${req.get('host')}/${result.attachments[0].filename}`, { root })
    } catch (error) {
        console.error(error, error.stack)
        res.status(500)
            .send(error)
    }
}

app.get('/', rootRequestHandler)

const slackRequestHandler = async (req, res) => {
    try {
        res.send({
            response_type: 'in_channel',
            text: 'working on it...'
        })
        const query = parse(req.url, true).query
        const result = await jokerify(query.response_url || query.text)
        const response_url = `${req.protocol}://${req.get('host')}/${result.attachments[0].filename}`

        if (!result)
            throw new Error('Empty result returned from the Jokerifier!')

        const payload = {
            response_type: 'in_channel',
            response_url: result.responseUrl,
            replace_original: true,
            attachments: result.attachments
        }

        console.log('slack response url: ', response_url)
        console.log('slack post payload: ', payload)

        post(response_url, { json: payload })
    } catch (error) {
        console.error(error, error.stack);
        res.status(200)
            .send({ text: error.message })
    }
}

app.get('/api/slack', slackRequestHandler)

app.listen(8080, () => console.log('listening on port 8080'))
new jokerify_handler(new discord_driver())