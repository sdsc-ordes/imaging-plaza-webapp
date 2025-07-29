'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const pack = require(process.cwd() + '/package.json');
const createBuildId = () => pack.version +
    '-' +
    require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
const coteriesNextProject = (config) => {
    const resolvedConfig = config;
    const thisBuildId = createBuildId();
    console.info(`Using buildId: ${thisBuildId}`);
    return {
        ...resolvedConfig,
        generateBuildId: () => thisBuildId,
        env: {
            ...resolvedConfig.env,
            NEXT_PUBLIC_CONFIG_BUILD_ID: thisBuildId,
            NEXT_PUBLIC_APP_VERSION: pack.version,
            NEXT_PUBLIC_APP_COMMIT_SHA: require('child_process')
                .execSync('git rev-parse HEAD')
                .toString()
                .trim()
        }
    };
};

exports.coteriesNextProject = coteriesNextProject;
exports.default = coteriesNextProject;
