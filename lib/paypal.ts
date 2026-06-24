const PAYPAL_ME = 'https://paypal.me/malikmazhar';

export type PriceKey =
    | 'verified_basic'
    | 'verified_pro'
    | 'verified_enterprise'
    | 'api_pro'
    | 'api_enterprise'
    | 'job_basic'
    | 'job_featured'
    | 'featured_tool';

interface PlanConfig {
    amount: number;
    label: string;
    successPath: string;
}

export const PAYPAL_PRICES: Record<PriceKey, PlanConfig> = {
    verified_basic:      { amount: 99,  label: 'Verified Badge — Basic',      successPath: '/verified/success' },
    verified_pro:        { amount: 199, label: 'Verified Badge — Pro',         successPath: '/verified/success' },
    verified_enterprise: { amount: 499, label: 'Verified Badge — Enterprise',  successPath: '/verified/success' },
    api_pro:             { amount: 29,  label: 'API Access — Pro',             successPath: '/api-access/success' },
    api_enterprise:      { amount: 199, label: 'API Access — Enterprise',      successPath: '/api-access/success' },
    job_basic:           { amount: 99,  label: 'Job Posting — Standard',       successPath: '/jobs/success' },
    job_featured:        { amount: 199, label: 'Job Posting — Featured',       successPath: '/jobs/success' },
    featured_tool:       { amount: 49,  label: 'Featured Tool Sponsorship',    successPath: '/dashboard?boost=pending' },
};

export function buildPaypalUrl(amount: number): string {
    return `${PAYPAL_ME}/${amount}USD`;
}

export function isPriceKey(key: string): key is PriceKey {
    return key in PAYPAL_PRICES;
}
