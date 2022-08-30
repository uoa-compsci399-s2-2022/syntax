/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const prod = process.env.NODE_ENV === 'production'
module.exports = withPWA({
  pwa: {
    disable: prod ? false : true,
    dest: 'public',
    runtimeCaching,
  },
})