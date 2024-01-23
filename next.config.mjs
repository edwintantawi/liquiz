/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import withPWAInit from 'next-pwa';
import path from 'path';

!process.env.SKIP_ENV_VALIDATION && (await import('./lib/env.mjs'));

/** @type {import('next-pwa').PWAConfig} */
const withPWA = withPWAInit({
  dest: 'public',
  // Solution: https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1399683017
  buildExcludes: ['app-build-manifest.json'],
});

const generateAppDirEntry = (entry) => {
  const packagePath = import.meta.resolve('next-pwa');
  const packageDirectory = path.dirname(packagePath);
  const registerJs = path.join(packageDirectory, 'register.js');

  return entry().then((entries) => {
    // Register SW on App directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
    if (entries['main-app'] && !entries['main-app'].includes(registerJs)) {
      if (Array.isArray(entries['main-app'])) {
        entries['main-app'].unshift(registerJs);
      } else if (typeof entries['main-app'] === 'string') {
        entries['main-app'] = [registerJs, entries['main-app']];
      }
    }
    return entries;
  });
};

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
  experimental: {
    serverMinification: false,
  },
  webpack: (config) => {
    const entry = generateAppDirEntry(config.entry);
    config.entry = () => entry;

    return config;
  },
};

export default withPWA(config);
