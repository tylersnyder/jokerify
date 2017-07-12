const { AUTO } = require('jimp')
const { parse } = require('url')
const { isWebUri } = require('valid-url')
const { getImage } = require('./util')
const uuid = require('uuid/v1')
const { tmpdir } = require('os')
const xss = require('xss')
const isImage = require('is-image')
const dir = tmpdir()

module.exports = jokerify

async function jokerify(req, res) {
  try {
    const query = parse(req.url, true).query
    const text = xss(query.text)

    if (!text) {
      throw new Error('image url to jokerify is required')
    }

    const { url, caption } = parseInput(text)
    const id = uuid()
    const filename = `${id}.png`
    
    const [ joker, canvas ] = await Promise.all([
      getImage('./assets/joker-cropped.png'),
      getImage(url)
    ])
  
    const result = await compositeAndWrite({ canvas, joker, filename })

    if (result !== 'success') {
      throw result
    }
    
    return {
      response_type: 'in_channel',
      attachments: [
          {
            filename,
            image_url: `${req.protocol}://${req.get('host')}/${filename}`,
          }
      ]
    }
  } catch(err) {
    throw err.message
  }
}

function parseInput(input) {
  const [ url, caption ] = input.split(' ')

  if (!isWebUri(url) || !isImage(url)) {
    throw new Error('image url to jokerify is required')
  }

  return {
    url,
    caption
  }
}

function compositeAndWrite({ canvas, joker, filename }) {
  return new Promise((resolve, reject) => {
    if (canvas.bitmap.width > 800) {
      canvas.resize(800, AUTO)
    }

    const { width } = canvas.bitmap
    const { height } = canvas.bitmap
    const jokerWidth = width - joker.bitmap.width
    const jokerHeight = height - joker.bitmap.height

    joker.resize(width * 0.5, AUTO)
    
    canvas
      .composite(joker, jokerWidth, jokerHeight)
      .write(`${dir}/${filename}`, (err) => {
        if (err) {
          return reject(err)
        }

        resolve('success')
      })
  })
}