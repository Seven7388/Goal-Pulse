// ─── API CONFIGURATION ────────────────────────────────────────────────────────
// Add your keys in Vercel Environment Variables:
// VITE_FOOTBALL_API_KEY   → from api-sports.io
// VITE_NEWS_API_KEY       → from newsapi.org
// VITE_ODDS_API_KEY       → from the-odds-api.com
// VITE_APIFY_API_KEY      → from apify.com

const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || ''
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''
const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || ''

// ─── SMART CACHE ──────────────────────────────────────────────────────────────
const cache: Record<string, { data: any; timestamp: number }> = {}

function getCache(key: string, ttlSeconds: number) {
  const entry = cache[key]
  if (!entry) return null
  if (Date.now() - entry.timestamp > ttlSeconds * 1000) return null
  return entry.data
}

function setCache(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() }
}

// ─── FOOTBALL API (api-sports.io) ─────────────────────────────────────────────
async function footballFetch(endpoint: string) {
  const res = await fetch(`https://v3.football.api-sports.io/${endpoint}`, {
    headers: {
      'x-apisports-key': FOOTBALL_API_KEY,
    },
  })
  const json = await res.json()
  return json.response
}

// ─── LIVE MATCHES ─────────────────────────────────────────────────────────────
export async function fetchLiveMatches() {
  const cacheKey = 'live_matches'
  const cached = getCache(cacheKey, 60) // cache 60 seconds
  if (cached) return cached

  try {
    if (!FOOTBALL_API_KEY) return getFallbackMatches()
    const data = await footballFetch('fixtures?live=all')
    const mapped = data.map(mapFixture)
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return getFallbackMatches()
  }
}

// ─── TODAY'S MATCHES ──────────────────────────────────────────────────────────
export async function fetchTodayMatches() {
  const cacheKey = 'today_matches'
  const cached = getCache(cacheKey, 300) // cache 5 minutes
  if (cached) return cached

  try {
    if (!FOOTBALL_API_KEY) return getFallbackMatches()
    const today = new Date().toISOString().split('T')[0]
    const data = await footballFetch(`fixtures?date=${today}&timezone=Africa/Dar_es_Salaam`)
    const mapped = data.map(mapFixture)
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return getFallbackMatches()
  }
}

// ─── MATCH DETAILS ────────────────────────────────────────────────────────────
export async function fetchMatchDetails(fixtureId: number) {
  const cacheKey = `match_${fixtureId}`
  const cached = getCache(cacheKey, 60)
  if (cached) return cached

  try {
    if (!FOOTBALL_API_KEY) return null
    const [events, lineups, stats, h2h] = await Promise.all([
      footballFetch(`fixtures/events?fixture=${fixtureId}`),
      footballFetch(`fixtures/lineups?fixture=${fixtureId}`),
      footballFetch(`fixtures/statistics?fixture=${fixtureId}`),
      footballFetch(`fixtures/headtohead?h2h=${fixtureId}`),
    ])
    const result = { events, lineups, stats, h2h }
    setCache(cacheKey, result)
    return result
  } catch {
    return null
  }
}

// ─── H2H ─────────────────────────────────────────────────────────────────────
export async function fetchH2H(team1: number, team2: number) {
  const cacheKey = `h2h_${team1}_${team2}`
  const cached = getCache(cacheKey, 3600) // cache 1 hour
  if (cached) return cached

  try {
    if (!FOOTBALL_API_KEY) return []
    const data = await footballFetch(`fixtures?headtohead=${team1}-${team2}&last=5`)
    const mapped = data.map((f: any) => ({
      date: f.fixture.date?.split('T')[0],
      home: f.teams.home.name,
      away: f.teams.away.name,
      score: `${f.goals.home ?? '?'}-${f.goals.away ?? '?'}`,
    }))
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return []
  }
}

// ─── STANDINGS ────────────────────────────────────────────────────────────────
export async function fetchStandings(leagueId: number) {
  const cacheKey = `standings_${leagueId}`
  const cached = getCache(cacheKey, 3600)
  if (cached) return cached

  try {
    if (!FOOTBALL_API_KEY) return []
    const season = new Date().getFullYear()
    const data = await footballFetch(`standings?league=${leagueId}&season=${season}`)
    const standings = data[0]?.league?.standings[0] || []
    const mapped = standings.map((s: any) => ({
      rank: s.rank,
      team: s.team.name,
      logo: s.team.logo,
      played: s.all.played,
      won: s.all.win,
      drawn: s.all.draw,
      lost: s.all.lose,
      gf: s.all.goals.for,
      ga: s.all.goals.against,
      gd: s.goalsDiff,
      points: s.points,
      form: s.form,
    }))
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return []
  }
}

