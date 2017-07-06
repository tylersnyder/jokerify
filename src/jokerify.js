const jimp = require('jimp')
const { parse } = require('url')
const { getImage, getBuffer } = require('./util')

module.exports = jokerify

async function jokerify(req, res) {
  try {
    const { text } = parse(req.url, true).query
    
    if (!text || !text.includes('//')) {
      throw new Error('image url to jokerify is required')
    }

    const joker = await getImage('./src/assets/joker-cropped.png')
    const image = await getImage(text)
  
    if (image.bitmap.width > 800) {
      image.resize(800, jimp.AUTO)
    }

    joker.resize(image.bitmap.width * 0.5, jimp.AUTO)

    image.composite(
      joker,
      image.bitmap.width - joker.bitmap.width,
      image.bitmap.height - joker.bitmap.height
    )

    const buffer = await getBuffer(image)

    res.set('Content-Type', jimp.MIME_PNG)
        .send(buffer)
  } catch(err) {
    res.status(500)
       .send(err)
  }
}