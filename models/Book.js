const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: [String],
});

mongoose.model('book', BookSchema);
