/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./lib/env.mjs'));

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverMinification: false,
  },
};

export default config;
