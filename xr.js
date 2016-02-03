(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xr.js"] = factory();
	else
		root["xr.js"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!****************!*\
  !*** multi xr ***!
  \****************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./src/xr.js */1);


/***/ },
/* 1 */
/*!*******************!*\
  !*** ./src/xr.js ***!
  \*******************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * xr (c) James Cleveland 2015
	                                                                                                                                                                                                                                                   * URL: https://github.com/radiosilence/xr
	                                                                                                                                                                                                                                                   * License: BSD
	                                                                                                                                                                                                                                                   */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _encode = __webpack_require__(/*! querystring/encode */ 2);

	var _encode2 = _interopRequireDefault(_encode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    if (!{}.hasOwnProperty.call(rs, i)) continue;
	    var r = rs[i];
	    if ((typeof r === 'undefined' ? 'undefined' : _typeof(r)) !== 'object') continue;
	    for (var k in r) {
	      if (!{}.hasOwnProperty.call(r, k)) continue;
	      l[k] = r[k];
	    }
	  }
	  return l;
	}

	var config = {};

	function configure(opts) {
	  config = assign({}, config, opts);
	}

	function promise(args, fn) {
	  return (args && args.promise ? args.promise : config.promise || defaults.promise)(fn);
	}

	function xr(args) {
	  var p = promise(args, function (resolve, reject) {
	    var opts = assign({}, defaults, config, args);
	    var xhr = opts.xmlHttpRequest();
	    p.abort = xhr.abort;

	    xhr.open(opts.method, opts.params ? opts.url.split('?')[0] + '?' + (0, _encode2.default)(opts.params) : opts.url, true);

	    xhr.addEventListener(Events.LOAD, function () {
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

	    xhr.addEventListener(Events.ABORT, function () {
	      return reject(res(xhr));
	    });
	    xhr.addEventListener(Events.ERROR, function () {
	      return reject(res(xhr));
	    });
	    xhr.addEventListener(Events.TIMEOUT, function () {
	      return reject(res(xhr));
	    });

	    for (var k in opts.headers) {
	      if (!{}.hasOwnProperty.call(opts.headers, k)) continue;
	      xhr.setRequestHeader(k, opts.headers[k]);
	    }

	    for (var k in opts.events) {
	      if (!{}.hasOwnProperty.call(opts.events, k)) continue;
	      xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
	    }

	    var data = _typeof(opts.data) === 'object' && !opts.raw ? opts.dump(opts.data) : opts.data;

	    if (data !== undefined) xhr.send(data);else xhr.send();
	  });
	  return p;
	}

	xr.assign = assign;
	xr.encode = _encode2.default;
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

	exports.default = xr;

/***/ },
/* 2 */
/*!*********************************!*\
  !*** ./~/querystring/encode.js ***!
  \*********************************/
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ }
/******/ ])
});
;