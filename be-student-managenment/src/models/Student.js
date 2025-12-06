const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//BAI1
const studentSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true }
}, { collection: 'students' });

module.exports = mongoose.model('Student', studentSchema);

