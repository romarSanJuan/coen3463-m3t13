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
  dob: { type: Date, default: Date.now },
});
module.exports =  mongoose.model('Blob', blobSchema);