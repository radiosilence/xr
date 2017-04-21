export interface Methods {
    GET: 'GET'
    POST: 'POST'
    PUT: 'PUT'
    DELETE: 'DELETE'
    PATCH: 'PATCH'
    OPTIONS: 'OPTIONS'
    HEAD: 'HEAD'
}

export interface Events {
    READY_STATE_CHANGE: 'readystatechange'
    LOAD_START: 'loadstart'
    PROGRESS: 'progress'
    ABORT: 'abort'
    ERROR: 'error'
    LOAD: 'load'
    TIMEOUT: 'timeout'
    LOAD_END: 'loadend'
}

export interface Headers {
    [key: string]: string
}

export interface EventCallbacks {
    [key: string]: any
}

export interface Config {
    url?: string
    method: keyof Methods
    data?: object | string
    headers: Headers
    dump: (data: object) => string
    load: (string: string) => object
    xmlHttpRequest: () => XMLHttpRequest
    promise: (fn: () => Promise<any>) => Promise<any>
    abort?: any
    params?: object | null
    withCredentials: boolean
    raw?: boolean
    events?: EventCallbacks
}

export interface Response {
    status: number
    response: object
    data?: string | object
    xhr: XMLHttpRequest
}

export interface DynamicObject {
    [key: string]: any
}
