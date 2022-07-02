const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const users = {}

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidV4 } = require('uuid');
const { markAsUntransferable } = require('worker_threads');
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (_req, res) => {
    
    res.render('index', { link : `/${uuidV4()}`});
})
// app.post('/:room', (req, res) => {
//     res.redirect(`/${uuidV4()}`);
// });
app.get('/:room', (req,res)=> {
    res.render('room', { roomId: req.params.room });
})
io.on('connection', socket => {
    socket.on('new-user-joined', nig => {
        users[socket.id] = nig;
        socket.broadcast.emit('user-joined', nig)
    });
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        
        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })

        socket.on('send', message => {
            socket.broadcast.emit('receive', { message: message, nig: users[socket.id] })
        });
        socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.io];
        });
    })
})
server.listen(process.env.PORT||3030);