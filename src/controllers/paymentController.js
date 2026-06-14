const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const supabase = require('../config/supabase');

const PLAN_DURATIONS_DAYS = { monthly: 30, yearly: 365 };

async function createOrder(req, res) {
  const { amount, currency = 'INR' } = req.body;
  if (!amount) return res.status(400).json({ error: 'amount is required' });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `fitfuel_${req.user.uid}_${Date.now()}`,
    });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function verifyPayment(req, res) {
  const { order_id, payment_id, signature, planType } = req.body;
  if (!order_id || !payment_id || !signature || !planType) {
    return res.status(400).json({ error: 'order_id, payment_id, signature and planType are required' });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  const durationDays = PLAN_DURATIONS_DAYS[planType];
  if (!durationDays) return res.status(400).json({ error: 'Invalid planType' });

  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: req.user.uid,
      plan_type: planType,
      status: 'active',
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ verified: true, subscription: data });
}

async function getSubscriptionStatus(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.json({ subscription: null, active: false });

  const active = data.status === 'active' && new Date(data.expires_at) > new Date();
  res.json({ subscription: data, active });
}

module.exports = { createOrder, verifyPayment, getSubscriptionStatus };
