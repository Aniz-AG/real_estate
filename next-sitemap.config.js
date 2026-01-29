/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/api/*'],
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: 'weekly',
            priority: path === '/' ? 1.0 : 0.7,
            lastmod: new Date().toISOString(),
        };
    },
};
