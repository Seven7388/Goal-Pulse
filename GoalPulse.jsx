import { useState, useEffect, useCallback } from "react";

// ─── THEME & GLOBALS ───────────────────────────────────────────────────────────
const THEME = {
  dark: {
    bg: "#0a0e1a", card: "#111827", border: "#1f2937",
    text: "#f9fafb", muted: "#6b7280", accent: "#10b981",
    accentBg: "#064e3b", nav: "#0d1224", pill: "#1f2937",
    red: "#ef4444", yellow: "#f59e0b", blue: "#3b82f6",
    gradient: "linear-gradient(135deg, #064e3b 0%, #0a0e1a 100%)"
  },
  light: {
    bg: "#f0f4f8", card: "#ffffff", border: "#e5e7eb",
    text: "#111827", muted: "#6b7280", accent: "#059669",
    accentBg: "#d1fae5", nav: "#ffffff", pill: "#f3f4f6",
    red: "#dc2626", yellow: "#d97706", blue: "#2563eb",
    gradient: "linear-gradient(135deg, #d1fae5 0%, #f0f4f8 100%)"
  }
};

// ─── MOCK DATA (real-api-shaped, replace API_KEY with yours) ──────────────────
const LEAGUES = [
  { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "🇪🇸" },
  { id: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", flag: "🇮🇹" },
  { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", flag: "🇩🇪" },
  { id: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", flag: "🇫🇷" },
  { id: 2, name: "UEFA Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "🇪🇺" },
  { id: 595, name: "Tanzania Premier League", country: "Tanzania", logo: "https://media.api-sports.io/football/leagues/595.png", flag: "🇹🇿" },
];

const MOCK_MATCHES = [
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
      { date: "2022-11-06", home: "Chelsea", away: "Arsenal", score: "0-1" },
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
    stats: { possession: [0, 0], shots: [0, 0], shotsOnTarget: [0, 0], corners: [0, 0], fouls: [0, 0] },
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
];

const MOCK_NEWS = [
  { id: 1, title: "Bellingham Scores Late Winner in El Clasico Thriller", source: "BBC Sport", time: "32 min ago", category: "Champions League", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80", summary: "Jude Bellingham's 79th-minute strike sealed a dramatic 3-2 victory for Real Madrid over Barcelona in one of the most thrilling El Clasicos in recent memory." },
  { id: 2, title: "Premier League Title Race Heats Up as Arsenal Climb to Second", source: "Sky Sports", time: "1 hr ago", category: "Premier League", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80", summary: "Arsenal's 2-1 victory over Chelsea has reignited the title race, pulling them level on points with Liverpool at the top of the Premier League table." },
  { id: 3, title: "Simba SC Advance to CAF Champions League Group Stage", source: "Daily News TZ", time: "2 hrs ago", category: "Tanzania", image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&q=80", summary: "Simba SC secured their place in the CAF Champions League group stage with a comfortable 3-0 aggregate win over their Kenyan opponents." },
  { id: 4, title: "Haaland Returns from Injury, Set to Face PSG", source: "Guardian", time: "3 hrs ago", category: "Champions League", image: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=400&q=80", summary: "Erling Haaland has been declared fit and is expected to start for Manchester City in their crucial Champions League tie against PSG." },
  { id: 5, title: "FIFA World Cup 2026 Ticket Sales Open Next Month", source: "FIFA.com", time: "5 hrs ago", category: "World Cup", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80", summary: "FIFA has announced that ticket sales for the 2026 World Cup, co-hosted by USA, Canada, and Mexico, will open to the general public next month." },
  { id: 6, title: "Young Africans Sign Brazilian Striker in January Window", source: "Mwanaspoti", time: "6 hrs ago", category: "Tanzania", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", summary: "Young Africans have confirmed the signing of Brazilian forward Carlos Oliveira on a two-and-a-half year deal ahead of the second half of the season." },
];

const MOCK_TIPS = [
  { id: 1, match: "Arsenal vs Chelsea", league: "Premier League", tip: "Arsenal Win or Draw", odds: "1.45", bookmaker: "Betway", confidence: 85, analysis: "Arsenal's home record this season is outstanding with 11W 2D 0L. Chelsea struggle away from Stamford Bridge.", kickoff: "Today 20:00", verdict: "WIN" },
  { id: 2, match: "Real Madrid vs Barcelona", league: "La Liga", tip: "Both Teams to Score", odds: "1.72", bookmaker: "Bet365", confidence: 78, analysis: "El Clasico fixtures consistently deliver goals. Both teams averaging 2.4 goals per game this season.", kickoff: "Today 21:00", verdict: "WIN" },
  { id: 3, match: "Liverpool vs Man United", league: "Premier League", tip: "Liverpool Win", odds: "1.90", bookmaker: "1xBet", confidence: 72, analysis: "Liverpool are unbeaten at Anfield this season. Man United's away form has been inconsistent.", kickoff: "Tomorrow 17:30", verdict: null },
  { id: 4, match: "PSG vs Bayern Munich", league: "Champions League", tip: "Over 2.5 Goals", odds: "1.65", bookmaker: "SportyBet", confidence: 80, analysis: "PSG home games average 3.1 goals. Bayern are the highest scoring team in Europe this season.", kickoff: "Tomorrow 21:00", verdict: null },
  { id: 5, match: "Simba SC vs Yanga", league: "Tanzania PL", tip: "Simba Win", odds: "2.10", bookmaker: "M-Bet", confidence: 68, analysis: "Simba SC have won their last 6 home games. Derby fixtures tend to favor the home side.", kickoff: "Saturday 16:00", verdict: null },
];

const TV_CHANNELS = [
  // Sports
  { id: 1, name: "Azam Sports 1", category: "Sports", platform: "Azam TV", logo: "⚽", stream: "#", isLive: true, currentShow: "Premier League Live" },
  { id: 2, name: "Azam Sports 2", category: "Sports", platform: "Azam TV", logo: "🏆", stream: "#", isLive: true, currentShow: "La Liga Highlights" },
  { id: 3, name: "Azam Sports 3", category: "Sports", platform: "Azam TV", logo: "🎯", stream: "#", isLive: false, currentShow: "Tennis: Australian Open" },
  { id: 4, name: "SuperSport 1", category: "Sports", platform: "DSTV", logo: "🏅", stream: "#", isLive: true, currentShow: "UEFA Champions League" },
  { id: 5, name: "SuperSport 2", category: "Sports", platform: "DSTV", logo: "🥊", stream: "#", isLive: false, currentShow: "Cricket: SA vs ENG" },
  { id: 6, name: "SuperSport Blitz", category: "Sports", platform: "DSTV", logo: "⚡", stream: "#", isLive: true, currentShow: "Sports News 24/7" },
  { id: 7, name: "ESPN", category: "Sports", platform: "DSTV", logo: "🏈", stream: "#", isLive: true, currentShow: "SportsCenter" },
  { id: 8, name: "beIN Sports 1", category: "Sports", platform: "DSTV", logo: "📺", stream: "#", isLive: true, currentShow: "Serie A Live" },
  // News
  { id: 9, name: "TBC 1", category: "News", platform: "Free-to-Air", logo: "📡", stream: "#", isLive: true, currentShow: "Habari za Usiku" },
  { id: 10, name: "ITV Tanzania", category: "News", platform: "Free-to-Air", logo: "🎙️", stream: "#", isLive: true, currentShow: "Prime News" },
  { id: 11, name: "Channel Ten", category: "News", platform: "Free-to-Air", logo: "🔟", stream: "#", isLive: false, currentShow: "Morning Show" },
  { id: 12, name: "CNN International", category: "News", platform: "DSTV", logo: "🌍", stream: "#", isLive: true, currentShow: "World News Now" },
  { id: 13, name: "BBC World News", category: "News", platform: "DSTV", logo: "🎬", stream: "#", isLive: true, currentShow: "BBC World at One" },
  { id: 14, name: "Al Jazeera", category: "News", platform: "DSTV", logo: "📰", stream: "#", isLive: true, currentShow: "Inside Story" },
  // Entertainment
  { id: 15, name: "Azam Uno", category: "Entertainment", platform: "Azam TV", logo: "🎭", stream: "#", isLive: true, currentShow: "Bongo Movie" },
  { id: 16, name: "Azam Viu", category: "Entertainment", platform: "Azam TV", logo: "🎥", stream: "#", isLive: false, currentShow: "African Drama" },
  { id: 17, name: "M-Net", category: "Entertainment", platform: "DSTV", logo: "🍿", stream: "#", isLive: true, currentShow: "Hollywood Movie Night" },
  { id: 18, name: "Africa Magic", category: "Entertainment", platform: "DSTV", logo: "✨", stream: "#", isLive: true, currentShow: "Nollywood Series" },
  { id: 19, name: "Cartoon Network", category: "Entertainment", platform: "DSTV", logo: "🐣", stream: "#", isLive: true, currentShow: "Tom & Jerry" },
  { id: 20, name: "KBC Channel 1", category: "Entertainment", platform: "Free-to-Air", logo: "📺", stream: "#", isLive: false, currentShow: "East African Drama" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function TeamLogo({ logo, name, size = 28 }) {
  const [err, setErr] = useState(false);
  if (!logo || err) {
    return (
      <div style={{ width: size, height: size, borderRadius: 6, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, fontWeight: 700, color: "#6b7280", flexShrink: 0 }}>
        {name?.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return <img src={logo} alt={name} width={size} height={size} onError={() => setErr(true)} style={{ objectFit: "contain", flexShrink: 0 }} />;
}

function StatBar({ label, home, away, t }) {
  const total = home + away || 1;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: t.muted, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: t.accent }}>{home}</span>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color: t.blue }}>{away}</span>
      </div>
      <div style={{ height: 5, background: t.border, borderRadius: 3, overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${(home / total) * 100}%`, background: t.accent, borderRadius: "3px 0 0 3px", transition: "width 0.6s ease" }} />
        <div style={{ width: `${(away / total) * 100}%`, background: t.blue, borderRadius: "0 3px 3px 0", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function ConfidenceMeter({ value, t }) {
  const color = value >= 80 ? t.accent : value >= 65 ? t.yellow : t.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: t.border, borderRadius: 2 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GoalPulse() {
  const [theme, setTheme] = useState("dark");
  const [page, setPage] = useState("scores");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // "login" | "register"
  const [ticker, setTicker] = useState(0);
  const [activeLeague, setActiveLeague] = useState("all");
  const [tvFilter, setTvFilter] = useState("All");
  const [tvPlatform, setTvPlatform] = useState("All");
  const [settings, setSettings] = useState({ notifications: true, favoriteLeague: "39", language: "en", oddsFormat: "decimal" });

  const t = THEME[theme];

  // Animate live scores minute counter
  useEffect(() => {
    const iv = setInterval(() => setTicker(x => x + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
    .tab-btn { transition: all 0.2s; cursor: pointer; border: none; outline: none; }
    .tab-btn:hover { opacity: 0.85; }
    .match-card { transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
    .match-card:hover { transform: translateY(-2px); }
    .nav-item { transition: all 0.2s; cursor: pointer; }
    .pulse { animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .slide-in { animation: slideIn 0.3s ease; }
    @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .chip { display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all 0.2s; }
  `;

  const S = {
    app: { background: t.bg, minHeight: "100vh", color: t.text, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
    header: { background: t.nav, borderBottom: `1px solid ${t.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" },
    nav: { background: t.nav, borderTop: `1px solid ${t.border}`, display: "flex", position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 50 },
    navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0 8px", gap: 3, color: active ? t.accent : t.muted, fontSize: 10, fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", transition: "color 0.2s" }),
    card: { background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden", marginBottom: 10 },
    content: { flex: 1, overflowY: "auto", paddingBottom: 80, paddingTop: 0 },
  };

  // ── MATCH DETAIL ──────────────────────────────────────────────────────────
  if (selectedMatch) {
    const m = selectedMatch;
    const [openSection, setOpenSection] = useState("events");
    const toggle = (s) => setOpenSection(openSection === s ? null : s);

    const Section = ({ id, label, children }) => (
      <div style={S.card}>
        <button onClick={() => toggle(id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "transparent", border: "none", color: t.text, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          <span>{label}</span>
          <span style={{ color: t.muted, fontSize: 18, transform: openSection === id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
        </button>
        {openSection === id && <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${t.border}` }} className="slide-in">{children}</div>}
      </div>
    );

    return (
      <div style={S.app}>
        <style>{css}</style>
        {/* Back header */}
        <div style={{ ...S.header, background: t.nav }}>
          <button onClick={() => setSelectedMatch(null)} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back
          </button>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Match Details</span>
          <div style={{ width: 60 }} />
        </div>

        <div style={S.content}>
          {/* Score Hero */}
          <div style={{ background: `linear-gradient(135deg, ${t.accentBg} 0%, ${t.card} 100%)`, padding: "24px 20px", marginBottom: 10 }}>
            <div style={{ textAlign: "center", fontSize: 11, color: t.accent, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
              {LEAGUES.find(l => l.id === m.leagueId)?.name?.toUpperCase()} • {m.status === "live" ? <span className="pulse" style={{ color: t.red }}>● LIVE {m.minute}</span> : m.minute}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <TeamLogo logo={m.home.logo} name={m.home.name} size={52} />
                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif" }}>{m.home.name}</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 100 }}>
                {m.status !== "upcoming" ? (
                  <>
                    <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: -2 }}>
                      {m.home.score} – {m.away.score}
                    </div>
                    {m.htScore && <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>HT: {m.htScore}</div>}
                  </>
                ) : (
                  <div style={{ fontSize: 22, fontWeight: 700, color: t.muted }}>VS</div>
                )}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <TeamLogo logo={m.away.logo} name={m.away.name} size={52} />
                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif" }}>{m.away.name}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 12px" }}>
            {/* Key Events */}
            {m.events.length > 0 && (
              <Section id="events" label="⚡ Key Events">
                {m.events.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < m.events.length - 1 ? `1px solid ${t.border}` : "none" }}>
                    <span style={{ fontSize: 11, color: t.muted, width: 30, textAlign: "right" }}>{e.minute}'</span>
                    <span style={{ fontSize: 16 }}>{e.type === "goal" ? "⚽" : e.type === "yellow" ? "🟨" : e.type === "red" ? "🟥" : "🔄"}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{e.player}</span>
                      {e.assist && <span style={{ fontSize: 11, color: t.muted }}> (assist: {e.assist})</span>}
                    </div>
                    <span style={{ fontSize: 11, color: t.muted }}>{e.team === "home" ? m.home.name : m.away.name}</span>
                  </div>
                ))}
              </Section>
            )}

            {/* Match Stats */}
            <Section id="stats" label="📊 Match Statistics">
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{m.home.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.blue }}>{m.away.name}</span>
                </div>
                <StatBar label="Possession %" home={m.stats.possession[0]} away={m.stats.possession[1]} t={t} />
                <StatBar label="Total Shots" home={m.stats.shots[0]} away={m.stats.shots[1]} t={t} />
                <StatBar label="Shots on Target" home={m.stats.shotsOnTarget[0]} away={m.stats.shotsOnTarget[1]} t={t} />
                <StatBar label="Corners" home={m.stats.corners[0]} away={m.stats.corners[1]} t={t} />
                <StatBar label="Fouls" home={m.stats.fouls[0]} away={m.stats.fouls[1]} t={t} />
              </div>
            </Section>

            {/* Lineups */}
            {m.lineup.home.length > 0 && (
              <Section id="lineup" label="👕 Lineups">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, marginBottom: 8 }}>{m.home.name}</div>
                    {m.lineup.home.map((p, i) => (
                      <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: t.muted, width: 16 }}>{i + 1}</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.blue, marginBottom: 8 }}>{m.away.name}</div>
                    {m.lineup.away.map((p, i) => (
                      <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: t.muted, width: 16 }}>{i + 1}</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* H2H */}
            <Section id="h2h" label="🔁 Head to Head">
              <div style={{ marginTop: 12 }}>
                {m.h2h.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < m.h2h.length - 1 ? `1px solid ${t.border}` : "none", fontSize: 12 }}>
                    <span style={{ color: t.muted }}>{g.date}</span>
                    <span style={{ fontWeight: 600, flex: 1, textAlign: "center" }}>{g.home} vs {g.away}</span>
                    <span style={{ fontWeight: 700, color: t.accent, minWidth: 40, textAlign: "right" }}>{g.score}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    );
  }

  // ── SCORES PAGE ───────────────────────────────────────────────────────────
  const ScoresPage = () => {
    const filtered = activeLeague === "all" ? MOCK_MATCHES : MOCK_MATCHES.filter(m => m.leagueId === Number(activeLeague));
    const leaguesWithMatches = LEAGUES.filter(l => MOCK_MATCHES.some(m => m.leagueId === l.id));

    return (
      <div style={{ padding: "12px 12px 0" }} className="slide-in">
        {/* League filter chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          {[{ id: "all", name: "All", flag: "🌐" }, ...leaguesWithMatches].map(l => (
            <button key={l.id} className="chip" onClick={() => setActiveLeague(String(l.id))}
              style={{ background: activeLeague === String(l.id) ? t.accent : t.pill, color: activeLeague === String(l.id) ? "#fff" : t.muted, whiteSpace: "nowrap" }}>
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        {leaguesWithMatches.filter(l => activeLeague === "all" || l.id === Number(activeLeague)).map(league => {
          const matches = filtered.filter(m => m.leagueId === league.id);
          if (!matches.length) return null;
          return (
            <div key={league.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "0 4px" }}>
                <img src={league.logo} alt="" width={18} height={18} onError={e => e.target.style.display = "none"} />
                <span style={{ fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: 0.5 }}>{league.name.toUpperCase()}</span>
              </div>
              {matches.map(m => (
                <div key={m.id} className="match-card" style={S.card} onClick={() => setSelectedMatch(m)}>
                  <div style={{ padding: "14px 16px" }}>
                    {/* Status bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: m.status === "live" ? t.red : m.status === "finished" ? t.muted : t.accent }}>
                        {m.status === "live" ? <span className="pulse">● {m.minute}</span> : m.status === "finished" ? "FT" : m.minute}
                      </span>
                      {m.htScore && <span style={{ fontSize: 10, color: t.muted }}>HT {m.htScore}</span>}
                    </div>
                    {/* Teams */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[{ team: m.home, score: m.home.score }, { team: m.away, score: m.away.score }].map(({ team, score }, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <TeamLogo logo={team.logo} name={team.name} size={24} />
                          <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{team.name}</span>
                          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", minWidth: 20, textAlign: "right" }}>
                            {score !== null ? score : "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* H2H mini preview */}
                    {m.h2h.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${t.border}`, display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: t.muted }}>Last 3:</span>
                        {m.h2h.slice(0, 3).map((h, i) => (
                          <span key={i} style={{ fontSize: 10, background: t.pill, padding: "2px 6px", borderRadius: 4, color: t.text }}>{h.score}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // ── NEWS PAGE ─────────────────────────────────────────────────────────────
  const NewsPage = () => (
    <div style={{ padding: "12px" }} className="slide-in">
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
        {["All", "Premier League", "Champions League", "Tanzania", "World Cup"].map(cat => (
          <button key={cat} className="chip" style={{ background: cat === "All" ? t.accent : t.pill, color: cat === "All" ? "#fff" : t.muted, whiteSpace: "nowrap" }}>{cat}</button>
        ))}
      </div>
      {/* Featured */}
      <div style={{ ...S.card, marginBottom: 14 }}>
        <img src={MOCK_NEWS[0].image} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
        <div style={{ padding: "12px 14px" }}>
          <span style={{ fontSize: 10, background: t.accentBg, color: t.accent, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{MOCK_NEWS[0].category}</span>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>{MOCK_NEWS[0].title}</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>{MOCK_NEWS[0].summary}</div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>{MOCK_NEWS[0].source} · {MOCK_NEWS[0].time}</div>
        </div>
      </div>
      {MOCK_NEWS.slice(1).map(n => (
        <div key={n.id} style={{ ...S.card, cursor: "pointer" }}>
          <div style={{ display: "flex", gap: 12, padding: "12px 14px", alignItems: "center" }}>
            <img src={n.image} alt="" style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 10, background: t.accentBg, color: t.accent, padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>{n.category}</span>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>{n.source} · {n.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── TIPS PAGE ─────────────────────────────────────────────────────────────
  const TipsPage = () => (
    <div style={{ padding: "12px" }} className="slide-in">
      <div style={{ background: t.gradient, borderRadius: 14, padding: "16px", marginBottom: 14, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, color: t.accent, fontWeight: 700, marginBottom: 4 }}>TODAY'S RECORD</div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["2", "Wins", t.accent], ["0", "Losses", t.red], ["78%", "Rate", t.yellow]].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: t.muted }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {MOCK_TIPS.map(tip => (
        <div key={tip.id} style={S.card}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: t.muted }}>{tip.league}</span>
              <span style={{ fontSize: 11, color: t.muted }}>⏰ {tip.kickoff}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 8 }}>{tip.match}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ background: t.accentBg, color: t.accent, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>✓ {tip.tip}</span>
              <span style={{ background: t.pill, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>@ {tip.odds}</span>
              <span style={{ fontSize: 11, color: t.muted, marginLeft: "auto" }}>{tip.bookmaker}</span>
            </div>
            <ConfidenceMeter value={tip.confidence} t={t} />
            <div style={{ fontSize: 12, color: t.muted, marginTop: 8, lineHeight: 1.5 }}>{tip.analysis}</div>
            {tip.verdict && (
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: tip.verdict === "WIN" ? t.accentBg : "#fee2e2", color: tip.verdict === "WIN" ? t.accent : t.red, padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                {tip.verdict === "WIN" ? "✅" : "❌"} {tip.verdict}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // ── TV PAGE ───────────────────────────────────────────────────────────────
  const TVPage = () => {
    const cats = ["All", "Sports", "News", "Entertainment"];
    const platforms = ["All", "Azam TV", "DSTV", "Free-to-Air"];
    const filtered = TV_CHANNELS.filter(ch =>
      (tvFilter === "All" || ch.category === tvFilter) &&
      (tvPlatform === "All" || ch.platform === tvPlatform)
    );
    return (
      <div style={{ padding: "12px" }} className="slide-in">
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {cats.map(c => (
            <button key={c} className="chip" onClick={() => setTvFilter(c)}
              style={{ background: tvFilter === c ? t.accent : t.pill, color: tvFilter === c ? "#fff" : t.muted, whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          {platforms.map(p => (
            <button key={p} className="chip" onClick={() => setTvPlatform(p)}
              style={{ background: tvPlatform === p ? t.blue : t.pill, color: tvPlatform === p ? "#fff" : t.muted, whiteSpace: "nowrap" }}>{p}</button>
          ))}
        </div>
        {filtered.map(ch => (
          <div key={ch.id} style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: t.pill, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{ch.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.currentShow}</div>
                <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{ch.platform}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                {ch.isLive && <span className="pulse" style={{ fontSize: 10, color: t.red, fontWeight: 700 }}>● LIVE</span>}
                <button style={{ background: t.accent, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Watch</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── SETTINGS PAGE ─────────────────────────────────────────────────────────
  const SettingsPage = () => {
    const [localSettings, setLocalSettings] = useState(settings);
    const Row = ({ label, children }) => (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 14 }}>{label}</span>
        {children}
      </div>
    );
    const Toggle = ({ value, onChange }) => (
      <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: value ? t.accent : t.border, position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: value ? 22 : 2, transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
      </div>
    );
    return (
      <div style={{ padding: "12px" }} className="slide-in">
        {user ? (
          <div style={{ ...S.card, padding: "16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: t.muted }}>{user.email}</div>
            </div>
            <button onClick={() => setUser(null)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 12px", color: t.muted, cursor: "pointer", fontSize: 12 }}>Logout</button>
          </div>
        ) : (
          <div style={{ ...S.card, padding: "16px", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: t.muted, marginBottom: 12 }}>Sign in to sync your preferences</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setAuthModal("login")} style={{ background: t.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>Login</button>
              <button onClick={() => setAuthModal("register")} style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>Register</button>
            </div>
          </div>
        )}

        <div style={S.card}>
          <div style={{ padding: "0 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 1, padding: "12px 0 4px" }}>APPEARANCE</div>
            <Row label="🌙 Dark Mode"><Toggle value={theme === "dark"} onChange={() => setTheme(theme === "dark" ? "light" : "dark")} /></Row>
            <Row label="🔔 Notifications"><Toggle value={localSettings.notifications} onChange={() => setLocalSettings(s => ({ ...s, notifications: !s.notifications }))} /></Row>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 1, padding: "12px 0 4px" }}>PREFERENCES</div>
            <Row label="⚽ Favorite League">
              <select value={localSettings.favoriteLeague} onChange={e => setLocalSettings(s => ({ ...s, favoriteLeague: e.target.value }))}
                style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                {LEAGUES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </Row>
            <Row label="💰 Odds Format">
              <select value={localSettings.oddsFormat} onChange={e => setLocalSettings(s => ({ ...s, oddsFormat: e.target.value }))}
                style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                <option value="decimal">Decimal (1.90)</option>
                <option value="fractional">Fractional (9/10)</option>
                <option value="american">American (-110)</option>
              </select>
            </Row>
            <Row label="🌐 Language">
              <select value={localSettings.language} onChange={e => setLocalSettings(s => ({ ...s, language: e.target.value }))}
                style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
            </Row>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 1, padding: "12px 0 4px" }}>ABOUT</div>
            <Row label="📱 Version"><span style={{ color: t.muted, fontSize: 13 }}>GoalPulse v1.0.0</span></Row>
            <Row label="📝 Privacy Policy"><span style={{ color: t.accent, fontSize: 13, cursor: "pointer" }}>View →</span></Row>
            <Row label="❓ Help & Support"><span style={{ color: t.accent, fontSize: 13, cursor: "pointer" }}>Contact →</span></Row>
            <div style={{ paddingBottom: 4 }} />
          </div>
        </div>
        <button onClick={() => { setSettings(localSettings); }} style={{ width: "100%", background: t.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 12 }}>Save Settings</button>
      </div>
    );
  };

  // ── AUTH MODAL ────────────────────────────────────────────────────────────
  const AuthModal = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const isLogin = authModal === "login";
    const submit = () => {
      if (form.email && form.password) {
        setUser({ name: form.name || form.email.split("@")[0], email: form.email });
        setAuthModal(null);
      }
    };
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ background: t.card, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }} className="slide-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>{isLogin ? "Welcome Back" : "Create Account"}</span>
            <button onClick={() => setAuthModal(null)} style={{ background: "none", border: "none", color: t.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>
          {!isLogin && (
            <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ width: "100%", background: t.pill, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, marginBottom: 12, outline: "none" }} />
          )}
          <input placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ width: "100%", background: t.pill, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, marginBottom: 12, outline: "none" }} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={{ width: "100%", background: t.pill, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, marginBottom: 20, outline: "none" }} />
          <button onClick={submit} style={{ width: "100%", background: t.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 12 }}>
            {isLogin ? "Login" : "Create Account"}
          </button>
          <div style={{ textAlign: "center", fontSize: 13, color: t.muted }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setAuthModal(isLogin ? "register" : "login")} style={{ color: t.accent, cursor: "pointer", fontWeight: 600 }}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const NAV = [
    { id: "scores", icon: "⚽", label: "Scores" },
    { id: "news", icon: "📰", label: "News" },
    { id: "tips", icon: "📈", label: "Tips" },
    { id: "tv", icon: "📺", label: "Live TV" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const pageTitle = { scores: "GoalPulse ⚡", news: "News", tips: "Betting Tips", tv: "Live TV", settings: "Settings" };

  return (
    <div style={S.app}>
      <style>{css}</style>

      {/* Header */}
      <div style={S.header}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: t.accent, letterSpacing: 0.5 }}>
          {pageTitle[page]}
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {page === "scores" && (
            <span className="pulse" style={{ fontSize: 11, color: t.red, fontWeight: 700 }}>● {MOCK_MATCHES.filter(m => m.status === "live").length} LIVE</span>
          )}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ background: t.pill, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {!user && (
            <button onClick={() => setAuthModal("login")}
              style={{ background: t.accent, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
              Login
            </button>
          )}
          {user && (
            <div style={{ width: 32, height: 32, borderRadius: 16, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>
              {user.name[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={S.content}>
        {page === "scores" && <ScoresPage />}
        {page === "news" && <NewsPage />}
        {page === "tips" && <TipsPage />}
        {page === "tv" && <TVPage />}
        {page === "settings" && <SettingsPage />}
      </div>

      {/* Bottom Nav */}
      <nav style={S.nav}>
        {NAV.map(n => (
          <button key={n.id} className="nav-item" style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span>{n.label}</span>
            {page === n.id && <div style={{ width: 20, height: 3, borderRadius: 2, background: t.accent, marginTop: 1 }} />}
          </button>
        ))}
      </nav>

      {/* Auth Modal */}
      {authModal && <AuthModal />}
    </div>
  );
}
