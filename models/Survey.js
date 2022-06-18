const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  lastname: {
    type: String,
    required:true
  },
  vaccinated: {
    type: Boolean,
    required:true
  },
  age:{
  type: String,
  required:true
  }
});

module.exports = mongoose.model('survey', SurveySchema);
