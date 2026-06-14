const supabase = require('../config/supabase');

async function logMeal(req, res) {
  const { uid } = req.user;
  const { mealName, items, calories } = req.body;

  const { data, error } = await supabase
    .from('meal_logs')
    .insert({ user_id: uid, meal_name: mealName, items, calories })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ log: data });
}

async function getMealLogs(req, res) {
  const { uid } = req.user;
  const { date } = req.query;

  let query = supabase.from('meal_logs').select('*').eq('user_id', uid);
  if (date) {
    query = query.gte('logged_at', `${date}T00:00:00`).lte('logged_at', `${date}T23:59:59`);
  }

  const { data, error } = await query.order('logged_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ logs: data });
}

module.exports = { logMeal, getMealLogs };
