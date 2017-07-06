const jimp = require('jimp')

module.exports = exports
exports.getImage = getImage
exports.getBuffer = getBuffer

async function getImage(path) {
  return new Promise((resolve, reject) => {
    jimp.read(path, (err, image) => {
      if (err) {
        return reject(err.message)
      }

      resolve(image)
    })
  })
}

async function getBuffer(image) {
  return new Promise((resolve, reject) => {
    image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
      if (err) {
        return reject(err.message)
      }
      
      resolve(buffer)
    })
  })
}
