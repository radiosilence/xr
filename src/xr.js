/**
 * xr (c) James Cleveland 2015
 * URL: https://github.com/radiosilence/xr
 * License: BSD
 */


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

function res(xhr) {
  return {
    status: xhr.status,
    response: xhr.response,
    xhr: xhr
  };
}

function assign(l, ...rs) {
  for (const i in rs) {
    if (!{}.hasOwnProperty.call(rs, i)) continue;
    const r = rs[i];
    if (typeof r !== 'object') continue;
    for (const k in r) {
      if (!{}.hasOwnProperty.call(r, k)) continue;
      l[k] = r[k];
    }
  }
  return l;
}

function urlEncode(params) {
  const paramStrings = [];
  for (const k in params) {
    if (!{}.hasOwnProperty.call(params, k)) continue;
    paramStrings.push(`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`);
  }
  return paramStrings.join('&');
}

let config = {};

function configure(opts) {
  config = assign({}, config, opts);
}

function promise(args, fn) {
  return ((args && args.promise)
      ? args.promise
      : (config.promise || defaults.promise)
  )(fn);
}

async function xr(args) {

  const opts = assign({}, defaults, config, args);
  const xhr = opts.xmlHttpRequest();

  xhr.open(
    opts.method,
    opts.params
      ? `${opts.url.split('?')[0]}?${urlEncode(opts.params)}`
      : opts.url,
    true
  );

  // xhr.addEventListener(Events.ABORT, err => throw new Error(err));
  // xhr.addEventListener(Events.ERROR, err => throw new Error(err));
  // xhr.addEventListener(Events.TIMEOUT, err => throw new Error(err));

  const data = await promise(args, (resolve, reject) => xhr.addEventListener(Events.LOAD, () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      let data = null;
      if (xhr.responseText) {
        data = opts.raw === true
          ? xhr.responseText
          : opts.load(xhr.responseText);
      }
      resolve(data);
    } else {
      reject(res(xhr));
    }
  }));

  for (const k in opts.headers) {
    if (!{}.hasOwnProperty.call(opts.headers, k)) continue;
    xhr.setRequestHeader(k, opts.headers[k]);
  }

  for (const k in opts.events) {
    if (!{}.hasOwnProperty.call(opts.events, k)) continue;
    xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
  }

  const body = (typeof opts.data === 'object' && !opts.raw)
    ? opts.dump(opts.data)
    : opts.data;


  if (body !== undefined) xhr.send(body);
  else xhr.send();
}

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
