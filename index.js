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
const ALBUM = 'your-album-to-be-saved'

// List all playlists
client.query('/playlists/').then((playlists) => {
  // find photo album playlist
  var album = playlists.MediaContainer.Metadata.find((album) => {
    return album.title === ALBUM
  })
  // get details on the specified album
  return client.query(album.key)
}).then((images) => {
  // create a directory for the album
  if (!fs.existsSync(ALBUM)) {
    fs.mkdirSync(ALBUM)
  }
  // fetch each image in the album in series, not in parallel to avoid 503
  return images.MediaContainer.Metadata.reduce((chain, image) => {
    // get image details
    var media = image.Media[0].Part[0]
    var filename = path.basename(media.file)
    return chain.then(() => {
      // save image to disk
      var filepath = path.join(ALBUM, filename)
      return saveImage(media.key, filepath)
    })
  }, Promise.resolve())
}).then(() => {
  console.log('Done')
  process.exit(0)
}).catch((err) => {
  console.log(err)
  process.exit(1)
})

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
