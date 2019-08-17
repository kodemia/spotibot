const spotify = require('../lib/spotify')

const apiHost = 'https://api.spotify.com/v1'
const limit = 2

async function findTrack (query = '', page = 1) {
  // const response = await spotify.search({ type: 'track', query, limit, offset: 2 })

  const offset = limit * page
  const response = await spotify.request(`${apiHost}/search?q=${query}&limit=${limit}&offset=${offset}&type=track`)
  const items = response.tracks.items
  const cleanItems = items.map((item) => {
    return {
      name: item.name,
      artists: item.artists.map(artist => artist.name).join(', '),
      url: item.external_urls.spotify
    }
  })
  const trackText = cleanItems.map((item) => {
    let text = `Title: ${item.name}\n`
    text += `Artists: ${item.artists}\n`
    text += item.url
    return text
  })
  return trackText
}

async function findPlaylist (query = '') {
  const response = await spotify.search({ type: 'playlist', query, limit })
  const items = response.playlists.items
  const cleanItems = items.map((item) => {
    return {
      name: item.name,
      owner: item.owner,
      url: item.external_urls.spotify
    }
  })
  const playlistText = cleanItems.map((item) => {
    let text = `Title: ${item.name}\n`
    text += `Owner: ${item.owner}\n`
    text += item.url
    return text
  })
  return playlistText
}

module.exports = {
  findTrack,
  findPlaylist
}


