const supabase = require('../config/supabase');

async function logWorkout(req, res) {
  const { uid } = req.user;
  const { day, exerciseName, sets, reps, weight, completed } = req.body;

  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: uid,
      day,
      exercise_name: exerciseName,
      sets,
      reps,
      weight,
      completed: completed ?? true,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ log: data });
}

async function getWorkoutLogs(req, res) {
  const { uid } = req.user;

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', uid)
    .order('logged_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ logs: data });
}

module.exports = { logWorkout, getWorkoutLogs };
