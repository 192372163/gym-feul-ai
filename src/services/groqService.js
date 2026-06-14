const axios = require('axios');

async function generatePlan({ age, gender, height, weight, goal, activityLevel, dietaryPreference, injuries }) {
  const prompt = `You are a certified fitness and nutrition coach. Create a personalized weekly workout plan and a daily diet plan for this user:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal}
- Activity level: ${activityLevel}
- Dietary preference: ${dietaryPreference || 'none'}
- Injuries/limitations: ${injuries || 'none'}

Respond ONLY with valid JSON in this exact shape:
{
  "workoutPlan": {
    "Monday": { "focus": "string", "exercises": [{ "name": "string", "sets": 3, "reps": "8-12", "notes": "string" }] },
    "Tuesday": { ... },
    "Wednesday": { ... },
    "Thursday": { ... },
    "Friday": { ... },
    "Saturday": { ... },
    "Sunday": { ... }
  },
  "dietPlan": {
    "calorieTarget": 0,
    "macros": { "proteinG": 0, "carbsG": 0, "fatG": 0 },
    "meals": [{ "name": "string", "items": ["string"], "calories": 0 }]
  },
  "notes": "string"
}`;

  const response = await axios.post(
    process.env.GROQ_API_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a fitness and nutrition AI that responds only with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { generatePlan };
