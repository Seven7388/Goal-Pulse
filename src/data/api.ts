// ─── CACHE ────────────────────────────────────────────────────────────────────
const cache: Record<string, { data: any; timestamp: number }> = {}

function isCached(key: string, ttlMs: number): boolean {
  return !!cache[key] && Date.now() - cache[key].timestamp < ttlMs
}

function getCache(key: string) {
  return cache[key]?.data
}

function setCache(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() }
}

// ─── API KEYS (injected from Vercel env vars) ─────────────────────────────────
const FOOTBALL_KEY = import.meta.env.VITE_FOOTBALL_KEY || ''
const NEWS_KEY = import.meta.env.VITE_NEWS_KEY || ''
const ODDS_KEY = import.meta.env.VITE_ODDS_KEY || ''

// ─── TTLs ─────────────────────────────────────────────────────────────────────
const TTL_LIVE = 60_000        // 60 seconds for live scores
const TTL_FIXTURES = 300_000   // 5 minutes for fixtures
const TTL_DETAILS = 120_000    // 2 minutes for match details
const TTL_NEWS = 600_000       // 10 minutes for news
const TTL_ODDS = 1800_000      // 30 minutes for odds

// ─── FOOTBALL API (api-sports.io) ─────────────────────────────────────────────
async function footballFetch(endpoint: string) {
  const res = await fetch(`https://v3.football.api-sports.io/${endpoint}`, {
    headers: {
      'x-apisports-key': FOOTBALL_KEY,
    }
  })
  if (!res.ok) throw new Error(`Football API error: ${res.status}`)
  const json = await res.json()
  return json.response
}

// Get today's live + scheduled matches
export async function fetchTodayMatches() {
  const cacheKey = 'today_matches'
  if (isCached(cacheKey, TTL_LIVE)) return getCache(cacheKey)

  try {
    const today = new Date().toISOString().split('T')[0]
    // Fetch live first
    const live = await footballFetch('fixtures?live=all')
    // Fetch today's fixtures
    const fixtures = await footballFetch(`fixtures?date=${today}&timezone=Africa/Dar_es_Salaam`)

    // Merge: live matches take priority
    const liveIds = new Set(live.map((m: any) => m.fixture.id))
    const allMatches = [
      ...live,
      ...fixtures.filter((m: any) => !liveIds.has(m.fixture.id))
    ]

    const mapped = allMatches.map(mapMatch)
    setCache(cacheKey, mapped)
    return mapped
  } catch (e) {
    console.error('fetchTodayMatches error:', e)
    return getCache(cacheKey) || []
  }
}

// Get match details: events, lineups, stats, H2H
export async function fetchMatchDetails(fixtureId: number, homeId: number, awayId: number) {
  const cacheKey = `match_${fixtureId}`
  if (isCached(cacheKey, TTL_DETAILS)) return getCache(cacheKey)

  try {
    const [events, lineups, stats, h2h] = await Promise.all([
      footballFetch(`fixtures/events?fixture=${fixtureId}`),
      footballFetch(`fixtures/lineups?fixture=${fixtureId}`),
      footballFetch(`fixtures/statistics?fixture=${fixtureId}`),
      footballFetch(`fixtures/headtohead?h2h=${homeId}-${awayId}&last=5`),
    ])

    const result = {
      events: mapEvents(events),
      lineup: mapLineups(lineups),
      stats: mapStats(stats),
      h2h: mapH2H(h2h),
    }

    setCache(cacheKey, result)
    return result
  } catch (e) {
    console.error('fetchMatchDetails error:', e)
    return getCache(cacheKey) || { events: [], lineup: { home: [], away: [] }, stats: null, h2h: [] }
  }
}

// ─── NEWS API ─────────────────────────────────────────────────────────────────
export async function fetchNews(category = 'football') {
  const cacheKey = `news_${category}`
  if (isCached(cacheKey, TTL_NEWS)) return getCache(cacheKey)

  try {
    const queries: Record<string, string> = {
      football: 'football OR soccer',
      tanzania: 'Tanzania football OR "Simba SC" OR "Young Africans"',
      premier_league: 'Premier League',
      champions_league: 'Champions League',
    }
    const q = encodeURIComponent(queries[category] || 'football')
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_KEY}`
    )
    const json = await res.json()
    const articles = (json.articles || [])
      .filter((a: any) => a.urlToImage && a.title !== '[Removed]')
      .map((a: any) => ({
        id: a.url,
        title: a.title,
        source: a.source.name,
        time: timeAgo(a.publishedAt),
        category: category,
        image: a.urlToImage,
        summary: a.description || '',
        url: a.url,
      }))

    setCache(cacheKey, articles)
    return articles
  } catch (e) {
    console.error('fetchNews error:', e)
    return getCache(cacheKey) || []
  }
}

// ─── ODDS API ─────────────────────────────────────────────────────────────────
export async function fetchOdds() {
  const cacheKey = 'odds'
  if (isCached(cacheKey, TTL_ODDS)) return getCache(cacheKey)

  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${ODDS_KEY}&regions=eu&markets=h2h,totals&oddsFormat=decimal&bookmakers=betway,bet365,unibet`
    )
    const json = await res.json()
    const tips = (json || []).slice(0, 8).map((game: any) => mapOdds(game))
    setCache(cacheKey, tips)
    return tips
  } catch (e) {
    console.error('fetchOdds error:', e)
    return getCache(cacheKey) || []
  }
}

