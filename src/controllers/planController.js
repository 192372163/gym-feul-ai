const supabase = require('../config/supabase');
const groqService = require('../services/groqService');

async function generatePlan(req, res) {
  const { uid } = req.user;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(400).json({ error: 'Complete your profile before generating a plan' });

  let plan;
  try {
    plan = await groqService.generatePlan({
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      goal: profile.goal,
      activityLevel: profile.activity_level,
      dietaryPreference: profile.dietary_preference,
      injuries: profile.injuries,
    });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to generate plan from AI service' });
  }

  const { data, error } = await supabase
    .from('plans')
    .insert({
      user_id: uid,
      workout_plan: plan.workoutPlan,
      diet_plan: plan.dietPlan,
      notes: plan.notes,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ plan: data });
}

async function getLatestPlan(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'No plan found' });
  res.json({ plan: data });
}

async function getPlanHistory(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ plans: data });
}

module.exports = { generatePlan, getLatestPlan, getPlanHistory };
