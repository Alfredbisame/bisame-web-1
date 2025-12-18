/**
 * Centralized API Configuration
 * Defines base URLs and endpoints for the application to ensure consistency
 * across direct client-side fetching.
 */

export const getApiConfig = () => {
    // Base URLs
    const LISTINGS_BASE_URL = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL || 'https://api.bisame.com';
    const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || 'https://auth.bisame.com';

    return {
        baseUrl: LISTINGS_BASE_URL,
        authBaseUrl: AUTH_API_BASE_URL,
        endpoints: {
            // Auth
            login: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_API_URL || '/api/authentication/login'}`,
            googleLogin: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_GOOGLE_LOGIN_API_URL || '/api/authentication/google'}`,
            appleLogin: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_APPLE_LOGIN_API_URL || '/api/authentication/apple'}`,
            verifyOtp: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_VERIFY_OTP_URL || '/api/authentication/verify-otp'}`,
            forgotPassword: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_FORGOT_PASSWORD_API_URL || '/api/authentication/forgot-password'}`,
            resendOtp: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_RESEND_API_URL || '/api/authentication/resend-otp'}`,
            resetPassword: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD || '/api/authentication/reset-password'}`,
            signup: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_SIGNUP_API_URL || '/api/authentication/signup'}`,
            profile: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_PROFILE_API_URL || '/api/authentication/profile'}`,
            logout: `${AUTH_API_BASE_URL}${process.env.NEXT_PUBLIC_LOGOUT_API_URL || '/api/authentication/logout'}`,

            // Listings & Products
            sections: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL || '/v1/api/home-page/home-page-section-ads'}`,
            latest: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_LATEST_LISTINGS_API_URL || '/v1/api/listings/new-arrivals'}`,
            trending: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_TRENDING_LISTINGS_URL || '/v1/api/listings/trending'}`,
            listingDetails: (id: string) => `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_LISTING_DETAILS_API_URL?.replace('{id}', id) || `/v1/api/listings/${id}`}`,
            listings: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_LISTINGS_API_URL || '/v1/api/listings'}`,
            listingsSearch: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_LISTINGS_SEARCH || '/v1/api/listings/search'}`,
            favoriteListings: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FAVORITE_LISTINGS_API_URL || '/v1/api/listings/favorites'}`,
            recentViews: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_RECENT_VIEWS_API_URL || '/v1/api/listings/recent-views'}`,
            profileListings: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_PROFILE_LISTINGS_API_URL || '/v1/api/profile/listings'}`,

            // Categories & Options
            categories: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_CATEGORIES_API_URL || '/v1/api/categories/all'}`,
            baseCategories: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_BASE_CATEGORIES || '/v1/api/categories/all'}`,
            categoryDropdownOptions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_CATEGORY_DROPDOWN_OPTIONS || '/v1/api/forms/category-attribute-dropdown-options'}`,
            serviceOptions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_SERVICE_OPTIONS || '/v1/api/services-options'}`,
            formOptions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FORM_OPTIONS || '/v1/api/forms/ad-request'}`,

            // Social & Reviews
            reviews: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_REVIEWS_API_URL || '/v1/api/profile/customer-reviews'}`,
            listingReviews: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_LISTINGS_CUSTOMER_REVIEWS || '/v1/api/customer-reviews'}`,
            replyReview: (id: string) => `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_REVIEWS_REPLY_API_URL?.replace('{id}', id) || `/v1/api/customer-reviews/${id}/reply`}`,
            following: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FOLLOWING_API_URL || '/v1/api/follows/following'}`,
            myFollowing: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_MY_FOLLOWING_API_URL || '/v1/api/follows/following'}`,
            myFollowers: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_MY_FOLLOWERS_API_URL || '/v1/api/follows/followers'}`,
            follow: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FOLLOW_API_URL || '/v1/api/follows/follow'}`,
            unfollow: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_UNFOLLOW_API_URL || '/v1/api/follows/unfollow'}`,
            followSummary: (userId: string) => `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FOLLOW_SUMMARY?.replace('{userId}', userId) || `/v1/api/follows/summary/user/${userId}`}`,

            // Favorites
            favorites: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_FAVORITE_API_URL || '/v1/api/favorites'}`,
            deleteSave: (listingId: string) => `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_DELETE_SAVE_API_URL?.replace('{listingId}', listingId) || `/v1/api/favorites/${listingId}`}`,

            // Others
            regions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_REGIONS_API_URL || '/v1/api/regions/listings-summary'}`,
            rankedRegions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_RANKED_REGIONS_API_URL || '/v1/api/regions/ranked'}`,
            popularSearch: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_POPULAR_SEARCH || '/v1/api/searches/popular'}`,
            complains: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_MAKE_COMPLAINS_API_URL || '/v1/api/complains'}`,
            promotionPlans: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_PROMOTION_PLANS || '/v1/api/promotions/plans'}`,
            promotionPurchase: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_PROMOTION_PURCHASE || '/v1/api/promotions/purchase'}`,
            dashboardStats: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_MAIN_DASHBOARD_API_URL || '/v1/api/profile/referral-stats'}`,
            imageUpload: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_IMAGE_UPLOAD || '/v1/api/files/upload'}`,
            chatContacts: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_CHAT_CONTACTS || '/v1/api/chat-contacts'}`,
            chatMessages: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_CHAT_MESSAGES || '/v1/api/chat-messages'}`,

            // Legacy / Misc (Fallback)
            localServices: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL || '/v1/api/home-page/home-page-section-ads'}?sectionTitle=Explore%20Local%20Services`,
            topMarketplaceDeals: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL || '/v1/api/home-page/home-page-section-ads'}?sectionTitle=Top%20Marketplace%20Deals`,
            featuredPosts: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL || '/v1/api/home-page/home-page-section-ads'}?sectionTitle=Featured%20Posts`,

            // New additions
            profilePromotions: `${LISTINGS_BASE_URL}${process.env.NEXT_PUBLIC_PROFILE_PROMOTION || '/v1/api/promotions/profile'}`,
            allFeatured: process.env.NEXT_PUBLIC_ALLFEATURED_API_URL || `${LISTINGS_BASE_URL}/v1/api/listings/featured`, // Fallback based on typical pattern, but env var is primary
            searchSuggestions: process.env.NEXT_PUBLIC_SEARCH_SUGGESTIONS_API_URL || `${LISTINGS_BASE_URL}/v1/api/searches/suggestions`,
        },
    };
};

export const getSectionApiUrl = (sectionTitle: string) => {
    const config = getApiConfig();
    return `${config.endpoints.sections}?sectionTitle=${encodeURIComponent(sectionTitle)}`;
};
