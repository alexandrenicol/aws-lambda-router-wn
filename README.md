![AWSLambdaRouter](https://s3-eu-west-1.amazonaws.com/static-webnicol/github/aws-lambda-router-wn/AWSLambdaRouterOrange.png)

# AWSLambdaRouter
HTTP Router for AWS Lambda + AWS API Gateway.

[![Build Status](https://travis-ci.org/alexandrenicol/aws-lambda-router-wn.png?branch=master)](https://travis-ci.org/alexandrenicol/aws-lambda-router-wn)
[![codecov](https://codecov.io/gh/alexandrenicol/aws-lambda-router-wn/branch/master/graph/badge.svg)](https://codecov.io/gh/alexandrenicol/aws-lambda-router-wn)

## What is AWSLambdaRouter?
AWSLambdaRouter is a simple HTTP router inspired by Express.js router's syntax. It allows you to transfer your stateless Express application to an AWS Lambda using the proxy integration of AWS API Gateway.

## Quickstart - Hello World
1. First, create your AWS Lambda, the name is up to you, but you'll need to remember it for the next steps.
2. Create your Node.js project on your computer.
3. In your project folder run ```npm init``` and then run ```npm install --save aws-lambda-router-wn```
4. Develop your application using AWSLambdaRouter.
5. Zip all the files in your project folder and upload the archive to your AWS Lambda, make sure to configure the handler.
6. Configure AWS API Gateway (see below)
7. Deploy your AWS API Gateway
8. Done! Your can now start using your Lambda! I suggest using Postman to check that everything is all right :)
### Lambda (Node.js)
```javascript
const AWSLambdaRouter = require('aws-lambda-router-wn');
const app = new AWSLambdaRouter();

app.get('/', (request, response) => {
  response(null, 'Hello world');
});

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  app.serve(event, callback);
};
```

### API Gateway Configuration (Recommended)
1. First, create a new API on AWS API Gateway (it's important that you use 1 API for 1 AWSLambdaRouter).
2. You should have a '/' route with no methods configured, create a new resource using the actions button.
3. Click on `configure as proxy resource` and leave the field as they are, enable the CORS configuration if you wish (this will add OPTIONS route). You should have something similar to the image below:
![proxy resource](https://s3-eu-west-1.amazonaws.com/static-webnicol/github/aws-lambda-router-wn/new-child-res.png)
4. Click on create, you should be redirect to the configuration of the ANY method, configure it as a Lambda proxy, and enter the name of your lambda, like below:
![any setup](https://s3-eu-west-1.amazonaws.com/static-webnicol/github/aws-lambda-router-wn/proxy-setup.png)
5. Click on save, select the '/' route and click on the actions button to create a new ANY method (this time for the '/' route, not '/{proxy+}'.
6. Configure the new ANY method like the previous one.
7. Enable CORS on the '/' route if needed.
8. In the end, you should have something similar for your two ANY method, like this image below:
![final](https://s3-eu-west-1.amazonaws.com/static-webnicol/github/aws-lambda-router-wn/slash-any.png)
9. Use the actions button to deploy your API.

## Full documentation
[https://alexandrenicol.github.com/aws-lambda-router-wn](https://alexandrenicol.github.com/aws-lambda-router-wn)


## Changelog
### 2018/10/22: 0.10.0
Added TypeScript definitions (Thanks @danenania)