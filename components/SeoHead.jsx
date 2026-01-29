import Head from 'next/head';
import { useRouter } from 'next/router';

const defaultMeta = {
    title: 'Real Estate Hub',
    description: 'Find your dream property from curated listings of homes, apartments, and villas.',
    image: '/og-image.png',
    siteName: 'Real Estate Hub',
};

export default function SeoHead({
    title,
    description,
    image,
    type = 'website',
    noIndex = false,
    canonical,
    jsonLd,
}) {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const path = router.asPath?.split('#')[0]?.split('?')[0] || '/';
    const url = canonical || `${baseUrl}${path}`;

    const metaTitle = title ? `${title} | ${defaultMeta.siteName}` : defaultMeta.title;
    const metaDescription = description || defaultMeta.description;
    const metaImage = image || defaultMeta.image;

    return (
        <Head>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={defaultMeta.siteName} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <link rel="canonical" href={url} />
            {noIndex && <meta name="robots" content="noindex,nofollow" />}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
}
