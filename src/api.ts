// ─── API CONFIGURATION ────────────────────────────────────────────────────────
// Add your keys to Vercel Environment Variables:
// VITE_FOOTBALL_API_KEY  → from api-sports.io
// VITE_NEWS_API_KEY      → from newsapi.org
// VITE_APIFY_TOKEN       → from apify.com

const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || ''
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''
const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN || ''

// ─── SMART CACHE ──────────────────────────────────────────────────────────────
// Prevents duplicate API calls within the cache window
const cache = new Map<string, { data: any; timestamp: number }>()

function getCached(key: string, ttlMs: number) {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < ttlMs) return entry.data
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// ─── FOOTBALL API (api-sports.io) ─────────────────────────────────────────────
async function footballFetch(endpoint: string) {
  const res = await fetch(`https://v3.football.api-sports.io${endpoint}`, {
    headers: {
      'x-apisports-key': FOOTBALL_API_KEY,
    }
  })
  if (!res.ok) throw new Error(`Football API error: ${res.status}`)
  const json = await res.json()
  return json.response
}

// ─── LIVE MATCHES ─────────────────────────────────────────────────────────────
export async function fetchLiveMatches() {
  const cacheKey = 'live-matches'
  const cached = getCached(cacheKey, 60 * 1000) // 60 second cache
  if (cached) return cached

  if (!FOOTBALL_API_KEY) return null

  try {
    const data = await footballFetch('/fixtures?live=all')
    const mapped = data.map((f: any) => mapFixture(f))
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('Live matches fetch failed:', e)
    return null
  }
}

// ─── TODAY'S MATCHES ──────────────────────────────────────────────────────────
export async function fetchTodayMatches() {
  const cacheKey = 'today-matches'
  const cached = getCached(cacheKey, 5 * 60 * 1000) // 5 min cache
  if (cached) return cached

  if (!FOOTBALL_API_KEY) return null

  try {
    const today = new Date().toISOString().split('T')[0]
    const data = await footballFetch(`/fixtures?date=${today}`)
    const mapped = data.map((f: any) => mapFixture(f))
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('Today matches fetch failed:', e)
    return null
  }
}

// ─── MATCH DETAILS (lineups + events + stats) ─────────────────────────────────
export async function fetchMatchDetails(fixtureId: number) {
  const cacheKey = `match-${fixtureId}`
  const cached = getCached(cacheKey, 60 * 1000) // 60 second cache for live
  if (cached) return cached

  if (!FOOTBALL_API_KEY) return null

  try {
    const [events, lineups, stats] = await Promise.all([
      footballFetch(`/fixtures/events?fixture=${fixtureId}`),
      footballFetch(`/fixtures/lineups?fixture=${fixtureId}`),
      footballFetch(`/fixtures/statistics?fixture=${fixtureId}`),
    ])

    const result = { events, lineups, stats }
    setCache(cacheKey, result)
    return result
  } catch (e) {
    console.error('Match details fetch failed:', e)
    return null
  }
}

// ─── HEAD TO HEAD ─────────────────────────────────────────────────────────────
export async function fetchH2H(team1: number, team2: number) {
  const cacheKey = `h2h-${team1}-${team2}`
  const cached = getCached(cacheKey, 60 * 60 * 1000) // 1 hour cache
  if (cached) return cached

  if (!FOOTBALL_API_KEY) return null

  try {
    const data = await footballFetch(`/fixtures/headtohead?h2h=${team1}-${team2}&last=5`)
    const mapped = data.map((f: any) => ({
      date: f.fixture.date?.split('T')[0],
      home: f.teams.home.name,
      away: f.teams.away.name,
      score: `${f.goals.home ?? 0}-${f.goals.away ?? 0}`,
    }))
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('H2H fetch failed:', e)
    return null
  }
}

// ─── STANDINGS ────────────────────────────────────────────────────────────────
export async function fetchStandings(leagueId: number) {
  const cacheKey = `standings-${leagueId}`
  const cached = getCached(cacheKey, 30 * 60 * 1000) // 30 min cache
  if (cached) return cached

  if (!FOOTBALL_API_KEY) return null

  try {
    const season = new Date().getFullYear()
    const data = await footballFetch(`/standings?league=${leagueId}&season=${season}`)
    const standings = data?.[0]?.league?.standings?.[0] || []
    const mapped = standings.map((s: any) => ({
      rank: s.rank,
      team: s.team.name,
      logo: s.team.logo,
      played: s.all.played,
      won: s.all.win,
      drawn: s.all.draw,
      lost: s.all.lose,
      gd: s.goalsDiff,
      points: s.points,
    }))
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('Standings fetch failed:', e)
    return null
  }
}

// ─── NEWS (NewsAPI) ───────────────────────────────────────────────────────────
export async function fetchNews(category = 'football') {
  const cacheKey = `news-${category}`
  const cached = getCached(cacheKey, 15 * 60 * 1000) // 15 min cache
  if (cached) return cached

  if (!NEWS_API_KEY) return null

  try {
    const query = category === 'Tanzania' ? 'Tanzania football Simba Yanga' : `${category} football`
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${NEWS_API_KEY}`
    )
    const json = await res.json()
    const mapped = (json.articles || []).map((a: any, i: number) => ({
      id: i + 1,
      title: a.title,
      source: a.source.name,
      time: timeAgo(a.publishedAt),
      category,
      image: a.urlToImage || 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80',
      summary: a.description || '',
      url: a.url,
    }))
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('News fetch failed:', e)
    return null
  }
}

// ─── BETTING TIPS (Apify) ─────────────────────────────────────────────────────
export async function fetchBettingTips() {
  const cacheKey = 'betting-tips'
  const cached = getCached(cacheKey, 30 * 60 * 1000) // 30 min cache
  if (cached) return cached

  if (!APIFY_TOKEN) return null

  try {
    // Use Apify's sports betting scraper actor
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~web-scraper/runs?token=${APIFY_TOKEN}`,
      { method: 'GET' }
    )
    if (!res.ok) return null
    const json = await res.json()
    setCache(cacheKey, json)
    return json
  } catch (e) {
    console.error('Betting tips fetch failed:', e)
    return null
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function mapFixture(f: any) {
  const status = f.fixture.status.short
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status)
  const isFinished = ['FT', 'AET', 'PEN'].includes(status)

  return {
    id: f.fixture.id,
    leagueId: f.league.id,
    leagueName: f.league.name,
    leagueLogo: f.league.logo,
    leagueFlag: f.league.flag,
    minute: isLive ? `${f.fixture.status.elapsed}'` : isFinished ? 'FT' : formatTime(f.fixture.date),
    minuteNum: f.fixture.status.elapsed || 0,
    home: {
      id: f.teams.home.id,
      name: f.teams.home.name,
      logo: f.teams.home.logo,
      score: f.goals.home,
    },
    away: {
      id: f.teams.away.id,
      name: f.teams.away.name,
      logo: f.teams.away.logo,
      score: f.goals.away,
    },
    status: isLive ? 'live' : isFinished ? 'finished' : 'upcoming',
    htScore: f.score.halftime.home !== null
      ? `${f.score.halftime.home}-${f.score.halftime.away}`
      : null,
  }
}

function formatTime(dateStr: string) {
  if (!dateStr) return '--:--'
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} days ago`
}
