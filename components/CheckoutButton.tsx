'use client';

import { useState } from 'react';

interface CheckoutButtonProps {
    priceKey: string;
    metadata?: Record<string, string>;
    className?: string;
    children: React.ReactNode;
}

export function CheckoutButton({ priceKey, metadata, className, children }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceKey, metadata }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Checkout failed. Please try again.');
            }
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleCheckout} disabled={loading} className={className}>
            {loading ? 'Redirecting...' : children}
        </button>
    );
}
