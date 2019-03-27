export interface Methods {
    GET: 'GET';
    POST: 'POST';
    PUT: 'PUT';
    DELETE: 'DELETE';
    PATCH: 'PATCH';
    OPTIONS: 'OPTIONS';
    HEAD: 'HEAD';
}
export declare const METHODS: Methods;
export interface Events {
    READY_STATE_CHANGE: 'readystatechange';
    LOAD_START: 'loadstart';
    PROGRESS: 'progress';
    ABORT: 'abort';
    ERROR: 'error';
    LOAD: 'load';
    TIMEOUT: 'timeout';
    LOAD_END: 'loadend';
}
export declare const EVENTS: {
    READY_STATE_CHANGE: string;
    LOAD_START: string;
    PROGRESS: string;
    ABORT: string;
    ERROR: string;
    LOAD: string;
    TIMEOUT: string;
    LOAD_END: string;
};
