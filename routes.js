"use strict";

const site = require("./controllers/site");
const user = require("./controllers/user");
const Joi = require("@hapi/joi");
const question = require("./controllers/question");
const { isAuth } = require("./utils/middleware/auth");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: site.home,
    options: {
      pre: [{ method: isAuth }],
      cache: {
        expiresIn: 1000 * 30,
        privacy: "private",
      },
    },
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
    options: {
      pre: [{ method: isAuth }],
    },
  },
  {
    method: "GET",
    path: "/question/{id}",
    handler: site.viewQuestion,
    options: {
      pre: [{ method: isAuth }],
    },
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
      pre: [{ method: isAuth }],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          image: Joi.any().optional(),
        }),
        failAction: user.failValidation,
      },
      payload: {
        //output: "stream",
        //parse: true,
        allow: [
          "application/json",
          "multipart/form-data",
          "image/jpeg",
          "application/pdf",
          "application/x-www-form-urlencoded",
        ],
        maxBytes: 1024 * 1024 * 100,
        //timeout: false,
        multipart: true,
      },
    },
    handler: question.createQuestion,
  },
  {
    path: "/answer-question",
    method: "POST",
    options: {
      pre: [{ method: isAuth }],
      validate: {
        payload: Joi.object({
          answer: Joi.string().required(),
          id: Joi.string().required(),
        }),
        failAction: user.failValidation,
      },
    },
    handler: question.answerQuestion,
  },
  {
    method: "GET",
    path: "/answer/{questionId}/{answerId}",
    handler: question.setAnswerRight,
    options: {
      pre: [{ method: isAuth }],
    },
  },
  {
    method: "GET",
    path: "/logout",
    handler: user.logout,
    options: {
      pre: [{ method: isAuth }],
    },
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
