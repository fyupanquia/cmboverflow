"use strict";

const questions = require("../models/index").questions;

async function setAnswerRight(questionId, answerId, user) {
  let result;
  try {
    result = await questions.setAnswerRight(questionId, answerId, user);
  } catch (error) {
    console.error(error);
    return false;
  }

  return result;
}

async function getLast(amout) {
  let data;
  try {
    data = await questions.getLast(amout);
  } catch (error) {
    console.error(error);
  }

  return data;
}

module.exports = {
  setAnswerRight,
  getLast,
};
