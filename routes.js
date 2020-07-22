'use strict'

const site = require('./controllers/site')
const user = require('./controllers/user')
const Joi = require('@hapi/joi')
const question = require("./controllers/question");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: site.home,
  },
  {
    method: "GET",
    path: "/register",
    handler: site.register,
  },
  {
    method: "POST",
    path: "/create-user",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().min(3),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6),
        }),
        failAction: user.failValidation,
      },
    },
    handler: user.createUser,
  },
  {
    method: "GET",
    path: "/login",
    handler: site.login,
  },
  {
    method: "GET",
    path: "/ask",
    handler: site.ask,
  },
  {
    method: "GET",
    path: "/question/{id}",
    handler: site.viewQuestion,
  },
  {
    path: "/validate-user",
    method: "POST",
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6),
        }),
        failAction: user.failValidation,
      },
    },
    handler: user.validateUser,
  },
  {
    path: "/create-question",
    method: "POST",
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
        }),
        failAction: user.failValidation,
      },
    },
    handler: question.createQuestion,
  },
  {
    method: "GET",
    path: "/logout",
    handler: user.logout,
  },
  {
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: ".",
        index: ["index.html"],
      },
    },
  },
  {
    method: ["GET", "POST"],
    path: "/{any*}",
    handler: site.notFound,
  },
];
