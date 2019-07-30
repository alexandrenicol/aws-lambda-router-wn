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
        statusCode: 200,
        body: 'true',
        headers: { 'Content-Type': 'application/json' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should bring cors headers if required', function() {
    const app = new AWSLambdaRouter();
    app.useCors();
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
        statusCode: 200,
        body: 'true',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })
  it('should not bring cors headers if required not to', function() {
    const app = new AWSLambdaRouter();
    app.useCors(false);
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
        statusCode: 200,
        body: 'true',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should use default body type and response type if not set', function() {
    const app = new AWSLambdaRouter();
    app.route('POST','/', (request, response) => {
      const param = request.body;
      response(null, {test: param.foo});
    });

    const event = {
      httpMethod: 'POST',
      path: '/',
      body: JSON.stringify({foo: 'bar'})
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify({test: 'bar'}),
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
        statusCode: 200,
        body: '<div>foo:bar</div>',
        headers: { 'Content-Type': 'text/html' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should take in consideration custom headers', function () {
    const app = new AWSLambdaRouter();
    app.route('POST', '/', (request, response) => {
      const param = request.body;
      response(null, `<div>foo:${param.foo}</div>`);
    }, {
        bodyType: 'application/x-www-form-urlencoded',
        responseType: 'text/html',
        headers: {
          customHeader: 'test-customHeader',
          'another-one': 'test-another-one'
        }
      });

    const event = {
      httpMethod: 'POST',
      path: '/',
      body: 'foo=bar'
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: 200,
        body: '<div>foo:bar</div>',
        headers: {
          'Content-Type': 'text/html',
          customHeader: 'test-customHeader',
          'another-one': 'test-another-one'
        }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should send back raw body if the type is not supported', function() {
    const app = new AWSLambdaRouter();
    app.route('POST','/', (request, response) => {
      const body = request.body;
      response(null, `<div>foo:${body}</div>`);
    }, {
      bodyType: 'text/raw',
      responseType: 'text/html'
    });

    const event = {
      httpMethod: 'POST',
      path: '/',
      body: 'Hello World'
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: 200,
        body: '<div>foo:Hello World</div>',
        headers: { 'Content-Type': 'text/html' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should support query string parameters', function() {
    const app = new AWSLambdaRouter();
    app.route('GET','/', (request, response) => {
      const params = request.queryStringParameters;
      response(null, `<div>${params.test1} ${params.test2}</div>`);
    }, {responseType: 'text/html'});

    const event = {
      httpMethod: 'GET',
      path: '/',
      queryStringParameters: {
        test1: "hello",
        test2: "world"
      },
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: 200,
        body: '<div>hello world</div>',
        headers: { 'Content-Type': 'text/html' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })

  it('should return 404 if the route is unknown', function() {
    const app = new AWSLambdaRouter();
    app.route('GET','/', (request, response) => {
      const params = request.queryStringParameters;
      response(null, {response: 'ok'});
    });

    const event = {
      httpMethod: 'GET',
      path: '/test'
    };

    const assertCallback = (something, response) => {
      assert.equal(something, null);
      const expectedResponse = {
        statusCode: 404,
        body: "Error: Route '/test' does not exist or does not handle 'get' method",
        headers: { 'Content-Type': 'application/json' }
      }
      assert.deepEqual(response, expectedResponse)
    }

    app.serve(event, assertCallback);

  })
})
