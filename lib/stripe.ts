import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
        stripeInstance = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
    }
    return stripeInstance;
}

export const STRIPE_PRICES = {
    verified_basic: process.env.STRIPE_PRICE_VERIFIED_BASIC || '',
    verified_pro: process.env.STRIPE_PRICE_VERIFIED_PRO || '',
    verified_enterprise: process.env.STRIPE_PRICE_VERIFIED_ENTERPRISE || '',
    api_pro: process.env.STRIPE_PRICE_API_PRO || '',
    api_enterprise: process.env.STRIPE_PRICE_API_ENTERPRISE || '',
    job_basic: process.env.STRIPE_PRICE_JOB_BASIC || '',
    job_featured: process.env.STRIPE_PRICE_JOB_FEATURED || '',
    featured_tool: process.env.STRIPE_PRICE_FEATURED_TOOL || '',
} as const;
