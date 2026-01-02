const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4242;

const LICENSES_FILE = path.resolve(__dirname, 'licenses.json');
function readLicenses() {
  try {
    const raw = fs.readFileSync(LICENSES_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}
function writeLicenses(obj) {
  fs.writeFileSync(LICENSES_FILE, JSON.stringify(obj, null, 2));
}

let stripe = null;
if (process.env.STRIPE_SECRET) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
  } catch (e) {
    console.warn('Stripe SDK not available; running in mock mode');
    stripe = null;
  }
}

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const origin = req.headers.origin || `http://localhost:${PORT}`;
    if (stripe && process.env.STRIPE_PRICE_ID) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        // include session id in success_url so client can confirm
        success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?session_cancel=1`,
      });
      return res.json({ checkoutUrl: session.url, sessionId: session.id });
    }

    // Mock fallback for local dev: return a url that contains a mock session id
    const mockId = `MOCK_${Date.now()}`;
    const mockUrl = `${origin}/?session_id=${mockId}`;
    // mark mock session active in licenses store for convenience
    const licenses = readLicenses();
    licenses[mockId] = { active: true, mock: true, created: new Date().toISOString() };
    writeLicenses(licenses);
    return res.json({ checkoutUrl: mockUrl, sessionId: mockId, mock: true });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ error: 'failed to create session' });
  }
});

// Live symbols lookup endpoint (reads data/symbols.json)
app.get('/api/symbols', (req, res) => {
  try {
    const q = (req.query.q || '').toString().toLowerCase();
    const asset = (req.query.asset || '').toString();
    const file = path.resolve(__dirname, '..', 'data', 'symbols.json');
    const raw = fs.readFileSync(file, 'utf-8');
    const list = JSON.parse(raw || '[]');
    let out = list;
    if (asset) out = out.filter((s) => (s.assetClass || '').toLowerCase().includes(asset.toLowerCase()));
    if (q) {
      out = out.filter((s) => (s.symbol + ' ' + (s.market || '') + ' ' + (s.assetClass || '')).toLowerCase().includes(q));
    }
    res.json(out.slice(0, 500));
  } catch (e) {
    console.error('symbols endpoint error', e);
    res.status(500).json({ error: 'failed to load symbols' });
  }
});

app.get('/api/checkout-session', async (req, res) => {
  const sessionId = req.query.sessionId || req.query.session_id;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  try {
    // If stripe is configured, retrieve session and inspect subscription/payment status
    if (stripe) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // depending on your stripe settings, check session.payment_status or subscription status
      const active = session.payment_status === 'paid' || !!session.subscription;
      if (active) {
        const licenses = readLicenses();
        licenses[sessionId] = { active: true, created: new Date().toISOString(), stripe: true };
        writeLicenses(licenses);
      }
      return res.json({ active, session });
    }

    // Mock mode: look up licenses.json
    const licenses = readLicenses();
    const rec = licenses[sessionId];
    const active = !!(rec && rec.active);
    return res.json({ active, mock: true, record: rec || null });
  } catch (err) {
    console.error('checkout-session error', err);
    return res.status(500).json({ error: 'failed to retrieve session' });
  }
});

// Simple webhook handler — in production verify signature using STRIPE_WEBHOOK_SECRET
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  try {
    if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers['stripe-signature'];
      let event = null;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      // handle relevant events
      if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
        const session = event.data.object;
        const sessionId = session.id || session.subscription || session.checkout_session;
        const licenses = readLicenses();
        licenses[sessionId] = { active: true, stripeEvent: event.type, ts: new Date().toISOString() };
        writeLicenses(licenses);
      }
      return res.status(200).send('ok');
    }

    // If no stripe configured, accept webhook and mark provided session id active
    try {
      const payload = JSON.parse(req.body.toString());
      const maybeId = payload.sessionId || payload.id || (payload.data && payload.data.object && payload.data.object.id);
      if (maybeId) {
        const licenses = readLicenses();
        licenses[maybeId] = { active: true, ts: new Date().toISOString(), raw: payload };
        writeLicenses(licenses);
      }
    } catch (e) {
      // ignore
    }
    return res.status(200).send('ok');
  } catch (e) {
    console.error('webhook handler error', e);
    return res.status(500).send('err');
  }
});

app.listen(PORT, () => {
  console.log(`Subscription scaffold server listening on http://localhost:${PORT}`);
});
