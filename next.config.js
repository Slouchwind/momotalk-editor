const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n: {
    locales: ['zh-CN', 'zh-TW'],
    defaultLocale: 'zh-CN'
  }
}

module.exports = nextConfig;
