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
    required: true
  }

});

module.exports = {Purchase}
