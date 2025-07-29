import { NextConfig } from 'next';

type NextConfigFn = (phase: string, config: NextConfig) => Promise<NextConfig>;
declare const coteriesNextProject: (config: NextConfig) => NextConfig;

export { NextConfigFn, coteriesNextProject, coteriesNextProject as default };
