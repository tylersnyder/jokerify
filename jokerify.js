const jimp = require('jimp')
const { parse } = require('url')
const { getImage, getBuffer } = require('./util')
const uuid = require('uuid/v1')
const { tmpdir } = require('os')
const xss = require('xss')

module.exports = jokerify

async function jokerify(req, res) {
  try {
    const query = parse(req.url, true).query
    const text = xss(query.text)

    if (!text || !text.includes('//')) {
      throw new Error('image url to jokerify is required')
    }

    if (text.includes('<')) {
      throw new Error('get the fuck outta here with that weak shit')
    }

    const id = uuid()
    const dir = tmpdir()
    const filename = `${id}.png`
    
    const [ joker, image ] = await Promise.all([
      getImage('./assets/joker-cropped.png'),
      getImage(text)
    ])
  
    if (image.bitmap.width > 800) {
      image.resize(800, jimp.AUTO)
    }

    joker.resize(image.bitmap.width * 0.5, jimp.AUTO)
    
    image
      .composite(
        joker,
        image.bitmap.width - joker.bitmap.width,
        image.bitmap.height - joker.bitmap.height
      )
      .write(`${dir}/${filename}`)

    res.send({
      response_type: 'in_channel',
      'attachments': [
          {
            'image_url': `${req.protocol}://${req.get('host')}/${filename}`
          }
      ]
    })
  } catch(err) {
    const message = err.message || err

    res.status(500)
       .send(message)
  }
}