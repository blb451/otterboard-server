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

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: "authenticated view" });
  });

  // SIGN UP and SIGN IN
  app.post('/signin', requireSignin, authentication.signin)
  app.post('/signup', authentication.signup);

  // PRODUCTS
  app.get('/products', requireAuth, (req, res) => {
    Product.find().then((products) => {res.send({products})
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
    const productId = req.body.id
    var purchase = new Purchase({
      _product: req.body.productid,
      _user: req.user.id,
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

  app.get('purchases/:id', requireAuth, (req, res) => {
    var id = req.params.id;
    if (!Object.isvalid(id)) {
      return res.status(404).send();
    }
    Purchase.findOne({
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

  app.delete('purchases/:id', requireAuth, (req, res) => {
    var id = req.params.id;
    if (!Object.isvalid(id)) {
      return res.status(404).send();
    }
    Purchase.findOneAndRemove({
      _id: id,
      _user: req.user._id
    }).populate('_product').then((purchase) => {
      if (!purchase) {
        return res.status(404).send();
      }
      res.send({purchase});
    }).cathc((err) => {
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
                              _user: req.user._id,
                              _product: req.product._id},
                              {$set: quantity},
                              {new: true}).then((purchase) => {
    if (!purchase) { return res.status(404).send(); }
    res.send({purchase});
    }).catch((err) => {
      res.status(400).send();
    });
  });

  // ORDER

}
