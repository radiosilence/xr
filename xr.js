(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.xr = mod.exports;
  }
})(this, function (exports, module) {
  /**
   * xr (c) James Cleveland 2015
   * URL: https://github.com/radiosilence/xr
   * License: BSD
   */

  'use strict';

  var res = function res(xhr) {
    return {
      status: xhr.status,
      response: xhr.response,
      xhr: xhr
    };
  };

  var assign = function assign(t, s) {
    var l = arguments.length,
        i = 1;
    while (i < l) {
      var _s = arguments[i++];
      for (var k in _s) {
        t[k] = _s[k];
      }
    }
    return t;
  };

  var getParams = function getParams(data, url) {
    var ret = [];
    for (var k in data) {
      ret.push('' + encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
    }if (url && url.split('?').length > 1) ret.push(url.split('?')[1]);
    return ret.join('&');
  };

  var Methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS'
  };

  var Events = {
    READY_STATE_CHANGE: 'readystatechange',
    LOAD_START: 'loadstart',
    PROGRESS: 'progress',
    ABORT: 'abort',
    ERROR: 'error',
    LOAD: 'load',
    TIMEOUT: 'timeout',
    LOAD_END: 'loadend'
  };

  var defaults = {
    method: Methods.GET,
    data: undefined,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    dump: JSON.stringify,
    load: JSON.parse,
    xmlHttpRequest: function xmlHttpRequest() {
      return new XMLHttpRequest();
    },
    promise: function promise(fn) {
      return new Promise(fn);
    }
  };

  var config = {};

  var configure = function configure(opts) {
    config = assign({}, config, opts);
  };

  var promise = function promise(args, fn) {
    return (args && args.promise ? args.promise : config.promise || defaults.promise)(fn);
  };

  var xr = function xr(args) {
    return promise(args, function (resolve, reject) {
      var opts = assign({}, defaults, config, args);
      var xhr = opts.xmlHttpRequest();

      xhr.open(opts.method, opts.params ? '' + opts.url.split('?')[0] + '?' + getParams(opts.params) : opts.url, true);

      xhr.addEventListener(Events.LOAD, function () {
        return xhr.status >= 200 && xhr.status < 300 ? resolve(assign({}, res(xhr), {
          data: xhr.response ? !opts.raw ? opts.load(xhr.response) : xhr.response : null
        }), false) : reject(res(xhr));
      });

      xhr.addEventListener(Events.ABORT, function () {
        return reject(res(xhr));
      });
      xhr.addEventListener(Events.ERROR, function () {
        return reject(res(xhr));
      });
      xhr.addEventListener(Events.TIMEOUT, function () {
        return reject(res(xhr));
      });

      for (var header in opts.headers) {
        xhr.setRequestHeader(header, opts.headers[header]);
      }for (var _event in opts.events) {
        xhr.addEventListener(_event, opts.events[_event].bind(null, xhr), false);
      }var data = typeof opts.data === 'object' && !opts.raw ? opts.dump(opts.data) : opts.data;

      data !== undefined ? xhr.send(data) : xhr.send();
    });
  };

  xr.assign = assign;
  xr.configure = configure;
  xr.Methods = Methods;
  xr.Events = Events;
  xr.defaults = defaults;

  xr.get = function (url, params, args) {
    return xr(assign({ url: url, method: Methods.GET, params: params }, args));
  };
  xr.put = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.PUT, data: data }, args));
  };
  xr.post = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.POST, data: data }, args));
  };
  xr.patch = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.PATCH, data: data }, args));
  };
  xr.del = function (url, args) {
    return xr(assign({ url: url, method: Methods.DELETE }, args));
  };
  xr.options = function (url, args) {
    return xr(assign({ url: url, method: Methods.OPTIONS }, args));
  };

  module.exports = xr;
});
