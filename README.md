# Apigee 127 Example Project

This example gets you up and running quickly with a sample Apigee 127 project that proxies the Twitter search API.  

* [About the app](#about)
* [Installation](#installation)
* [Project setup](#setupsteps)
* [Configure and run the app](#configure-and-run)
* [Troubleshooting](#troubleshooting)

## <a name="about"></a>About the app

This example application implements an API proxy for the Twitter search API. A Node.js server running on your local system communicates with Apigee Edge through the volos Node.js module's management API. 

Volos is an open source Node.js solution for developing and deploying production-level APIs. Volos provides a way to leverage common features such as OAuth 2.0, Caching, and Quota Management into your APIs. Volos can proxy support for these features through Apigee Edge, or independently of Edge. 

This example runs locally and makes calls to Apigee Edge to handle OAuth requests. Volos provides the glue that binds together your API implementation and Apigee Edge. 

![Alt text](https://raw.githubusercontent.com/apigee-127/a127-documentation/master/a127/images/with-edge.png)

1. Volos calls Apigee Edge to perform OAuth, Quota, or Caching. Volos only sends metadata to Edge, not the API payload. 
3. Edge returns a response indicating whether the key was valid.
4. If valid, the API call is proxied to the local Node.js API implementation.
5. The API response is returned from the API implementation.
6. (Optional) Metadata is sent to Edge for centralized analytics and monitoring. 

## <a name="installation"></a>Installation

1. Clone the example project from GitHub:

    `git clone https://github.com/apigee-127/example-project.git`

2. In the `example-project` folder, execute: `npm install`.

3. Install Apigee 127:

    `npm install -g apigee-127`

    The `-g` option automatically places the `a127` executable commands in you PATH. If you do not use `-g`, then you need to add the `apigee-127/bin `directory to your PATH manually. You may need to use `sudo` to execute this command.

## <a name="setupsteps"></a>Project setup

To run the example project, you need to set up these things first:

1. Create a [Twitter app](https://dev.twitter.com/apps). Any app will do, even a simple/dummy app. You'll need to grab the Access Token and Access Token Secret keys from the app later. If you use keys from an existing app, be sure they are not expired. 
2. Configure an Apigee 127 account to hold your Apigee account information with the command `a127 account create <anAccountName>`. If you do not have an account on Apigee.com you will be prompted to create one.Enter this command and follow the prompts, entering information about your Apigee account:

```bash
$ a127 account create myApigeeAccount

    [?] Provider? apigee
    [?] Do you have an account? Yes
    [?] Base URI? https://api.enterprise.apigee.com  //-- Enter to accept the default.
    [?] Organization? wwitman
    [?] User Id? wwitman@apigee.com
    [?] Password? *********
    [?] Environment? test
    [?] Virtual Hosts? default,secure  //-- Enter to accept the default
```

## <a name="configure-and-run"></a>Configure and run the app

1. In the `example-project`, copy `config/secrets.sample.js` to `config/secrets.js`.
2. Edit `config/secrets.js` with your Twitter API keys and Access Tokens. You can find them on the management console for your Twitter app, under the API Keys tab.
    
        exports.twitter = {
          consumer_key:        '123xxxxxxxxxxxxxxxx',
          consumer_secret:     '456yyyyyyyyyyyyyyyy',
          access_token:        '789aaaaaaaaaaaaaaaa',
          access_token_secret: '123bbbbbbbbbbbbbbbb'
        };
    

3. In the same file, edit the Apigee Edge object with your Edge account information. Leave the `uri`, `key`, and `secret` attributes blank.

        exports.apigee = {
          organization: 'jdoe',
          user: 'jdoe@apigee.com',
          password: 'mypassword'
        };

4. Execute: `a127 project start`.
5. Try the example curl commands that are printed to the console (from another console window):

    **Twitter Search:** This command calls the Twitter search API through the Apigee 127 proxy, running locally on your machine. The OAuth Bearer token was generated through Volos and added to this curl command by the app:

        `$ curl -H "Authorization: Bearer 123ababababababa" "http://localhost:10010/twitter?search=apigee"`


    **Get a Password Token:** This command returns a new access token on behalf of the user. You can try substituting this access token in the Twitter search API call. 

        `$ curl -X POST "http://localhost:10010/accesstoken" -d "grant_type=password&client_id=xxxxxxxxxxxxx&client_secret=yyyyyyyyyy&username=jdoe&password=password"`


## <a name="troubleshooting"></a>Troubleshooting

* A possible source of error is using incorrect or expired app keys in your configuration. Make sure, for example, that your Twitter credentials are current.


<!--
-- old
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
-->
