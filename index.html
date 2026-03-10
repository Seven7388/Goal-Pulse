import { useState, useEffect } from 'react'
import { usePWA } from './hooks/usePWA'
import { useLocalStorage } from './hooks/useLocalStorage'
import { LEAGUES, MOCK_MATCHES, MOCK_NEWS, MOCK_TIPS, TV_CHANNELS } from './data'

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEME = {
  dark: { bg: '#0a0e1a', card: '#111827', border: '#1f2937', text: '#f9fafb', muted: '#6b7280', accent: '#10b981', accentBg: '#064e3b', accentLight: '#d1fae5', nav: '#0d1224', pill: '#1f2937', red: '#ef4444', yellow: '#f59e0b', blue: '#3b82f6' },
  light: { bg: '#f0f4f8', card: '#ffffff', border: '#e5e7eb', text: '#111827', muted: '#6b7280', accent: '#059669', accentBg: '#d1fae5', accentLight: '#059669', nav: '#ffffff', pill: '#f3f4f6', red: '#dc2626', yellow: '#d97706', blue: '#2563eb' },
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function TeamLogo({ logo, name, size = 28 }: { logo: string; name: string; size?: number }) {
  const [err, setErr] = useState(false)
  if (!logo || err) return (
    <div style={{ width: size, height: size, borderRadius: 6, background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
      {name?.slice(0, 2).toUpperCase()}
    </div>
  )
  return <img src={logo} alt={name} width={size} height={size} onError={() => setErr(true)} style={{ objectFit: 'contain', flexShrink: 0 }} />
}

function StatBar({ label, home, away, t }: { label: string; home: number; away: number; t: typeof THEME.dark }) {
  const total = home + away || 1
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.muted, marginBottom: 5 }}>
        <span style={{ fontWeight: 700, color: t.accent, minWidth: 24 }}>{home}</span>
        <span style={{ textAlign: 'center', flex: 1 }}>{label}</span>
        <span style={{ fontWeight: 700, color: t.blue, minWidth: 24, textAlign: 'right' }}>{away}</span>
      </div>
      <div style={{ height: 5, background: t.border, borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${(home / total) * 100}%`, background: t.accent, transition: 'width 0.7s ease' }} />
        <div style={{ width: `${(away / total) * 100}%`, background: t.blue, transition: 'width 0.7s ease' }} />
      </div>
    </div>
  )
}

function Toggle({ value, onChange, t }: { value: boolean; onChange: () => void; t: typeof THEME.dark }) {
  return (
    <div onClick={onChange} style={{ width: 46, height: 26, borderRadius: 13, background: value ? t.accent : t.border, position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 2, left: value ? 22 : 2, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', background: active ? color : '#1f2937', color: active ? '#fff' : '#9ca3af', transition: 'all 0.2s' }}>
      {label}
    </button>
  )
}

// ─── MATCH DETAIL PAGE ────────────────────────────────────────────────────────
function MatchDetail({ match: m, onBack, t }: { match: any; onBack: () => void; t: typeof THEME.dark }) {
  const [open, setOpen] = useState<string>('events')
  const toggle = (s: string) => setOpen(open === s ? '' : s)

  const Section = ({ id, icon, label, children }: { id: string; icon: string; label: string; children: React.ReactNode }) => (
    <div style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, marginBottom: 10, overflow: 'hidden' }}>
      <button onClick={() => toggle(id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'transparent', border: 'none', color: t.text, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
        <span>{icon} {label}</span>
        <span style={{ color: t.muted, transform: open === id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: 18 }}>⌄</span>
      </button>
      {open === id && <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${t.border}` }} className="slide-up">{children}</div>}
    </div>
  )

  const league = LEAGUES.find(l => l.id === m.leagueId)

  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text }}>
      {/* Header */}
      <div style={{ background: t.nav, borderBottom: `1px solid ${t.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: t.accent, cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
        <span style={{ fontWeight: 700, fontSize: 14, flex: 1, textAlign: 'center' }}>Match Details</span>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ overflowY: 'auto', paddingBottom: 20 }} className="scroll-y">
        {/* Score Hero */}
        <div style={{ background: `linear-gradient(160deg, ${t.accentBg} 0%, ${t.card} 100%)`, padding: '24px 20px 20px', marginBottom: 12 }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: t.accent, fontWeight: 700, marginBottom: 18, letterSpacing: 1 }}>
            {league?.flag} {league?.name?.toUpperCase()} {m.status === 'live' && <span className="pulse" style={{ color: t.red }}>• LIVE {m.minute}</span>}
            {m.status === 'finished' && ' • FULL TIME'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <TeamLogo logo={m.home.logo} name={m.home.name} size={56} />
              <div style={{ marginTop: 8, fontWeight: 800, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.2 }}>{m.home.name}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 110 }}>
              {m.status !== 'upcoming' ? (
                <>
                  <div style={{ fontSize: 46, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: -3, lineHeight: 1 }}>
                    {m.home.score} – {m.away.score}
                  </div>
                  {m.htScore && <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>HT {m.htScore}</div>}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: t.muted, marginBottom: 4 }}>Kick Off</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: t.accent, fontFamily: "'Barlow Condensed', sans-serif" }}>{m.minute}</div>
                </>
              )}
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <TeamLogo logo={m.away.logo} name={m.away.name} size={56} />
              <div style={{ marginTop: 8, fontWeight: 800, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.2 }}>{m.away.name}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 12px' }}>
          {/* Events */}
          {m.events.length > 0 && (
            <Section id="events" icon="⚡" label="Key Events">
              {m.events.map((e: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < m.events.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <span style={{ fontSize: 11, color: t.muted, width: 28, textAlign: 'right', flexShrink: 0 }}>{e.minute}'</span>
                  <span style={{ fontSize: 18 }}>{e.type === 'goal' ? '⚽' : e.type === 'yellow' ? '🟨' : e.type === 'red' ? '🟥' : '🔄'}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{e.player}</span>
                    {e.assist && <div style={{ fontSize: 11, color: t.muted }}>Assist: {e.assist}</div>}
                  </div>
                  <span style={{ fontSize: 11, color: t.muted, flexShrink: 0 }}>{e.team === 'home' ? m.home.name : m.away.name}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Stats */}
          <Section id="stats" icon="📊" label="Match Statistics">
            <div style={{ paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{m.home.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.blue }}>{m.away.name}</span>
              </div>
              <StatBar label="Possession %" home={m.stats.possession[0]} away={m.stats.possession[1]} t={t} />
              <StatBar label="Total Shots" home={m.stats.shots[0]} away={m.stats.shots[1]} t={t} />
              <StatBar label="On Target" home={m.stats.shotsOnTarget[0]} away={m.stats.shotsOnTarget[1]} t={t} />
              <StatBar label="Corners" home={m.stats.corners[0]} away={m.stats.corners[1]} t={t} />
              <StatBar label="Fouls" home={m.stats.fouls[0]} away={m.stats.fouls[1]} t={t} />
            </div>
          </Section>

          {/* Lineups */}
          {m.lineup.home.length > 0 && (
            <Section id="lineup" icon="👕" label="Lineups">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 12 }}>
                {[{ team: m.home, players: m.lineup.home, color: t.accent }, { team: m.away, players: m.lineup.away, color: t.blue }].map(({ team, players, color }) => (
                  <div key={team.name}>
                    <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8 }}>{team.name}</div>
                    {players.map((p: string, i: number) => (
                      <div key={i} style={{ fontSize: 12, padding: '5px 0', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 6 }}>
                        <span style={{ color: t.muted, width: 16, fontSize: 10 }}>{i + 1}</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* H2H */}
          <Section id="h2h" icon="🔁" label="Head to Head">
            <div style={{ paddingTop: 8 }}>
              {m.h2h.map((g: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: i < m.h2h.length - 1 ? `1px solid ${t.border}` : 'none', fontSize: 12 }}>
                  <span style={{ color: t.muted, flexShrink: 0 }}>{g.date}</span>
                  <span style={{ flex: 1, textAlign: 'center', fontWeight: 500 }}>{g.home} vs {g.away}</span>
                  <span style={{ fontWeight: 800, color: t.accent, flexShrink: 0, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15 }}>{g.score}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useLocalStorage<'dark' | 'light'>('gp-theme', 'dark')
  const [page, setPage] = useState('scores')
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [user, setUser] = useLocalStorage<any>('gp-user', null)
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null)
  const [activeLeague, setActiveLeague] = useState('all')
  const [tvFilter, setTvFilter] = useState('All')
  const [tvPlatform, setTvPlatform] = useState('All')
  const [newsCategory, setNewsCategory] = useState('All')
  const [settings, setSettings] = useLocalStorage('gp-settings', { notifications: true, favoriteLeague: '39', language: 'en', oddsFormat: 'decimal' })
  const [offlineBanner, setOfflineBanner] = useState(false)
  const { isOnline, canInstall, install, notifPermission, requestNotifications, sendNotification } = usePWA()
  const t = THEME[themeKey]

  // Detect offline
  useEffect(() => {
    if (!isOnline) setOfflineBanner(true)
    else setOfflineBanner(false)
  }, [isOnline])

  // Auto dark mode from system
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const saved = localStorage.getItem('gp-theme')
    if (!saved) setThemeKey(mq.matches ? 'dark' : 'light')
  }, [])

  // Simulate live score notification
  useEffect(() => {
    if (notifPermission === 'granted') {
      const t2 = setTimeout(() => sendNotification('⚽ GoalPulse', 'Havertz scores! Arsenal 2-1 Chelsea (67\')'), 8000)
      return () => clearTimeout(t2)
    }
  }, [notifPermission])

  if (selectedMatch) {
    return <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} t={t} />
  }

  const S = {
    app: { background: t.bg, height: '100dvh', color: t.text, display: 'flex', flexDirection: 'column' as const, fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: '0 auto', position: 'relative' as const, overflow: 'hidden' },
    header: { background: t.nav, borderBottom: `1px solid ${t.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 },
    content: { flex: 1, overflowY: 'auto' as const, scrollbarWidth: 'none' as const },
    nav: { background: t.nav, borderTop: `1px solid ${t.border}`, display: 'flex', flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
    navItem: (active: boolean) => ({ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', gap: 2, color: active ? t.accent : t.muted, fontSize: 10, fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }),
    card: { background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, overflow: 'hidden', marginBottom: 10 },
  }

  // ── SCORES ──────────────────────────────────────────────────────────────────
  const ScoresPage = () => {
    const leaguesWithMatches = LEAGUES.filter(l => MOCK_MATCHES.some(m => m.leagueId === l.id))
    const filtered = activeLeague === 'all' ? MOCK_MATCHES : MOCK_MATCHES.filter(m => m.leagueId === Number(activeLeague))

    return (
      <div style={{ padding: '12px 12px 0' }} className="slide-up">
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          <Chip label="🌐 All" active={activeLeague === 'all'} color={t.accent} onClick={() => setActiveLeague('all')} />
          {leaguesWithMatches.map(l => (
            <Chip key={l.id} label={`${l.flag} ${l.name}`} active={activeLeague === String(l.id)} color={t.accent} onClick={() => setActiveLeague(String(l.id))} />
          ))}
        </div>

        {leaguesWithMatches.filter(l => activeLeague === 'all' || l.id === Number(activeLeague)).map(league => {
          const matches = filtered.filter(m => m.leagueId === league.id)
          if (!matches.length) return null
          return (
            <div key={league.id} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '0 2px' }}>
                <img src={league.logo} alt="" width={16} height={16} onError={(e: any) => e.target.style.display = 'none'} style={{ objectFit: 'contain' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 0.8 }}>{league.name.toUpperCase()}</span>
                <span style={{ fontSize: 10, color: t.muted }}>{league.flag}</span>
              </div>
              {matches.map(m => (
                <div key={m.id} style={{ ...S.card, cursor: 'pointer', transition: 'transform 0.15s' }}
                  onClick={() => setSelectedMatch(m)}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: m.status === 'live' ? t.red : m.status === 'finished' ? t.muted : t.accent }}>
                        {m.status === 'live' ? <span className="pulse">● {m.minute}</span> : m.status === 'finished' ? '✓ FT' : `⏰ ${m.minute}`}
                      </span>
                      {m.htScore && <span style={{ fontSize: 10, color: t.muted, background: t.pill, padding: '2px 6px', borderRadius: 4 }}>HT {m.htScore}</span>}
                    </div>
                    {[{ team: m.home }, { team: m.away }].map(({ team }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i === 0 ? 7 : 0 }}>
                        <TeamLogo logo={team.logo} name={team.name} size={26} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{team.name}</span>
                        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", minWidth: 20, textAlign: 'right' }}>
                          {team.score !== null ? team.score : '—'}
                        </span>
                      </div>
                    ))}
                    {m.h2h.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: t.muted }}>H2H:</span>
                        {m.h2h.slice(0, 3).map((h: any, i: number) => (
                          <span key={i} style={{ fontSize: 10, background: t.pill, padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>{h.score}</span>
                        ))}
                        <span style={{ fontSize: 10, color: t.muted, marginLeft: 'auto' }}>Tap for details →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  // ── NEWS ─────────────────────────────────────────────────────────────────────
  const NewsPage = () => {
    const cats = ['All', 'Premier League', 'Champions League', 'Tanzania', 'Bundesliga', 'World Cup']
    const filtered = newsCategory === 'All' ? MOCK_NEWS : MOCK_NEWS.filter(n => n.category === newsCategory)
    return (
      <div style={{ padding: '12px' }} className="slide-up">
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          {cats.map(c => <Chip key={c} label={c} active={newsCategory === c} color={t.accent} onClick={() => setNewsCategory(c)} />)}
        </div>
        {filtered.length > 0 && (
          <div style={{ ...S.card, marginBottom: 14, cursor: 'pointer' }}>
            <img src={filtered[0].image} alt="" style={{ width: '100%', height: 190, objectFit: 'cover' }} />
            <div style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10, background: t.accentBg, color: t.accent, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{filtered[0].category}</span>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, marginTop: 8, lineHeight: 1.2 }}>{filtered[0].title}</div>
              <div style={{ fontSize: 12, color: t.muted, marginTop: 6, lineHeight: 1.6 }}>{filtered[0].summary}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>{filtered[0].source} · {filtered[0].time}</div>
            </div>
          </div>
        )}
        {filtered.slice(1).map(n => (
          <div key={n.id} style={{ ...S.card, cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'center' }}>
              <img src={n.image} alt="" style={{ width: 76, height: 76, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 10, background: t.accentBg, color: t.accent, padding: '1px 7px', borderRadius: 8, fontWeight: 700 }}>{n.category}</span>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 5, lineHeight: 1.35 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 5 }}>{n.source} · {n.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── TIPS ─────────────────────────────────────────────────────────────────────
  const TipsPage = () => {
    const wins = MOCK_TIPS.filter(t2 => t2.verdict === 'WIN').length
    const losses = MOCK_TIPS.filter(t2 => t2.verdict === 'LOSS').length
    return (
      <div style={{ padding: '12px' }} className="slide-up">
        <div style={{ background: `linear-gradient(135deg, ${t.accentBg}, ${t.card})`, borderRadius: 14, padding: '16px 20px', marginBottom: 14, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>TODAY'S RECORD</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[[String(wins), 'Wins', t.accent], [String(losses), 'Losses', t.red], ['78%', 'Accuracy', t.yellow]].map(([v, l, c]) => (
              <div key={l as string} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: c as string }}>{v}</div>
                <div style={{ fontSize: 11, color: t.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {MOCK_TIPS.map(tip => (
          <div key={tip.id} style={S.card}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: t.muted }}>{tip.league}</span>
                <span style={{ fontSize: 11, color: t.muted }}>⏰ {tip.kickoff}</span>
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{tip.match}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ background: t.accentBg, color: t.accent, padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>✓ {tip.tip}</span>
                <span style={{ background: t.pill, padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: t.text }}>@ {tip.odds}</span>
                <span style={{ background: t.pill, padding: '5px 12px', borderRadius: 8, fontSize: 11, color: t.muted }}>{tip.bookmaker}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, height: 5, background: t.border, borderRadius: 3 }}>
                  <div style={{ width: `${tip.confidence}%`, height: '100%', background: tip.confidence >= 80 ? t.accent : tip.confidence >= 65 ? t.yellow : t.red, borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: tip.confidence >= 80 ? t.accent : t.yellow, minWidth: 32 }}>{tip.confidence}%</span>
              </div>
              <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.6 }}>{tip.analysis}</div>
              {tip.verdict && (
                <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, background: tip.verdict === 'WIN' ? t.accentBg : '#fee2e2', color: tip.verdict === 'WIN' ? t.accent : t.red, padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  {tip.verdict === 'WIN' ? '✅' : '❌'} {tip.verdict}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── TV ───────────────────────────────────────────────────────────────────────
  const TVPage = () => {
    const cats = ['All', 'Sports', 'News', 'Entertainment']
    const platforms = ['All', 'Azam TV', 'DSTV', 'Free-to-Air']
    const filtered = TV_CHANNELS.filter(ch =>
      (tvFilter === 'All' || ch.category === tvFilter) &&
      (tvPlatform === 'All' || ch.platform === tvPlatform)
    )
    return (
      <div style={{ padding: '12px' }} className="slide-up">
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
          {cats.map(c => <Chip key={c} label={c} active={tvFilter === c} color={t.accent} onClick={() => setTvFilter(c)} />)}
        </div>
        <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          {platforms.map(p => <Chip key={p} label={p} active={tvPlatform === p} color={t.blue} onClick={() => setTvPlatform(p)} />)}
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginBottom: 10 }}>{filtered.length} channels</div>
        {filtered.map(ch => (
          <div key={ch.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: t.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{ch.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ch.name}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.currentShow}</div>
                <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{ch.platform}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {ch.isLive && <span className="pulse" style={{ fontSize: 10, color: t.red, fontWeight: 700 }}>● LIVE</span>}
                <button style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Watch</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  const SettingsPage = () => {
    const [local, setLocal] = useState(settings)
    const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${t.border}` }}>
        <div><div style={{ fontSize: 14 }}>{label}</div>{sub && <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{sub}</div>}</div>
        {children}
      </div>
    )
    return (
      <div style={{ padding: '12px' }} className="slide-up">
        {/* Profile card */}
        {user ? (
          <div style={{ ...S.card, padding: '16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: t.muted }}>{user.email}</div>
              <div style={{ fontSize: 11, color: t.accent, marginTop: 2 }}>⭐ GoalPulse Member</div>
            </div>
            <button onClick={() => setUser(null)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 12px', color: t.muted, cursor: 'pointer', fontSize: 12 }}>Logout</button>
          </div>
        ) : (
          <div style={{ ...S.card, padding: '20px', marginBottom: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👤</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Join GoalPulse</div>
            <div style={{ fontSize: 13, color: t.muted, marginBottom: 16 }}>Sync preferences, follow your teams & get alerts</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setAuthModal('login')} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Login</button>
              <button onClick={() => setAuthModal('register')} style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Register</button>
            </div>
          </div>
        )}

        {/* Install PWA */}
        {canInstall && (
          <div style={{ background: `linear-gradient(135deg, ${t.accentBg}, ${t.card})`, borderRadius: 14, padding: '16px', marginBottom: 14, border: `1px solid ${t.accent}` }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>📲 Install GoalPulse</div>
            <div style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>Add to your home screen for the best experience</div>
            <button onClick={install} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Install App</button>
          </div>
        )}

        <div style={S.card}>
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: 1.2, padding: '14px 0 4px' }}>APPEARANCE</div>
            <Row label="🌙 Dark Mode" sub="Switch between dark and light theme">
              <Toggle value={themeKey === 'dark'} onChange={() => setThemeKey(themeKey === 'dark' ? 'light' : 'dark')} t={t} />
            </Row>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: 1.2, padding: '14px 0 4px' }}>NOTIFICATIONS</div>
            <Row label="🔔 Push Notifications" sub={notifPermission === 'granted' ? 'Enabled' : 'Tap to enable'}>
              <Toggle value={notifPermission === 'granted'} onChange={requestNotifications} t={t} />
            </Row>
            <Row label="⚽ Goal Alerts" sub="Get notified for goals"><Toggle value={local.notifications} onChange={() => setLocal(s => ({ ...s, notifications: !s.notifications }))} t={t} /></Row>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: 1.2, padding: '14px 0 4px' }}>PREFERENCES</div>
            <Row label="🏆 Favorite League">
              <select value={local.favoriteLeague} onChange={e => setLocal(s => ({ ...s, favoriteLeague: e.target.value }))} style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                {LEAGUES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
              </select>
            </Row>
            <Row label="💰 Odds Format">
              <select value={local.oddsFormat} onChange={e => setLocal(s => ({ ...s, oddsFormat: e.target.value }))} style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                <option value="decimal">Decimal (1.90)</option>
                <option value="fractional">Fractional (9/10)</option>
                <option value="american">American (-110)</option>
              </select>
            </Row>
            <Row label="🌐 Language">
              <select value={local.language} onChange={e => setLocal(s => ({ ...s, language: e.target.value }))} style={{ background: t.pill, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
            </Row>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: 1.2, padding: '14px 0 4px' }}>ABOUT</div>
            <Row label="📱 Version"><span style={{ color: t.muted, fontSize: 13 }}>1.0.0</span></Row>
            <Row label="🌍 Website"><span style={{ color: t.accent, fontSize: 13, cursor: 'pointer' }}>goalpulse.app →</span></Row>
            <Row label="📝 Privacy Policy"><span style={{ color: t.accent, fontSize: 13, cursor: 'pointer' }}>View →</span></Row>
            <Row label="❓ Support"><span style={{ color: t.accent, fontSize: 13, cursor: 'pointer' }}>Contact →</span></Row>
            <div style={{ paddingBottom: 4 }} />
          </div>
        </div>
        <button onClick={() => { setSettings(local) }} style={{ width: '100%', background: t.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 12 }}>💾 Save Settings</button>
      </div>
    )
  }

  // ── AUTH MODAL ────────────────────────────────────────────────────────────────
  const AuthModal = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const isLogin = authModal === 'login'
    const submit = () => {
      if (form.email && form.password) {
        setUser({ name: form.name || form.email.split('@')[0], email: form.email, joined: new Date().toISOString() })
        setAuthModal(null)
      }
    }
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setAuthModal(null)}>
        <div style={{ background: t.card, borderRadius: '22px 22px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480, border: `1px solid ${t.border}` }} className="slide-up" onClick={e => e.stopPropagation()}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: t.border, margin: '0 auto 20px' }} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
            {isLogin ? '👋 Welcome Back' : '🚀 Create Account'}
          </div>
          {!isLogin && (
            <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ width: '100%', background: t.pill, border: `1px solid ${t.border}`, borderRadius: 12, padding: '13px 16px', color: t.text, fontSize: 14, marginBottom: 12, outline: 'none' }} />
          )}
          <input placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ width: '100%', background: t.pill, border: `1px solid ${t.border}`, borderRadius: 12, padding: '13px 16px', color: t.text, fontSize: 14, marginBottom: 12, outline: 'none' }} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={{ width: '100%', background: t.pill, border: `1px solid ${t.border}`, borderRadius: 12, padding: '13px 16px', color: t.text, fontSize: 14, marginBottom: 20, outline: 'none' }} />
          <button onClick={submit} style={{ width: '100%', background: t.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 14 }}>
            {isLogin ? 'Login →' : 'Create Account →'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 13, color: t.muted }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => setAuthModal(isLogin ? 'register' : 'login')} style={{ color: t.accent, cursor: 'pointer', fontWeight: 700 }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const NAV = [
    { id: 'scores', icon: '⚽', label: 'Scores' },
    { id: 'news', icon: '📰', label: 'News' },
    { id: 'tips', icon: '📈', label: 'Tips' },
    { id: 'tv', icon: '📺', label: 'Live TV' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  const liveCount = MOCK_MATCHES.filter(m => m.status === 'live').length

  return (
    <div style={S.app}>
      {/* Offline Banner */}
      {offlineBanner && (
        <div style={{ background: t.yellow, color: '#000', textAlign: 'center', padding: '8px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          📴 You're offline — showing cached data
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: t.accent, letterSpacing: 0.5 }}>GoalPulse</span>
          <span style={{ fontSize: 16 }}>⚡</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {page === 'scores' && liveCount > 0 && (
            <span className="pulse" style={{ fontSize: 11, color: t.red, fontWeight: 700 }}>● {liveCount} LIVE</span>
          )}
          <button onClick={() => setThemeKey(themeKey === 'dark' ? 'light' : 'dark')}
            style={{ background: t.pill, border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
            {themeKey === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <div onClick={() => setPage('settings')} style={{ width: 34, height: 34, borderRadius: 17, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, cursor: 'pointer' }}>
              {user.name[0].toUpperCase()}
            </div>
          ) : (
            <button onClick={() => setAuthModal('login')} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Login</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={S.content} className="scroll-y">
        {page === 'scores' && <ScoresPage />}
        {page === 'news' && <NewsPage />}
        {page === 'tips' && <TipsPage />}
        {page === 'tv' && <TVPage />}
        {page === 'settings' && <SettingsPage />}
      </div>

      {/* Bottom Nav */}
      <nav style={S.nav}>
        {NAV.map(n => (
          <button key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span>{n.label}</span>
            {page === n.id && <div style={{ width: 18, height: 3, borderRadius: 2, background: t.accent }} />}
          </button>
        ))}
      </nav>

      {authModal && <AuthModal />}
    </div>
  )
}
