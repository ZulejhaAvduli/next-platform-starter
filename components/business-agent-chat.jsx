'use client';

import { useState } from 'react';
import { Alert } from './alert';
import { Card } from './card';

const MESSAGE_TYPES = [
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'twitter', label: 'Twitter', icon: '🐦' },
    { id: 'website', label: 'Website', icon: '💬' }
];

export function BusinessAgentChat() {
    const [messageType, setMessageType] = useState('email');
    const [customerMessage, setCustomerMessage] = useState('');
    const [agentResponse, setAgentResponse] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            setAgentResponse('');

            const res = await fetch('/api/business-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: messageType,
                    message: customerMessage
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAgentResponse(data.response);
                setStatus('ok');
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card title="Compose Message">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-700">Message Channel</label>
                        <div className="flex gap-2 flex-wrap">
                            {MESSAGE_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setMessageType(type.id)}
                                    className={`px-4 py-2 rounded-sm transition-colors ${
                                        messageType === type.id
                                            ? 'bg-primary text-primary-content'
                                            : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                                    }`}
                                >
                                    {type.icon} {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="customerMessage" className="text-sm font-medium text-neutral-700">
                            Customer Message
                        </label>
                        <textarea
                            id="customerMessage"
                            value={customerMessage}
                            onChange={(e) => setCustomerMessage(e.target.value)}
                            placeholder={getPlaceholder(messageType)}
                            required
                            rows={4}
                            className="input resize-none"
                        />
                    </div>

                    <button className="btn" type="submit" disabled={status === 'pending'}>
                        {status === 'pending' ? 'Generating Response...' : 'Generate Agent Response'}
                    </button>

                    {status === 'error' && <Alert type="error">{error}</Alert>}
                </form>
            </Card>

            {agentResponse && (
                <Card title={`Agent Response (${MESSAGE_TYPES.find((t) => t.id === messageType)?.label})`}>
                    <div className="p-4 bg-neutral-100 rounded-sm whitespace-pre-wrap">{agentResponse}</div>
                    <button
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(agentResponse);
                        }}
                        className="btn mt-4"
                    >
                        📋 Copy Response
                    </button>
                </Card>
            )}
        </div>
    );
}

function getPlaceholder(type) {
    switch (type) {
        case 'email':
            return 'Paste the customer email here...';
        case 'twitter':
            return 'Paste the Twitter/X message here...';
        case 'website':
            return 'Paste the website contact form message here...';
        default:
            return 'Enter the customer message...';
    }
}
