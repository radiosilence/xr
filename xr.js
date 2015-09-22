(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'bluebird'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('bluebird'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global._bluebird);
    global.xr = mod.exports;
  }
})(this, function (exports, module, _bluebird2) {
  /**
   * xr (c) James Cleveland 2015
   * URL: https://github.com/radiosilence/xr
   * License: BSD
   */

  'use strict';

  var xr = _bluebird2.coroutine(function* (args) {

    var opts = assign({}, defaults, config, args);
    var xhr = opts.xmlHttpRequest();

    xhr.open(opts.method, opts.params ? opts.url.split('?')[0] + '?' + urlEncode(opts.params) : opts.url, true);

    // xhr.addEventListener(Events.ABORT, err => throw new Error(err));
    // xhr.addEventListener(Events.ERROR, err => throw new Error(err));
    // xhr.addEventListener(Events.TIMEOUT, err => throw new Error(err));

    var data = yield promise(args, function (resolve, reject) {
      return xhr.addEventListener(Events.LOAD, function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          var _data = null;
          if (xhr.responseText) {
            _data = opts.raw === true ? xhr.responseText : opts.load(xhr.responseText);
          }
          resolve(_data);
        } else {
          reject(res(xhr));
        }
      });
    });

    for (var k in opts.headers) {
      if (!({}).hasOwnProperty.call(opts.headers, k)) continue;
      xhr.setRequestHeader(k, opts.headers[k]);
    }

    for (var k in opts.events) {
      if (!({}).hasOwnProperty.call(opts.events, k)) continue;
      xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
    }

    var body = typeof opts.data === 'object' && !opts.raw ? opts.dump(opts.data) : opts.data;

    if (body !== undefined) xhr.send(body);else xhr.send();
  });

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

  function res(xhr) {
    return {
      status: xhr.status,
      response: xhr.response,
      xhr: xhr
    };
  }

  function assign(l) {
    for (var _len = arguments.length, rs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rs[_key - 1] = arguments[_key];
    }

    for (var i in rs) {
      if (!({}).hasOwnProperty.call(rs, i)) continue;
      var r = rs[i];
      if (typeof r !== 'object') continue;
      for (var k in r) {
        if (!({}).hasOwnProperty.call(r, k)) continue;
        l[k] = r[k];
      }
    }
    return l;
  }

  function urlEncode(params) {
    var paramStrings = [];
    for (var k in params) {
      if (!({}).hasOwnProperty.call(params, k)) continue;
      paramStrings.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    }
    return paramStrings.join('&');
  }

  var config = {};

  function configure(opts) {
    config = assign({}, config, opts);
  }

  function promise(args, fn) {
    return (args && args.promise ? args.promise : config.promise || defaults.promise)(fn);
  }

  xr.assign = assign;
  xr.urlEncode = urlEncode;
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
