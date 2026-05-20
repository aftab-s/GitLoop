import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { stats, archetype, identity } = await req.json();

    if (!stats) {
      return NextResponse.json({ error: 'Stats required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ aiDirected: false });
    }

    const groq = new Groq({ apiKey });

    const topLangs = (stats.topLanguages ?? [])
      .slice(0, 5)
      .map((l: { name: string; percentage: number }) => `${l.name} (${l.percentage.toFixed(0)}%)`)
      .join(', ');

    const nightScore = (stats.activeHours ?? [])
      .slice(20, 24)
      .concat((stats.activeHours ?? []).slice(0, 6))
      .reduce((a: number, b: number) => a + b, 0);

    const prompt = `You are a professional music composer and sound designer AI. Based on a software developer's GitHub activity profile, you must choose precise music synthesis parameters that will make their procedurally-generated coding soundtrack feel genuinely unique and emotionally resonant.

DEVELOPER PROFILE:
- Archetype: ${archetype}
- Aura: ${identity?.aura ?? 'Unknown'}
- Coding Mood: ${identity?.mood ?? 'Unknown'}
- Lore: ${identity?.lore ?? 'Unknown'}
- Dominant Languages: ${topLangs || 'Unknown'}
- Total Commits: ${stats.totalCommits}
- Total Stars: ${stats.totalStars}
- Longest Streak: ${stats.longestStreak} days
- Account Age: ${stats.accountAgeDays} days
- Night Coder Index: ${nightScore} (sum of late-night/early-morning activity hours)
- Language Count: ${stats.topLanguages?.length ?? 0}

AVAILABLE GENRES: synthwave, ambient, cyberpunk, lofi, orchestral

TASK: Choose music parameters that reflect this developer's personality, activity style, and coding rhythm. A night coder with Rust/C++ should feel industrial and intense. A Python/data scientist should feel atmospheric. A TypeScript developer with high stars should feel polished and complex.

Respond ONLY with a valid JSON object — no markdown, no explanation:
{
  "genre": "<one of: synthwave | ambient | cyberpunk | lofi | orchestral>",
  "bpm": <integer 60-160, reflects commit frequency and energy>,
  "energy": <integer 0-100, overall intensity>,
  "ambience": <integer 0-100, reverb/space depth>,
  "glitch": <integer 0-80, randomness/noise bursts>,
  "complexity": <integer 20-100, harmonic and rhythmic layers>,
  "bass": <integer 20-100, low-end presence>,
  "tempo": <integer 20-100, perceived speed>,
  "reasoning": "<one sentence explaining your musical choices>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.65,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content ?? '{}';
    const data = JSON.parse(text);

    // Validate and clamp all values
    const clamped = {
      genre: ['synthwave', 'ambient', 'cyberpunk', 'lofi', 'orchestral'].includes(data.genre)
        ? data.genre
        : 'synthwave',
      bpm: Math.min(160, Math.max(60, Math.round(Number(data.bpm) || 100))),
      energy: Math.min(100, Math.max(0, Math.round(Number(data.energy) || 50))),
      ambience: Math.min(100, Math.max(0, Math.round(Number(data.ambience) || 50))),
      glitch: Math.min(80, Math.max(0, Math.round(Number(data.glitch) || 20))),
      complexity: Math.min(100, Math.max(20, Math.round(Number(data.complexity) || 50))),
      bass: Math.min(100, Math.max(20, Math.round(Number(data.bass) || 50))),
      tempo: Math.min(100, Math.max(20, Math.round(Number(data.tempo) || 50))),
      reasoning: typeof data.reasoning === 'string' ? data.reasoning : null,
      aiDirected: true,
    };

    return NextResponse.json(clamped);
  } catch (err: any) {
    console.error('Groq music-params error:', err);
    return NextResponse.json({ aiDirected: false, error: err.message });
  }
}
