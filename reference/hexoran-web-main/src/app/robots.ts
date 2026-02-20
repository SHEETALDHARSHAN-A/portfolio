
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/api/', '/auth/', '/_next/', '/static/'],
            },
        ],
        sitemap: 'https://www.hexoran.com/sitemap.xml',
        host: 'https://www.hexoran.com',
    }
}
