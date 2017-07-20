const { parse } = require('url')
const { message_handler } = require('../discord')

class default_handler extends message_handler {
    constructor(discord) {
        super('default')
        this.discord = discord;
        discord.registerMessageHandler(this);
    }

    async emit(message, cmd_args) {
        message.reply(`Commands: !jokerify <search terms|image url>`)
    }
}

module.exports = { jokerify_handler }