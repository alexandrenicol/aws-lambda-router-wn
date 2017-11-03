
class AWSLambdaRouter {
  constructor(){
    this.responseType = 'application/json';
    this.bodyType = 'application/json';
    this.functions = {
      post: {},
      get: {},
      put: {},
      delete: {},
      head: {},
      connect:{},
      patch: {},
      trace: {},
      options: {}
    };
  }

  serve(_event, _callback) {
    this.event = _event;
    this.callback = _callback;

    const path = this.__whatIsTheRoute();

    const method = event.httpMethod.toLowerCase();

    const functionToLaunch = this.functions[method][path].callback;
    const functionOptions = this.functions[method][path].options;

    this.__formatRequest(functionOptions);

    const response = this.__done.bind(this, functionOptions);

    functionToLaunch(this.event, response);

  }

  route(_method, _path, _callback, _options = {}) {
    const method = _method.toLowerCase();
    const path = this.__validateRoute(_path);
    this.functions[method][path] = {
      callback: _callback,
      options: _options
    }
  }

  get(_path, _callback, _options = {}) {
    this.route('get', _path, _callback, _options)
  }
  post(_path, _callback, _options = {}) {
    this.route('post', _path, _callback, _options)
  }
  delete(_path, _callback, _options = {}) {
    this.route('delete', _path, _callback, _options)
  }

  __formatRequest(options) {
    let request = this.event.body;

    let bodyType = this.bodyType;
    if (options.bodyType) bodyType = options.bodyType;

    switch (bodyType) {
      case 'application/json':
        request = JSON.parse(request);
        break;
      case 'application/x-www-form-urlencoded':
        let pairs = request.split('&');
        request = {};
        pairs.forEach(function(pair) {
          pair = pair.split('=');
          request[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        break;
      default:
        break;
    }
    this.event.body = request;
  }

  __validateRoute(_path) {
    let path = _path;
    if (path.indexOf("/") < 0) {
      path = `/${path}`;
    }
    return path;
  }

  __whatIsTheRoute() {
    let route = "/";
    if (this.event.pathParameters){
      if (this.event.pathParameters.path) {
        route = `/${this.event.pathParameters.path}`;
      }
    }
    return route;
  }

  __done(__options, _err, _res) {
    let response = _res;
    let responseType = this.responseType;
    if (__options.responseType) responseType = __options.responseType;
    if (responseType === 'application/json'){
      response = JSON.stringify(_res);
    }
    this.callback(null, {
      statusCode: _err ? '400' : '200',
      body: _err ? _err.message : response,
      headers: {
        'Content-Type': responseType,
      },
    })
  }

}

module.exports = AWSLambdaRouter;
