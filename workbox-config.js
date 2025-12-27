module.exports = {
  globDirectory: 'build/',      // look at the build output
  globPatterns: ['**/*.{js,html,css,json,ico,png,webp}'], // cache everything
  swDest: 'build/sw.js',        // drop the generated sw here
  skipWaiting: true,            // new SW activates immediately
  clientsClaim: true            // take control of open tabs
};