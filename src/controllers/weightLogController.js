const supabase = require('../config/supabase');

async function logWeight(req, res) {
  const { uid } = req.user;
  const { weight } = req.body;
  if (!weight) return res.status(400).json({ error: 'weight is required' });

  const { data, error } = await supabase
    .from('weight_logs')
    .insert({ user_id: uid, weight })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ log: data });
}

async function getWeightLogs(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', uid)
    .order('logged_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ logs: data });
}

module.exports = { logWeight, getWeightLogs };
