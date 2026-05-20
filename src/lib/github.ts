import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  DeveloperStats,
  LanguageStats,
  ContributionDay,
} from '@/types/github';

// ═══════════════════════════════════════════════════════════
// GitHub API Client (Public Data — no auth needed)
// ═══════════════════════════════════════════════════════════

const GITHUB_API = 'https://api.github.com';

async function githubFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  // Use token if available — raises rate limit from 60 → 5000 req/hr
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) throw new Error('Rate limited. Try again shortly or add a GitHub token.');
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

// ═══════════════════════════════════════════════════════════
// Fetch Functions
// ═══════════════════════════════════════════════════════════

export async function fetchUser(username: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>(`/users/${username}`);
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  // Fetch up to 100 repos, sorted by most recently pushed
  const repos = await githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&sort=pushed&direction=desc`
  );
  return repos.filter((r) => !r.fork); // Exclude forks
}

export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  return githubFetch<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`);
}

export async function fetchRepoLanguages(
  username: string,
  repoName: string
): Promise<LanguageStats> {
  return githubFetch<LanguageStats>(`/repos/${username}/${repoName}/languages`);
}

// ═══════════════════════════════════════════════════════════
// Aggregate Language Stats
// ═══════════════════════════════════════════════════════════

async function aggregateLanguages(
  username: string,
  repos: GitHubRepo[]
): Promise<LanguageStats> {
  const topRepos = repos.slice(0, 15); // Limit to top 15 to avoid rate limiting
  const languagePromises = topRepos.map((repo) =>
    fetchRepoLanguages(username, repo.name).catch(() => ({} as LanguageStats))
  );

  const allLanguages = await Promise.all(languagePromises);
  const combined: LanguageStats = {};

  for (const repoLangs of allLanguages) {
    for (const [lang, bytes] of Object.entries(repoLangs)) {
      combined[lang] = (combined[lang] || 0) + bytes;
    }
  }

  return combined;
}

// ═══════════════════════════════════════════════════════════
// Contribution Data (from events since we can't use GraphQL without auth)
// ═══════════════════════════════════════════════════════════

function deriveContributionData(events: GitHubEvent[]): ContributionDay[] {
  const dayMap: Record<string, number> = {};

  // Count events per day
  for (const event of events) {
    const date = event.created_at.split('T')[0];
    dayMap[date] = (dayMap[date] || 0) + 1;
  }

  // Generate last 90 days
  const days: ContributionDay[] = [];
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = dayMap[dateStr] || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 10) level = 4;
    else if (count >= 6) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    days.push({ date: dateStr, count, level });
  }

  return days;
}

// ═══════════════════════════════════════════════════════════
// Active Hours
// ═══════════════════════════════════════════════════════════

function deriveActiveHours(events: GitHubEvent[]): number[] {
  const hours = new Array(24).fill(0);
  for (const event of events) {
    const hour = new Date(event.created_at).getHours();
    hours[hour]++;
  }
  return hours;
}

// ═══════════════════════════════════════════════════════════
// Streaks
// ═══════════════════════════════════════════════════════════

function calculateStreaks(contributions: ContributionDay[]): {
  longest: number;
  current: number;
} {
  let longest = 0;
  let current = 0;
  let tempStreak = 0;

  for (const day of contributions) {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longest) longest = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Current streak (from the end)
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      current++;
    } else {
      break;
    }
  }

  return { longest, current };
}

// ═══════════════════════════════════════════════════════════
// Main: Fetch All Developer Stats
// ═══════════════════════════════════════════════════════════

export async function fetchDeveloperStats(
  username: string
): Promise<DeveloperStats> {
  const [user, repos, events] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
    fetchEvents(username),
  ]);

  const languages = await aggregateLanguages(username, repos);

  // Compute top languages
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
    }));

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  // Count push events as commit proxies
  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  const totalCommits = pushEvents.reduce((sum, e) => {
    const size = (e.payload as { size?: number }).size || 1;
    return sum + size;
  }, 0);

  const contributionData = deriveContributionData(events);
  const streaks = calculateStreaks(contributionData);
  const activeHours = deriveActiveHours(events);

  const activeDays = contributionData.filter((d) => d.count > 0).length;
  const averageCommitsPerDay = activeDays > 0 ? totalCommits / activeDays : 0;

  const accountAgeDays = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    user,
    repos,
    languages,
    totalStars,
    totalForks,
    totalCommits,
    topLanguages,
    contributionData,
    longestStreak: streaks.longest,
    currentStreak: streaks.current,
    activeHours,
    recentEvents: events,
    averageCommitsPerDay,
    totalRepos: repos.length,
    accountAgeDays,
  };
}
