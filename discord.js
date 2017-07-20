const { Discord } = require('discord.js');

const client = new Discord.Client()
const token = ''

export class message_handler {
    constructor(command_type, callback) {
        if (!command_type || (!callback || !callback instanceof Promise))
            throw new Error(`InvalidArgumentException: Malformed message_handler Registration.`)

        this.type = command_type
        this.emit = (message) => callback(message)
        
        this.emit.catch(error => this.handle_error)
    }

    static handle_error = (error) => console.error(error)
    static is_handler = (obj) => obj && obj.type && obj.emit && obj.emit instanceof Promise
}

export class discord_driver {
    constructor() {
        this.message_handlers = {}

        client.on('ready', this.onReady)
        client.on('message', this.onMessage)
    }

    static client = () => client
    static token = () => token

    static registerMessageHandler(handler) {
        if (!handler instanceof message_handler && !message_handler.is_handler(handler))
            throw new Error('InvalidArgumentException: Malformed message_handler')

        if (this.message_handlers[handler.type]) return

        this.message_handlers[handler.type] = handler
    }

    onReady = () => {
        console.log('Discord Driver online.')
    }

    onMessage = (message) => {
        const cmd = message || '';
        const emitter = (!this.message_handlers[cmd] && this.message_handlers.default)
            ? this.message_handlers.default
            : this.message_handlers[message] || null

        if (!emitter)
            return message.reply('Whut?')

        return emitter.emit(message)
    }
}