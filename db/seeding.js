  const {ObjectID} = require('mongodb');
  const jwt = require('jsonwebtoken');
  const {User} = require('./../models/user');
  const {Product} = require('./../models/product');
  const {Purchase} = require('./../models/purchase');

  const userOneId = new ObjectID();
  const userTwoId = new ObjectID();

  const productOneId = new ObjectID();
  const productTwoId = new ObjectID();

  const users = [{
    _id: userOneId,
    email: 'test@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }, {
    _id: userTwoId,
    email: 'test2@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }];

  const populateUsers = (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo])
    }).then(() => done());
  };

  const products = [{
     _id: productOneId,
     name: 'name',
     category: 'category',
     origin: 'origin',
     price: 1,
     _user: userOneId
   },
   {
    _id: productTwoId,
    name: 'name',
    category: 'category',
    origin: 'origin',
    price: 1,
    _user: userTwoId
  }];

  const populateProducts = (done) => {
    Product.remove({}).then(() => {
      return Product.insertMany(products);
    }).then(() => done());
  };

  const purchases = [{
     _id: new ObjectID(),
     product: productOneId,
     _user: userOneId
   },
   {
     _id: new ObjectID(),
     product: productTwoId,
     _user: userTwoId
  }];

  const populatePurchases = (done) => {
    Purchase.remove({}).then(() => {
      return Purchase.insertMany(purchases);
    }).then(() => done());
  };

  module.exports = {products,
                    populateProducts,
                    purchases,
                    populatePurchases,
                    users,
                    populateUsers};
