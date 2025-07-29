import { NextRequest, NextResponse } from 'next/server';

type MiddlewareFn = (req: NextRequest) => NextResponse | Promise<NextResponse | undefined> | undefined;
declare function applyCoteriesMiddleware(config?: Record<string, any>, fn?: MiddlewareFn): MiddlewareFn;

export { applyCoteriesMiddleware };
