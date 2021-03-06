'use strict'
const questionModel = require("../models/index").questions;

async function home(req, h) {
  let questions;
  try {
    questions = await req.server.methods.getLast(10);
  } catch (error) {
    console.error(error);
  }

  return h.view("index", {
    title: "home",
    user: req.state.user,
    questions,
  });
}

function register (req, h) {
  return h.view("register", {
    title: "Registro",
    user: req.state.user,
  });
}

function login (req, h) {
  return h.view("login", {
    title: "Ingrese",
    user: req.state.user,
  });
}

function notFound(req, h) {
  return h.view("404", {}, { layout: "error-layout" }).code(404);
}

function fileNotFound(req, h) {
  const response = req.response;
  if (
    !req.path.startsWith("/api") &&
    response.isBoom &&
    response.output.statusCode === 404
  ) {
    return h.view("404", {}, { layout: "error-layout" }).code(404);
  }

  return h.continue;
}

function ask(req, h) {
  return h.view("ask", {
    title: "Crear pregunta",
    user: req.state.user,
  });
}

async function viewQuestion(req, h) {
  let data;
  try {
    data = await questionModel.getOne(req.params.id);
    if (!data) {
      return notFound(req, h);
    }
  } catch (error) {
    console.error(error);
  }

  return h.view("question", {
    title: "Question details",
    user: req.state.user,
    question: data,
    key: req.params.id,
  });
}

module.exports = {
  home,
  register,
  login,
  notFound,
  fileNotFound,
  ask,
  viewQuestion,
};
