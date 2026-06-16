const supabase = require('../config/supabase');

// Called by the mobile app on every login/register to ensure
// a profile row exists in Supabase before any logs are written.
async function registerUser(req, res) {
  const { uid, email } = req.user;
  const { name } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: uid,
        email,
        name: name || email?.split('@')[0] || 'User',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ user: data });
}

module.exports = { registerUser };
