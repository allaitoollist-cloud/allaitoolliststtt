/**
 * Bing Webmaster API Client
 * 
 * This module provides functions to interact with the Bing Webmaster API
 * Documentation: https://docs.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi
 */

const WEBMASTER_API_BASE = 'https://ssl.bing.com/webmaster/api.svc';

export interface WebmasterApiConfig {
    apiKey: string;
    format?: 'json' | 'xml' | 'soap';
}

export interface TrafficStats {
    date: Date;
    impressions: number;
    clicks: number;
    ctr: number;
}

export interface Site {
    url: string;
    verified: boolean;
    addedDate: string;
}

export interface SubmitUrlResponse {
    success: boolean;
    message: string;
    url: string;
}

/**
 * Submit a single URL for indexing
 */
export async function submitUrl(
    config: WebmasterApiConfig,
    siteUrl: string,
    url: string
): Promise<SubmitUrlResponse> {
    try {
        const endpoint = `${WEBMASTER_API_BASE}/SubmitUrl?apikey=${config.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                siteUrl,
                url,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return {
            success: true,
            message: 'URL submitted successfully',
            url,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            url,
        };
    }
}

/**
 * Submit multiple URLs for indexing
 */
export async function submitUrls(
    config: WebmasterApiConfig,
    siteUrl: string,
    urls: string[]
): Promise<SubmitUrlResponse[]> {
    const results: SubmitUrlResponse[] = [];

    for (const url of urls) {
        const result = await submitUrl(config, siteUrl, url);
        results.push(result);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
}

/**
 * Get traffic and ranking statistics
 */
export async function getRankAndTrafficStats(
    config: WebmasterApiConfig,
    siteUrl: string,
    startDate?: Date,
    endDate?: Date
): Promise<TrafficStats[]> {
    try {
        const endpoint = `${WEBMASTER_API_BASE}/GetRankAndTrafficStats?apikey=${config.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                siteUrl,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        return data.map((stat: any) => ({
            date: new Date(stat.Date),
            impressions: stat.Impressions,
            clicks: stat.Clicks,
            ctr: (stat.Clicks / stat.Impressions) * 100,
        }));
    } catch (error) {
        console.error('Error fetching traffic stats:', error);
        return [];
    }
}

/**
 * Add a new site to Webmaster Tools
 */
export async function addSite(
    config: WebmasterApiConfig,
    siteUrl: string
): Promise<{ success: boolean; message: string }> {
    try {
        const endpoint = `${WEBMASTER_API_BASE}/AddSite?apikey=${config.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ siteUrl }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return {
            success: true,
            message: 'Site added successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Remove a site from Webmaster Tools
 */
export async function removeSite(
    config: WebmasterApiConfig,
    siteUrl: string
): Promise<{ success: boolean; message: string }> {
    try {
        const endpoint = `${WEBMASTER_API_BASE}/RemoveSite?apikey=${config.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ siteUrl }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return {
            success: true,
            message: 'Site removed successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get list of all sites
 */
export async function getSites(
    config: WebmasterApiConfig
): Promise<Site[]> {
    try {
        const endpoint = `${WEBMASTER_API_BASE}/GetSites?apikey=${config.apiKey}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        return data.map((site: any) => ({
            url: site.Url,
            verified: site.IsVerified,
            addedDate: site.AddedDate,
        }));
    } catch (error) {
        console.error('Error fetching sites:', error);
        return [];
    }
}
