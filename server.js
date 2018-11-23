'use strict';
var express = require('express')
var request = require('request')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const _ = require('lodash')

const adapter = new FileSync('db.json')
const db = low(adapter)
const adapter2 = new FileSync('promo.json')
const promo = low(adapter2)

var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(http).listen(server)
var session = require('express-session')({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
})
var sharedsession = require('express-socket.io-session')

var sockets = {}
var PORT = process.env.PORT || 3001

app.use(session)

io.use(sharedsession(session))

io.on('connection', function(socket){ 
    // console.log(socket.handshake.session.caller_id)   
    if (socket[socket.handshake.session.caller_id] === undefined &&
        socket.handshake.session.caller_id !== undefined) {
        sockets[socket.handshake.session.caller_id] = socket
    }
    // console.log('a ws user connected')
});

app.use((req, res, next) => {
    let allowedOrigins = [
        'http://localhost:8080', 
        'http://127.0.0.1:8080',
        'http://localhost',
        'http://127.0.0.1', 
        'http://localhost:1234',
        'http://intercom.mockapi.ru',
        'https://intercomconf.com',
        'http://intercomconf.com',
        'https://demos05.voximplant.com',
        'http://demos05.voximplant.com'
    ];
    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.header('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

app.get('/checkPromo', (req, res) => {
    let free_codes = promo.get('data').find({type: "free"}).value().codes,
        medium_codes = promo.get('data').find({type: "medium_discount"}).value().codes,
        small_codes = promo.get('data').find({type: "small_discount"}).value().codes
    if (free_codes === undefined || medium_codes === undefined || small_codes === undefined) {
        res.json({"result": false})
    } else if (free_codes.length == 0 || medium_codes.length == 0 || small_codes.length == 0) {
        res.json({"result": false})
    } else {
        res.json({"result": true})    
    }    
})

app.get('/checkCallerId', (req, res) => {
    if (req.query.caller_id !== undefined) {        
        let data = db.get('data').find({ caller_id: req.query.caller_id }).value()
        if (data === undefined) {
            // Not found - OK to play
            if (sockets[req.query.caller_id] === undefined) res.json({"result": false, "reason": "no_socket"})
            else res.json({"result": true})
        } else {
            // Found - already played
            res.json({"result": false, "reason": "already_played"})
        }
    } else res.json({"error": true})
})

app.get('/setCallerId', (req, res) => {
    if (req.query.caller_id !== undefined) {
        req.session.caller_id = req.query.caller_id
        res.json({"result": true})
    } else res.json({"error": true})
})

app.get('/voxResult', (req, res) => {
    //console.log(req.query.caller_id)    
    if (sockets[req.query.caller_id] !== undefined) {
        if (req.query.action !== undefined && req.query.action == "store") {    
            if (db.get('data').find({ caller_id: req.query.caller_id }).value() === undefined) db.get('data').push({ caller_id: req.query.caller_id }).write()            
            res.json({ result: 'stored'})
        } else {
            if (req.query.action !== undefined && req.query.action == "finish") {
                try {
                    var data = JSON.parse(req.query.data)
                } catch (e) {
                    //...
                }
                //console.log(data)
                var code, code_type, codes
                if (data.points >= 19) {
                    codes = promo.get('data').find({type: "free"}).value().codes
                    code = codes.pop()
                    code_type = "FREE"
                    promo.get('data').find({type: "free"}).assign({codes: codes}).write()
                } else if (data.points >= 6 && data.points <= 18) {
                    codes = promo.get('data').find({type: "medium_discount"}).value().codes
                    code = codes.pop()
                    code_type = "MEDIUM"
                    promo.get('data').find({type: "medium_discount"}).assign({codes: codes}).write()
                } else if (data.points >= 1 && data.points <= 5) {
                    codes = promo.get('data').find({type: "small_discount"}).value().codes
                    code = codes.pop()
                    code_type = "SMALL"
                    promo.get('data').find({type: "small_discount"}).assign({codes: codes}).write()
                }
                //console.log(code)
                db.get('data')
                    .find({ caller_id: req.query.caller_id })
                    .assign({ points: data.points })
                    .assign({ promo_code: code })
                    .write()   
                if (code !== undefined) {
                    data.code = code   
                    data.code_type = code_type                 
                }
                data = JSON.stringify(data)
                let socket = sockets[req.query.caller_id]
                socket.emit('data', { result: data } )
                res.json({ result: true })
            } else {
                let socket = sockets[req.query.caller_id]
                socket.emit('data', { result: req.query.data } )
                res.json({ result: true })
            }
        }                
    } else res.json({ result: false })
})

app.get('/urlResult', (req, res) => {
    if (req.query.caller_id !== undefined && sockets[req.query.caller_id] !== undefined) {
        db.get('data')
            .find({ caller_id: req.query.caller_id })
            .assign({ record_url: req.query.url })
            .write()   
        res.json({ result: true })
    } else res.json({ result: false })
})

server.listen(PORT, () => {
    console.log('Pavel-connector-backend is listening on port %s.', PORT)
})