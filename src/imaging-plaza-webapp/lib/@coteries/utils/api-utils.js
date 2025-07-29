'use strict';

const stripMatcher = (str, matcher) => str.replace(new RegExp(matcher[0]), '').replace(new RegExp(matcher[1]), '');
/**
 *
 * @param str the string to interpolate into
 * @param interpolator the interpolator object
 * @returns the interpolated string
 */
const interpolate = (str, interpolator, matcher = ['\\${', '}']) => {
    return str.replace(new RegExp(`${matcher[0]}.*?${matcher[1]}`, 'g'), g => {
        if (typeof interpolator !== 'object')
            return interpolator + '';
        const replacer = stripMatcher(g, matcher);
        const nest = replacer.split('.');
        let obj = interpolator;
        for (let i = 0; i < nest.length; i++) {
            const key = nest[i];
            const nested = obj?.[key];
            if (['string', 'number'].includes(typeof nested) && i === nest.length - 1) {
                return (nested + '');
            }
            else if (typeof nested === 'object') {
                obj = nested;
            }
            else {
                return g;
            }
        }
        return g;
    });
};

const stripLeadingSlash = (part) => (part.startsWith('/') ? part.substring(1) : part);
const stripEndingSlash = (part) => (part.endsWith('/') ? part.substring(1) : part);
/**
 * Remove leading and trailing slashes
 * @param part the url part
 * @returns the sanitized url
 */
const sanitzeURLPart = (part) => stripEndingSlash(stripLeadingSlash(part));
/**
 * Build an url by appending parts to a base uri
 * @param base the base for the final url
 * @param parts all the parts to append to the url
 * @returns the built URL
 */
const buildUrl = (base, ...parts) => {
    const sanitized = parts.map(sanitzeURLPart).filter(p => !!p);
    return sanitized.length == 0 ? base : stripEndingSlash(base) + '/' + sanitized.join('/');
};
/**
 * prepare a url for interpolation
 * @param urlString the url to interpolate
 * @param _ the slug representation
 * @returns
 */
const dynamicUrl = (urlString, _) => slug => {
    return interpolate(urlString, slug, ['\\[', '\\]']);
};

/**
 * Is this an existing object with at least one element
 * @param obj the tested object
 * @returns true if this is an object with at least one element false otherwise
 */
/**
 * Remove keys from an object
 * @param obj the object
 * @param keys the keys to omit
 */
const omit = (obj, ...keys) => {
    return Object.entries(obj).reduce((acc, [k, v]) => keys.includes(k)
        ? acc
        : {
            ...acc,
            [k]: v
        }, {});
};

class FetchError extends Error {
    status;
    url;
    constructor(status, url, method) {
        super(`${method} ${url} failed with status: ${status}`);
        this.status = status;
        this.url = url;
    }
}
const typedFetch = async (url, options) => {
    const res = await fetch(url, {
        ...options
    });
    if (!res.ok) {
        throw new FetchError(res.status, url, options?.method ?? 'GET');
    }
    else {
        const data = (await res.json());
        if (options?.rawResponseKeeper) {
            options.rawResponseKeeper.response = res;
        }
        return options?.parser ? options.parser.parse(data) : data;
    }
};
class TypedFetch {
    url;
    constructor(url) {
        this.url = url;
    }
    get(params, options) {
        return TypedFetch.get(dynamicUrl(this.url)(params), options);
    }
    put(params, body, options) {
        return TypedFetch.put(dynamicUrl(this.url)(params), body, options);
    }
    post(params, body, options) {
        return TypedFetch.post(dynamicUrl(this.url)(params), body, options);
    }
    delete(params, options) {
        return TypedFetch.delete(dynamicUrl(this.url)(params), options);
    }
    postFiles(params, files, options) {
        return TypedFetch.postFiles(dynamicUrl(this.url)(params), files, options);
    }
    static prepare = (url, _) => {
        return new TypedFetch(url);
    };
    static get = async (url, options) => {
        return typedFetch(url, {
            method: 'GET',
            ...options
        });
    };
    static put = async (url, body, options) => {
        return typedFetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            body: JSON.stringify(body),
            ...(options ? omit(options, 'headers') : {})
        });
    };
    static post = async (url, body, options) => {
        return typedFetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            body: JSON.stringify(body),
            ...(options ? omit(options, 'headers') : {})
        });
    };
    static delete = async (url, options) => {
        return typedFetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            ...(options ? omit(options, 'headers') : {})
        });
    };
    static async postFiles(url, files, options) {
        const formData = new FormData();
        files.forEach(f => formData.append(f.name, f));
        const result = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const json = await result.json();
        return options?.parser ? options.parser.parse(json) : json;
    }
}

exports.FetchError = FetchError;
exports.TypedFetch = TypedFetch;
exports.buildUrl = buildUrl;
exports.dynamicUrl = dynamicUrl;
exports.sanitzeURLPart = sanitzeURLPart;
exports.stripEndingSlash = stripEndingSlash;
exports.stripLeadingSlash = stripLeadingSlash;
exports.typedFetch = typedFetch;
