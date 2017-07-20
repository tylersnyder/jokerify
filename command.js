const { URL } = require('url')

class command {
    constructor(url, query) {
        if (!url) throw new Error(`InvalidArgumentException: ${!url ? 'url is blank!' : ''}`)
        this.url = new URL(url)
        this.query = query
    }

    static protocol() { return this.url.protocol }
    static get(key) { return this.url.get(key) }
}

module.exports = { command }