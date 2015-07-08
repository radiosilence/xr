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

    rs.forEach(function (r) {
      Object.keys(r).forEach(function (k) {
        l[k] = r[k];
      });
    });
    return l;
  }

  function urlEncode(params) {
    return Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
  }

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

      xhr.open(opts.method, opts.params ? opts.url.split('?')[0] + '?' + urlEncode(opts.params) : opts.url, true);

      xhr.addEventListener(Events.LOAD, function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          var _data = null;
          if (xhr.response) {
            _data = opts.raw === true ? xhr.response : opts.load(xhr.response);
          }
          resolve(_data);
        } else {
          reject(res(xhr));
        }
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

      opts.headers.forEach(function (header, name) {
        return xhr.setRequestHeader(name, header);
      });

      opts.events.forEach(function (event, name) {
        return xhr.addEventListener(name, event.bind(null, xhr), false);
      });

      var data = typeof opts.data === 'object' && !opts.raw ? opts.dump(opts.data) : opts.data;

      if (data !== undefined) xhr.send(data);else xhr.send();
    });
  };

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
