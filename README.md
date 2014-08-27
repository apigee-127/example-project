Setup:

1. copy `config/secrets.sample.js config/secrets.js`
2. create a twitter app ([https://dev.twitter.com/]()) and edit secrets.js to match
3. create an Apigee account ([https://enterprise.apigee.com]())
4. add the account to a127: `a127 account create [name]`
4. deploy the Apigee remote proxy: `a127 account deployApigeeProxy`
5. set your secrets:
    1. copy config/secrets.sample.js to config.secrets.js and edit (this is for creating the example app)
    2. set your proxy deployment values:
        1. `a127 setValue apigeeProxyKey [YOURKEY]`
        2. `a127 setValue apigeeProxyUri [YOURURI]`
6. install and run redis ([http://redis.io]())
7. execute: `node bin/create-app.js`
8. execute: `a127 project start`
9. try the example curl commands that are printed to the console (from another console window)
