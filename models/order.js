var mongoose = require('mongoose')

var Order = mongoose.model('Order', {
  purchases: {
    type: Array,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = {Order}
