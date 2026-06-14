const supabase = require('../config/supabase');

async function upsertProfile(req, res) {
  const { uid, email } = req.user;
  const { name, age, gender, height, weight, goal, activityLevel, dietaryPreference, injuries } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: uid,
      email,
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activity_level: activityLevel,
      dietary_preference: dietaryPreference,
      injuries,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ profile: data });
}

async function getProfile(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Profile not found' });
  res.json({ profile: data });
}

module.exports = { upsertProfile, getProfile };
