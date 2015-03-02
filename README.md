    xr
    ==

    Really simple wrapper about XR that provides a couple of nice functions,
    exposes the XHR object wherever relevant, and returns an ES6 Promise (or
    whatever Promise is set to globally, if you want to use something else).

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

    Really simple wrapper about XR that provides a couple of nice functions,
    exposes the XHR object wherever relevant, and returns an ES6 Promise.

    API is simple, for now consult source files.

    Features
    --------

     * Returns ES6 promises.
     * Rejects if not 200.
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

