var ProductModel = require('mongoose').model('Product');
var PurchaseModel = require('mongoose').model('Purchase');
var UserModel = require('mongoose').model('User');

function seedProducts(req, res) {

  const products = [
    { name: 'name',
     category: 'category',
     origin: 'origin',
     sale: false,
     in_stock: true,
     price: 1,
     _user: 1 },
    { name: 'name',
     category: 'category',
     origin: 'origin',
     sale: false,
     in_stock: true,
     price: 1,
     _user: 1 },
    { name: 'name',
     category: 'category',
     origin: 'origin',
     sale: false,
     in_stock: true,
     price: 1,
     _user: 1 },
  ];

  for (product of products) {
    var newProduct = new Product(product);
    newProduct.save();
  }
}

  function seedPurchases(req, res) {

    const purchases = [
      { quantity: 1,
       _product: 1,
       _user: 1 },
      { quantity: 1,
      _product: 1,
      _user: 1 },
      { quantity: 1,
       _product: 1,
       _user: 1 }
    ];

    for (purchase of purchases) {
      var newPurchase = new Purchase(purchase);
      newPurchase.save();
    }
  };

  function seedUsers(req, res) {

    const users = [
      { email: 'test@test.com',
       password: 'unique1' },
      { email: 'test@test.com',
      password: 'unique1' },
      { email: 'test@test.com',
       password: 'unique1' },
    ];

    for (user of users) {
      var newUser = new User(user);
      newUser.save();
    }
  };

  res.send('Database seeded!');
