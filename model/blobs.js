var mongoose = require('mongoose');  
var blobSchema = new mongoose.Schema({  
  name: String,
  locale: String,
  president: String,
  established: Number,
  population: Number,
  website: String,
  social: String,
  image: String,
  date: String,
  updated: String,
});

module.exports =  mongoose.model('Blob', blobSchema);
