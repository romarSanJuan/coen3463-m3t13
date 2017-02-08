var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { alertMessage: req.flash('alertMessage')});
});

module.exports = router;
