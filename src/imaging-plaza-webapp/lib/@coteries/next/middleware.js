'use strict';

var server = require('next/server');

// https://nextjs.org/docs/api-reference/next/server#how-do-i-access-environment-variables
// we cannot pass config as is since it's in webpack and inserted at build time :()
function applyCoteriesMiddleware(config, fn) {
    return async (req) => {
        switch (req.nextUrl.pathname) {
            case '/api/log':
                await req.json();
                server.NextResponse.next();
                return new server.NextResponse(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: { 'content-type': 'application/json' }
                });
            case '/api/config':
                return new server.NextResponse(JSON.stringify({
                    ...process.env,
                    NEXT_PUBLIC_CONFIG_BUILD_ID: process.env.NEXT_PUBLIC_CONFIG_BUILD_ID ?? 'install plugin',
                    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? 'install plugin',
                    NEXT_PUBLIC_APP_COMMIT_SHA: process.env.NEXT_PUBLIC_APP_COMMIT_SHA ?? 'install plugin',
                    ...config
                }), {
                    status: 200,
                    headers: { 'content-type': 'application/json' }
                });
        }
        const resp = await fn?.(req);
        return resp;
    };
}

exports.applyCoteriesMiddleware = applyCoteriesMiddleware;