// ─── NEWS (NewsAPI) ───────────────────────────────────────────────────────────
export async function fetchNews(query = 'football soccer') {
  const cacheKey = `news_${query}`
  const cached = getCache(cacheKey, 1800) // cache 30 minutes
  if (cached) return cached

  try {
    if (!NEWS_API_KEY) return getFallbackNews()
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${NEWS_API_KEY}`
    )
    const json = await res.json()
    const mapped = (json.articles || [])
      .filter((a: any) => a.urlToImage)
      .map((a: any, i: number) => ({
        id: i + 1,
        title: a.title,
        source: a.source.name,
        time: timeAgo(a.publishedAt),
        category: detectCategory(a.title),
        image: a.urlToImage,
        summary: a.description,
        url: a.url,
      }))
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return getFallbackNews()
  }
}

// ─── BETTING ODDS (The Odds API) ──────────────────────────────────────────────
export async function fetchOdds() {
  const cacheKey = 'odds'
  const cached = getCache(cacheKey, 3600) // cache 1 hour
  if (cached) return cached

  try {
    if (!ODDS_API_KEY) return getFallbackTips()
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`
    )
    const json = await res.json()
    const mapped = (json || []).slice(0, 10).map((game: any, i: number) => {
      const bookmaker = game.bookmakers?.[0]
      const market = bookmaker?.markets?.[0]
      const outcomes = market?.outcomes || []
      const homeOdd = outcomes.find((o: any) => o.name === game.home_team)?.price || '?'
      const awayOdd = outcomes.find((o: any) => o.name === game.away_team)?.price || '?'
      const drawOdd = outcomes.find((o: any) => o.name === 'Draw')?.price || '?'
      const bestOdd = Math.max(Number(homeOdd), Number(awayOdd))
      const tip = Number(homeOdd) < Number(awayOdd) ? `${game.home_team} Win` : `${game.away_team} Win`
      return {
        id: i + 1,
        match: `${game.home_team} vs ${game.away_team}`,
        league: game.sport_title,
        tip,
        odds: String(bestOdd),
        bookmaker: bookmaker?.title || 'Bet365',
        confidence: Math.floor(60 + Math.random() * 30),
        analysis: `Based on current odds: Home ${homeOdd} | Draw ${drawOdd} | Away ${awayOdd}`,
        kickoff: new Date(game.commence_time).toLocaleString('en-TZ', { timeZone: 'Africa/Dar_es_Salaam', hour: '2-digit', minute: '2-digit' }),
        verdict: null,
      }
    })
    setCache(cacheKey, mapped)
    return mapped
  } catch {
    return getFallbackTips()
  }
}

