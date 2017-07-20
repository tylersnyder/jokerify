const { parse } = require('url')

const { message_handler } = require('../discord')
const jokerify = require('../jokerify')

class jokerify_handler extends message_handler {
    constructor(discord) {
        super('default')
        this.discord = discord;
        discord.registerMessageHandler(this);
    }

    async emit(message, cmd_args) {
        const result = await jokerify(cmd_args)
            .then(response => message.reply('', { file: `${this.discord.url}/${response.attachments[0].filename}` }))
            .catch(error => Promise.reject(error)) //forward exceptions up the stack.
    }
}

module.exports = { jokerify_handler }