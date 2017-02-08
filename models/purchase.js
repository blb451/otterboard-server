var mongoose = require('mongoose')

var Purchase = mongoose.model('Purchase', {
  quantity: {
    type: Number,
    default: 1,
    require: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = {Purchase}
