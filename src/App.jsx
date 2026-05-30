import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const API = "https://purps-api.onrender.com";

const COLORS = {
  bg: "#0a0e1a",
  card: "#111827",
  border: "#1f2d45",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#e8ff47",
  away: "#00d4ff",
  win: "#4ade80",
  loss: "#f87171",
  draw: "#94a3b8",
};

// ─── All leaderboard stats grouped by category ───────────────────────────────
const LEADERBOARD_CATEGORIES = [
  {
    label: "Results",
    stats: [
      { key: "wins",             label: "Wins",              lowerBetter: false },
      { key: "losses",           label: "Losses",            lowerBetter: true  },
      { key: "avg_score_for",    label: "Avg Score For",     lowerBetter: false },
      { key: "avg_score_against",label: "Avg Score Against", lowerBetter: true  },
    ],
  },
  {
    label: "Disposals",
    stats: [
      { key: "avg_disposals",             label: "Avg Disposals",             lowerBetter: false },
      { key: "avg_kicks",                 label: "Avg Kicks",                 lowerBetter: false },
      { key: "avg_handballs",             label: "Avg Handballs",             lowerBetter: false },
      { key: "avg_contested_possessions", label: "Avg Contested Poss.",       lowerBetter: false },
      { key: "avg_groundball_gets",       label: "Avg Groundball Gets",       lowerBetter: false },
      { key: "avg_hard_ball_gets",        label: "Avg Hard Ball Gets",        lowerBetter: false },
      { key: "avg_loose_ball_gets",       label: "Avg Loose Ball Gets",       lowerBetter: false },
      { key: "avg_intercept_possessions", label: "Avg Intercept Poss.",       lowerBetter: false },
      { key: "avg_gathers",               label: "Avg Gathers",               lowerBetter: false },
      { key: "avg_handball_receives",     label: "Avg Handball Receives",     lowerBetter: false },
    ],
  },
  {
    label: "Marks",
    stats: [
      { key: "avg_marks",           label: "Avg Marks",           lowerBetter: false },
      { key: "avg_contested_marks", label: "Avg Contested Marks", lowerBetter: false },
      { key: "avg_uncontested_marks",label: "Avg Uncontested Marks",lowerBetter: false },
      { key: "avg_intercept_marks", label: "Avg Intercept Marks", lowerBetter: false },
      { key: "avg_marks_inside_50", label: "Avg Marks Inside 50", lowerBetter: false },
    ],
  },
  {
    label: "General Play",
    stats: [
      { key: "avg_ranking_points",       label: "Avg Ranking Points",       lowerBetter: false },
      { key: "avg_hit_outs",             label: "Avg Hit Outs",             lowerBetter: false },
      { key: "avg_hit_outs_to_advantage",label: "Avg Hit Outs to Advantage",lowerBetter: false },
      { key: "avg_clearances",           label: "Avg Clearances",           lowerBetter: false },
      { key: "avg_centre_clearances",    label: "Avg Centre Clearances",    lowerBetter: false },
      { key: "avg_ball_up_clearances",   label: "Avg Ball Up Clearances",   lowerBetter: false },
      { key: "avg_throw_in_clearances",  label: "Avg Throw In Clearances",  lowerBetter: false },
      { key: "avg_inside_50s",           label: "Avg Inside 50s",           lowerBetter: false },
      { key: "avg_rebound_50s",          label: "Avg Rebound 50s",          lowerBetter: false },
      { key: "avg_frees_for",            label: "Avg Frees For",            lowerBetter: false },
      { key: "avg_kick_ins",             label: "Avg Kick Ins",             lowerBetter: false },
      { key: "avg_one_percenters",       label: "Avg 1%ers",                lowerBetter: false },
      { key: "avg_bounces",              label: "Avg Bounces",              lowerBetter: false },
    ],
  },
  {
    label: "Turnovers",
    stats: [
      { key: "avg_turnovers",          label: "Avg Turnovers",          lowerBetter: true },
      { key: "avg_back_turnovers",     label: "Avg Back Turnovers",     lowerBetter: true },
      { key: "avg_midfield_turnovers", label: "Avg Midfield Turnovers", lowerBetter: true },
      { key: "avg_forward_turnovers",  label: "Avg Forward Turnovers",  lowerBetter: true },
    ],
  },
  {
    label: "Pressure",
    stats: [
      { key: "avg_overall_pressure",   label: "Avg Overall Pressure",  lowerBetter: false },
      { key: "avg_pressure_acts",      label: "Avg Pressure Acts",     lowerBetter: false },
      { key: "avg_chases",             label: "Avg Chases",            lowerBetter: false },
      { key: "avg_smothers",           label: "Avg Smothers",          lowerBetter: false },
      { key: "avg_spoils",             label: "Avg Spoils",            lowerBetter: false },
      { key: "avg_tackles",            label: "Avg Tackles",           lowerBetter: false },
      { key: "avg_tackles_eff",        label: "Avg Tackles Eff",       lowerBetter: false },
      { key: "avg_forward_50_tackles", label: "Avg Fwd 50 Tackles",    lowerBetter: false },
      { key: "avg_midfield_tackles",   label: "Avg Midfield Tackles",  lowerBetter: false },
      { key: "avg_back_50_tackles",    label: "Avg Back 50 Tackles",   lowerBetter: false },
    ],
  },
  {
    label: "Scoring",
    stats: [
      { key: "avg_goals",          label: "Avg Goals",          lowerBetter: false },
      { key: "avg_behinds",        label: "Avg Behinds",        lowerBetter: false },
      { key: "avg_rushed_behinds", label: "Avg Rushed Behinds", lowerBetter: true  },
    ],
  },
  {
    label: "Efficiency",
    stats: [
      { key: "avg_disposal_efficiency", label: "Avg Disposal Eff. %", lowerBetter: false },
      { key: "avg_kick_efficiency",     label: "Avg Kick Eff. %",     lowerBetter: false },
      { key: "avg_scoring_efficiency",  label: "Avg Scoring Eff. %",  lowerBetter: false },
    ],
  },
  {
    label: "Score Sources %",
    stats: [
      { key: "avg_ss_turnovers_pct",             label: "Avg Turnovers %",             lowerBetter: false },
      { key: "avg_ss_back_turnovers_pct",         label: "Avg Back Turnovers %",         lowerBetter: false },
      { key: "avg_ss_mid_turnovers_pct",          label: "Avg Mid Turnovers %",          lowerBetter: false },
      { key: "avg_ss_f50_turnovers_pct",          label: "Avg F50 Turnovers %",          lowerBetter: false },
      { key: "avg_ss_stoppages_pct",              label: "Avg Stoppages %",              lowerBetter: false },
      { key: "avg_ss_centre_bounces_pct",         label: "Avg Centre Bounces %",         lowerBetter: false },
      { key: "avg_ss_ball_ups_pct",               label: "Avg Ball Ups %",               lowerBetter: false },
      { key: "avg_ss_throw_ins_pct",              label: "Avg Throw Ins %",              lowerBetter: false },
      { key: "avg_ss_kick_ins_pct",               label: "Avg Kick Ins %",               lowerBetter: false },
      { key: "avg_ss_inside50s_pct",              label: "Avg Inside 50s %",             lowerBetter: false },
      { key: "avg_ss_deep_inside50s_pct",         label: "Avg Deep Inside 50s %",        lowerBetter: false },
      { key: "avg_ss_shallow_inside50s_pct",      label: "Avg Shallow Inside 50s %",     lowerBetter: false },
      { key: "avg_ss_marks_inside50_pct",         label: "Avg Marks Inside 50 %",        lowerBetter: false },
      { key: "avg_ss_marks_inside50_deep_pct",    label: "Avg Marks Inside 50 Deep %",   lowerBetter: false },
      { key: "avg_ss_marks_inside50_shallow_pct", label: "Avg Marks Inside 50 Shallow %",lowerBetter: false },
    ],
  },
  {
    label: "Score Sources Pts",
    stats: [
      { key: "avg_ss_turnovers_pts",             label: "Avg Turnover Pts",             lowerBetter: false },
      { key: "avg_ss_back_turnovers_pts",         label: "Avg Back Turnover Pts",         lowerBetter: false },
      { key: "avg_ss_mid_turnovers_pts",          label: "Avg Mid Turnover Pts",          lowerBetter: false },
      { key: "avg_ss_f50_turnovers_pts",          label: "Avg F50 Turnover Pts",          lowerBetter: false },
      { key: "avg_ss_stoppages_pts",              label: "Avg Stoppage Pts",              lowerBetter: false },
      { key: "avg_ss_centre_bounces_pts",         label: "Avg Centre Bounce Pts",         lowerBetter: false },
      { key: "avg_ss_ball_ups_pts",               label: "Avg Ball Up Pts",               lowerBetter: false },
      { key: "avg_ss_throw_ins_pts",              label: "Avg Throw In Pts",              lowerBetter: false },
      { key: "avg_ss_kick_ins_pts",               label: "Avg Kick In Pts",               lowerBetter: false },
      { key: "avg_ss_inside50s_pts",              label: "Avg Inside 50 Pts",             lowerBetter: false },
      { key: "avg_ss_deep_inside50s_pts",         label: "Avg Deep Inside 50 Pts",        lowerBetter: false },
      { key: "avg_ss_shallow_inside50s_pts",      label: "Avg Shallow Inside 50 Pts",     lowerBetter: false },
      { key: "avg_ss_marks_inside50_pts",         label: "Avg Marks Inside 50 Pts",       lowerBetter: false },
      { key: "avg_ss_marks_inside50_deep_pts",    label: "Avg Marks Inside 50 Deep Pts",  lowerBetter: false },
      { key: "avg_ss_marks_inside50_shallow_pts", label: "Avg Marks Inside 50 Shallow Pts",lowerBetter: false },
    ],
  },
];

