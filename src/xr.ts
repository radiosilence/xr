/**
 * xr (c) James Cleveland 2015
 * URL: https://github.com/radiosilence/xr
 * License: BSD
 */

import { stringify } from 'query-string'

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
}

const res = (xhr: XMLHttpRequest, data?: string | object): Response => ({
    status: xhr.status,
    response: xhr.response,
    data,
    xhr,
})

let config: Config = { ...defaults }

const configure = (opts: Partial<Config>): void => {
    config = { ...config, ...opts }
}

const promise = (args: Config, fn: any) =>
  ((args && args.promise)
    ? args.promise
    : (config.promise || defaults.promise)
  )(fn)

const xr: any = (args: Config): Promise<any>  =>
    promise(args, (resolve: any, reject: any) => {
        const opts: Config = { ...defaults, ...config, ...args }
        const xhr = opts.xmlHttpRequest()

        if (opts.abort) {
            args.abort(() => {
                reject(res(xhr))
                xhr.abort()
            })
        }

        if (opts.url === undefined) throw new Error('No URL defined')

        xhr.open(
            opts.method,
            opts.params
                ? `${opts.url.split('?')[0]}?${stringify(opts.params)}`
                : opts.url,
            true,
            )

        // setting after open for compatibility with IE versions <=10
        xhr.withCredentials = opts.withCredentials

        xhr.addEventListener(EVENTS.LOAD, () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                let data
                if (xhr.responseText) {
                    data = opts.raw === true
                        ? xhr.responseText
                        : opts.load(xhr.responseText)
                }
                resolve(res(xhr, data))
            } else {
                reject(res(xhr))
            }
        })

        xhr.addEventListener(EVENTS.ABORT, () => reject(res(xhr)))
        xhr.addEventListener(EVENTS.ERROR, () => reject(res(xhr)))
        xhr.addEventListener(EVENTS.TIMEOUT, () => reject(res(xhr)))

        for (const k in opts.headers) {
            if (!{}.hasOwnProperty.call(opts.headers, k)) continue
            xhr.setRequestHeader(k, opts.headers[k])
        }

        if (opts.events) {
            for (const k in opts.events) {
                if (!{}.hasOwnProperty.call(opts.events, k)) continue
                xhr.addEventListener(k, opts.events[k].bind(null, xhr), false)
            }
        }

        const data = (typeof opts.data === 'object' && !opts.raw)
            ? opts.dump(opts.data)
            : opts.data

        if (data !== undefined) xhr.send(data)
            else xhr.send()
    })

xr.configure = configure
xr.Methods = METHODS
xr.Events = EVENTS

xr.get = (url: string, params: object, args: Partial<Config>) =>
    xr({ url, method: METHODS.GET, params, ...args })

xr.put = (url: string, data: any, args: Partial<Config>) =>
    xr({ url, method: METHODS.PUT, data, ...args })

xr.post = (url: string, data: any, args: Partial<Config>) =>
    xr({ url, method: METHODS.POST, data, ...args })

xr.patch = (url: string, data: any, args: Partial<Config>) =>
    xr({ url, method: METHODS.PATCH, data, ...args})

xr.del = (url: string, args: Partial<Config>) =>
    xr({ url, method: METHODS.DELETE, ...args})

xr.options = (url: string, args: Partial<Config>) =>
    xr({ url, method: METHODS.OPTIONS, ...args})

export default xr
