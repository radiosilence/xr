import { Methods } from './constants';
export interface Config {
    url?: string;
    method: keyof Methods;
    data?: object | string;
    headers: {
        [key: string]: string;
    };
    dump: (data: object) => string;
    load: (string: string) => object;
    xmlHttpRequest: () => XMLHttpRequest;
    promise: (fn: () => Promise<any>) => Promise<any>;
    abort?: any;
    params?: object | null;
    withCredentials: boolean;
    raw?: boolean;
    events?: {
        [key: string]: () => void;
    };
}
export interface Response {
    status: number;
    response: object;
    data?: string | object;
    xhr: XMLHttpRequest;
}
declare const api: {
    configure: (opts: Partial<Config>) => void;
    EVENTS: {
        READY_STATE_CHANGE: string;
        LOAD_START: string;
        PROGRESS: string;
        ABORT: string;
        ERROR: string;
        LOAD: string;
        TIMEOUT: string;
        LOAD_END: string;
    };
    METHODS: Methods;
    get: (url: string, params?: object | undefined, args?: Partial<Config> | undefined) => Promise<any>;
    put: (url: string, data: any, args: Partial<Config>) => Promise<any>;
    post: (url: string, data: any, args: Partial<Config>) => Promise<any>;
    patch: (url: string, data: any, args: Partial<Config>) => Promise<any>;
    del: (url: string, args: Partial<Config>) => Promise<any>;
    options: (url: string, args: Partial<Config>) => Promise<any>;
};
export default api;
