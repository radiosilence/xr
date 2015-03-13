xr Changelog
============

master
------

* Raw mode applies to sending and loading.
* Updated readme with more examples.

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