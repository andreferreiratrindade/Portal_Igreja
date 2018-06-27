'use strict'; 

const express = require('express')
const config = require('./config/config')
const bodyParser = require('body-parser')
const app = express()
const db = require('./config/db')
const path = require('path')
const logger = require('morgan')
const apiRoutes = express.Router()
var cors = require('cors')
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(logger('dev'));

// middleware
apiRoutes.use(function(req, res, next) {

  
    // check header or url parameters or post parameters for token
    var token =  req.headers['authentication'];
    console.log('teste');
    
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token,config.key.privateKey, function(err, decoded) {      
        if (err) {          
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
  
    }
  });



// public
  app.use('/pessoa', require('./services/pessoa/pessoa-route'));


// private
  apiRoutes.use('/igreja', require('./services/igreja/igreja-route'))
  apiRoutes.use('/ministerio', require('./services/ministerio/ministerio-route'))
  apiRoutes.use('/ministracao', require('./services/ministracao/ministracao-route'))
  

  app.use('/api',apiRoutes);
  

var port = config.server.port;

app.listen(process.env.PORT || port);

console.log('App started on port ' + port);