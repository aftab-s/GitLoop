import { NextResponse } from 'next/server';
import type {
  DeveloperStats,
  ContributionDay,
  GitHubRepo,
  GitHubEvent,
} from '@/types/github';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const GITHUB_REST = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN;

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function graphqlFetch(query: string, variables: Record<string, unknown>) {
  if (!token) throw new Error('No GitHub token configured');

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? 'GraphQL error');
  return json.data;
}

async function restFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_REST}${path}`, {
    headers,
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) throw new Error('Rate limited');
    throw new Error(`GitHub REST ${res.status}`);
  }
  return res.json();
}

// ─── GraphQL Query ─────────────────────────────────────────────────────────────

const PROFILE_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      name
      bio
      avatarUrl
      createdAt
      location
      company
      websiteUrl
      twitterUsername
      followers { totalCount }
      following  { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
        isFork: false
      ) {
        nodes {
          name
          description
          url
          createdAt
          updatedAt
          pushedAt
          stargazerCount
          forkCount
          openIssues: issues(states: OPEN) { totalCount }
          primaryLanguage { name }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name } }
          }
          repositoryTopics(first: 10) {
            nodes { topic { name } }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function levelFromGQL(level: string): 0 | 1 | 2 | 3 | 4 {
  const map: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return map[level] ?? 0;
}

function deriveActiveHours(events: GitHubEvent[]): number[] {
  const hours = new Array(24).fill(0);
  for (const e of events) {
    hours[new Date(e.created_at).getHours()]++;
  }
  return hours;
}

function calculateStreaks(days: ContributionDay[]): { longest: number; current: number } {
  let longest = 0;
  let temp = 0;
  let current = 0;

  for (const d of days) {
    if (d.count > 0) {
      temp++;
      if (temp > longest) longest = temp;
    } else {
      temp = 0;
    }
  }

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else break;
  }

  return { longest, current };
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username')?.trim();

  if (!username) {
    return NextResponse.json({ error: 'username required' }, { status: 400 });
  }

  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // ── Try GraphQL path (requires token) ─────────────────────────────────────
    if (token) {
      const data = await graphqlFetch(PROFILE_QUERY, {
        username,
        from: ninetyDaysAgo.toISOString(),
        to: now.toISOString(),
      });

      const u = data.user;
      if (!u) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Repos
      const repos: GitHubRepo[] = u.repositories.nodes.map((r: any) => ({
        id: r.url,
        name: r.name,
        full_name: `${username}/${r.name}`,
        description: r.description,
        language: r.primaryLanguage?.name ?? null,
        stargazers_count: r.stargazerCount,
        forks_count: r.forkCount,
        open_issues_count: r.openIssues.totalCount,
        html_url: r.url,
        created_at: r.createdAt,
        updated_at: r.updatedAt,
        pushed_at: r.pushedAt,
        size: 0,
        topics: r.repositoryTopics.nodes.map((t: any) => t.topic.name),
        fork: false,
      }));

      // Language aggregation from GraphQL (no extra per-repo calls!)
      const languageBytes: Record<string, number> = {};
      for (const repo of u.repositories.nodes) {
        for (const edge of repo.languages.edges) {
          const lang: string = edge.node.name;
          languageBytes[lang] = (languageBytes[lang] ?? 0) + edge.size;
        }
      }
      const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
      const topLanguages = Object.entries(languageBytes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, bytes]) => ({
          name,
          bytes,
          percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
        }));

      // Contribution calendar from GraphQL
      const contributionData: ContributionDay[] = [];
      for (const week of u.contributionsCollection.contributionCalendar.weeks) {
        for (const day of week.contributionDays) {
          contributionData.push({
            date: day.date,
            count: day.contributionCount,
            level: levelFromGQL(day.contributionLevel),
          });
        }
      }

      const streaks = calculateStreaks(contributionData);
      const cc = u.contributionsCollection;
      const totalCommits = cc.totalCommitContributions;

      // Active hours from events (REST — best available source)
      let activeHours = new Array(24).fill(0);
      try {
        const events = await restFetch<GitHubEvent[]>(
          `/users/${username}/events/public?per_page=100`
        );
        activeHours = deriveActiveHours(events);
      } catch {
        // Non-fatal — leave hours zeroed
      }

      const activeDays = contributionData.filter((d) => d.count > 0).length;
      const averageCommitsPerDay = activeDays > 0 ? totalCommits / activeDays : 0;
      const accountAgeDays = Math.floor(
        (Date.now() - new Date(u.createdAt).getTime()) / 86_400_000
      );

      const stats: DeveloperStats = {
        user: {
          login: u.login,
          id: 0,
          avatar_url: u.avatarUrl,
          name: u.name,
          bio: u.bio,
          public_repos: repos.length,
          followers: u.followers.totalCount,
          following: u.following.totalCount,
          created_at: u.createdAt,
          html_url: `https://github.com/${u.login}`,
          location: u.location,
          company: u.company,
          blog: u.websiteUrl,
          twitter_username: u.twitterUsername,
        },
        repos,
        languages: languageBytes,
        totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
        totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
        totalCommits,
        topLanguages,
        contributionData,
        longestStreak: streaks.longest,
        currentStreak: streaks.current,
        activeHours,
        recentEvents: [],
        averageCommitsPerDay,
        totalRepos: repos.length,
        accountAgeDays,
      };

      return NextResponse.json(stats);
    }

    // ── Fallback: unauthenticated REST ────────────────────────────────────────
    return NextResponse.json(
      { error: 'No GITHUB_TOKEN configured — add it to .env.local for real data.' },
      { status: 503 }
    );

  } catch (err: any) {
    console.error('[/api/github/stats]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
