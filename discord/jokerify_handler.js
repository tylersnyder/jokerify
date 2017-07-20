const { parse } = require('url')

const { message_handler } = require('../discord')
const jokerify = require('../jokerify')

class jokerify_handler extends message_handler {
    constructor(discord) {
        super('jokerify')
        this.discord = discord;
        discord.registerMessageHandler(this);
    }

    async emit(message, cmd_args) {
        const result = await jokerify(this.discord.url, cmd_args.join())
            .then(response => message.reply('', { file: response.attachments[0].image_url }))
            .catch(error => Promise.reject(error)) //forward exceptions up the stack.
    }
}

module.exports = { jokerify_handler }