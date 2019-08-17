const Spotify = require('node-spotify-api')

const spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET
})

module.exports = spotify

