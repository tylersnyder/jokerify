const { URL } = require('url');

export class command {
    constructor(url, query) {
        if (!url) throw new Error(`InvalidArgumentException: ${!url ? 'url is blank!' : ''}`)
        this.url = new URL(url)
        this.query = query
    }

    static protocol = () => this.url.protocol
    static get = (key) => this.url.get(key)
}