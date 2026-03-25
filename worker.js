export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    const { message, history } = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are a warm, practical wellness companion inside Seed2Sunlight — an app for people building income and mental resilience from scratch. Be honest, specific, and warm. No generic advice. 3–5 sentences max. Give one concrete next action when someone is stuck.`,
        messages: history || [{ role: 'user', content: message }]
      })
    });
    const data = await response.json();
    const reply = data.content?.[0]?.text || "I'm still here — try again in a moment.";
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
