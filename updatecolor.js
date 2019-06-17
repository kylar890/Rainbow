/*
 * Discord Rainbow Roles
 * 
 * updatecolor.js :: Update the color for a role, uses direct Discord API calls (avoid issues with Discord.js)
 *
 * MIT License
 *
 * Copyright (c) 2019 Jack MacDougall
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const Debug = require('debug')
const Package = require('./package.json')
const Axios = require('axios')
const { token } = require('./token.json')

const log = Debug('update-color')

module.exports = async (guildID, roleID, colorHex) => {
    log(`Updating color for role ${guildID}/${roleID} to ${colorHex.toUpperCase()}`)
    let result
    try {
        result = await Axios.request({
            method: 'PATCH',
            url: `https://discordapp.com/api/guilds/${guildID}/roles/${roleID}`,
            timeout: 500,
            headers: {
                'Authorization': `Bot ${token}`,
                'User-Agent': `rainbow-roles-bot/${Package.version}`,
                'Content-Type': 'application/json'
            },
            data: {
                color: eval( // TODO: This is somewhat inefficent (use something that isn't eval)
                    '0x' +
                    ((colorHex.match(/#[0-9ABCDEF]{6}/i) || [])[0]|| '#FFFFFF').substring(1)
                )
            }
        })
        log(`Updated color successfully on ${guildID}/${roleID}`)
    } catch(err) {
        message = `Update for ${guildID}/${roleID} failed!`
        log(message, err)
        console.log(message, err)
        throw err
    }
    return result
}
