/**
 * Centralized API Configuration
 * Defines base URLs and endpoints for the application to ensure consistency
 * across direct client-side fetching.
 */

export const getApiConfig = () => {
    // Base URLs
    const LISTINGS_BASE_URL = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL || 'https://api.bisame.com';
    const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || 'https://auth.bisame.com';

    // Endpoint Paths (from env or defaults)
    const SECTION_API_PATH = process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL || '/api/general/market-place/listings/get-listings-by-section/';
    const LATEST_LISTINGS_PATH = process.env.NEXT_PUBLIC_LATEST_LISTINGS_API_URL || '/api/general/market-place/listings/latest-listings';
    const TRENDING_LISTINGS_PATH = process.env.NEXT_PUBLIC_TRENDING_LISTINGS_URL || '/api/general/market-place/listings/trending-listings';

    return {
        baseUrl: LISTINGS_BASE_URL,
        authBaseUrl: AUTH_API_BASE_URL,
        endpoints: {
            sections: `${LISTINGS_BASE_URL}${SECTION_API_PATH}`,
            latest: `${LISTINGS_BASE_URL}${LATEST_LISTINGS_PATH}`,
            trending: `${LISTINGS_BASE_URL}${TRENDING_LISTINGS_PATH}`,
        },
    };
};

export const getSectionApiUrl = (sectionTitle: string) => {
    const config = getApiConfig();
    return `${config.endpoints.sections}?sectionTitle=${encodeURIComponent(sectionTitle)}`;
};

