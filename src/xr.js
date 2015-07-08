/**
 * xr (c) James Cleveland 2015
 * URL: https://github.com/radiosilence/xr
 * License: BSD
 */

function res(xhr) {
  return {
    status: xhr.status,
    response: xhr.response,
    xhr: xhr
  };
}

function assign(l, ...rs) {
  rs.forEach(r => {
    Object.keys(r).forEach(k => {
      l[k] = r[k];
    });
  });
  return l;
}

function urlEncode(params) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}

const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS'
};

const Events = {
  READY_STATE_CHANGE: 'readystatechange',
  LOAD_START: 'loadstart',
  PROGRESS: 'progress',
  ABORT: 'abort',
  ERROR: 'error',
  LOAD: 'load',
  TIMEOUT: 'timeout',
  LOAD_END: 'loadend'
};

const defaults = {
  method: Methods.GET,
  data: undefined,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  dump: JSON.stringify,
  load: JSON.parse,
  xmlHttpRequest: () => new XMLHttpRequest(),
  promise: fn => new Promise(fn)
};

let config = {};

const configure = (opts) => {
  config = assign({}, config, opts);
};

const promise = (args, fn) => (
  (args && args.promise)
    ? args.promise
    : (config.promise || defaults.promise)
)(fn);

const xr = args => promise(args, (resolve, reject) => {
  const opts = assign({}, defaults, config, args);
  const xhr = opts.xmlHttpRequest();

  xhr.open(
    opts.method,
    opts.params
      ? `${opts.url.split('?')[0]}?${urlEncode(opts.params)}`
      : opts.url,
    true
  );

  xhr.addEventListener(Events.LOAD, () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      let data = null;
      if (xhr.response) {
        data = opts.raw === true
          ? xhr.response
          : opts.load(xhr.response);
      }
      resolve(data);
    } else {
      reject(res(xhr));
    }
  });

  xhr.addEventListener(Events.ABORT, () => reject(res(xhr)));
  xhr.addEventListener(Events.ERROR, () => reject(res(xhr)));
  xhr.addEventListener(Events.TIMEOUT, () => reject(res(xhr)));

  opts.headers
    .forEach((header, name) => xhr.setRequestHeader(name, header));

  opts.events
    .forEach((event, name) => xhr.addEventListener(name, event.bind(null, xhr), false));


  const data = (typeof opts.data === 'object' && !opts.raw)
      ? opts.dump(opts.data)
      : opts.data;

  if (data !== undefined) xhr.send(data);
  else xhr.send();
});

xr.assign = assign;
xr.urlEncode = urlEncode;
xr.configure = configure;
xr.Methods = Methods;
xr.Events = Events;
xr.defaults = defaults;

xr.get = (url, params, args) => xr(assign({url: url, method: Methods.GET, params: params}, args));
xr.put = (url, data, args) => xr(assign({url: url, method: Methods.PUT, data: data}, args));
xr.post = (url, data, args) => xr(assign({url: url, method: Methods.POST, data: data}, args));
xr.patch = (url, data, args) => xr(assign({url: url, method: Methods.PATCH, data: data}, args));
xr.del = (url, args) => xr(assign({url: url, method: Methods.DELETE}, args));
xr.options = (url, args) => xr(assign({url: url, method: Methods.OPTIONS}, args));

export default xr;
