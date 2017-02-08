  var express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      Blob = require('../model/blobs');  

var date = new Date();
var getDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


router.get('/', function(req, res, next) {
    if(req.user){   
        Blob.find().sort({date: 'descending'}).exec(function(err, blobs){
          mongoose.model('Blob').find({}, function (err, blobs) {
              if (err) {
                  return console.error(err);
              } else {  
                  res.format({  
                    html: function(){
                        res.render('blobs/index', {
                              user: req.user,
                              title: 'All my Blobs',
                              "blobs" : blobs,
                              alertMessage: req.flash('alertMessage')
                        });
                    },
                    json: function(){
                        res.json(blobs);
                    }
                });
              }     
         });
        })  
    }
    else{
      res.redirect('/auth/login')
    }    
});
router.post('/', function(req, res){
  res.redirect('../blobs/')
});
router.post('/new', function(req, res) {
        var name = req.body.name;
        var locale = req.body.locale;
        var president = req.body.president;
        var established = req.body.established;
        var population = req.body.population;
        var website = req.body.website;
        var social = req.body.social;
        var image = req.body.image;
        var date = getDate;
        var updated = getDate;


        mongoose.model('Blob').create({
            name : name,
            locale: locale,
            president: president,
            established: established,
            population: population,
            website: website,
            social: social,
            image: image,
            date : date,

        }, function (err, blob) {
              if (err) {
                  req.flash('alertMessage', 'Please fill up all information!');
                  res.redirect('/blobs/new');
                  //res.send("/blobs");
              } else {
                  console.log('POST creating new blob: ' + blob);
                  res.format({   
                    html: function(){
                        res.location("blobs");
                        res.redirect("/blobs/");
                    },
                    json: function(){
                        res.json(blob);
                    }
                });
              }
        })
});

router.get('/new', function(req, res) {
  if(req.user){  
    res.render('blobs/new', { user: req.user, title: 'Add New Blob' , alertMessage: req.flash('alertMessage')});
  }
  else{
    res.redirect('/auth/login')
  } 
});


router.param('id', function(req, res, next, id) {
    mongoose.model('Blob').findById(id, function (err, blob) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
    
        } else {
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Blob').findById(req.id, function (err, blob) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + blob._id);
        res.format({
          html: function(){
              res.render('blobs/show', {
                "blob" : blob
              });
          },
          json: function(){
              res.json(blob);
          }
        });
      }
    });
  });

router.route('/:id/edit')
  .get(function(req, res) {
      mongoose.model('Blob').findById(req.id, function (err, blob) {
          if (err) {
              console.log('GET Error: There was a problem retrieving: ' + err);
          } else {
              console.log('GET Retrieving ID: ' + blob._id);
              res.format({
                  html: function(){
                         res.render('blobs/edit', {
                            title: 'Blob' + blob._id,
                            "blob" : blob
                        });
                   },
                  json: function(){
                         res.json(blob);
                   }
              });
          }
      });
  })

  .put(function(req, res) {
      var name = req.body.name;
      var locale = req.body.locale;
      var president = req.body.president;
      var established = req.body.established;
      var population = req.body.population;
      var website = req.body.website;
      var social = req.body.social;
      var image = req.body.image;
      var updated = getDate;




      mongoose.model('Blob').findById(req.id, function (err, blob) {
          blob.update({
              name : name,
              locale: locale,
              president: president,
              established: established,
              population: population,
              website: website,
              social: social,
              image: image,
              updated : getDate,

          }, function (err, blobID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } 
            else {
                   
                    res.format({
                        html: function(){
                             res.redirect("/blobs/");
                       },
                 
                      json: function(){
                             res.json(blob);
                       }
                    });
             }
          })
      });
  })

  .delete(function (req, res){
      mongoose.model('Blob').findById(req.id, function (err, blob) {
          if (err) {
              return console.error(err);
          } else {
              blob.remove(function (err, blob) {
                  if (err) {
                      return console.error(err);
                  } else {
                      console.log('DELETE removing ID: ' + blob._id);
                      res.format({
                            html: function(){
                                 res.redirect("/blobs");
                           },
                          json: function(){
                                 res.json({message : 'deleted',
                                     item : blob
                                 });
                           }
                        });
                  }
              });
          }
      });
  });
module.exports = router;