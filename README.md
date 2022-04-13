[![NPM](https://nodei.co/npm/reliablehandler.png)](https://nodei.co/npm/reliablehandler/)

# TABLE OF CONTENTS

- [Installation](#installation)
- [Setup](#setup)

# Installation

**NPM**

```bash
npm i reliablehandler
```

# Setup

To initialize ReliableHandler -

```JS
const Discord = require('discord.js')
const { Intents } = require('discord.js')
const ReliableHandler = require('reliablehandler')

const config = require('./config.json')

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
})

client.on('ready' , () => {
    console.log(`Logged in as ${client.user.tag}!`)

    new ReliableHandler(client)
})

client.login(config.TOKEN)
```

You can specify your `commands` folder by doing so -
```JS
new ReliableHandler(client , 'cmds')
```

Few notes to make here are you should have a directory called `commands` no matter what IF you haven't specified the commands directory

# Creating a Command

We have worked on making a command as simple as possible using ReliableHandler.

Here's and example of a `ping` command:

```JS
// File name: "ping.js"
// Folder "./cmds"

module.exports = {
    name: 'ping' , // Required
    aliases: ['p'] , // Optional aliases
    description: "A simple ping command" , // Optional description
    callback: (message) => {
        message.reply('Pong!')
    }
}
```

## Min and Max Arugment Rules

You can speficy how many arguments are required and also provide an error message for every command.

