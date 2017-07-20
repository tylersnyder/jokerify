const { parse } = require('url')

const { message_handler } = require('../discord')
const { command } = require('../command')
const jokerify = require('../jokerify')

class jokerify_handler {
    constructor(discord) {
        this.type = 'default';
        this.discord = discord;
        discord.registerMessageHandler(this);
    }

    async emit(message, cmd_args) {
        const result = await jokerify(cmd_args)
            .then(response => message.reply(response.response_url))
            .catch(error => Promise.reject(error)) //forward exceptions up the stack.
    }
}

module.exports = { jokerify_handler }