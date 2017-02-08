var mongoose = require('mongoose')

var Order = mongoose.model('Order', {
  items: {
    type: Array,
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = {Order}
