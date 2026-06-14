const supabase = require('../config/supabase');

async function logWater(req, res) {
  const { uid } = req.user;
  const { amountMl } = req.body;
  if (!amountMl) return res.status(400).json({ error: 'amountMl is required' });

  const { data, error } = await supabase
    .from('water_logs')
    .insert({ user_id: uid, amount_ml: amountMl })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ log: data });
}

async function getWaterLogs(req, res) {
  const { uid } = req.user;
  const { date } = req.query;

  let query = supabase.from('water_logs').select('*').eq('user_id', uid);
  if (date) {
    query = query.gte('logged_at', `${date}T00:00:00`).lte('logged_at', `${date}T23:59:59`);
  }

  const { data, error } = await query.order('logged_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const total = data.reduce((sum, l) => sum + l.amount_ml, 0);
  res.json({ logs: data, totalMl: total });
}

module.exports = { logWater, getWaterLogs };
