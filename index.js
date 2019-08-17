require('dotenv').config()
const Telegraf = require('telegraf')
const Markup = require('telegraf/Markup')

const spotify = require('./usecases/spotify')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start((ctx) => {
  console.log('first_name: ', ctx.from.first_name)
  ctx.reply(`Hola ${ctx.from.first_name}! 😎`)
})

bot.command('track', async (ctx) => {
  const query = ctx.message.text.replace('/track', '').trim()
  const tracks = await spotify.findTrack(query)

  const replyPromises = tracks.map(track => ctx.reply(track))
  const replies = await Promise.all(replyPromises)

  ctx.reply('Quieres mas?', Markup.inlineKeyboard([
    Markup.callbackButton('Si, por favor', `next-tracks 2 ${query}`)
  ]).extra())
})

bot.on('callback_query', async (ctx) => {
  const text = ctx.callbackQuery.data
  const [ command, page, ...query ] = text.split(' ')

  switch (command) {
    case 'next-tracks':
      const tracks = await spotify.findTrack(query.join(' '), page)
      const replyPromises = tracks.map(track => ctx.reply(track))
      await Promise.all(replyPromises)

      ctx.reply('Quieres mas?', Markup.inlineKeyboard([
        Markup.callbackButton('Si, por favor', `next-tracks ${page + 1} ${query}`)
      ]).extra())
      break
    case 'next-playlists':
      break

    default:
      break;
  }
})

bot.command('playlist', async (ctx) => {
  const query = ctx.message.text.replace('/playlist', '').trim()
  const playlists = await spotify.findPlaylist(query)

  const replyPromises = playlists.map(playlist => ctx.reply(playlist))
  const replies = await Promise.all(replyPromises)
})

bot.launch()
  .then(() => {
    console.info('> BOT READY!')
  })
  .catch((error) => {
    console.error('ERROR: ', error)
  })