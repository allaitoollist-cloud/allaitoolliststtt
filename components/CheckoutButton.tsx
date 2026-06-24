'use client';

import { useState } from 'react';

interface CheckoutButtonProps {
    priceKey: string;
    metadata?: Record<string, string>;
    className?: string;
    children: React.ReactNode;
}

type Step = 'idle' | 'loading' | 'pay' | 'done';

export function CheckoutButton({ priceKey, metadata, className, children }: CheckoutButtonProps) {
    const [step, setStep] = useState<Step>('idle');
    const [paypalUrl, setPaypalUrl] = useState('');
    const [amount, setAmount] = useState(0);
    const [successUrl, setSuccessUrl] = useState('');

    const handleCheckout = async () => {
        setStep('loading');
        try {
            const res = await fetch('/api/paypal/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceKey, metadata }),
            });
            const data = await res.json();
            if (!res.ok || !data.paypalUrl) {
                alert(data.error || 'Checkout failed. Please try again.');
                setStep('idle');
                return;
            }
            setPaypalUrl(data.paypalUrl);
            setAmount(data.amount);
            setSuccessUrl(data.successUrl);
            window.open(data.paypalUrl, '_blank', 'noopener,noreferrer');
            setStep('pay');
        } catch {
            alert('Something went wrong. Please try again.');
            setStep('idle');
        }
    };

    const handleConfirm = () => {
        setStep('done');
        if (successUrl) window.location.href = successUrl;
    };

    if (step === 'pay') {
        return (
            <div className="space-y-2 text-center">
                <p className="text-sm text-gray-600">
                    PayPal opened in a new tab. Pay <strong>${amount}</strong> then click below.
                </p>
                <div className="flex gap-2 justify-center">
                    <a
                        href={paypalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                    >
                        Reopen PayPal
                    </a>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={handleConfirm}
                        className="text-xs text-green-600 underline font-semibold"
                    >
                        I have paid →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={step === 'loading' || step === 'done'}
            className={className}
        >
            {step === 'loading' ? 'Opening PayPal...' : children}
        </button>
    );
}
