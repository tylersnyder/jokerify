const { AUTO } = require('jimp')
const { parse } = require('url')
const { isWebUri } = require('valid-url')
const { getImage } = require('./util')
const uuid = require('uuid/v1')
const { tmpdir } = require('os')
const xss = require('xss')
const isImage = require('is-image')
const dir = tmpdir()
const { get } = require('request')

module.exports = jokerify

async function jokerify(req, res) {
  try {
    const query = parse(req.url, true).query
    var text = xss(query.text)
    const responseUrl = xss(query.response_url)

    if (!text || text.length ==0) {
      text =  await GetRandomImageURL();
    }
    else{
      if (!isWebUri(text) || !isImage(text)) {
        text =  await GetRandomImageURL(text);
      }
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
      response_url: responseUrl,
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

async function GetRandomImageURL(search) {
  var url ='http://api.flickr.com/services/feeds/photos_public.gne?nojsoncallback=1&format=json';

  if(search && search.length>0){
    url+='&tags='+search;
  }

  return new Promise((resolve, reject) => {
    get(url, function(error, response, body) {
      try{
        var data = JSON.parse(body.replace(/\\'/g, "'"));
        var image_src = data.items[Math.floor(Math.random() * data.items.length)]['media']['m'].replace("_m", "_b");
        return resolve(image_src);
      }
      catch(err){
        return resolve('https://s-media-cache-ak0.pinimg.com/736x/91/c2/f8/91c2f8931b4954ab41f665e88b1e1acf--paula-deen-happy-thanksgiving.jpg');
      }
      
    })
  })
}

function parseInput(input) {
  const [ url, caption ] = input.split(' ')

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
    
    if(width<height)
      joker.resize(width * 0.5, AUTO)
    else
      joker.resize(AUTO, height * 0.5)

    const jokerWidth = width - joker.bitmap.width
    const jokerHeight = height - joker.bitmap.height

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