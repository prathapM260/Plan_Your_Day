// const mongoose = require('mongoose');

// const goalSchema = new mongoose.Schema({
  
//   content: {
//     addtopic: String,
//     websiteLink: String,
//     youtubeLink: String,
//     documents: String,
//     summary: String
//   }
// });

// module.exports = mongoose.model('Goal', goalSchema);


// models/goal.js

const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  addtopic: { type: String, required: true },
  date: { type: Date, required: true },
  websiteLink: String,
  youtubeLink: String,
  summary: String,
  documents: String, // Path to the file
});

module.exports = mongoose.model('Goal', goalSchema);

