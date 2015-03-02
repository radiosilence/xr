xr
==

Really simple wrapper about XR that provides a couple of nice functions,
exposes the XHR object wherever relevant, and returns an ES6 Promise.

API is simple, for now consult source files.

Features
--------

 * Returns ES6 promises.
 * Rejects if not 200.
 * Has query parameter generation.
 * Supports events.

Requirements
------------

There must be a polyfill that supports at least the standard ES6 promise API
(xr will use whatever's there), and Object.assign().

