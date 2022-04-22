[![NPM](https://nodei.co/npm/reliablehandler.png)](https://nodei.co/npm/reliablehandler/)

# TABLE OF CONTENTS

- [Installation](#installation)
- [Setup](#setup)
- [Argument Rules](#arugment-rules)
- [Syntax Errors](#syntax-errors)
- [Required Permissions](#required-permssions)

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

# Arugment Rules

You can speficy how many arguments are required and also provide an error message for every command.

```JS
// File name: "ping.js"
// Folder "./cmds"

module.exports = {
    name: 'ping' , // Required
    aliases: ['p'] , // Optional aliases
    description: "A simple ping command" , // Optional description
    minArgs: 0 ,
    maxArgs: 0 ,
    syntaxError: "Incorrect Syntax!"
    callback: (message) => {
        message.reply('Pong!')
    }
}
```

If you want no maximum aguments , you can do -

```js
maxArgs: -1 // -1 is no limit
```

# Syntax Errors

Most of the times the Syntax Errors will be same. You can speficy a common syntax error for all the commands using -

```js
new ReliableHandler(client)
    .setSyntaxError('Incorrect Syntax!`)
```

If you've speficied syntax error in the command , it will override the global syntax error.

# Required Permssions

For example: If you are using a ban command , you would want the person using the `BAN MEMBERS` permission. To speficy that you can do so -

```js
module.exports = {
    maxArgs: 1 ,
    requiredPermissions: ['BAN_MEMBERS'] ,
    callback: () => {
        // code
    }
}
```

All supported permissions - 

```js
export = [
    'CREATE_INSTANT_INVITE' ,
    'KICK_MEMBERS' ,
    'BAN_MEMBERS' ,
    'ADMINISTRATOR' ,
    'MANAGE_CHANNELS' ,
    'MANAGE_GUILD' ,
    'ADD_REACTIONS' ,
    'VIEW_AUDIT_LOG' ,
    'PRIORITY_SPEAKER' ,
    'STREAM' ,
    'VIEW_CHANNEL' ,
    'SEND_MESSAGES' ,
    'SEND_TTS_MESSAGES' ,
    'MANAGE_MESSAGES' ,
    'EMBED_LINKS' ,
    'ATTACH_FILES' ,
    'READ_MESSAGE_HISTORY' ,
    'MENTION_EVERYONE' ,
    'USE_EXTERNAL_EMOJIS' ,
    'VIEW_GUILD_INSIGHTS' ,
    'CONNECT' ,
    'SPEAK' ,
    'MUTE_MEMBERS' ,
    'DEAFEN_MEMBERS' ,
    'MOVE_MEMBERS' ,
    'USE_VAD' ,
    'CHANGE_NICKNAME' ,
    'MANAGE_NICKNAMES' ,
    'MANAGE_ROLES' ,
    'MANAGE_WEBHOOKS' ,
    'MANAGE_EMOJIS' ,
]
```