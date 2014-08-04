Setup:

1. copy `config/secrets.sample.js config/secrets.js`
2. create a twitter app ([https://dev.twitter.com/]()) and edit secrets.js to match
3. create an Apigee account ([https://enterprise.apigee.com]()), deploy the volos proxy, and edit secrets.js to match
3. install and run redis ([http://redis.io]())
4. execute: `node bin/create-app.js`
4. execute: `npm start`
5. try the example curl commands that are printed to the console (from another console window)
