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

Quickstart
----------

    xr.get('/api/items', {take: 5})
      .then(res => console.log(res.data));
    
    xr.post('/api/item', {name: 'hello'})
      .then(res => console.log("new item", res.data));

Extended syntax:

    xr({
      method: xr.Methods.GET,
      url: '/api/items',
      params: {take: 5},
      events: {
        progress: (xhr, xhrProgressEvent) => {
          console.log("xhr", xhr);
          console.log("progress", xhrProgressEvent);
        }
      }
    });
    

API is simple, for now consult source files.

Features
--------

 * Returns ES6 promises.
 * Has query parameter generation.
 * Supports events.

Alias Methods
-------------

You can do some quick aliases to requests, for instance:
    
    xr.get('/my-url')

Requirements
------------

There must be a polyfill that supports at least the standard ES6 promise API
(xr will use whatever's there), and Object.assign().

License
-------

See LICENSE
