xr
========

Really simple wrapper around XHR that provides a few bits of nice
functionality, exposes the XHR object wherever relevant, and returns an
ES6 Promise (or whatever Promise is set to globally, if you want to use
something else).

The idea was to make a pragmatic library that's pre-configured for the 90%
use case, but override-able for anyone that wants to do anything
a bit off the beaten track.

For instance, the library is by default set up to send/receive JSON (with
the associated headers and parser/dumper already set up), but if you wanted to
use something like XML, it's easy enough to override that with a few lines.

It's lightweight, has no dependencies (other than having either Promise
in the global namespace or provided via `xr.config`), and adds pretty
much no overhead over the standard XHR API.

Install
----------
`npm install xr --save`

Quickstart
----------

```javascript
const res = await xr.get('/api/items', {take: 5});
console.log(res.data);

const res = await xr.post('/api/item', {name: 'hello'});
console.log('new item', res.data);
```

Extended syntax:

```javascript
xr({
  method: xr.Methods.GET,
  url: '/api/items',
  params: {take: 5},
  events: {
    [xr.Events.PROGRESS]: (xhr, xhrProgressEvent) => {
      console.log("xhr", xhr);
      console.log("progress", xhrProgressEvent);
    }
  }
});
```

Custom promise:

```javascript
xr.get('/url', {}, {
  promise: fn => new myPromiseClass(fn)
});
```

Raw mode (data is not dumped/loaded):

```javascript
xr.put('/url', 'some data', {
  raw: true
});
```

Custom dump/load:

```javascript
xr.post('/url', {'some': 'data'}, {
  dump: data => msgpack.encode(data),
  load: data => msgpack.decode(data)
});
```

Global configuration
--------------------

One thing that I've always found irritating with libraries it that if you want to
override the defaults, you have to do it per-request, or wrap the libraries.

With XR, this is simple, as you can globally configure the module for your project.

```javascript
xr.configure({
  promise: fn => new myPromise(fn)
})
```


API is simple, for now consult [source](https://github.com/radiosilence/xr/blob/master/src/xr.js).

Features
--------

 * Returns ES6 promises.
 * Has query parameter generation.
 * Supports events.

Alias Methods
-------------

You can do some quick aliases to requests, for instance:

```javascript
xr.get('/my-url')
```

Requirements
------------

There must be a [polyfill](https://github.com/jakearchibald/es6-promise) or [browser](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility) that supports at least the standard ES6 promise API
(xr will use whatever's there).

License
-------

See LICENSE
