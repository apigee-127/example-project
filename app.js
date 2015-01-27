'use strict';


/**** Init ****/

var express = require('express');
var a127 = require('a127-magic');

/**** Express ****/

var PORT = process.env.PORT || 10010;

function startExpress() {

  var app = express();

  a127.init(function(config) {
    app.use(a127.middleware(config));

    app.listen(PORT);

    printHelp();
  });
}

startExpress();


/*
 * All the following code just to generate a token and print the help and is generally unnecessary for your app.
 */

function printHelp() {

  var config = require('./config');
  var volos = config.volos;
  var management = volos.Management.create(config.apigee);
  var oauth = a127.resource('oauth2');

  createToken(management, oauth, config, function(err, creds) {
    if (err) {
      console.log(err);
      console.log(err.stack);
      return;
    }

    console.log('listening on %d', PORT);

    console.log('\nexample curl commands:\n');

    console.log('Get a Client Credential Token:');
    console.log('curl -X POST "http://127.0.0.1:%s/accesstoken" -d ' +
      '"grant_type=client_credentials&client_id=%s&client_secret=%s"\n',
      PORT, encodeURIComponent(creds.clientId), encodeURIComponent(creds.clientSecret));

    console.log('Twitter Search:');
    console.log('curl -H "Authorization: Bearer %s" "http://127.0.0.1:%s/twitter?search=apigee"\n',
      creds.accessToken, PORT);
  });
}

function createToken(management, oauth, config, cb) {

  management.getDeveloperApp(config.devRequest.userName, config.appRequest.name, function(err, app) {
    if (err) { return cb(err); }

    var tokenRequest = {
      clientId: app.credentials[0].key,
      clientSecret: app.credentials[0].secret
    };

    oauth.spi.createTokenClientCredentials(tokenRequest, function(err, result) {
      if (err) { return cb(err); }

      var accessToken = result.access_token;

      console.log('Client ID: %s', app.credentials[0].key);
      console.log('Client Secret: %s', app.credentials[0].secret);
      console.log('Access Token: %s', accessToken);

      tokenRequest.accessToken = accessToken;

      cb(null, tokenRequest);
    });
  });
}
