const Discord = require('discord.js');
const client = new Discord.Client()

// SETTINGS
const token = ''
const max_arguments = 3

// END SETTINGS
class message_handler {
    constructor(command_type, callback) {
        if (!command_type || (!callback || !callback instanceof Promise))
            throw new Error(`InvalidArgumentException: Malformed message_handler Registration.`)

        this.type = command_type
        this.emit = (cmd, parsed_message) => callback(cmd, parsed_message)

        this.emit.catch(error => this.handle_error)
    }

    static handle_error(error) { return console.error(error) }
    static is_handler(obj) { obj && obj.type && obj.emit && obj.emit instanceof Promise }
}

const parseMessageContent = (content) =>
    `${content}`
    .split(' ', max_arguments + 1)
    .reverse()

class discord_driver {
    constructor() {
        this.message_handlers = {}

        client.on('ready', () => this.onReady)
        client.on('message', () => this.onMessage)
    }

    static client() { return client }
    static token() { return token }

    registerMessageHandler(handler) {
        if (!handler instanceof message_handler && !message_handler.is_handler(handler))
            throw new Error('InvalidArgumentException: Malformed message_handler')

        if (this.message_handlers[handler.type]) return
        this.message_handlers[handler.type] = handler

        console.log(`[Discord]: Registered '${handler.type}' as a message handler.`)
    }

    onReady() {
        console.log('Discord Driver online.')
    }

    onMessage(message) {
        const parsed_message = parseMessageContent(message.content)
        const cmd = parsed_message[parsed_message.length - 1].startsWith('/')
            ? parsed_message.pop()
            : null
        
        const emitter = ((!cmd || !this.message_handlers[cmd]) && this.message_handlers.default)
            ? this.message_handlers.default
            : this.message_handlers[message] || null

        if (!emitter)
            return message.reply('Whut?')

        return emitter.emit(cmd, parsed_message)
    }
}

module.exports = {
    message_handler,
    discord_driver
}