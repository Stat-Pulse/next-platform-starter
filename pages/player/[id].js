// pages/player/[id].js
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Chart from 'chart.js/auto';

/* ------------------------------------------------------------------ */
/*  getServerSideProps – fetch one player                             */
/* ------------------------------------------------------------------ */
export async function getServerSideProps({ params, req }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    `http://${req.headers.host}`;

  const playerId = params.id;
  if (!playerId) return { notFound: true };
  const res = await fetch(`${baseUrl}/api/player/${playerId}`);
  if (!res.ok) return { notFound: true };
  const data = await res.json();
  return {
    props: {
      ...data,
      weekly: data.weekly || [],
      seasonStats: data.seasonStats || [],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  PlayerPage                                                        */
/* ------------------------------------------------------------------ */
export default function PlayerPage({
  player,
  seasonStats = [],
  passingMetrics = [],
  rushingMetrics = [],
  receivingMetrics = [],
  advancedMetrics = {},
  advancedRushing = {},
  weekly = [],
}) {
  // If the metrics arrays are empty, build them from weekly
  let rushingMetricsArr, receivingMetricsArr, rawPassing;
  if (rushingMetrics.length) {
    rushingMetricsArr = rushingMetrics;
  } else if (player.rushingMetrics && player.rushingMetrics.length) {
    rushingMetricsArr = player.rushingMetrics;
  } else if (weekly && weekly.length) {
    rushingMetricsArr = weekly.filter(w => w.carries !== undefined || w.rushing_yards !== undefined);
  } else {
    rushingMetricsArr = [];
  }
  if (receivingMetrics.length) {
    receivingMetricsArr = receivingMetrics;
  } else if (player.receivingMetrics && player.receivingMetrics.length) {
    receivingMetricsArr = player.receivingMetrics;
  } else if (weekly && weekly.length) {
    receivingMetricsArr = weekly.filter(w => w.targets !== undefined || w.receptions !== undefined);
  } else {
    receivingMetricsArr = [];
  }
  if (passingMetrics.length) {
    rawPassing = passingMetrics;
  } else if (player.passingMetrics && player.passingMetrics.length) {
    rawPassing = player.passingMetrics;
  } else if (weekly && weekly.length) {
    rawPassing = weekly.filter(w => w.attempts !== undefined || w.completions !== undefined);
  } else {
    rawPassing = [];
  }
  const uniquePassingMetrics = Array.isArray(rawPassing)
    ? rawPassing.filter((v,i,self)=>v?.week && i===self.findIndex(r=>r.week===v.week))
    : [];

  /* -------- advanced flags ---------------------------------------- */
  const advancedPassing = player.advancedPassing || null;
  const hasAdvancedPassing = advancedPassing &&
    Object.values(advancedPassing).some(v => typeof v === 'number' && v !== 0);

  const hasAdvancedReceiving = advancedMetrics &&
    Object.values(advancedMetrics).some(v => typeof v === 'number' && v !== 0);

  const hasAdvancedRushing = advancedRushing &&
    Object.values(advancedRushing).some(v => typeof v === 'number' && v !== 0);

  /* -------- UI state ---------------------------------------------- */
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [bgColor,       setBgColor]       = useState(player.primary_color   || '#004C54');
  const [borderColor,   setBorderColor]   = useState(player.secondary_color || '#000');
  const [expandedCard,  setExpandedCard]  = useState(null);
  const [collapsed,     setCollapsed]     = useState(true);
  const scrollRef = useRef();

  /* season & stat-type controls */
  const seasonOptions = [...new Set(
    [...receivingMetricsArr, ...rushingMetricsArr, ...uniquePassingMetrics].map(r=>r.season)
  )].sort();
  const defaultSeason = seasonOptions.at(-1) || '2024';
  const [selectedSeason, setSelectedSeason] = useState(defaultSeason);
  const [statType, setStatType]             = useState('receiving'); // receiving | rushing | passing

  /* -------- derived weekly rows ----------------------------------- */
  const weeklyRows = (() => {
    const filterSeason = arr => arr.filter(r => String(r.season) === String(selectedSeason));
    if (statType==='passing')   return filterSeason(uniquePassingMetrics);
    if (statType==='rushing')   return filterSeason(rushingMetricsArr);
    return filterSeason(receivingMetricsArr);
  })();
  const displayRows = collapsed ? weeklyRows.slice(-3) : weeklyRows;

  /* -------- side effects ------------------------------------------ */
  useEffect(() => {
    if (player.primary_color)   setBgColor(player.primary_color);
    if (player.secondary_color) setBorderColor(player.secondary_color);
  }, [player.primary_color, player.secondary_color]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  /* particles */
  const particlesInit = main => loadFull(main);

  /* Chart.js – destroy/recreate to avoid canvas reuse */
  const snapsChartRef  = useRef(null);
  const weeklyChartRef = useRef(null);

  useEffect(() => {
    const ctxSnaps = document.getElementById('snapsChart')?.getContext('2d');
    if (ctxSnaps) {
      snapsChartRef.current && snapsChartRef.current.destroy();
      snapsChartRef.current = new Chart(ctxSnaps, {
        type:'polarArea',
        data:{ labels:['Offense','Defense','Special'], datasets:[{ data:[75,20,5], backgroundColor:['#00FFFF','#FF00FF','#00FF00'] }] },
        options:{ plugins:{ legend:{ position:'bottom', labels:{ color:'#fff' } } } }
      });
    }

    const ctxWeekly = document.getElementById('weeklyChart')?.getContext('2d');
    if (ctxWeekly) {
      weeklyChartRef.current && weeklyChartRef.current.destroy();
      const weeks   = receivingMetricsArr.map(r=>`W${r.week}`);
      const targets = receivingMetricsArr.map(r=>r.targets);
      const recs    = receivingMetricsArr.map(r=>r.receptions);
      weeklyChartRef.current = new Chart(ctxWeekly, {
        type:'bar',
        data:{ labels:weeks, datasets:[
          { label:'Targets', data:targets, backgroundColor:'#00FFFF' },
          { label:'Receptions', data:recs, backgroundColor:'#0088ff' }
        ]},
        options:{ plugins:{ legend:{ labels:{ color:'#fff' } } }, scales:{ x:{ ticks:{ color:'#fff' } }, y:{ ticks:{ color:'#fff' } } } }
      });
    }

    return () => {
      snapsChartRef.current  && snapsChartRef.current.destroy();
      weeklyChartRef.current && weeklyChartRef.current.destroy();
    };
  }, [receivingMetricsArr]);

  if (!player) return <p className="text-center text-white">Player not found</p>;

  /* primary color for glow */
  const primaryColor = player.primary_color || bgColor;

  /* ------------------------------------------------------------------ */
  return (
    <>
      <Head><title>{player.player_name} | StatPulse</title></Head>

      {/* particles */}
      <Particles id="tsparticles" init={particlesInit}
        className="fixed inset-0 -z-10"
        options={{ background:{ color:'#0a0a0a' }, particles:{ number:{ value:60 }, color:{ value:'#00FFFF' }, opacity:{ value:0.5 }, size:{ value:3 }, move:{ enable:true, speed:0.6 } } }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-8 font-orbitron text-sm">

        {/* ---------------- HERO ---------------- */}
        <motion.div className="relative mb-8 rounded-xl overflow-hidden"
          initial={{ opacity:0,y:-50 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8 }}
        >
          <div className="relative bg-black/70 p-6 flex flex-col md:flex-row items-center justify-between">

            {/* Headshot + meta */}
            <div className="flex items-center space-x-6">
              <Image
                src={player.headshot_url || '/default-avatar.png'}
                alt={`${player.player_name} headshot`}
                width={160} height={160}
                className="rounded-full border-4 shadow-lg"
                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                style={{ borderColor:primaryColor, boxShadow:`0 0 15px ${primaryColor}` }}
              />

              <div>
                <h1 className="text-4xl font-extrabold text-white" style={{ textShadow:`0 0 12px ${primaryColor}` }}>
                  {player.player_name}
                  {(player.team_logo_espn || player.team_logo) && (
                    <Image
                      src={player.team_logo_espn || player.team_logo}
                      alt={`${player.team_abbr} logo`}
                      width={40} height={40}
                      className="inline-block ml-2 align-middle"
                    />
                  )}
                </h1>
                <div className="text-xl font-semibold text-cyan-300">
                  {player.position} {player.jersey_number ? `#${player.jersey_number}` : ''}
                </div>

                {/* meta rows */}
                <div className="text-gray-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Team:</strong> {player.team_abbr || 'N/A'}</span>
                  <span><strong>College:</strong> {player.college || 'N/A'}</span>
                  <span><strong>Ht:</strong> {player.height_inches ? `${player.height_inches}"` : 'N/A'}</span>
                  <span><strong>Wt:</strong> {player.weight_pounds ? `${player.weight_pounds} lbs` : 'N/A'}</span>
                  <span><strong>DOB:</strong> {player.date_of_birth
                    ? new Date(player.date_of_birth).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
                    : 'N/A'}</span>
                </div>
                <div className="text-gray-300 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span><strong>Contract:</strong> {player.contract_value
                    ? `$${Number(player.contract_value).toLocaleString()}M`
                    : 'N/A'}</span>
                  <span><strong>Avg/Year:</strong> {player.contract_apy
                    ? `$${Number(player.contract_apy).toLocaleString()}M`
                    : 'N/A'}</span>
                  <span><strong>Guaranteed:</strong> {player.contract_guaranteed
                    ? `$${Number(player.contract_guaranteed).toLocaleString()}M`
                    : 'N/A'}</span>
                  <span><strong>Cap %:</strong> {player.contract_apy_cap_pct
                    ? `${(Number(player.contract_apy_cap_pct)*100).toFixed(1)}%`
                    : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="mt-4 md:mt-0 bg-cyan-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-cyan-300 transition"
              style={{ boxShadow:`0 0 12px ${primaryColor}` }}>
              View AI Insights
            </button>
          </div>
        </motion.div>

        {/* --------------- SEASON AGGREGATES (per-season totals) --------------- */}
        <motion.div className="glass-card p-6 mb-8"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Season Totals</h2>
          {seasonStats && seasonStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-xs text-gray-200">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-cyan-300">Season</th>
                    <th className="text-left p-2 text-cyan-300">Team</th>
                    <th className="text-left p-2 text-cyan-300">Games</th>
                    <th className="text-left p-2 text-cyan-300">Pass Yds</th>
                    <th className="text-left p-2 text-cyan-300">Pass TD</th>
                    <th className="text-left p-2 text-cyan-300">INT</th>
                    <th className="text-left p-2 text-cyan-300">Rush Yds</th>
                    <th className="text-left p-2 text-cyan-300">Rush TD</th>
                    <th className="text-left p-2 text-cyan-300">Rec Yds</th>
                    <th className="text-left p-2 text-cyan-300">Rec TD</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonStats.map((s, idx) => (
                    <tr key={idx} className="border-b border-gray-600 hover:bg-gray-800">
                      <td className="p-2">{s.season || '—'}</td>
                      <td className="p-2">{s.team || s.team_abbr || '—'}</td>
                      <td className="p-2">{s.games_played ?? s.gp ?? '—'}</td>
                      <td className="p-2">{s.passing_yards ?? s.pass_yards ?? '—'}</td>
                      <td className="p-2">{s.passing_tds ?? s.pass_tds ?? '—'}</td>
                      <td className="p-2">{s.interceptions ?? s.ints ?? '—'}</td>
                      <td className="p-2">{s.rushing_yards ?? s.rush_yards ?? '—'}</td>
                      <td className="p-2">{s.rushing_tds ?? s.rush_tds ?? '—'}</td>
                      <td className="p-2">{s.receiving_yards ?? s.rec_yards ?? '—'}</td>
                      <td className="p-2">{s.rec_touchdowns ?? s.rec_tds ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No season aggregate stats available.</p>
          )}
        </motion.div>

        {/* --------------- SEASON STATS (weekly) --------------- */}
        <motion.div className="glass-card p-6 mb-8"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Season Stats</h2>

            <div className="flex items-center gap-3">
              {['receiving','rushing','passing'].map(t=>(
                <button key={t} onClick={()=>setStatType(t)}
                  className={`px-2 py-1 rounded text-xs uppercase font-semibold
                    ${statType===t ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                  {t.slice(0,3)}
                </button>
              ))}
              <select value={selectedSeason} onChange={e=>setSelectedSeason(e.target.value)}
                className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded">
                {seasonOptions.map(yr=>(
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {displayRows.length ? (
            <StatsCard
              title={`${selectedSeason} ${statType.charAt(0).toUpperCase()+statType.slice(1)} (${collapsed? 'Last 3' : 'Full'} games)`}
              columns={statType==='receiving'
                ? ['Week','Opp','Tgt','Rec','Yds','TD']
                : statType==='rushing'
                  ? ['Week','Opp','Car','Yds','TD','EPA']
                  : ['Week','Opp','Cmp','Att','Yds','TD','INT','EPA']}
              rows={displayRows.map(g => (
                statType==='receiving' ? [
                  g.week, g.opponent_team, g.targets, g.receptions, g.receiving_yards, g.rec_touchdowns
                ] : statType==='rushing' ? [
                  g.week, g.opponent_team, g.carries, g.rushing_yards, g.rushing_tds,
                  typeof g.rushing_epa==='number'?g.rushing_epa.toFixed(2):'—'
                ] : [
                  g.week, g.opponent_team, g.completions, g.attempts,
                  g.passing_yards, g.passing_tds, g.interceptions,
                  typeof g.passing_epa==='number'?g.passing_epa.toFixed(2):'—'
                ]
              ))}
            />
          ) : <p className="text-gray-400">No {statType} data for {selectedSeason}.</p>}

          {weeklyRows.length > 3 && (
            <div className="text-center mt-2">
              <button onClick={()=>setCollapsed(!collapsed)}
                className="text-cyan-400 text-xs underline hover:text-cyan-200">
                {collapsed ? 'Show full season' : 'Show last 3 games'}
              </button>
            </div>
          )}
        </motion.div>

        {/* ------------- GRID (left = summary / center = career) ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* left column ------------------------------------------------ */}
          <div className="space-y-6">
            <motion.div className="glass-card p-4"
              whileHover={{ scale:1.05 }}
              onClick={()=>setExpandedCard(expandedCard==='summary'?null:'summary')}>
              <h2 className="text-sm uppercase font-semibold text-cyan-300">Player Summary</h2>
              <p className="text-white">
                Active <span className="font-semibold">{player.position}</span> for&nbsp;
                <span className="font-semibold">{player.recent_team}</span>.
              </p>
              {expandedCard==='summary' && (
                <div className="mt-4 text-gray-300">
                  <p>Additional details or chart…</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* center column ---------------------------------------------- */}
          <div className="space-y-8">
            {/* career carousel */}
            <div className="glass-card p-4">
              <div ref={scrollRef}
                className="overflow-x-auto py-6 hide-scrollbar snap-x snap-mandatory">
                <div className="flex">
                  {['Receiving','Rushing','Passing'].map(type=>{
                    const data=player.career?.[type.toLowerCase()]||{};
                    let ints = 'N/A';
                    if (type === 'Passing') {
                      ints = data.interceptions ?? data.ints ?? 'N/A';
                    }
                    return(
                      <motion.div key={type}
                        className="bg-black/50 p-4 rounded-lg min-w-full snap-center"
                        whileHover={{ scale:1.05 }}>
                        <h3 className="text-sm uppercase font-semibold text-cyan-300">{type} Career</h3>
                        <p className="text-white">Seasons: {data.seasons||'N/A'}</p>
                        <p className="text-white">Yards:   {data.yards  ||'N/A'}</p>
                        <p className="text-white">TDs:     {data.tds    ||'N/A'}</p>
                        {type === 'Passing' && (
                          <p className="text-white">INT:     {ints}</p>
                        )}
                        {type === 'Rushing' && data.interceptions !== undefined && (
                          <p className="text-white">INT:     {data.interceptions}</p>
                        )}
                        {type === 'Receiving' && data.interceptions !== undefined && (
                          <p className="text-white">INT:     {data.interceptions}</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-2">
                {[...Array(3)].map((_,i)=>(
                  <button key={i}
                    onClick={()=>scrollRef.current.scrollTo({ left:i*scrollRef.current.clientWidth, behavior:'smooth' })}
                    className={`h-2 w-2 rounded-full ${i===activeIndex?'bg-cyan-400':'bg-gray-600'}`}/>
                ))}
              </div>
            </div>

            {/* advanced blocks (optional) */}
            {hasAdvancedPassing && (
              <AdvancedCard title="2024 Advanced Passing" rows={[
                ['Avg Time to Throw',`${advancedPassing.avg_time_to_throw?.toFixed(2)||'N/A'} s`],
                ['Passer Rating',     advancedPassing.passer_rating?.toFixed(1)||'N/A'],
              ]}/>
            )}
            {hasAdvancedReceiving && (
              <AdvancedCard title="2024 Advanced Receiving" rows={[
                ['Avg Cushion', `${advancedMetrics.avg_cushion?.toFixed(2)||'N/A'} yds`],
                ['Air Yards Share', advancedMetrics.percent_share_of_intended_air_yards != null
                  ? `${(advancedMetrics.percent_share_of_intended_air_yards * 100).toFixed(1)} %`
                  : 'N/A'],
              ]}/>
            )}
            {hasAdvancedRushing && (
              <AdvancedCard title="2024 Advanced Rushing" rows={[
                ['RYOE', advancedRushing.rushing_yards_over_expected?.toFixed(1)||'N/A'],
                ['Rush EPA', advancedRushing.rushing_epa?.toFixed(2)||'N/A'],
              ]}/>
            )}
          </div>

          {/* right column ---------------------------------------------- */}
          <div className="space-y-8">
            <motion.div className="glass-card p-4 flex flex-col items-center" whileHover={{ scale:1.05 }}>
              <h2 className="text-sm uppercase font-semibold text-cyan-300">Snaps</h2>
              <canvas id="snapsChart" className="w-40 h-40"/>
            </motion.div>
            <motion.div className="glass-card p-4" whileHover={{ scale:1.05 }}>
              <h2 className="text-sm uppercase font-semibold text-cyan-300">Weekly Targets vs. Receptions</h2>
              <canvas id="weeklyChart" className="w-full h-64"/>
            </motion.div>
          </div>
        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        .font-orbitron{ font-family:'Orbitron',sans-serif; }
        .glass-card{
          background:rgba(255,255,255,0.07);
          backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,0.15);
          border-radius:12px;
          box-shadow:0 4px 25px rgba(0,255,255,0.15);
        }
        .hide-scrollbar::-webkit-scrollbar{ display:none; }
      `}</style>
    </>
  );
}

/* ---------------- reusable table + advanced card ------------------ */
function StatsCard({ title, columns, rows }) {
  return (
    <div className="glass-card p-4 overflow-x-auto">
      <h3 className="text-sm uppercase font-semibold text-cyan-300 mb-2">{title}</h3>
      <table className="table-auto w-full text-xs text-gray-200">
        <thead><tr>{columns.map(c=>(
          <th key={c} className="text-left p-2 text-cyan-300">{c}</th>
        ))}</tr></thead>
        <tbody>{rows.map((vals,i)=>(
          <tr key={i} className="border-b border-gray-600 hover:bg-gray-800">
            {vals.map((v,j)=><td key={j} className="p-2">{v}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
function AdvancedCard({ title, rows }) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm uppercase font-semibold text-cyan-300 mb-2">{title}</h3>
      <div className="text-gray-200 space-y-1">{rows.map(([label,val])=>(
        <p key={label}><strong>{label}:</strong> {val}</p>
      ))}</div>
    </div>
  );
}
