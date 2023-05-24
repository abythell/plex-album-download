/**
 * Download images from a Plex Photo Album
 * @copyright 2018 Andrew Bythell <abythell@ieee.org>
 */
import dotenv from 'dotenv'
import { program } from 'commander'
import PlexDownload from './plex-download.js'

dotenv.config()
program.option('-a, --album <name>', 'Plex album (playlist) name')
program.option('-h, --host [hostname]', 'Plex server hostname or ip.')
program.option('-u, --user [username]', 'Plex username or email.')
program.option('-p, --password [password]', 'Plex user password')

program.parse(process.argv)
const cli = program.opts()

async function main () {
  if (!cli.album) {
    program.outputHelp()
    process.exit(1)
  }
  const plexDownload = PlexDownload.create({
    hostname: cli.host || process.env.HOST,
    username: cli.user || process.env.USERNAME,
    password: cli.password || process.env.PASSWORD
  })
  return plexDownload.download(cli.album)
}

main().catch(err => {
  console.log(err.message)
})
