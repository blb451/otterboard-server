const authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const _ = require('lodash');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const {Product} = require('./models/product')
const {Purchase} = require('./models/purchase')
const {Order} = require('./models/order')
const {User} = require('./models/user')

const {ObjectID} = require('mongodb');

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: "authenticated view" });
  });

  // SIGN UP and SIGN IN
  app.post('/signin', requireSignin, authentication.signin)
  app.post('/signup', authentication.signup);

  // PRODUCTS
  app.get('/products', requireAuth, (req, res) => {
    Product.find().populate('_user', ['name']).then((products) => {res.send({products})
    }, (err) => {
      res.status(400).send(err);
    })
  });

  app.post('/products', requireAuth, (req, res) => {
    var product = new Product({
      name: req.body.name,
      category: req.body.category,
      origin: req.body.origin,
      sale: false,
      in_stock: true,
      price: req.body.price,
      _user: req.user.id
    });
    product.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
  });

  // PURCHASE
  app.post('/purchases', requireAuth, (req, res) => {
    Purchase.findOne({ _product: req.body.productid}, function(err, existingProduct) {
       if (err) { return next(err); }
       console.log(existingProduct);
      if (existingProduct) {
        return res.status(422).send({ error: 'Product already added' });
      }
    });
    var purchase = new Purchase({
      _product: req.body.productid,
      _user: req.user._id,
      quantity: 1
    });
    purchase.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
  });

  app.get('/purchases', requireAuth, (req, res) => {
    Purchase.find({
      _user: req.user._id
    }).populate('_product').then((purchases) => {res.send({purchases})
    }, (err) => {
      res.status(400).send(err);
    })
  });

  app.get('/purchases/:id', requireAuth, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Purchase.findOne({
      _id: id,
      _user: req.user._id
    }).populate('_product').then((purchase) => {
      if (!purchase) {
        return res.status(404).send();
      }
      res.send({purchase});
    }).catch((err) => {
      res.status(400).send();
    });
  });

  app.delete('/purchases/:id', requireAuth, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Purchase.findOneAndRemove({
      _id: id,
      _user: req.user._id
    }).then((purchase) => {
      if (!purchase) {
        return res.status(404).send();
      }
      res.send({purchase});
    }).catch((err) => {
      res.status(400).send();
    });
  });

  app.patch('/purchases/:id', requireAuth, (req, res) => {
    var id = req.params.id;
    var quantity = _.pick(req.body, ['quantity']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Purchase.findOneAndUpdate({_id: id,
                              _user: req.user._id},
                              {$set: quantity},
                              {new: true}).then((purchase) => {
    if (!purchase) { return res.status(404).send(); }
    res.send({purchase});
    }).catch((err) => {
      res.status(400).send();
    });
  });

  //custom route to delete all purchases from a specific user
  app.delete('/deletepurchases', requireAuth, (req, res) => {
    Purchase.remove({
      _user: req.user._id
    }).populate('_product').then((purchases) => {res.send({purchases})
    }, (err) => {
      res.status(400).send(err);
    })
  });

  // ORDER
  app.post('/orders', requireAuth, (req, res) => {
    Purchase.find({
      _user: req.user._id
    }).then((purchases) => {
      var order = new Order({
        items: purchases,
        _user: req.user._id
      });
      order.save().then((doc) => {
        res.send(doc);
        Purchase.remove({_user: req.user.id}, (err) => {
          if(err) throw err});
      }, (err) => {
        res.status(400).send(err);
      });
    });
  });

  app.get('/orders', requireAuth, (req, res) => {
    Order.find({
      _user: req.user._id
    }).then((orders) => {res.send({orders})
    }, (err) => {
      res.status(400).send(err);
    })
  });

}
