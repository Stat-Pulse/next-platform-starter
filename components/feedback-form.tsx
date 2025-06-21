'use client';

import React from 'react';
import { useState } from 'react';
import { Alert } from './alert';
import Card from './Card';

export function FeedbackForm(): JSX.Element {
    const [status, setStatus] = useState<'pending' | 'ok' | 'error' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.currentTarget;
            const formData = new FormData(myForm);
            const res = await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as any).toString(),
            });
            if (res.status === 200) {
                setStatus('ok');
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(e instanceof Error ? e.message : String(e));
        }
    }

    return (
        <Card title="Feedback" value="">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {status === 'error' && error && (
                    <Alert className="" type="error">
                        {error}
                    </Alert>
                )}
                {status === 'ok' && (
                    <Alert className="" type="success">
                        Thanks for your feedback!
                    </Alert>
                )}
                <input type="text" name="message" placeholder="Your feedback..." required className="w-full border px-4 py-2" />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={status === 'pending'}
                >
                    {status === 'pending' ? 'Submitting…' : 'Submit'}
                </button>
            </form>
        </Card>
    );
}