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
        const o = cmd_args.join();
        console.log(o);
        const query = parse(o, true).query
        const result = await jokerify(new command(o, query))
            .then(response => message.reply(response.response_url))
            .catch(error => Promise.reject(error)) //forward exceptions up the stack.
    }
}

module.exports = { jokerify_handler }