// Flat list for team tracker / h2h
const STAT_OPTIONS = LEADERBOARD_CATEGORIES.flatMap(c =>
  c.stats.map(s => ({ key: s.key.replace("avg_", ""), label: s.label.replace("Avg ", "") }))
).filter((s, i, arr) => arr.findIndex(x => x.key === s.key) === i);

const RADAR_KEYS = [
  { key: "avg_disposals",    label: "Disposals", max: 400 },
  { key: "avg_marks",        label: "Marks",     max: 100 },
  { key: "avg_tackles",      label: "Tackles",   max: 80  },
  { key: "avg_inside_50s",   label: "I50s",      max: 60  },
  { key: "avg_clearances",   label: "Clearances",max: 60  },
  { key: "avg_pressure_acts",label: "Pressure",  max: 80  },
];

// ─── Fetch ────────────────────────────────────────────────────────────────────
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);
  return { data, loading };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function StatBadge({ value, label }) {
  return (
    <div style={{ textAlign: "center", padding: "12px 16px", background: COLORS.bg, borderRadius: 8, minWidth: 90 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.accent, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function ResultPill({ result }) {
  const color = result === "W" ? COLORS.win : result === "L" ? COLORS.loss : COLORS.draw;
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 4, padding: "2px 8px", fontWeight: 700, fontSize: 12 }}>{result}</span>;
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? COLORS.accent : "transparent",
      color: active ? COLORS.bg : COLORS.muted,
      border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
      borderRadius: 6, padding: "8px 20px", cursor: "pointer",
      fontWeight: 700, fontSize: 13, letterSpacing: 0.5, transition: "all 0.15s",
    }}>{children}</button>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 14, cursor: "pointer", minWidth: 180,
    }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function Leaderboard() {
  const [category, setCategory] = useState("Results");
  const [statKey, setStatKey] = useState("wins");
  const { data: summary, loading } = useFetch(`${API}/api/summary`);

  const currentCategory = LEADERBOARD_CATEGORIES.find(c => c.label === category);
  const currentStat = currentCategory?.stats.find(s => s.key === statKey) ?? currentCategory?.stats[0];

  // When category changes, reset stat to first in that category
  useEffect(() => {
    if (currentCategory) setStatKey(currentCategory.stats[0].key);
  }, [category]);

  const sorted = summary
    ? [...summary].sort((a, b) => {
        const mult = currentStat?.lowerBetter ? 1 : -1;
        return mult * ((b[statKey] ?? 0) - (a[statKey] ?? 0));
      })
    : [];

  const maxVal = sorted.length ? Math.abs(sorted[0][statKey] ?? 1) || 1 : 1;

  const radarData = RADAR_KEYS.map(({ key, label, max }) => {
    const obj = { stat: label };
    sorted.forEach(t => { obj[t.team] = Math.round(((t[key] ?? 0) / max) * 100); });
    return obj;
  });
  const radarTeams = sorted.slice(0, 5);
  const radarColors = [COLORS.accent, COLORS.away, "#ff6b9d", "#ffa94d", "#c084fc"];

  return (
    <div>
      {/* Category + Stat selectors */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <Select
          value={category}
          onChange={setCategory}
          options={LEADERBOARD_CATEGORIES.map(c => ({ value: c.label, label: c.label }))}
        />
        <Select
          value={statKey}
          onChange={setStatKey}
          options={(currentCategory?.stats ?? []).map(s => ({ value: s.key, label: s.label }))}
        />
        {currentStat?.lowerBetter && (
          <span style={{ fontSize: 11, color: COLORS.muted, background: COLORS.border, padding: "4px 10px", borderRadius: 20 }}>
            ↓ Lower is better
          </span>
        )}
      </div>

      {loading && <p style={{ color: COLORS.muted }}>Loading...</p>}

      {sorted.length > 0 && (
        <>
          {/* Bar leaderboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
            {sorted.map((team, i) => {
              const val = team[statKey] ?? 0;
              const pct = maxVal ? (Math.abs(val) / maxVal) * 100 : 0;
              const isTop = i === 0;
              const barColor = isTop
                ? (currentStat?.lowerBetter ? COLORS.win : COLORS.accent)
                : i === 1 ? COLORS.away : COLORS.muted + "88";
              return (
                <div key={team.team} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 24, color: COLORS.muted, fontSize: 13, fontWeight: 700, textAlign: "right" }}>{i + 1}</div>
                  <div style={{ width: 160, color: COLORS.text, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.team}</div>
                  <div style={{ flex: 1, background: COLORS.border, borderRadius: 4, height: 28, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: barColor, transition: "width 0.4s ease" }} />
                  </div>
                  <div style={{ width: 70, color: isTop ? COLORS.accent : COLORS.text, fontWeight: 700, fontSize: 14, textAlign: "right" }}>{val}</div>
                  <div style={{ width: 50, color: COLORS.muted, fontSize: 11 }}>W{team.wins} L{team.losses}</div>
                </div>
              );
            })}
          </div>

          {/* Radar chart */}
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 20 }}>
            <h3 style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Team profile — top 5</h3>
            <p style={{ color: COLORS.muted, fontSize: 11, marginBottom: 16 }}>Normalised to league maximum</p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={COLORS.border} />
                <PolarAngleAxis dataKey="stat" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                {radarTeams.map((t, i) => (
                  <Radar key={t.team} name={t.team} dataKey={t.team}
                    stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.08} strokeWidth={2} />
                ))}
                <Legend />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Team Tracker ──────────────────────────────────────────────────────────────
function TeamTracker({ teams }) {
  const [team, setTeam] = useState("");
  const [stat, setStat] = useState("disposals");
  const { data: rounds, loading } = useFetch(team ? `${API}/api/team-rounds?team=${encodeURIComponent(team)}` : null);
  const statLabel = STAT_OPTIONS.find(s => s.key === stat)?.label ?? stat;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Select value={team} onChange={setTeam} options={teams} placeholder="Select a team..." />
        <Select value={stat} onChange={setStat} options={STAT_OPTIONS.map(s => ({ value: s.key, label: s.label }))} />
      </div>
      {loading && <p style={{ color: COLORS.muted }}>Loading...</p>}
      {rounds && rounds.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {rounds.map(r => (
              <div key={r.round} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>{r.round.replace("ROUND ", "R")}</div>
                <ResultPill result={r.result} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            <StatBadge value={rounds.filter(r => r.result === "W").length} label="Wins" />
            <StatBadge value={rounds.filter(r => r.result === "L").length} label="Losses" />
            <StatBadge value={Math.round(rounds.reduce((a, r) => a + (r.score_for || 0), 0) / rounds.length)} label="Avg Score" />
            <StatBadge value={Math.round(rounds.reduce((a, r) => a + (r[stat] || 0), 0) / rounds.length)} label={`Avg ${statLabel}`} />
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{statLabel} by Round</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rounds}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="round" tick={{ fill: COLORS.muted, fontSize: 11 }} tickFormatter={v => v.replace("ROUND ", "R")} />
                <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} labelStyle={{ color: COLORS.text }} formatter={v => [v, statLabel]} />
                <Line type="monotone" dataKey={stat} stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["Round", "Opponent", "Venue", "Score", "Result", statLabel].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: COLORS.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rounds.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}20`, background: i % 2 === 0 ? COLORS.bg + "40" : "transparent" }}>
                    <td style={{ padding: "10px 12px", color: COLORS.muted }}>{r.round}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 500 }}>{r.opponent}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.muted }}>{r.venue}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.text }}>{r.score_for} – {r.score_against}</td>
                    <td style={{ padding: "10px 12px" }}><ResultPill result={r.result} /></td>
                    <td style={{ padding: "10px 12px", color: COLORS.accent, fontWeight: 700 }}>{r[stat] ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {rounds && rounds.length === 0 && <p style={{ color: COLORS.muted }}>No data found for this team.</p>}
    </div>
  );
}

// ─── Head to Head ─────────────────────────────────────────────────────────────
function HeadToHead({ teams }) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [stat, setStat] = useState("disposals");
  const canFetch = teamA && teamB && teamA !== teamB;
  const { data: games, loading } = useFetch(
    canFetch ? `${API}/api/head-to-head?team_a=${encodeURIComponent(teamA)}&team_b=${encodeURIComponent(teamB)}` : null
  );
  const normalised = games?.map(g => {
    const aIsHome = g.home_team?.toUpperCase().includes(teamA.toUpperCase());
    return {
      round: g.round,
      a_score: aIsHome ? g.home_score : g.away_score,
      b_score: aIsHome ? g.away_score : g.home_score,
      a_stat: aIsHome ? g[`home_${stat}`] : g[`away_${stat}`],
      b_stat: aIsHome ? g[`away_${stat}`] : g[`home_${stat}`],
      result: aIsHome
        ? (g.home_score > g.away_score ? "A" : g.home_score < g.away_score ? "B" : "D")
        : (g.away_score > g.home_score ? "A" : g.away_score < g.home_score ? "B" : "D"),
    };
  });
  const aWins = normalised?.filter(g => g.result === "A").length ?? 0;
  const bWins = normalised?.filter(g => g.result === "B").length ?? 0;
  const statLabel = STAT_OPTIONS.find(s => s.key === stat)?.label ?? stat;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <Select value={teamA} onChange={setTeamA} options={teams} placeholder="Team A..." />
        <span style={{ color: COLORS.muted, fontWeight: 700 }}>vs</span>
        <Select value={teamB} onChange={setTeamB} options={teams} placeholder="Team B..." />
        <Select value={stat} onChange={setStat} options={STAT_OPTIONS.map(s => ({ value: s.key, label: s.label }))} />
      </div>
      {loading && <p style={{ color: COLORS.muted }}>Loading...</p>}
      {normalised && normalised.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
            <div style={{ flex: 1, background: COLORS.bg, borderRadius: 10, padding: 20, textAlign: "center", border: `2px solid ${aWins > bWins ? COLORS.accent : COLORS.border}` }}>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{teamA}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.accent, fontFamily: "'Bebas Neue', sans-serif" }}>{aWins}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Wins</div>
            </div>
            <div style={{ flex: 1, background: COLORS.bg, borderRadius: 10, padding: 20, textAlign: "center", border: `2px solid ${bWins > aWins ? COLORS.away : COLORS.border}` }}>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{teamB}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.away, fontFamily: "'Bebas Neue', sans-serif" }}>{bWins}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Wins</div>
            </div>
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{statLabel} comparison</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={normalised}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="round" tick={{ fill: COLORS.muted, fontSize: 11 }} tickFormatter={v => v.replace("ROUND ", "R")} />
                <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="a_stat" name={teamA} fill={COLORS.accent} radius={[3, 3, 0, 0]} />
                <Bar dataKey="b_stat" name={teamB} fill={COLORS.away} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 20 }}>
            <h3 style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Score history</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={normalised}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="round" tick={{ fill: COLORS.muted, fontSize: 11 }} tickFormatter={v => v.replace("ROUND ", "R")} />
                <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="a_score" name={teamA} stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="b_score" name={teamB} stroke={COLORS.away} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {normalised && normalised.length === 0 && <p style={{ color: COLORS.muted }}>No head-to-head games found.</p>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("leaderboard");
  const { data: teams } = useFetch(`${API}/api/teams`);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "20px 32px", display: "flex", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>Murray Football League</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, color: COLORS.accent, margin: 0 }}>TEAM STATS DASHBOARD</h1>
        </div>
      </div>
      <div style={{ padding: "20px 32px 0", display: "flex", gap: 10, borderBottom: `1px solid ${COLORS.border}` }}>
        <TabBtn active={tab === "leaderboard"} onClick={() => setTab("leaderboard")}>Leaderboard</TabBtn>
        <TabBtn active={tab === "tracker"}     onClick={() => setTab("tracker")}>Team Tracker</TabBtn>
        <TabBtn active={tab === "h2h"}         onClick={() => setTab("h2h")}>Head to Head</TabBtn>
      </div>
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "tracker"     && <TeamTracker teams={teams ?? []} />}
        {tab === "h2h"         && <HeadToHead  teams={teams ?? []} />}
      </div>
    </div>
  );
}
