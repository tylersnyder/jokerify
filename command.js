const { URL } = require('url')

class command {
    constructor(url, query) {
        if (!url) throw new Error(`InvalidArgumentException: ${!url ? 'url is blank!' : ''}`)
        this.url = new URL(url)

        this.protocol = this.url.protocol
        this.query = query
    }

    get(key) { return this.url[key] }
}

module.exports = { command }