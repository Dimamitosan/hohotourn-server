import { Server } from 'socket.io'
import { createServer } from 'http'
import { sequelize } from './config/database'
sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!')
})

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

//bot
import TelegramBot from 'node-telegram-bot-api'

const webAppUrl = 'https://client.ru.tuna.am'

const token = '6304629931:AAFq7J2ONfaq9j_co_vdQRWMY0eUfZJkK6E'

const bot = new TelegramBot(token, { polling: true })

bot.on('message', async (msg) => {
  // ПОМЕНЯТЬ ТИП msg

  const chatId = msg.chat.id
  const text = msg.text

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Для игры нажмите кнопку ниже', {
      reply_markup: {
        inline_keyboard: [[{ text: 'играть', web_app: { url: webAppUrl } }]],
      },
    })
  }
  bot.sendMessage(chatId, 'Received your message')
})

//server

type Lobby = {
  code: string
  players: string[]
}

const lobbies: { [key: string]: Lobby } = {}

const generateLobbyCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase()
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  socket.on('createLobby', () => {
    const code = generateLobbyCode()
    lobbies[code] = { code, players: [socket.id] }

    socket.join(code)
    socket.emit('lobbyCreated', code)
    io.to(code).emit('updatePlayers', lobbies[code].players)
  })

  socket.on('joinLobby', (code) => {
    if (lobbies[code]) {
      lobbies[code].players.push(socket.id)
      socket.join(code)
      io.to(code).emit('updatePlayers', lobbies[code].players)
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    for (const code in lobbies) {
      const lobby = lobbies[code]
      const index = lobby.players.indexOf(socket.id)
      if (index !== -1) {
        lobby.players.splice(index, 1)
        io.to(code).emit('updatePlayers', lobby.players)

        if (lobby.players.length === 0) {
          delete lobbies[code]
        }
      }
    }
  })
})

httpServer.listen(3001, () => {
  console.log('Socket.IO server running at http://localhost:3001/')
})
