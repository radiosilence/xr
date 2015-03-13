(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  /**
   * xr (c) James Cleveland 2015
   * URL: https://github.com/radiosilence/xr
   * License: BSD
   */

  var res = function (xhr) {
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

  var getParams = function (data, url) {
    var ret = [];
    for (var k in data) {
      ret.push("" + encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
    }if (url && url.split("?").length > 1) ret.push(url.split("?")[1]);
    return ret.join("&");
  };

  var Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    OPTIONS: "OPTIONS"
  };

  var defaults = {
    method: Methods.GET,
    data: undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    dump: JSON.stringify,
    load: JSON.parse,
    promise: Promise
  };

  var promise = function (args, fn) {
    return new (args && args.promise ? args.promise : defaults.promise)(fn);
  };

  var xr = function (args) {
    return promise(args, function (resolve, reject) {
      var opts = assign({}, defaults, args);
      var xhr = new XMLHttpRequest();

      xhr.open(opts.method, opts.params ? "" + opts.url.split("?")[0] + "?" + getParams(opts.params) : opts.url, true);
      xhr.addEventListener("load", function () {
        return xhr.status >= 200 && xhr.status < 300 ? resolve(assign({}, res(xhr), {
          data: xhr.response ? !opts.raw ? opts.load(xhr.response) : xhr.response : null
        }), false) : reject(res(xhr));
      });

      for (var header in opts.headers) {
        xhr.setRequestHeader(header, opts.headers[header]);
      }for (var _event in opts.events) {
        xhr.addEventListener(_event, opts.events[_event].bind(null, xhr), false);
      }xhr.send(typeof opts.data === "object" && !opts.raw ? opts.dump(opts.data) : opts.data);
    });
  };

  xr.assign = assign;
  xr.Methods = Methods;
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
