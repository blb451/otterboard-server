var mongoose = require('mongoose')

var Product = mongoose.model('Product', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  category: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  sale: {
    type: Boolean,
    default: false
  },
  in_stock: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: null
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = {Product}
