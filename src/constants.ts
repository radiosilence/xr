export interface Methods {
    GET: 'GET'
    POST: 'POST'
    PUT: 'PUT'
    DELETE: 'DELETE'
    PATCH: 'PATCH'
    OPTIONS: 'OPTIONS'
    HEAD: 'HEAD'
}

export const METHODS: Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
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

export const EVENTS = {
  READY_STATE_CHANGE: 'readystatechange',
  LOAD_START: 'loadstart',
  PROGRESS: 'progress',
  ABORT: 'abort',
  ERROR: 'error',
  LOAD: 'load',
  TIMEOUT: 'timeout',
  LOAD_END: 'loadend',
}
