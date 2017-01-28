var passport = require('passport');
var User = require('../model/user');
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/register')
  .get(function(req, res, next) {
    res.render('register', {});
  })
  .post(function(req, res, next) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, account) {
      if(err) {
        return res.render('register', {account: account});
      }

      req.login(account, function(err) {
        res.redirect('/login');
      });
    })
  })

router.get('/login', function(req, res, next) {
  res.render('login', {user: req.user});
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.all('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


module.exports = router;