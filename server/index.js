
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const {getApiResponse} = require('wildcard-api');

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000


app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.all('/wildcard/*' , async (req, res, next) => {
    const {body, statusCode} = await getApiResponse(req);
    res.status(statusCode);
    res.send(body);
    next();
  });

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
