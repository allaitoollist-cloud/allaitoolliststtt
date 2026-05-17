import { NextRequest, NextResponse } from 'next/server';

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_VARIANT_ID_FEATURED = process.env.LEMONSQUEEZY_VARIANT_ID_FEATURED;

export async function POST(req: NextRequest) {
    try {
        const { priceKey, metadata = {} } = await req.json();

        if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID) {
            return NextResponse.json({ error: 'Lemon Squeezy credentials not configured' }, { status: 500 });
        }

        let variantId = '';
        if (priceKey === 'featured_tool') {
            variantId = LEMONSQUEEZY_VARIANT_ID_FEATURED || '';
        }

        if (!variantId) {
            return NextResponse.json({ error: `Variant ID not configured for ${priceKey}` }, { status: 500 });
        }

        // Create checkout via Lemon Squeezy API
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            custom: {
                                priceKey,
                                ...metadata,
                            }
                        }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: LEMONSQUEEZY_STORE_ID
                            }
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId
                            }
                        }
                    }
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('LemonSqueezy Error:', JSON.stringify(data, null, 2));
            return NextResponse.json({ error: data.errors?.[0]?.detail || 'Failed to create checkout' }, { status: response.status });
        }

        const checkoutUrl = data.data.attributes.url;
        return NextResponse.json({ url: checkoutUrl });

    } catch (err: any) {
        console.error('Checkout error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
