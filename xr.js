(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xr = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var res = function (xhr) {
  return {
    status: xhr.status,
    response: xhr.response,
    xhr: xhr,
    params: {}
  };
};

var getParams = function (data, url) {
  var ret = [];
  for (var k in data) {
    ret.push("" + encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
  }if (url.split("?").length > 1) ret.push(url.split("?")[1]);
  return ret.join("&");
};

var Methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};

var defaults = {
  method: Methods.GET,
  data: undefined,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  dumpFn: JSON.stringify,
  loadFn: JSON.parse
};

var xr = function (args) {
  return new Promise(function (resolve, reject) {
    var opts = Object.assign({}, defaults, args);
    var xhr = new XMLHttpRequest();
    var params = getParams(opts.params, opts.url);

    xhr.open(opts.method, params ? "" + opts.url.split("?")[0] + "?" + params : opts.url, true);
    xhr.addEventListener("load", function () {
      if (xhr.status === 200) resolve(Object.assign({}, res(xhr), {
        data: opts.loadFn(xhr.response)
      }), false);else reject(res(xhr));
    });

    for (var header in opts.headers) {
      xhr.setRequestHeader(header, opts.headers[header]);
    }for (var _event in opts.events) {
      xhr.addEventListener(_event, opts.events[_event].bind(xhr), false);
    }xhr.send(typeof opts.data === "object" ? opts.dumpFn(opts.data) : opts.data);
  });
};

xr.Methods = Methods;
xr.defaults = defaults;

xr.get = function (url, params, args) {
  return xr(Object.assign({ url: url, method: Methods.GET, params: params }, args));
};
xr.put = function (url, data, args) {
  return xr(Object.assign({ url: url, method: Methods.PUT, data: data }, args));
};
xr.post = function (url, data, args) {
  return xr(Object.assign({ url: url, method: Methods.POST, data: data }, args));
};
xr.del = function (url, args) {
  return xr(Object.assign({ url: url, method: Methods.DELETE }, args));
};

module.exports = xr;

},{}]},{},[1])(1)
});