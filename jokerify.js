const { AUTO } = require('jimp')
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

    if (text.includes('<') || text.includes('>')) {
      throw new Error('get outta heaaa')
    }

    const id = uuid()
    const dir = tmpdir()
    const filename = `${id}.png`
    
    const [ joker, image ] = await Promise.all([
      getImage('./assets/joker-cropped.png'),
      getImage(text)
    ])
  
    if (image.bitmap.width > 800) {
      image.resize(800, AUTO)
    }

    const imageWidth = image.bitmap.width
    const imageHeight = image.bitmap.height

    joker.resize(imageWidth * 0.5, AUTO)
    
    const jokerWidth = imageWidth - joker.bitmap.width
    const jokerHeight = imageHeight - joker.bitmap.height
    
    image
      .composite(
        joker,
        jokerWidth,
        jokerHeight
      )
      .write(`${dir}/${filename}`)

    return {
      response_type: 'in_channel',
      attachments: [
          {
            image_url: `https://${req.get('host')}/${filename}`,
            width: imageWidth,
            height: imageHeight
          }
      ]
    }
  } catch(err) {
    const message = err.message || err

    res.status(500)
       .send(message)
  }
}
