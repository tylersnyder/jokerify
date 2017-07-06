const jimp = require('jimp')
const { parse } = require('url')
const { getImage, getBuffer } = require('./util')
const uuid = require('uuid/v1')
const path = require('path')

module.exports = jokerify

async function jokerify(req, res) {
  try {
    const { text } = parse(req.url, true).query
    
    if (!text || !text.includes('//')) {
      throw new Error('image url to jokerify is required')
    }

    const id = uuid()
    const dest = `${id}.png`
    
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
      .write(`tmp/${dest}`)

    res.send({
      response_type: 'in_channel',
      'attachments': [
          {
            'image_url': `${req.protocol}://${req.get('host')}/${dest}`
          }
      ]
    })
  } catch(err) {
    res.status(500)
       .send(err)
  }
}