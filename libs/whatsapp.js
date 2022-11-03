const makeWASocket = require('@adiwajshing/baileys').default

const { DisconnectReason, useMultiFileAuthState  } = require('@adiwajshing/baileys')
const { connection, lastDisconnect, qr }

var Connection = null

const start = () => {
    return new Promise(async (resolve) => {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

        const client = makeWASocket({
            //printQRInTerminal: true,
            auth: state
        })

        client.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if(connection === 'close') {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
                // reconnect if not logged out
                if(shouldReconnect) {
                    start()
                }
            } else if(connection === 'open') {
                Connection = client
                resolve(client)
            }
        })

        client.ev.on ('creds.update', saveCreds)
    })
}

const get = () => {
    return Connection
}

module.exports = {start, get}