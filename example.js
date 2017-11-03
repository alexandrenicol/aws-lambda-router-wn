'use strict';

const AWSLambdaRouter = require('aws-lambda-router-wn');
const app = new AWSLambdaRouter();

app.post('/', (request, response) => {
  response(null, true);
});

app.get('/hello', (request, response) => {
  response(null, {'text': 'Bonjour Alex'});
});

app.get('/goodbye', (request, response) => {
  response(null, {'text': 'Aurevoir Alex'});
});

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  app.serve(event, callback);
};
