'use client';

import { useEffect } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        fetch('/api/tools/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
        }).catch(() => {});
    }, [slug]);

    return null;
}
