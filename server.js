const wa = require('./libs/whatsapp')
const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')

wa.start()

const app = express()
const port = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Route
app.get('/sendMessage', async (req, res) => {
    const client = wa.get()
    
    if (req.query.no == undefined || req.query.msg == undefined) {
        res.status(400).send({
            error: 'Nomor atau pesan tidak boleh kosong'
        })
    }    
    
    const no = req.query.no + '@s.whatsapp.net'
    const msg = req.query.msg
    await client.sendMessage(no, {text: msg})
    res.send({status: true})
})

app.listen(port, () => {
    console.log('App berjalan pada port: ' + port)
})