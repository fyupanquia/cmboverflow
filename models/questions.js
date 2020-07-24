"use strict";

const Questions = (db) => {
  
    let collection = db.ref("/").child("questions");
  

  const create = async (info, user, filename) => {
    const data = {
      description: info.description,
      title: info.title,
      owner: user,
    };

    if (filename) {
      data.filename = filename;
    }

    const question = collection.push();
    question.set(data);

    return question.key;
  }
  
  const getLast = async (amount) => {
    const query = await collection.limitToLast(amount).once("value");
    const data = query.val();
    return data;
  }

  const getOne = async (id) => {
    const query = await collection.child(id).once("value");
    const data = query.val();
    return data;
  }

  const answer = async (data, user) => {
    user = {
      ...user,
    };
    const answers = await collection
      .child(data.id)
      .child("answers")
      .push();
    answers.set({ text: data.answer, user });
    return answers;
  }

  const setAnswerRight = async (questionId, answerId, user) => {
    const query = await collection.child(questionId).once("value");
    const question = query.val();
    const answers = question.answers;

    if (!user.email === question.owner.email) {
      return false;
    }

    for (let key in answers) {
      answers[key].correct = key === answerId;
    }

    const update = await collection
      .child(questionId)
      .child("answers")
      .update(answers);
    return update;
  }

  return {
    create,
    getLast,
    getOne,
    answer,
    setAnswerRight,
  };
}

module.exports = Questions;
