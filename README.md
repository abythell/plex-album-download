Plex album downloader - Download and save all images from a Plex album. 
Run `node .` to see command line options.  Plex host, username, and password
can be set via command line, environment variables, or in `.env`:

```
HOST = 'local-ip-of-plex-server'
USERNAME = 'your-email'
PASSWORD = 'your-password'
```
Command line options override environment variables.

To rotate to the correct orientation based on EXIF flags after
downloading, use `exiftran -i -a *.jpg`.  This allows images to be
displayed correctly on inexpensive picture frames.
