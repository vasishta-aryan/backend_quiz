const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questions: [
    {
      questionText: String,
      answerOptions: [
        { answerText: String, isCorrect: Boolean },
        { answerText: String, isCorrect: Boolean },
        { answerText: String, isCorrect: Boolean },
        { answerText: String, isCorrect: Boolean },
      ],
    },
  ],
});

module.exports = mongoose.model("question", QuestionSchema);
