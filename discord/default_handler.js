const { parse } = require('url')
const { message_handler } = require('../discord')

class default_handler extends message_handler {
    constructor(discord) {
        super(discord, 'default')
    }

    async emit(message, cmd_args) {
        return message.reply(`Commands: !jokerify <search terms|image url>`)
    }
}

module.exports = { default_handler }