/**
 * Download images from a Plex Photo ALBUM
 * @copyright 2018 Andrew Bythell <abythell@ieee.org>
 *
 * Edit hostname, username, password, and the name of the
 * photo album below.  All images in the album will be downloaded
 * into a sub folder of the current one, using the album name.
 */
const fs = require('fs')
const path = require('path')
const PlexAPI = require('plex-api')
const client = new PlexAPI({
  hostname: 'your-local-plex-host',
  username: 'your-plex-username',
  password: 'your-plex-password'
})
const ALBUM = 'your-album-name'

/**
 * Get an image from Plex and save it to disk
 * @param {string} key - Plex API key of photo to saveImage
 * @param {string} filename - Full path of saved image including extension
 * @returns {Promise} resolves true, rejects with Error.
 */
function saveImage (key, filename) {
  console.log('Saving ' + filename)
  return client.query(key).then((buffer) => {
    fs.writeFileSync(filename, buffer)
  })
}

/**
 * Get a Plex Album
 * @param {string} name - Album name
 * @returns {Promise<PlexAPI.MediaContainer.Metadata>} Plex Album Metadata
 */
async function getAlbum (name) {
  const playlists = await client.query('/playlists')
  return playlists.MediaContainer.Metadata.find((album) => {
    return album.title === name
  })
}

async function main () {
  const album = await getAlbum(ALBUM)
  const images = await client.query(album.key)
  if (!fs.existsSync(ALBUM)) fs.mkdirSync(ALBUM)
  for (const image of images.MediaContainer.Metadata) {
    const media = image.Media[0].Part[0]
    const filename = path.basename(media.file)
    const filepath = path.join(ALBUM, filename)
    await saveImage(media.key, filepath)
  }
}

main().catch(console.error)
