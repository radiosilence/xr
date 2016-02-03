xr Changelog
============

0.2.0
------

* [API Change] Resolving promis now includes a "res" object, as opposed to just raw data.
* Added "abort" method to returned promise.
* Remove hot update from build (whoops!).
* Add withCredentials argument for CORS.

0.1.15
------

* Using `querystring` for URL encoding instead of previous function.
* Build process uses webpack.
* Readme updates.

0.1.13
------

* Using xhr.responseText instead of xhr.response to fix an issue with IE9.

0.1.12
------

* Refactored according to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).


0.1.10
------

* Added ability to override XMLHttpRequest with xmlHttpRequest option.
* Fix bug with IE where sending `undefined` with a DELETE request would send the string.

0.1.9
-----

* Added xr.configure, a function to globally configure xr.
* Slight change of the way Promises are passed into configuration,
  where `new` (it being a class) is not assumed necessary. They are
  now passed in a function which takes one argument (the first argument
  to the promise), and returns a Promise, e.g. `fn => new Promise(fn)`.

0.1.8
-----

* Handling abort/error/timeout with a rejection.
* Exposing `xr.Events` which are constants based on the XMLHttpRequest spec.

0.1.7
------

* Raw mode applies to sending and loading.
* Updated readme with more examples.
* Fix bug where data wasn't loaded.

0.1.6
-----

* Fix bug where empty response causes exception.

0.1.5
-----

* Allowing data to be sent directly using opts.raw
* AUTHORS text file

0.1.4
-----

* Remove Promise warning, because it would be annoying if you're providing your
  own promises.
* Add PATCH and OPTIONS.

0.1.3
-----

* Able to inject promise class (will be instantiated with `new`)
* Using internal `assign` function so Object.assign is not needed.
* Added Changelog

0.1.0
-----

* resolve anything between 200-300 instead of only 200.
* Change dumpFn/loadFn to dump/load.

0.0.10
------

* HackerNews debut!
