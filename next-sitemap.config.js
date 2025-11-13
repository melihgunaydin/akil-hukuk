/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.akilhukuk.com.tr', // deploy’da gerçek domain
    generateRobotsTxt: true,
    exclude: ['/studio*'], // Sanity Studio’yu dışarıda bırak
  }
  