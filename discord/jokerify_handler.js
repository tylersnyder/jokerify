const { parse } = require('url')

const { message_handler } = require('../discord')
const { command } = require('../command')
const jokerify = require('../jokerify')

export class jokerify_handler {
    constructor(discord) {
        this.type = 'default';
        discord.registerMessageHandler(this);
    }

    async emit(message) {
        const query = parse(message, true).query
        const result = await jokerify(new command(message.content, query))
            .then(response => message.reply(response.response_url))
            .catch(error => Promise.reject(error)) //forward exceptions up the stack.
    }
}