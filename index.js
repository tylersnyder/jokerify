const express = require('express')
const app = express()
const jokerify = require('./jokerify')
const { tmpdir } = require('os')
const root = tmpdir()
const { post } = require('request')
const { parse } = require('url')
const { fs } = require('fs')

const settings = require('./settings.json')
settings.url = `${settings.protocol}://${settings.host}${settings.port ? ':' + settings.port : ''}`

//discord
const { discord_driver } = require('./discord')
const { jokerify_handler } = require('./discord/jokerify_handler')

app.use(express.static(root))
const rootRequestHandler = async (req, res) => {
    try {
        const query = parse(req.url, true).query
        const result = await jokerify(settings.url, query.text)

        res.sendFile(result.attachments[0].image_url, { root })
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
        const result = await jokerify(settings.url, query.response_url || query.text)
        const response_url = result.attachments[0].image_url

        if (!result)
            throw new Error('Empty result returned from the Jokerifier!')

        const payload = {
            response_type: 'in_channel',
            response_url: result.response_url,
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
new jokerify_handler(new discord_driver(settings))