// ─── MAPPER ───────────────────────────────────────────────────────────────────
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
    minute: isLive ? `${f.fixture.status.elapsed}'` : isFinished ? 'FT' : f.fixture.date?.split('T')[1]?.slice(0, 5) || '',
    minuteNum: f.fixture.status.elapsed || 0,
    home: { name: f.teams.home.name, logo: f.teams.home.logo, score: f.goals.home, id: f.teams.home.id },
    away: { name: f.teams.away.name, logo: f.teams.away.logo, score: f.goals.away, id: f.teams.away.id },
    status: isLive ? 'live' : isFinished ? 'finished' : 'upcoming',
    htScore: f.score.halftime.home !== null ? `${f.score.halftime.home}-${f.score.halftime.away}` : null,
    events: [], lineup: { home: [], away: [] },
    stats: { possession: [0, 0], shots: [0, 0], shotsOnTarget: [0, 0], corners: [0, 0], fouls: [0, 0] },
    h2h: [],
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} days ago`
}

function detectCategory(title: string) {
  const t = title.toLowerCase()
  if (t.includes('premier league')) return 'Premier League'
  if (t.includes('champions league')) return 'Champions League'
  if (t.includes('tanzania') || t.includes('simba') || t.includes('yanga')) return 'Tanzania'
  if (t.includes('world cup')) return 'World Cup'
  if (t.includes('la liga') || t.includes('real madrid') || t.includes('barcelona')) return 'La Liga'
  if (t.includes('serie a')) return 'Serie A'
  if (t.includes('bundesliga')) return 'Bundesliga'
  return 'Football'
}

// ─── FALLBACK DATA (shown when API key not set yet) ───────────────────────────
export function getFallbackMatches() {
  return [
    {
      id: 1, leagueId: 39, leagueName: 'Premier League', leagueLogo: 'https://media.api-sports.io/football/leagues/39.png', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      minute: "67'", minuteNum: 67,
      home: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png', score: 2, id: 42 },
      away: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', score: 1, id: 49 },
      status: 'live', htScore: '1-1',
      events: [
        { minute: 23, type: 'goal', team: 'home', player: 'Saka', assist: 'Ødegaard' },
        { minute: 38, type: 'goal', team: 'away', player: 'Palmer', assist: 'Mudryk' },
        { minute: 45, type: 'yellow', team: 'home', player: 'Rice', assist: '' },
        { minute: 61, type: 'goal', team: 'home', player: 'Havertz', assist: 'Saka' },
      ],
      lineup: {
        home: ['Raya','White','Saliba','Magalhães','Zinchenko','Rice','Ødegaard','Havertz','Saka','Martinelli','Jesus'],
        away: ['Sánchez','Gusto','Chalobah','Colwill','Cucurella','Caicedo','Fernández','Palmer','Nkunku','Mudryk','Jackson']
      },
      stats: { possession: [58,42], shots: [14,8], shotsOnTarget: [6,3], corners: [7,4], fouls: [9,13] },
      h2h: [
        { date: '2024-04-23', home: 'Arsenal', away: 'Chelsea', score: '5-0' },
        { date: '2023-10-21', home: 'Chelsea', away: 'Arsenal', score: '2-2' },
        { date: '2023-04-04', home: 'Arsenal', away: 'Chelsea', score: '3-1' },
      ]
    },
    {
      id: 2, leagueId: 140, leagueName: 'La Liga', leagueLogo: 'https://media.api-sports.io/football/leagues/140.png', leagueFlag: '🇪🇸',
      minute: "82'", minuteNum: 82,
      home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png', score: 3, id: 541 },
      away: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', score: 2, id: 529 },
      status: 'live', htScore: '2-1',
      events: [
        { minute: 12, type: 'goal', team: 'home', player: 'Vinicius Jr', assist: 'Bellingham' },
        { minute: 29, type: 'goal', team: 'away', player: 'Yamal', assist: 'Pedri' },
        { minute: 44, type: 'goal', team: 'home', player: 'Mbappé', assist: 'Valverde' },
        { minute: 68, type: 'goal', team: 'away', player: 'Lewandowski', assist: '' },
        { minute: 79, type: 'goal', team: 'home', player: 'Bellingham', assist: 'Mbappé' },
      ],
      lineup: {
        home: ['Courtois','Carvajal','Militão','Rüdiger','Mendy','Valverde','Camavinga','Bellingham','Rodrygo','Mbappé','Vinicius Jr'],
        away: ['Ter Stegen','Koundé','Araujo','Íñigo Martínez','Balde','Pedri','Gavi','De Jong','Yamal','Lewandowski','Raphinha']
      },
      stats: { possession: [46,54], shots: [18,15], shotsOnTarget: [9,7], corners: [6,8], fouls: [14,16] },
      h2h: [
        { date: '2024-10-26', home: 'Barcelona', away: 'Real Madrid', score: '4-0' },
        { date: '2024-04-21', home: 'Real Madrid', away: 'Barcelona', score: '3-2' },
      ]
    },
    {
      id: 3, leagueId: 595, leagueName: 'Tanzania Premier League', leagueLogo: 'https://media.api-sports.io/football/leagues/595.png', leagueFlag: '🇹🇿',
      minute: "45'", minuteNum: 45,
      home: { name: 'Simba SC', logo: 'https://media.api-sports.io/football/teams/1490.png', score: 1, id: 1490 },
      away: { name: 'Young Africans', logo: 'https://media.api-sports.io/football/teams/1491.png', score: 0, id: 1491 },
      status: 'live', htScore: '1-0',
      events: [{ minute: 34, type: 'goal', team: 'home', player: 'Kagere', assist: '' }],
      lineup: { home: [], away: [] },
      stats: { possession: [55,45], shots: [8,4], shotsOnTarget: [3,1], corners: [5,2], fouls: [6,8] },
      h2h: [
        { date: '2024-08-10', home: 'Simba SC', away: 'Young Africans', score: '2-1' },
        { date: '2024-02-14', home: 'Young Africans', away: 'Simba SC', score: '1-1' },
      ]
    },
    {
      id: 4, leagueId: 39, leagueName: 'Premier League', leagueLogo: 'https://media.api-sports.io/football/leagues/39.png', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      minute: '19:30', minuteNum: 0,
      home: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png', score: null, id: 40 },
      away: { name: 'Man United', logo: 'https://media.api-sports.io/football/teams/33.png', score: null, id: 33 },
      status: 'upcoming', htScore: null,
      events: [], lineup: { home: [], away: [] },
      stats: { possession: [0,0], shots: [0,0], shotsOnTarget: [0,0], corners: [0,0], fouls: [0,0] },
      h2h: [
        { date: '2024-03-17', home: 'Liverpool', away: 'Man United', score: '2-2' },
        { date: '2023-12-17', home: 'Man United', away: 'Liverpool', score: '0-1' },
      ]
    },
  ]
}

export function getFallbackNews() {
  return [
    { id: 1, title: 'Bellingham Scores Late Winner in El Clasico Thriller', source: 'BBC Sport', time: '32 min ago', category: 'La Liga', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80', summary: 'Jude Bellingham sealed a dramatic 3-2 victory for Real Madrid over Barcelona.', url: '#' },
    { id: 2, title: 'Premier League Title Race Heats Up as Arsenal Climb to Second', source: 'Sky Sports', time: '1 hr ago', category: 'Premier League', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80', summary: "Arsenal's 2-1 victory over Chelsea has reignited the title race.", url: '#' },
    { id: 3, title: 'Simba SC Advance to CAF Champions League Group Stage', source: 'Daily News TZ', time: '2 hrs ago', category: 'Tanzania', image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&q=80', summary: 'Simba SC secured their place in the CAF Champions League group stage.', url: '#' },
    { id: 4, title: 'Haaland Returns from Injury, Set to Face PSG', source: 'Guardian', time: '3 hrs ago', category: 'Champions League', image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=400&q=80', summary: 'Erling Haaland has been declared fit for the Champions League clash.', url: '#' },
    { id: 5, title: 'FIFA World Cup 2026 Ticket Sales Open Next Month', source: 'FIFA.com', time: '5 hrs ago', category: 'World Cup', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', summary: 'FIFA announced ticket sales for 2026 World Cup open next month.', url: '#' },
    { id: 6, title: 'Young Africans Sign Brazilian Striker in January Window', source: 'Mwanaspoti', time: '6 hrs ago', category: 'Tanzania', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80', summary: 'Young Africans confirmed the signing of Brazilian forward Carlos Oliveira.', url: '#' },
  ]
}

export function getFallbackTips() {
  return [
    { id: 1, match: 'Arsenal vs Chelsea', league: 'Premier League', tip: 'Arsenal Win or Draw', odds: '1.45', bookmaker: 'Betway', confidence: 85, analysis: "Arsenal's home record is outstanding. Chelsea struggle away from home.", kickoff: 'Today 20:00', verdict: 'WIN' },
    { id: 2, match: 'Real Madrid vs Barcelona', league: 'La Liga', tip: 'Both Teams to Score', odds: '1.72', bookmaker: 'Bet365', confidence: 78, analysis: 'El Clasico fixtures consistently deliver goals from both sides.', kickoff: 'Today 21:00', verdict: 'WIN' },
    { id: 3, match: 'Liverpool vs Man United', league: 'Premier League', tip: 'Liverpool Win', odds: '1.90', bookmaker: '1xBet', confidence: 72, analysis: 'Liverpool are unbeaten at Anfield. Man United away form is poor.', kickoff: 'Tomorrow 17:30', verdict: null },
    { id: 4, match: 'PSG vs Bayern Munich', league: 'Champions League', tip: 'Over 2.5 Goals', odds: '1.65', bookmaker: 'SportyBet', confidence: 80, analysis: 'PSG home games average 3.1 goals. Bayern are top scorers in Europe.', kickoff: 'Tomorrow 21:00', verdict: null },
    { id: 5, match: 'Simba SC vs Yanga', league: 'Tanzania PL', tip: 'Simba Win', odds: '2.10', bookmaker: 'M-Bet', confidence: 68, analysis: 'Simba have won their last 6 home games in all competitions.', kickoff: 'Saturday 16:00', verdict: null },
  ]
}

export const TV_CHANNELS = [
  { id: 1, name: 'Azam Sports 1', category: 'Sports', platform: 'Azam TV', emoji: '⚽', isLive: true, currentShow: 'Premier League Live', youtubeId: '' },
  { id: 2, name: 'Azam Sports 2', category: 'Sports', platform: 'Azam TV', emoji: '🏆', isLive: true, currentShow: 'La Liga Highlights', youtubeId: '' },
  { id: 3, name: 'Azam Sports 3', category: 'Sports', platform: 'Azam TV', emoji: '🎯', isLive: false, currentShow: 'Tennis Live', youtubeId: '' },
  { id: 4, name: 'SuperSport 1', category: 'Sports', platform: 'DSTV', emoji: '🏅', isLive: true, currentShow: 'UEFA Champions League', youtubeId: '' },
  { id: 5, name: 'SuperSport Blitz', category: 'Sports', platform: 'DSTV', emoji: '⚡', isLive: true, currentShow: 'Sports News 24/7', youtubeId: '' },
  { id: 6, name: 'ESPN', category: 'Sports', platform: 'DSTV', emoji: '🏈', isLive: true, currentShow: 'SportsCenter', youtubeId: '' },
  { id: 7, name: 'beIN Sports 1', category: 'Sports', platform: 'DSTV', emoji: '📺', isLive: true, currentShow: 'Serie A Live', youtubeId: '' },
  { id: 8, name: 'TBC 1', category: 'News', platform: 'Free-to-Air', emoji: '📡', isLive: true, currentShow: 'Habari za Usiku', youtubeId: 'your_tbc_youtube_id' },
  { id: 9, name: 'ITV Tanzania', category: 'News', platform: 'Free-to-Air', emoji: '🎙️', isLive: true, currentShow: 'Prime News', youtubeId: '' },
  { id: 10, name: 'Channel Ten', category: 'News', platform: 'Free-to-Air', emoji: '🔟', isLive: false, currentShow: 'Morning Show', youtubeId: '' },
  { id: 11, name: 'CNN International', category: 'News', platform: 'DSTV', emoji: '🌍', isLive: true, currentShow: 'World News Now', youtubeId: 'qgylp9KmSuE' },
  { id: 12, name: 'BBC World News', category: 'News', platform: 'DSTV', emoji: '🎬', isLive: true, currentShow: 'BBC World at One', youtubeId: 'w_Ma8oQLmSM' },
  { id: 13, name: 'Al Jazeera', category: 'News', platform: 'DSTV', emoji: '📰', isLive: true, currentShow: 'Inside Story', youtubeId: 'h3MuIUNCCLI' },
  { id: 14, name: 'Azam Uno', category: 'Entertainment', platform: 'Azam TV', emoji: '🎭', isLive: true, currentShow: 'Bongo Movie', youtubeId: '' },
  { id: 15, name: 'Azam Viu', category: 'Entertainment', platform: 'Azam TV', emoji: '🎥', isLive: false, currentShow: 'African Drama', youtubeId: '' },
  { id: 16, name: 'M-Net', category: 'Entertainment', platform: 'DSTV', emoji: '🍿', isLive: true, currentShow: 'Hollywood Movie Night', youtubeId: '' },
  { id: 17, name: 'Africa Magic', category: 'Entertainment', platform: 'DSTV', emoji: '✨', isLive: true, currentShow: 'Nollywood Series', youtubeId: '' },
  { id: 18, name: 'Cartoon Network', category: 'Entertainment', platform: 'DSTV', emoji: '🐣', isLive: false, currentShow: 'Tom & Jerry', youtubeId: '' },
]

export const LEAGUES = [
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 140, name: 'La Liga', flag: '🇪🇸', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 135, name: 'Serie A', flag: '🇮🇹', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 61, name: 'Ligue 1', flag: '🇫🇷', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: 2, name: 'Champions League', flag: '🇪🇺', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 595, name: 'Tanzania Premier League', flag: '🇹🇿', logo: 'https://media.api-sports.io/football/leagues/595.png' },
]
