'use strict'

const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const routes = require('./routes')
const path = require('path')
const handlerbars = require('handlebars')
const site = require("./controllers/site");
const {config} = require('./config')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)
    await server.register(vision)

    server.state("user", {
      ttl: 1000 * 60 * 60 * 24 * 7,
      isSecure: config.env === "prd",
      encoding: "base64json",
      path: "/",
    });

    server.views({
      engines: {
        hbs: handlerbars
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.ext("onPreResponse", site.fileNotFound);
    server.route(routes)

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en: ${server.info.uri}`)
}

process.on("unhandledRejection", (error) => {
  console.error("UnhandledRejection", error.message, error);
});

process.on("unhandledException", (error) => {
  console.error("unhandledException", error.message, error);
});

init()
