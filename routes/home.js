var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user){
 	res.render('home', { 
 			user: req.user,
 		});
 	}
 	else{
 		res.redirect('/auth/login');
 	}
});
module.exports = router;
