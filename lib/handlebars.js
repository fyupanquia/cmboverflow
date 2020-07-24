"use strict";

const handlebars = require("handlebars");

function registerHelpers() {
  handlebars.registerHelper("answerNumber", (answers) => {
    const length = answers ? Object.keys(answers).length : 0;
    return length;
  });

  handlebars.registerHelper("ifEquals", (a, b, options) => {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  return handlebars;
}

module.exports = registerHelpers();
