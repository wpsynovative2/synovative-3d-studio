// Plain JS (not .ts) so the config loads without SWC: the Hostinger build server's glibc is too old
// for Next's native SWC binary, so builds run on the wasm fallback (@next/swc-wasm-nodejs) + webpack.
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
