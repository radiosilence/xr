/**
 * xr (c) James Cleveland 2015
 * URL: https://github.com/radiosilence/xr
 * License: BSD
 */

import encode from 'querystring/encode';

const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
};

const Events = {
  READY_STATE_CHANGE: 'readystatechange',
  LOAD_START: 'loadstart',
  PROGRESS: 'progress',
  ABORT: 'abort',
  ERROR: 'error',
  LOAD: 'load',
  TIMEOUT: 'timeout',
  LOAD_END: 'loadend',
};

const defaults = {
  method: Methods.GET,
  data: undefined,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  dump: JSON.stringify,
  load: JSON.parse,
  xmlHttpRequest: () => new XMLHttpRequest(),
  promise: fn => new Promise(fn),
  withCredentials: false,
};

function res(xhr, data) {
  return {
    status: xhr.status,
    response: xhr.response,
    data,
    xhr,
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

function getURI(opts) {
	let uri = opts.url;
	let subPath = opts.subPath
	if(!uri|| subPath.indexOf("://") !== -1) {
		uri = subPath;
		subPath = undefined;
	}
	if(subPath || opts.params) {
		uri = uri.split('?')[0];
	}
	if(subPath) {
		if(uri.indexOf('/') === uri.length - 1) { 
			uri = uri.substr(0, uri.length -1);
		}
		if(subPath.indexOf('/') === 0) {
			subPath = subPath.substr(1);
		}
		uri = `${uri}/${subPath}`;
	}
	if(opts.params) {
		uri = `${uri}?${encode(opts.params)}`
	}
	return uri;
}

function xr(args) {
  return promise(args, (resolve, reject) => {
    const opts = assign({}, defaults, config, args);
    const xhr = opts.xmlHttpRequest();

    xhr.withCredentials = opts.withCredentials;

    if (opts.abort) {
      args.abort(() => {
        reject(res(xhr));
        xhr.abort();
      })
    }

    xhr.open(opts.method, getURI(opts), true );

    xhr.addEventListener(Events.LOAD, () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let data = null;
        if (xhr.responseText) {
          data = opts.raw === true
            ? xhr.responseText
            : opts.load(xhr.responseText);
        }
        resolve(res(xhr, data));
      } else {
        reject(res(xhr));
      }
    });

    xhr.addEventListener(Events.ABORT, () => reject(res(xhr)));
    xhr.addEventListener(Events.ERROR, () => reject(res(xhr)));
    xhr.addEventListener(Events.TIMEOUT, () => reject(res(xhr)));

    for (const k in opts.headers) {
      if (!{}.hasOwnProperty.call(opts.headers, k)) continue;
      xhr.setRequestHeader(k, opts.headers[k]);
    }

    for (const k in opts.events) {
      if (!{}.hasOwnProperty.call(opts.events, k)) continue;
      xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
    }

    const data = (typeof opts.data === 'object' && !opts.raw)
        ? opts.dump(opts.data)
        : opts.data;

    if (data !== undefined) xhr.send(data);
    else xhr.send();
  });
}

xr.assign = assign;
xr.encode = encode;
xr.configure = configure;
xr.Methods = Methods;
xr.Events = Events;
xr.defaults = defaults;

xr.get = (subPath, params, args) => xr(assign({ subPath, method: Methods.GET, params }, args));
xr.put = (subPath, data, args) => xr(assign({ subPath, method: Methods.PUT, data }, args));
xr.post = (subPath, data, args) => xr(assign({ subPath, method: Methods.POST, data }, args));
xr.patch = (subPath, data, args) => xr(assign({ subPath, method: Methods.PATCH, data }, args));
xr.del = (subPath, args) => xr(assign({ subPath, method: Methods.DELETE }, args));
xr.options = (subPath, args) => xr(assign({ subPath, method: Methods.OPTIONS }, args));

export default xr;
