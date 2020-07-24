'use strict'

const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const routes = require('./routes')
const path = require('path')
const handlerbars = require('./lib/handlebars')
const methods = require("./lib/methods");
const site = require("./controllers/site");
const crumb = require("crumb");
const blankie = require("blankie");
const scooter = require("@hapi/scooter");
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

    await server.register({
      plugin: require("@hapi/good"),
      options: {
        ops: {
          interval: 60000,
        },
        reporters: {
          myConsoleReporters: [
            {
              module: require("@hapi/good-console"),
            },
            "stdout",
          ],
        },
      },
    });

    await server.register([
      scooter,
      {
        plugin: blankie,
        options: {
          defaultSrc: `'self' 'unsafe-inline'`,
          styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com`,
          fontSrc: `'self' 'unsafe-inline' data:`,
          scriptSrc: `'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/`,
          generateNonces: false,
        },
      },
    ]);

    await server.register({
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: config.env === "prd",
        },
      },
    });

    await server.register(require('@hapi/basic'))

    await server.register({
      plugin: require("./lib/api"),
      options: {
        prefix: "api",
      },
    });

    server.method("setAnswerRight", methods.setAnswerRight);
    server.method("getLast", methods.getLast, {
      cache: {
        expiresIn: 1000 * 60,
        generateTimeout: 2000,
      },
    });
    
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

  server.log("info", `Servidor lanzado en: ${server.info.uri}`);
}

process.on("unhandledRejection", (error) => {
  server.log("UnhandledRejection", error);
});

process.on("unhandledException", (error) => {
  server.log("unhandledException", error);
});

init()