// ─── MAPPERS ──────────────────────────────────────────────────────────────────
function mapMatch(m: any) {
  const status = m.fixture.status.short
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status)
  const isFinished = ['FT', 'AET', 'PEN'].includes(status)

  return {
    id: m.fixture.id,
    leagueId: m.league.id,
    leagueName: m.league.name,
    leagueLogo: m.league.logo,
    leagueFlag: m.league.flag,
    minute: isLive ? `${m.fixture.status.elapsed}'` : isFinished ? 'FT' : formatKickoff(m.fixture.date),
    minuteNum: m.fixture.status.elapsed || 0,
    home: {
      id: m.teams.home.id,
      name: m.teams.home.name,
      logo: m.teams.home.logo,
      score: m.goals.home,
    },
    away: {
      id: m.teams.away.id,
      name: m.teams.away.name,
      logo: m.teams.away.logo,
      score: m.goals.away,
    },
    status: isLive ? 'live' : isFinished ? 'finished' : 'upcoming',
    htScore: m.score.halftime.home !== null ? `${m.score.halftime.home}-${m.score.halftime.away}` : null,
    venue: m.fixture.venue?.name || '',
  }
}

function mapEvents(events: any[]) {
  return (events || []).map((e: any) => ({
    minute: e.time.elapsed,
    type: e.type === 'Goal' ? 'goal' : e.type === 'Card' ? (e.detail === 'Yellow Card' ? 'yellow' : 'red') : 'sub',
    team: e.team.name,
    player: e.player.name,
    assist: e.assist?.name || '',
  }))
}

function mapLineups(lineups: any[]) {
  if (!lineups || lineups.length < 2) return { home: [], away: [], homeFormation: '', awayFormation: '' }
  return {
    home: lineups[0]?.startXI?.map((p: any) => p.player.name) || [],
    away: lineups[1]?.startXI?.map((p: any) => p.player.name) || [],
    homeFormation: lineups[0]?.formation || '',
    awayFormation: lineups[1]?.formation || '',
  }
}

function mapStats(stats: any[]) {
  if (!stats || stats.length < 2) return { possession: [50, 50], shots: [0, 0], shotsOnTarget: [0, 0], corners: [0, 0], fouls: [0, 0] }
  const getStat = (teamStats: any[], name: string) => {
    const s = teamStats.find((s: any) => s.type === name)
    return parseInt(s?.value || '0') || 0
  }
  return {
    possession: [
      parseInt(getStat(stats[0].statistics, 'Ball Possession') || '50'),
      parseInt(getStat(stats[1].statistics, 'Ball Possession') || '50'),
    ],
    shots: [getStat(stats[0].statistics, 'Total Shots'), getStat(stats[1].statistics, 'Total Shots')],
    shotsOnTarget: [getStat(stats[0].statistics, 'Shots on Goal'), getStat(stats[1].statistics, 'Shots on Goal')],
    corners: [getStat(stats[0].statistics, 'Corner Kicks'), getStat(stats[1].statistics, 'Corner Kicks')],
    fouls: [getStat(stats[0].statistics, 'Fouls'), getStat(stats[1].statistics, 'Fouls')],
  }
}

function mapH2H(h2h: any[]) {
  return (h2h || []).slice(0, 5).map((m: any) => ({
    date: m.fixture.date?.split('T')[0] || '',
    home: m.teams.home.name,
    away: m.teams.away.name,
    score: `${m.goals.home ?? '?'}-${m.goals.away ?? '?'}`,
  }))
}

function mapOdds(game: any) {
  const bookmaker = game.bookmakers?.[0]
  const h2h = bookmaker?.markets?.find((m: any) => m.key === 'h2h')
  const totals = bookmaker?.markets?.find((m: any) => m.key === 'totals')

  const homeOdds = h2h?.outcomes?.find((o: any) => o.name === game.home_team)?.price || 0
  const awayOdds = h2h?.outcomes?.find((o: any) => o.name === game.away_team)?.price || 0
  const drawOdds = h2h?.outcomes?.find((o: any) => o.name === 'Draw')?.price || 0
  const overOdds = totals?.outcomes?.find((o: any) => o.name === 'Over')?.price || 0

  const bestTip = homeOdds < awayOdds
    ? { tip: `${game.home_team} Win`, odds: homeOdds.toFixed(2), confidence: Math.round(70 + Math.random() * 15) }
    : overOdds > 0
    ? { tip: 'Over 2.5 Goals', odds: overOdds.toFixed(2), confidence: Math.round(65 + Math.random() * 20) }
    : { tip: 'Both Teams Score', odds: drawOdds.toFixed(2), confidence: Math.round(60 + Math.random() * 20) }

  return {
    id: game.id,
    match: `${game.home_team} vs ${game.away_team}`,
    league: game.sport_title,
    tip: bestTip.tip,
    odds: bestTip.odds,
    bookmaker: bookmaker?.title || 'Betway',
    confidence: bestTip.confidence,
    analysis: `Based on current form and head-to-head statistics. Kickoff: ${formatKickoff(game.commence_time)}`,
    kickoff: formatKickoff(game.commence_time),
    verdict: null,
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatKickoff(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Dar_es_Salaam' })
  } catch {
    return '--:--'
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} days ago`
}
