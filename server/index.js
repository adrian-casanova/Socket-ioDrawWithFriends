const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();
var cors = require('cors');
const uuid = require('uuid');

app.use(cors());

const port = 3005;
const httpServer = createServer(app);

const database = {
  sessions: {},
  socketsList: {},
  users: {},
};

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const MAX_USERS_PER_SESSION = 2;

function findOpenSession() {
  const sessionsArr = Object.values(database.sessions);
  if (!sessionsArr.length) return false;

  for (let i = 0; i < sessionsArr.length; i++) {
    const session = sessionsArr[i];
    if (session.users.length >= MAX_USERS_PER_SESSION) continue;
    return session;
  }

  return false;
}

app.get('/join-room', (req, res) => {
  const name = req?.query?.name;
  console.log('JONING ROOM: ', name);
  if (!name) {
    res.status(400).send('KO');
    return;
  }

  if (database.users[name]) {
    console.log('USER EXISTS: ', database.users[name]);
    res.status(401).send('USER ALREADY EXISTS');
    return;
  }

  const user = {
    name,
    createDate: Date.now(),
    createDateString: new Date().toString(),
  };

  database.users[name] = user;

  let openSession = findOpenSession();

  if (!openSession) {
    openSession = {
      sessionId: uuid.v4(),
      users: [name],
      canvas: [],
      createDate: Date.now(),
      createDateString: new Date().toString(),
    };
  } else {
    openSession.users.push(name);
  }

  database.sessions[openSession.sessionId] = openSession;

  res.status(200).send(openSession);
});

app.get('/', (req, res) => {
  res.send('I"M ALIVE');
});

function initSocketHandlers(socket, room) {
  socket.on('point_drawn', event => {
    database.sessions[room].canvas.push(event);
    console.log('room: ', room, 'mosusedown: ', event);
    console.log('data: ', database.sessions[room].canvas);
    socket.to(room).emit('point_drawn', event);
  });
}

io.on('connection', socket => {
  const room = socket?.handshake?.query?.room;
  if (room) {
    console.log('JONING ROOM: ', room);
    database.socketsList[room] = socket;
    socket.join(room);
    initSocketHandlers(socket, room);
  }
});

httpServer.listen(port);
