import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { stats, archetype } = await req.json();

    if (!stats) {
      return NextResponse.json({ error: 'Stats are required' }, { status: 400 });
    }

    if (!apiKey) {
      // Fallback if GROQ_API_KEY is not defined in environment
      return NextResponse.json({
        lore: `Synthesizing ${stats.topLanguages[0]?.name || 'code'} patterns into a digital symphony.`,
        aura: 'Cosmic Violet',
        mood: 'Creative & Focused',
      });
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an AI music producer and creative coding oracle. Analyze the following GitHub developer statistics and generate their music lore, a unique color aura name, and coding mood.
    
    Developer Archetype: ${archetype}
    Dominant Languages: ${JSON.stringify(stats.topLanguages)}
    Total Commits: ${stats.totalCommits}
    Total Stars: ${stats.totalStars}
    Forks: ${stats.totalForks}
    Active Coding Hours (24h array starting at hour 0): ${JSON.stringify(stats.activeHours)}
    Longest Streak: ${stats.longestStreak}
    
    Respond STRICTLY with a JSON object in this format (do not wrap in markdown blocks, do not include extra text):
    {
      "lore": "A highly creative, slightly dramatic one-sentence story of their coding style, blending programming and musical themes (e.g., 'Writing asynchronous sonatas under the indigo glow of three monitors.')",
      "aura": "A poetic, neon-inspired color aura name (e.g., 'Nocturnal Indigo Pulse' or 'Solar Cyber-glow')",
      "mood": "2-3 words describing their coding mood (e.g., 'Hypnotic & Rhythmic' or 'Frenetic Cyberpunk')"
    }`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.75,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Groq AI API error:', err);
    return NextResponse.json({
      lore: 'Your coding rhythm creates an atmospheric, ambient digital signal.',
      aura: 'Electric Blue',
      mood: 'Focused & Meditative',
      error: err.message,
    });
  }
}
