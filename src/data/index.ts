export const LEAGUES = [
  { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "🇪🇸" },
  { id: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", flag: "🇮🇹" },
  { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", flag: "🇩🇪" },
  { id: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", flag: "🇫🇷" },
  { id: 2, name: "Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "🇪🇺" },
  { id: 595, name: "Tanzania Premier League", country: "Tanzania", logo: "https://media.api-sports.io/football/leagues/595.png", flag: "🇹🇿" },
]

export const MOCK_MATCHES = [
  {
    id: 1, leagueId: 39, minute: "LIVE", minuteNum: 67,
    home: { name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png", score: 2, id: 42 },
    away: { name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png", score: 1, id: 49 },
    status: "live", htScore: "1-1",
    events: [
      { minute: 23, type: "goal", team: "home", player: "Saka", assist: "Ødegaard" },
      { minute: 38, type: "goal", team: "away", player: "Palmer", assist: "Mudryk" },
      { minute: 45, type: "yellow", team: "home", player: "Rice" },
      { minute: 61, type: "goal", team: "home", player: "Havertz", assist: "Saka" },
    ],
    lineup: {
      home: ["Raya", "White", "Saliba", "Magalhães", "Zinchenko", "Rice", "Ødegaard", "Havertz", "Saka", "Martinelli", "Jesus"],
      away: ["Sánchez", "Gusto", "Chalobah", "Colwill", "Cucurella", "Caicedo", "Fernández", "Palmer", "Nkunku", "Mudryk", "Jackson"]
    },
    stats: { possession: [58, 42], shots: [14, 8], shotsOnTarget: [6, 3], corners: [7, 4], fouls: [9, 13] },
    h2h: [
      { date: "2024-04-23", home: "Arsenal", away: "Chelsea", score: "5-0" },
      { date: "2023-10-21", home: "Chelsea", away: "Arsenal", score: "2-2" },
      { date: "2023-04-04", home: "Arsenal", away: "Chelsea", score: "3-1" },
    ]
  },
  {
    id: 2, leagueId: 140, minute: "82'", minuteNum: 82,
    home: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", score: 3, id: 541 },
    away: { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png", score: 2, id: 529 },
    status: "live", htScore: "2-1",
    events: [
      { minute: 12, type: "goal", team: "home", player: "Vinicius Jr", assist: "Bellingham" },
      { minute: 29, type: "goal", team: "away", player: "Yamal", assist: "Pedri" },
      { minute: 44, type: "goal", team: "home", player: "Mbappé", assist: "Valverde" },
      { minute: 55, type: "yellow", team: "away", player: "Gavi" },
      { minute: 68, type: "goal", team: "away", player: "Lewandowski" },
      { minute: 75, type: "red", team: "away", player: "Araujo" },
      { minute: 79, type: "goal", team: "home", player: "Bellingham", assist: "Mbappé" },
    ],
    lineup: {
      home: ["Courtois", "Carvajal", "Militão", "Rüdiger", "Mendy", "Valverde", "Camavinga", "Bellingham", "Rodrygo", "Mbappé", "Vinicius Jr"],
      away: ["Ter Stegen", "Koundé", "Araujo", "Íñigo Martínez", "Balde", "Pedri", "Gavi", "De Jong", "Yamal", "Lewandowski", "Raphinha"]
    },
    stats: { possession: [46, 54], shots: [18, 15], shotsOnTarget: [9, 7], corners: [6, 8], fouls: [14, 16] },
    h2h: [
      { date: "2024-10-26", home: "Barcelona", away: "Real Madrid", score: "4-0" },
      { date: "2024-04-21", home: "Real Madrid", away: "Barcelona", score: "3-2" },
      { date: "2023-10-28", home: "Barcelona", away: "Real Madrid", score: "1-2" },
    ]
  },
  {
    id: 3, leagueId: 2, minute: "FT",
    home: { name: "Man City", logo: "https://media.api-sports.io/football/teams/50.png", score: 1, id: 50 },
    away: { name: "PSG", logo: "https://media.api-sports.io/football/teams/85.png", score: 1, id: 85 },
    status: "finished", htScore: "1-0",
    events: [
      { minute: 34, type: "goal", team: "home", player: "Haaland" },
      { minute: 78, type: "goal", team: "away", player: "Dembélé" },
    ],
    lineup: {
      home: ["Ederson", "Walker", "Rúben Dias", "Akanji", "Gvardiol", "Rodri", "Kovačić", "De Bruyne", "Bernardo Silva", "Foden", "Haaland"],
      away: ["Donnarumma", "Hakimi", "Marquinhos", "Pacho", "Nuno Mendes", "Vitinha", "Ruiz", "Lee Kang-in", "Dembélé", "Barcola", "Ramos"]
    },
    stats: { possession: [61, 39], shots: [16, 9], shotsOnTarget: [5, 4], corners: [9, 3], fouls: [8, 11] },
    h2h: [
      { date: "2021-05-04", home: "Man City", away: "PSG", score: "2-0" },
      { date: "2021-04-28", home: "PSG", away: "Man City", score: "1-2" },
    ]
  },
  {
    id: 4, leagueId: 39, minute: "19:30",
    home: { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png", score: null, id: 40 },
    away: { name: "Man United", logo: "https://media.api-sports.io/football/teams/33.png", score: null, id: 33 },
    status: "upcoming", htScore: null,
    events: [], lineup: { home: [], away: [] },
    stats: { possession: [0,0], shots: [0,0], shotsOnTarget: [0,0], corners: [0,0], fouls: [0,0] },
    h2h: [
      { date: "2024-03-17", home: "Liverpool", away: "Man United", score: "2-2" },
      { date: "2023-12-17", home: "Man United", away: "Liverpool", score: "0-1" },
    ]
  },
  {
    id: 5, leagueId: 595, minute: "LIVE", minuteNum: 45,
    home: { name: "Simba SC", logo: "https://media.api-sports.io/football/teams/1490.png", score: 1, id: 1490 },
    away: { name: "Young Africans", logo: "https://media.api-sports.io/football/teams/1491.png", score: 0, id: 1491 },
    status: "live", htScore: "1-0",
    events: [{ minute: 34, type: "goal", team: "home", player: "Kagere" }],
    lineup: { home: [], away: [] },
    stats: { possession: [55, 45], shots: [8, 4], shotsOnTarget: [3, 1], corners: [5, 2], fouls: [6, 8] },
    h2h: [
      { date: "2024-08-10", home: "Simba SC", away: "Young Africans", score: "2-1" },
      { date: "2024-02-14", home: "Young Africans", away: "Simba SC", score: "1-1" },
    ]
  },
  {
    id: 6, leagueId: 78, minute: "21:00",
    home: { name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png", score: null, id: 157 },
    away: { name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png", score: null, id: 165 },
    status: "upcoming", htScore: null,
    events: [], lineup: { home: [], away: [] },
    stats: { possession: [0,0], shots: [0,0], shotsOnTarget: [0,0], corners: [0,0], fouls: [0,0] },
    h2h: [
      { date: "2024-11-02", home: "Bayern Munich", away: "Dortmund", score: "1-0" },
      { date: "2024-04-06", home: "Dortmund", away: "Bayern Munich", score: "0-2" },
    ]
  },
]

export const MOCK_NEWS = [
  { id: 1, title: "Bellingham Scores Late Winner in El Clasico Thriller", source: "BBC Sport", time: "32 min ago", category: "La Liga", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80", summary: "Jude Bellingham's 79th-minute strike sealed a dramatic 3-2 victory for Real Madrid over Barcelona in one of the most thrilling El Clasicos in recent memory." },
  { id: 2, title: "Premier League Title Race Heats Up as Arsenal Climb to Second", source: "Sky Sports", time: "1 hr ago", category: "Premier League", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80", summary: "Arsenal's 2-1 victory over Chelsea has reignited the title race, pulling them level on points with Liverpool at the top of the table." },
  { id: 3, title: "Simba SC Advance to CAF Champions League Group Stage", source: "Daily News TZ", time: "2 hrs ago", category: "Tanzania", image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&q=80", summary: "Simba SC secured their place in the CAF Champions League group stage with a comfortable 3-0 aggregate win over their Kenyan opponents." },
  { id: 4, title: "Haaland Returns from Injury, Set to Face PSG", source: "Guardian", time: "3 hrs ago", category: "Champions League", image: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=400&q=80", summary: "Erling Haaland has been declared fit and is expected to start for Manchester City in their crucial Champions League tie against PSG." },
  { id: 5, title: "FIFA World Cup 2026 Ticket Sales Open Next Month", source: "FIFA.com", time: "5 hrs ago", category: "World Cup", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80", summary: "FIFA has announced that ticket sales for the 2026 World Cup, co-hosted by USA, Canada, and Mexico, will open to the general public next month." },
  { id: 6, title: "Young Africans Sign Brazilian Striker in January Window", source: "Mwanaspoti", time: "6 hrs ago", category: "Tanzania", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", summary: "Young Africans have confirmed the signing of Brazilian forward Carlos Oliveira on a two-and-a-half year deal ahead of the second half of the season." },
  { id: 7, title: "Bundesliga: Bayern Munich Eye Der Klassiker Domination", source: "Kicker", time: "8 hrs ago", category: "Bundesliga", image: "https://images.unsplash.com/photo-1551958219-acbc595b3b08?w=400&q=80", summary: "Bayern Munich are preparing for a crucial Bundesliga clash against rivals Borussia Dortmund, with both sides level on points at the top." },
]

export const MOCK_TIPS = [
  { id: 1, match: "Arsenal vs Chelsea", league: "Premier League", tip: "Arsenal Win or Draw", odds: "1.45", bookmaker: "Betway", confidence: 85, analysis: "Arsenal's home record this season is outstanding with 11W 2D 0L. Chelsea struggle badly away from Stamford Bridge.", kickoff: "Today 20:00", verdict: "WIN" },
  { id: 2, match: "Real Madrid vs Barcelona", league: "La Liga", tip: "Both Teams to Score", odds: "1.72", bookmaker: "Bet365", confidence: 78, analysis: "El Clasico fixtures consistently deliver goals. Both teams averaging 2.4 goals per game this season.", kickoff: "Today 21:00", verdict: "WIN" },
  { id: 3, match: "Liverpool vs Man United", league: "Premier League", tip: "Liverpool Win", odds: "1.90", bookmaker: "1xBet", confidence: 72, analysis: "Liverpool are unbeaten at Anfield this season. Man United's away form has been very inconsistent.", kickoff: "Tomorrow 17:30", verdict: null },
  { id: 4, match: "PSG vs Bayern Munich", league: "Champions League", tip: "Over 2.5 Goals", odds: "1.65", bookmaker: "SportyBet", confidence: 80, analysis: "PSG home games average 3.1 goals. Bayern are the highest scoring team in Europe this season.", kickoff: "Tomorrow 21:00", verdict: null },
  { id: 5, match: "Simba SC vs Yanga", league: "Tanzania PL", tip: "Simba Win", odds: "2.10", bookmaker: "M-Bet", confidence: 68, analysis: "Simba SC have won their last 6 home games. Derby fixtures tend to strongly favor the home side.", kickoff: "Saturday 16:00", verdict: null },
]

export const TV_CHANNELS = [
  { id: 1, name: "Azam Sports 1", category: "Sports", platform: "Azam TV", emoji: "⚽", isLive: true, currentShow: "Premier League Live" },
  { id: 2, name: "Azam Sports 2", category: "Sports", platform: "Azam TV", emoji: "🏆", isLive: true, currentShow: "La Liga Highlights" },
  { id: 3, name: "Azam Sports 3", category: "Sports", platform: "Azam TV", emoji: "🎯", isLive: false, currentShow: "Tennis: Australian Open" },
  { id: 4, name: "SuperSport 1", category: "Sports", platform: "DSTV", emoji: "🏅", isLive: true, currentShow: "UEFA Champions League" },
  { id: 5, name: "SuperSport 2", category: "Sports", platform: "DSTV", emoji: "🥊", isLive: false, currentShow: "Cricket: SA vs ENG" },
  { id: 6, name: "SuperSport Blitz", category: "Sports", platform: "DSTV", emoji: "⚡", isLive: true, currentShow: "Sports News 24/7" },
  { id: 7, name: "ESPN", category: "Sports", platform: "DSTV", emoji: "🏈", isLive: true, currentShow: "SportsCenter" },
  { id: 8, name: "beIN Sports 1", category: "Sports", platform: "DSTV", emoji: "📺", isLive: true, currentShow: "Serie A Live" },
  { id: 9, name: "TBC 1", category: "News", platform: "Free-to-Air", emoji: "📡", isLive: true, currentShow: "Habari za Usiku" },
  { id: 10, name: "ITV Tanzania", category: "News", platform: "Free-to-Air", emoji: "🎙️", isLive: true, currentShow: "Prime News" },
  { id: 11, name: "Channel Ten", category: "News", platform: "Free-to-Air", emoji: "🔟", isLive: false, currentShow: "Morning Show" },
  { id: 12, name: "CNN International", category: "News", platform: "DSTV", emoji: "🌍", isLive: true, currentShow: "World News Now" },
  { id: 13, name: "BBC World News", category: "News", platform: "DSTV", emoji: "🎬", isLive: true, currentShow: "BBC World at One" },
  { id: 14, name: "Al Jazeera", category: "News", platform: "DSTV", emoji: "📰", isLive: true, currentShow: "Inside Story" },
  { id: 15, name: "Azam Uno", category: "Entertainment", platform: "Azam TV", emoji: "🎭", isLive: true, currentShow: "Bongo Movie" },
  { id: 16, name: "Azam Viu", category: "Entertainment", platform: "Azam TV", emoji: "🎥", isLive: false, currentShow: "African Drama" },
  { id: 17, name: "M-Net", category: "Entertainment", platform: "DSTV", emoji: "🍿", isLive: true, currentShow: "Hollywood Movie Night" },
  { id: 18, name: "Africa Magic", category: "Entertainment", platform: "DSTV", emoji: "✨", isLive: true, currentShow: "Nollywood Series" },
  { id: 19, name: "Cartoon Network", category: "Entertainment", platform: "DSTV", emoji: "🐣", isLive: true, currentShow: "Tom & Jerry" },
  { id: 20, name: "KBC Channel 1", category: "Entertainment", platform: "Free-to-Air", emoji: "📺", isLive: false, currentShow: "East African Drama" },
]
