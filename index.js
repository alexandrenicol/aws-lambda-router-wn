
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

    const functionToLaunch = this.functions[method][path];

    const request = this.__formatRequest();

    const response = this.__done.bind(this)

    functionToLaunch(request, response);

  }

  route(_method, _path, _callback) {
    const method = _method.toLowerCase();
    const path = this.__validateRoute(_path);
    this.functions[method][path] = _callback;
  }

  get(_path, _callback) {
    this.route('get', _path, _callback)
  }
  post(_path, _callback) {
    this.route('post', _path, _callback)
  }
  delete(_path, _callback) {
    this.route('delete', _path, _callback)
  }

  __formatRequest() {
    let request = this.event.body;
    switch (this.bodyType) {
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
    return request;
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

  __done(_err, _res) {
    let response = _res;
    if (this.responseType === 'application/json'){
      response = JSON.stringify(_res);
    }
    this.callback(null, {
      statusCode: _err ? '400' : '200',
      body: _err ? _err.message : response,
      headers: {
        'Content-Type': this.responseType,
      },
    })
  }

}

module.exports = AWSLambdaRouter;
