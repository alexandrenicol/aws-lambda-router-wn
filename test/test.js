var chai = require('chai');
var assert = chai.assert;

var AWSLambdaRouter = require('../index.js');

describe('AWSLambdaRouter - declaration stage', function() {

  it('should register GET functions', function(){
    const app = new AWSLambdaRouter();
    assert.lengthOf(Object.keys(app.functions.get), 0, 'router should not have any GET route register')
    app.get('/', (request, response) => {
      response(null, true);
    });

    assert.lengthOf(Object.keys(app.functions.get), 1, 'router should have 1 GET route registered')

    app.get('test', (request, response) => {
      response(null, true);
    });

    assert.hasAllKeys(app.functions.get, ['/', '/test'], 'route \'/\' should be registerd')
    assert.isFunction(app.functions.get['/'].callback)
    assert.isFunction(app.functions.get['/test'].callback)
  });

  it('should register POST functions', function() {
    const app = new AWSLambdaRouter();
    assert.lengthOf(Object.keys(app.functions.post), 0, 'router should not have any POST route register')
    app.post('/', (request, response) => {
      response(null, true);
    });

    assert.lengthOf(Object.keys(app.functions.post), 1, 'router should have 1 POST route registered')

    app.post('test', (request, response) => {
      response(null, true);
    });

    assert.hasAllKeys(app.functions.post, ['/', '/test'], 'route \'/\' shoudl be registerd')
    assert.isFunction(app.functions.post['/'].callback)
    assert.isFunction(app.functions.post['/test'].callback)

  })
  //
  it('should register DELETE functions', function() {
    const app = new AWSLambdaRouter();
    assert.lengthOf(Object.keys(app.functions.delete), 0, 'router should not have any DELETE route register')
    app.delete('/', (request, response) => {
      response(null, true);
    });

    assert.lengthOf(Object.keys(app.functions.delete), 1, 'router should have 1 DELETE route registered')

    app.delete('test', (request, response) => {
      response(null, true);
    });

    assert.hasAllKeys(app.functions.delete, ['/', '/test'])
    assert.isFunction(app.functions.delete['/'].callback)
    assert.isFunction(app.functions.delete['/test'].callback)
  })
  //
  it('should register any method functions', function() {
    const app = new AWSLambdaRouter();
    app.route('PUT','/', (request, response) => {
      response(null, true);
    });

    assert.lengthOf(Object.keys(app.functions.put), 1, 'router should have 1 PUT route registered')

    app.route('PATCH','test', (request, response) => {
      response(null, true);
    });

    assert.hasAllKeys(app.functions.put, ['/'])
    assert.hasAllKeys(app.functions.patch, ['/test'])
    assert.isFunction(app.functions.put['/'].callback)
    assert.isFunction(app.functions.patch['/test'].callback)
  })
  //
  it('should reject non valid method', function() {
    const app = new AWSLambdaRouter();
    assert.throws(app.route.bind(app, 'PUTT', '/', () => {}), Error);
    assert.doesNotThrow(app.route.bind(app, 'PUT', '/', () => {}), Error);
  })

  it('should register route options, bodyType and responseType', function(){
    const app = new AWSLambdaRouter();
    app.route('POST','/', (request, response) => {
      response(null, true);
    }, {
      bodyType: 'application/x-www-form-urlencoded',
      responseType: 'text/html'
    });

    assert.equal(app.functions.post['/'].options.bodyType, 'application/x-www-form-urlencoded')
    assert.equal(app.functions.post['/'].options.responseType, 'text/html')

  })


});

describe('AWSLambdaRouter - execution stage', function () {
  it('should execute the requested function when handling events', function() {
    const app = new AWSLambdaRouter();
    app.route('GET','test', (request, response) => {
      response(null, true);
    });

    const event = {
      httpMethod: 'GET',
      path: '/test'
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: '200',
        body: 'true',
        headers: { 'Content-Type': 'application/json' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should take in consideration functions options', function() {
    const app = new AWSLambdaRouter();
    app.route('POST','/', (request, response) => {
      const param = request.body;
      response(null, `<div>foo:${param.foo}</div>`);
    }, {
      bodyType: 'application/x-www-form-urlencoded',
      responseType: 'text/html'
    });

    const event = {
      httpMethod: 'POST',
      path: '/',
      body: 'foo=bar'
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: '200',
        body: '<div>foo:bar</div>',
        headers: { 'Content-Type': 'text/html' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })
})
