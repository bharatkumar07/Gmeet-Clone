if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const users = {}
const users2 = [];
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidV4 } = require('uuid');
const { markAsUntransferable } = require('worker_threads');
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');

app.use(express.static('public'));
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users2.find(user => user.email === email),
    id => users2.find(user => user.id === id)
)

let roomBoard = {}
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { link: `/${uuidV4()}` })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users2.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
    
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


// app.post('/:room', (req, res) => {
//     res.redirect(`/${uuidV4()}`);
// });
app.get('/:room', (req, res) => {
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

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })

        socket.on('send', message => {
            socket.broadcast.emit('receive', { message: message, nig: users[socket.id] })
        });
        socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        });

        socket.on('getCanvas', () => {
            if (roomBoard[roomId])
                socket.emit('getCanvas', roomBoard[roomId]);
        });

        socket.on('draw', (newx, newy, prevx, prevy, color, size) => {
            socket.to(roomId).emit('draw', newx, newy, prevx, prevy, color, size);
        })

        socket.on('clearBoard', () => {
            socket.to(roomId).emit('clearBoard');
        });

        socket.on('store canvas', url => {
            roomBoard[roomId] = url;
        })
    })
})
server.listen(process.env.PORT || 443);