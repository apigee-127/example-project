'use strict';

/**** Init ****/

var config = require('./config');
var volos = config.volos;
var express = require('express');
var _ = require('underscore');


/******* Swagger *******/

var swaggerTools = require('swagger-tools').middleware.v2_0;
var swaggerObject = require('./api/swagger/a127-project.json');
var volosSwagger = require('volos-swagger');

// todo: deal with this account & secret stuff in a sane way
swaggerObject['x-volos-resources']['oauth2']['options'] = [ config.apigee ];

/**** Express ****/

var PORT = process.env.PORT || 10010;

function startExpress() {

  var app = express();

  // Swagger middleware
  app.use(swaggerTools.swaggerMetadata(swaggerObject));
  app.use(swaggerTools.swaggerValidator());

  app.use(volosSwagger(swaggerObject));

  // todo: move these into swagger
  app.get('/authorize', oauth.expressMiddleware().handleAuthorize());
  app.post('/accesstoken', oauth.expressMiddleware().handleAccessToken());
  app.post('/invalidate', oauth.expressMiddleware().invalidateToken());
  app.post('/refresh', oauth.expressMiddleware().refreshToken());

  // todo: make useStubs configurable via a127
  app.use(swaggerTools.swaggerRouter({ useStubs: true, controllers: './api/controllers' }));

  app.listen(PORT);

  printHelp();
}




/**** OAuth ****/

var oauthConfig = _.extend({
  validGrantTypes: [ 'client_credentials', 'authorization_code', 'implicit_grant', 'password' ],
  passwordCheck: checkPassword
}, config.apigee);

function checkPassword(username, password, cb) {
  cb(null, true);
}

var management = volos.Management.create(oauthConfig);
var oauth = volos.OAuth.create(oauthConfig);


function createToken(management, oauth, cb) {

  management.getDeveloperApp(config.devRequest.userName, config.appRequest.name, function(err, app) {
    if (err) { cb(err); }

    var tokenRequest = {
      clientId: app.credentials[0].key,
      clientSecret: app.credentials[0].secret
    };

    oauth.spi.createTokenClientCredentials(tokenRequest, function(err, result) {
      if (err) { cb(err); }

      var accessToken = result.access_token;

      console.log('Client ID: %s', app.credentials[0].key);
      console.log('Client Secret: %s', app.credentials[0].secret);
      console.log('Access Token: %s', accessToken);

      tokenRequest.accessToken = accessToken;

      cb(null, tokenRequest);
    });
  });

}


function printHelp() {

  createToken(management, oauth, function(err, creds) {
    if (err) {
      console.log(err);
      throw err;
    }

    console.log('listening on %d', PORT);

    console.log('\nexample curl commands:\n');

    console.log('Get a Password Token:');
    console.log('curl -X POST "http://localhost:%s/accesstoken" -d ' +
      '"grant_type=password&client_id=%s&client_secret=%s&username=%s&password=%s"\n',
      PORT, encodeURIComponent(creds.clientId), encodeURIComponent(creds.clientSecret), 'sganyo', 'password');

    console.log('Twitter Search:');
    console.log('curl -H "Authorization: Bearer %s" "http://localhost:%s/twitter?search=apigee"\n',
      creds.accessToken, PORT);
  });
}


startExpress();
