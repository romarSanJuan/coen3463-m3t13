  var express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override');
        
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/')
  }
  next();
});

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Blob').find({}, function (err, blobs) {
              if (err) {
                  return console.error(err);
              } else {  
                  res.format({  
                    html: function(){
                        res.render('blobs/index', {
                              title: 'All my Blobs',
                              "blobs" : blobs
                          });
                    },
                    json: function(){
                        res.json(blobs);
                    }
                });
              }     
        });
    })

    .post(function(req, res) {
        var name = req.body.name;
        var locale = req.body.locale;
        var president = req.body.president;
        var established = req.body.established;
        var population = req.body.population;
        var website = req.body.website;
        var social = req.body.social;
        var image = req.body.image;
        var dob = req.body.dob;


        mongoose.model('Blob').create({
            name : name,
            locale: locale,
            president: president,
            established: established,
            population: population,
            website: website,
            social: social,
            image: image,
            dob : dob,

        }, function (err, blob) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  console.log('POST creating new blob: ' + blob);
                  res.format({   
                    html: function(){
                        res.location("blobs");
                        res.redirect("/blobs");
                    },
                    json: function(){
                        res.json(blob);
                    }
                });
              }
        })
    });


router.get('/new', function(req, res) {
    res.render('blobs/new', { title: 'Add New Blob' });
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
        var blobdob = blob.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('blobs/show', {
                "blobdob" : blobdob,
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
              var blobdob = blob.dob.toISOString();
              blobdob = blobdob.substring(0, blobdob.indexOf('T'))
              res.format({
                  html: function(){
                         res.render('blobs/edit', {
                            title: 'Blob' + blob._id,
                            "blobdob" : blobdob,
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
      var dob = req.body.dob;




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
              dob : dob,

          }, function (err, blobID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } 
            else {
                   
                    res.format({
                        html: function(){
                             res.redirect("/blobs/" + blob._id);
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