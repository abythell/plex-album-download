import PlexAPI from 'plex-api'
import fs from 'fs'
import path from 'path'

/**
 * Plex Album Downloader
 * @class
 */
export default class PlexDownload {
  /**
   * Use PlexDownload.create() instead of invoking the constructor directly
   * @constructor
   * @param {PlexAPI} client - Plex API client instance
   */
  constructor (client) {
    this.plex = client
  }

  /**
   * Create an instance of PlexDownload
   * @param {options} options - Same options as PlexApi
   * @param {string} options.hostname - local name or IP of Plex server
   * @param {string} options.username - Plex username
   * @param {string} options.password - Plex user password
   * @returns {PlexDownload}
   */
  static create ({ hostname, username, password }) {
    const client = new PlexAPI({ hostname, username, password })
    return new PlexDownload(client)
  }

  /**
   * Get an image from Plex and save it to disk
   * @param {string} key - Plex API key of photo to saveImage
   * @param {string} filename - Full path of saved image including extension
   * @returns {Promise}
   */
  saveImage (key, filename) {
    return this.plex.query(key).then((buffer) => {
      fs.writeFileSync(filename, buffer)
    })
  }

  /**
   * Get a Plex Album by name.
   * @param {string} name - Album name
   * @returns {Promise<PlexAPI.MediaContainer.Metadata>} Plex Album Metadata
   */
  async getAlbum (name) {
    const playlists = await this.plex.query('/playlists')
    return playlists.MediaContainer.Metadata.find((album) => {
      return album.title === name
    })
  }

  /**
   * Download all images from a Plex album and save them to disk in a folder of
   * the same name.
   * @param {string} name - Plex Album (aka Playlist) name.
   * @returns {Promise}
   */
  async download (name) {
    const album = await this.getAlbum(name)
    if (!album) throw Error(`Album ${name} was not found.`)
    const images = await this.plex.query(album.key)
    if (!fs.existsSync(name)) fs.mkdirSync(name)
    for (const image of images.MediaContainer.Metadata) {
      const media = image.Media[0].Part[0]
      const filename = path.basename(media.file)
      const filepath = path.join(name, filename)
      console.log('Saving ' + filename)
      await this.saveImage(media.key, filepath)
    }
  }
} // class
