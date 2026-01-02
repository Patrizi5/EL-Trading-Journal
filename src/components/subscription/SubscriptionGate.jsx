import React, { useEffect, useState } from 'react';

function SubscriptionPrompt({ onSubscribe }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-shell-card p-8 rounded-lg shadow-xl border border-shell-accent text-center">
        <h2 className="text-2xl font-bold mb-4">Subscription required</h2>
        <p className="mb-4 text-shell-text/80">A subscription is required to use this app. Subscribe to continue.</p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2 rounded bg-gradient-to-r from-shell-green to-emerald-500 text-black font-semibold"
            onClick={onSubscribe}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionGate({ children }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('subscription_active');
      setActive(v === '1');
    } catch (e) {
      setActive(false);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const resp = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await resp.json();
      if (data && data.checkoutUrl) {
        // Open the checkout in a new tab for real flow (mock will just return a page)
        try {
          window.open(data.checkoutUrl, '_blank');
        } catch (e) {
          // ignore
        }
        // For developer convenience, mark subscription active locally (mock flow)
        localStorage.setItem('subscription_active', '1');
        setActive(true);
        return;
      }
    } catch (e) {
      // fallback to local flag if network or server not available
      console.warn('subscription server unavailable, enabling mock subscription');
      localStorage.setItem('subscription_active', '1');
      setActive(true);
    }
  };

  // If page was opened with a session_id (redirect from Stripe), confirm it with server
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') || params.get('sessionId');
    if (sessionId && !active) {
      (async () => {
        try {
          const r = await fetch(`/api/checkout-session?sessionId=${encodeURIComponent(sessionId)}`);
          const j = await r.json();
          if (j && j.active) {
            localStorage.setItem('subscription_active', '1');
            setActive(true);
            // remove session_id from URL to keep things tidy
            params.delete('session_id');
            params.delete('sessionId');
            const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            window.history.replaceState({}, document.title, newUrl);
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [active]);

  if (!active) return <SubscriptionPrompt onSubscribe={handleSubscribe} />;
  return <>{children}</>;
}
