/**
 * xr (c) James Cleveland 2015
 * URL: https://github.com/radiosilence/xr
 * License: BSD
 */

import { stringify } from 'query-string';

import { METHODS, EVENTS } from './constants'

import { Methods, Events, Config, Response, DynamicObject } from '../index.d'

const defaults = {
  method: METHODS.GET,
  data: undefined,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  dump: JSON.stringify,
  load: JSON.parse,
  xmlHttpRequest: (): XMLHttpRequest => new XMLHttpRequest(),
  promise: (fn: () => Promise<any>) => new Promise(fn),
  withCredentials: false,
};

const res = (xhr: XMLHttpRequest, data: object): Response => ({
    status: xhr.status,
    response: xhr.response,
    data,
    xhr,
})

let config: Config = { ...defaults };

const configure = (opts: Partial<Config>): void => {
    config = { ...config, ...opts };
}

const promise = (args: Config, fn: (resolve: any, reject: any) => any) =>
  ((args && args.promise)
    ? args.promise
    : (config.promise || defaults.promise)
  )(fn)

const xr = (args: Config): Promise<any> =>
    promise(args, (resolve: () => any, reject: () => any) => {
        const opts: Config = { ...defaults, ...config, ...args };
        const xhr = opts.xmlHttpRequest();

        if (opts.abort) {
            args.abort(() => {
                reject(res(xhr));
                xhr.abort();
            });
        }

        xhr.open(
      opts.method,
      opts.params
        ? `${opts.url.split('?')[0]}?${stringify(opts.params)}`
        : opts.url,
      true,
    );

    // setting after open for compatibility with IE versions <=10
        xhr.withCredentials = opts.withCredentials;

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

xr.assign = assign;
xr.encode = encode;
xr.configure = configure;
xr.Methods = Methods;
xr.Events = Events;
xr.defaults = defaults;

xr.get = (url, params, args) => xr(assign({ url, method: Methods.GET, params }, args));
xr.put = (url, data, args) => xr(assign({ url, method: Methods.PUT, data }, args));
xr.post = (url, data, args) => xr(assign({ url, method: Methods.POST, data }, args));
xr.patch = (url, data, args) => xr(assign({ url, method: Methods.PATCH, data }, args));
xr.del = (url, args) => xr(assign({ url, method: Methods.DELETE }, args));
xr.options = (url, args) => xr(assign({ url, method: Methods.OPTIONS }, args));

export default xr;
