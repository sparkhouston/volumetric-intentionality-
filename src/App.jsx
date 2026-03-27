import { useState, useEffect, useRef } from "react";

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const SK = "vi_v6";
const load = () => { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } };
const save = (s) => { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} };

// ─── SEED DATA ────────────────────────────────────────────────────────────────
// type: "once" = one and done (goes to vault), "daily" = resets every day
const SEED = {
  earth: [
    { id:"e1", text:"Set up all socials for AWNEST", priority:9, done:false, type:"once" },
    { id:"e2", text:"Lock in Blu & Exile tour pricing and dates", priority:10, done:false, type:"once" },
    { id:"e3", text:"Follow up with every warm lead", priority:9, done:false, type:"once" },
    { id:"e4", text:"Finalize guitar / lyrics / woods schedule for Archie", priority:8, done:false, type:"once" },
    { id:"e5", text:"Get Scott to respond about Madstone", priority:7, done:false, type:"once" },
    { id:"e6", text:"Isaac automaton", priority:6, done:false, type:"once" },
    { id:"e7", text:"Get music business in order top to bottom", priority:9, done:false, type:"once" },
    { id:"e8", text:"Final budget delimitation", priority:8, done:false, type:"once" },
    { id:"e9", text:"Follow up Barry — taxes and t-shirt invoice", priority:7, done:false, type:"once" },
  ],
  heaven: [
    { id:"h1", text:"Finalize \"ANDALE\"", priority:10, done:false, type:"once" },
    { id:"h2", text:"Finalize \"On The Run\"", priority:10, done:false, type:"once" },
    { id:"h3", text:"Finalize \"God Is\"", priority:10, done:false, type:"once" },
    { id:"h4", text:"Guitar / lyrics / woods world-building completion", priority:9, done:false, type:"once" },
    { id:"h5", text:"Finalize the AWNEST brand voice", priority:8, done:false, type:"once" },
    { id:"h6", text:"Record \"Because Of You\"", priority:8, done:false, type:"once" },
    { id:"h7", text:"Find consistent master level for album (reference HIMR)", priority:7, done:false, type:"once" },
    { id:"h8", text:"Record new \"Breathe\" hook", priority:7, done:false, type:"once" },
    { id:"h9", text:"Comp \"Ride On\"", priority:6, done:false, type:"once" },
    { id:"h10", text:"Create nativity set for Bon Anniversaire", priority:6, done:false, type:"once" },
    { id:"h11", text:"Come up with fun content ideas for AWNEST", priority:5, done:false, type:"once" },
  ],
  balance: [
    { id:"b1", text:"Call Jamie", priority:7, done:false, type:"once" },
    { id:"b2", text:"Call Ryan", priority:7, done:false, type:"once" },
    { id:"b3", text:"Call Rafy", priority:7, done:false, type:"once" },
    { id:"b4", text:"Blackout curtains", priority:8, done:false, type:"once" },
    { id:"b5", text:"New phone battery", priority:8, done:false, type:"once" },
    { id:"b6", text:"Good computer chair", priority:7, done:false, type:"once" },
    { id:"b7", text:"Figure out bedroom TV situation", priority:6, done:false, type:"once" },
    { id:"b8", text:"Full clean", priority:7, done:false, type:"once" },
    { id:"b9", text:"Grocery shop", priority:8, done:false, type:"once" },
    { id:"b10", text:"Walk Charlie x3", priority:10, done:false, type:"daily", lastDone:null, streak:0 },
    { id:"b11", text:"Get a haircut", priority:5, done:false, type:"once" },
    { id:"b12", text:"Frame up the art", priority:4, done:false, type:"once" },
    { id:"b13", text:"Throw out stuff at the front", priority:5, done:false, type:"once" },
    { id:"b14", text:"Mini fridge for studio office", priority:6, done:false, type:"once" },
    { id:"b15", text:"Brighter lights in the condo", priority:6, done:false, type:"once" },
    { id:"b16", text:"New lamp shade", priority:4, done:false, type:"once" },
    { id:"b17", text:"High-quality dog enrichment toys", priority:6, done:false, type:"once" },
    { id:"b18", text:"Cheese + Cream", priority:5, done:false, type:"once" },
  ],
};

// ─── DAILY FRAMEWORK ─────────────────────────────────────────────────────────
// These are the fixed daily rituals — they live separately from task lists
// and reset automatically each day
const DAILY_FRAMEWORK = [
  { id:"df1", pillar:"balance", text:"Wake · Shower · Reasonable Doubt walk", icon:"🌅", time:"9:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df2", pillar:"balance", text:"Walk Charlie (morning)", icon:"🐕", time:"9:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df3", pillar:"balance", text:"Burrito", icon:"🌯", time:"9:30 AM", done:false, lastDone:null, streak:0 },
  { id:"df4", pillar:"earth",   text:"Ruthless Execution I", icon:"⚔️", time:"10:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df5", pillar:"balance", text:"Walk Charlie (midday) + Lunch", icon:"🐕", time:"1:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df6", pillar:"earth",   text:"Clerical block", icon:"📋", time:"2:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df7", pillar:"earth",   text:"Ruthless Execution II", icon:"⚔️", time:"2:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df8", pillar:"balance", text:"The Shift — steam, shower, reset", icon:"⚡", time:"5:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df9", pillar:"balance", text:"Dinner + unwind", icon:"🍽️", time:"5:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df10",pillar:"balance", text:"Walk Charlie (evening)", icon:"🐕", time:"6:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df11",pillar:"heaven",  text:"Creative hyper focus", icon:"✦", time:"7:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df12",pillar:"balance", text:"Lights out · vibe · wind down", icon:"🌙", time:"12:00 AM", done:false, lastDone:null, streak:0 },
];

// ─── ALARMS ───────────────────────────────────────────────────────────────────
const ALARMS = [
  { h:9,  m:0,  label:"Rise & Ritual",       msg:"Time to wake up. Shower. Reasonable Doubt. Charlie. Burrito. Let's go." },
  { h:10, m:0,  label:"Execution I",         msg:"10AM. Ruthless Execution begins. Lock in. No mercy." },
  { h:13, m:0,  label:"Break Time",          msg:"1PM. Take the break. Walk Charlie. Eat. You earned it." },
  { h:14, m:30, label:"Execution II",        msg:"2:30PM. Back to work. Close it out." },
  { h:17, m:0,  label:"The Shift",           msg:"5PM. Earth is done. The Shift begins. Steam. Reset. Heaven awaits." },
  { h:19, m:0,  label:"Creative Begins",     msg:"7PM. Heaven hours. Create. This is your North Star." },
  { h:0,  m:0,  label:"Lights Out",          msg:"Midnight. Wind down. Lights out. Rest." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getMode = (h) => (h >= 17 || h < 1) && h !== 0 ? (h >= 17 ? "heaven" : "earth") : h < 17 ? "earth" : "heaven";
const getModeByHour = (h) => h >= 17 ? "heaven" : "earth";
const today = () => new Date().toDateString();
let uid = 5000;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#fff; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#ddd; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes haloBreath { 0%,100%{box-shadow:0 0 40px 10px rgba(255,255,200,0.18),0 0 80px 20px rgba(200,180,255,0.1)} 50%{box-shadow:0 0 60px 20px rgba(255,255,220,0.28),0 0 120px 40px rgba(147,197,253,0.18)} }
  @keyframes haloText { 0%,100%{text-shadow:0 0 20px rgba(255,240,150,0.4)} 50%{text-shadow:0 0 40px rgba(255,240,180,0.7),0 0 80px rgba(220,200,255,0.3)} }
  @keyframes softPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes alarmIn  { 0%{opacity:0;transform:translateY(-20px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes alarmOut { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.95)} }
  @keyframes typing   { from{width:0} to{width:100%} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(540deg);opacity:0} }

  .app { font-family:'DM Mono',monospace; min-height:100vh; transition:background 0.8s ease, color 0.8s ease; }
  .earth-app { background:#fff; color:#000; font-weight:500; }
  .heaven-app { background:#fff; color:#000; font-weight:500; }
  .df { font-family:'Cormorant Garamond',serif; }

  /* NAV */
  .nav { display:flex; border-bottom:1px solid; padding:0 16px; overflow-x:auto; scrollbar-width:none; }
  .nav::-webkit-scrollbar { display:none; }
  .earth-nav { border-color:#000; background:#fff; }
  .heaven-nav { border-color:rgba(147,197,253,0.2); background:#fafaf8; }
  .ntab { background:none; border:none; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.2em; padding:14px 14px; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; white-space:nowrap; text-transform:uppercase; }
  .earth-ntab { color:#000; font-weight:500; }
  .earth-ntab:hover { color:#000; }
  .earth-ntab.active { color:#CC0000; border-bottom-color:#CC0000; font-weight:600; }
  .heaven-ntab { color:#000; }
  .heaven-ntab:hover { color:#1a56db; }
  .heaven-ntab.active { color:#1a56db; border-bottom-color:#1a56db; font-weight:600; }

  /* CARDS */
  .ec { background:#fff; border:1px solid #ddd; padding:18px; }
  .eca { background:#f5f5f5; border:1px solid #ccc; padding:18px; }
  .hc { background:rgba(255,255,255,0.7); border:1px solid rgba(147,197,253,0.2); border-radius:12px; padding:18px; backdrop-filter:blur(8px); }
  .hca { background:rgba(239,246,255,0.8); border:1px solid rgba(147,197,253,0.35); border-radius:12px; padding:18px; backdrop-filter:blur(8px); }

  /* BUTTONS */
  .eb  { background:#fff; border:1px solid #ccc; color:#000; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.15s; }
  .eb:hover  { border-color:#000; color:#000; font-weight:600; }
  .ebs { background:#000; border:1px solid #000; color:#fff; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.15s; }
  .ebs:hover { background:#333; }
  .hb  { background:transparent; border:1px solid rgba(26,86,219,0.4); color:#1a56db; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.2s; border-radius:4px; }
  .hb:hover  { background:rgba(26,86,219,0.08); border-color:rgba(26,86,219,0.7); }
  .hbs { background:rgba(26,86,219,0.12); border:1px solid rgba(26,86,219,0.6); color:#1240b0; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.2s; border-radius:4px; }
  .hbs:hover { background:rgba(26,86,219,0.2); }

  /* INPUTS */
  input, select, textarea { font-family:'DM Mono',monospace; font-size:16px; padding:11px 14px; outline:none; width:100%; transition:border 0.2s; }
  .ei { background:#fff; border:1px solid #ccc; color:#000; font-weight:500; }
  .ei:focus { border-color:#111; }
  .hi { background:rgba(255,255,255,0.6); border:1px solid rgba(26,86,219,0.25); color:#1a1a2e; border-radius:6px; }
  .hi:focus { border-color:rgba(26,86,219,0.6); }
  select option { background:#fff; color:#111; }

  /* TASK ROWS */
  .tr { display:flex; align-items:center; gap:10px; padding:12px 14px; margin-bottom:4px; transition:all 0.15s; animation:slideUp 0.2s ease; cursor:pointer; }
  .etr { border-left:2px solid #eee; background:#fff; }
  .etr:hover { border-left-color:#CC0000; background:#fff8f8; }
  .htr { border-left:2px solid rgba(147,197,253,0.3); background:rgba(255,255,255,0.5); border-radius:0 6px 6px 0; }
  .htr:hover { border-left-color:rgba(26,86,219,0.6); background:rgba(239,246,255,0.7); }

  /* CHECKBOX */
  .cb { width:15px; height:15px; border:1px solid; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .ecb { border-color:#000; }
  .ecb.done { background:#111; border-color:#111; }
  .hcb { border-color:rgba(26,86,219,0.4); border-radius:50%; }
  .hcb.done { background:rgba(26,86,219,0.7); border-color:rgba(26,86,219,0.7); }

  /* PRIORITY BADGE */
  .pb { font-size:9px; letter-spacing:0.1em; padding:2px 7px; flex-shrink:0; }
  .epb { border:1px solid #bbb; color:#000; font-weight:600; }
  .hpb { border:1px solid rgba(147,197,253,0.3); color:rgba(26,86,219,0.8); border-radius:10px; }

  /* FAB */
  .fab { position:fixed; bottom:24px; right:20px; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; border:none; z-index:50; transition:all 0.2s; }
  .efab { background:#000; color:#fff; box-shadow:0 2px 16px rgba(0,0,0,0.15); }
  .efab:hover { transform:scale(1.08); }
  .hfab { background:rgba(26,86,219,0.85); color:#fff; box-shadow:0 2px 24px rgba(26,86,219,0.3); animation:haloBreath 4s ease-in-out infinite; }
  .hfab:hover { transform:scale(1.08); }

  /* ALARM OVERLAY */
  .alarm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.3s ease; }
  .alarm-box { max-width:360px; width:100%; padding:36px 28px; text-align:center; animation:alarmIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .earth-alarm { background:#fff; border:2px solid #000; }
  .heaven-alarm { background:#fafaf8; border:1px solid rgba(26,86,219,0.5); border-radius:16px; animation:alarmIn 0.4s cubic-bezier(0.34,1.56,0.64,1), haloBreath 3s ease-in-out infinite; }

  /* MIND DUMP */
  .dump-wrap { min-height:70vh; display:flex; flex-direction:column; }
  .dump-messages { flex:1; padding:20px 0; display:flex; flex-direction:column; gap:16px; }
  .msg { animation:slideUp 0.25s ease; max-width:85%; }
  .msg-ai { align-self:flex-start; }
  .msg-user { align-self:flex-end; }
  .msg-bubble { padding:12px 16px; font-size:13px; line-height:1.6; }
  .earth-ai-bubble { background:#f5f5f5; color:#111; }
  .earth-user-bubble { background:#111; color:#fff; }
  .heaven-ai-bubble { background:rgba(239,246,255,0.9); border:1px solid rgba(147,197,253,0.25); color:#1a1a2e; border-radius:0 12px 12px 12px; }
  .heaven-user-bubble { background:rgba(26,86,219,0.15); border:1px solid rgba(26,86,219,0.3); color:#0e338a; border-radius:12px 0 12px 12px; }

  /* SCREEN */
  .screen { animation:fadeUp 0.3s ease; padding:20px 16px 100px; max-width:680px; margin:0 auto; }

  /* HEAVEN BACKGROUND */
  .heaven-bg-layer { position:fixed; inset:0; pointer-events:none; z-index:0; }

  /* PROGRESS BAR */
  .prog-bar { height:2px; background:#ebebeb; margin:8px 0; }
  .earth-prog-fill { background:#CC0000; height:100%; transition:width 0.6s ease; }
  .heaven-prog-fill { background:linear-gradient(90deg,rgba(26,86,219,0.6),rgba(147,197,253,0.8)); height:100%; transition:width 0.6s ease; }

  .screen-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,7vw,42px); font-weight:300; letter-spacing:-0.01em; margin-bottom:4px; }
  .earth-title { color:#000; font-weight:700; }
  .heaven-title { color:#1240b0; animation:haloText 4s ease-in-out infinite; }

  .divider { height:1px; margin:16px 0; }
  .earth-divider { background:#eee; }
  .heaven-divider { background:rgba(147,197,253,0.2); }

  .section-label { font-size:8px; letter-spacing:0.3em; text-transform:uppercase; margin-bottom:10px; }
  .earth-sl { color:#000; font-weight:600; letter-spacing:0.25em; }
  .heaven-sl { color:rgba(26,86,219,0.6); }
`;

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const saved = load();
  const nowH = new Date().getHours();

  const [mode, setMode] = useState(getModeByHour(nowH));
  const [tab, setTab] = useState("dump");
  const [tasks, setTasks] = useState(saved?.tasks || SEED);
  const [wins, setWins] = useState(saved?.wins || []);
  const [daily, setDaily] = useState(() => {
    const savedDaily = saved?.daily;
    if (savedDaily) {
      // Reset daily tasks if last save was a different day
      const lastDay = saved?.lastDay;
      if (lastDay !== new Date().toDateString()) {
        return savedDaily.map(d => ({...d, done:false}));
      }
      return savedDaily;
    }
    return DAILY_FRAMEWORK;
  });
  const currentTime = new Date(); // static - no state updates = no blinking
  const [alarm, setAlarm] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [shownAlarms, setShownAlarms] = useState(saved?.shownAlarms || []);

  // Mind dump state
  const [dumpMessages, setDumpMessages] = useState([
    { id:1, role:"ai", text:"What's on your mind? I know your world — just talk to me." }
  ]);
  const dumpEndRef = useRef(null);
  const audioCtx = useRef(null);

  const isH = mode === "heaven";
  const C = (e,h) => isH ? h : e;
  const card = C("ec","hc");
  const cardA = C("eca","hca");
  const btn = C("eb","hb");
  const btnS = C("ebs","hbs");
  const iCls = C("ei","hi");
  const trCls = C("etr","htr");
  const cbCls = C("ecb","hcb");
  const pbCls = C("epb","hpb");
  const ac = isH ? "#1a56db" : "#111";

  // Persist
  useEffect(() => { save({ tasks, wins, shownAlarms, daily, lastDay: new Date().toDateString() }); }, [tasks, wins, shownAlarms, daily]);

  // Mode check + alarms every 30s (no 1s clock = no blinking)
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setMode(getModeByHour(n.getHours()));
      const key = `${n.getHours()}:${n.getMinutes()}`;
      const alarmItem = ALARMS.find(a => a.h === n.getHours() && a.m === n.getMinutes());
      if (alarmItem && !shownAlarms.includes(key)) {
        setAlarm(alarmItem);
        setShownAlarms(prev => [...prev, key]);
        playAlarmSound();
      }
    }, 30000);
    return () => clearInterval(t);
  }, [shownAlarms]);

  // Auto-switch tab by time
  useEffect(() => {
    const h = new Date().getHours();
    if (tab === "dump") return; // don't interrupt mind dump
    if (h >= 10 && h < 13) setTab("earth");
    else if (h >= 14.5 && h < 17) setTab("earth");
    else if (h >= 17) setTab("heaven");
  }, [mode]);

  // Scroll dump to bottom
  useEffect(() => { dumpEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [dumpMessages]);

  const playAlarmSound = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = delay === 0 ? 528 : delay === 0.3 ? 660 : 528;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.8);
      });
    } catch {}
  };

  const fireConfetti = () => { setConfetti(true); setTimeout(() => setConfetti(false), 3000); };

  const toggleTask = (pillar, id) => {
    setTasks(prev => {
      const updated = prev[pillar].map(t => {
        if (t.id !== id) return t;
        if (t.type === "daily") {
          // Daily tasks: check in for today, track streak, never permanent
          const wasDone = t.done;
          const newDone = !wasDone;
          const wasYesterday = t.lastDone === new Date(Date.now()-86400000).toDateString();
          const newStreak = newDone ? (wasYesterday ? (t.streak||0)+1 : 1) : Math.max(0,(t.streak||0)-1);
          if (newDone && newStreak >= 3) fireConfetti();
          return {...t, done:newDone, lastDone:newDone?today():t.lastDone, streak:newStreak};
        }
        return {...t, done:!t.done};
      });
      const task = updated.find(t => t.id === id);
      if (task.done && task.type !== "daily") {
        fireConfetti();
        setWins(w => [{id:Date.now(),text:task.text,ts:Date.now()},...w.slice(0,29)]);
      } else if (task.done && task.type === "daily") {
        setWins(w => [{id:Date.now(),text:`✓ Daily: ${task.text}`,ts:Date.now()},...w.slice(0,29)]);
      }
      return {...prev, [pillar]: updated};
    });
  };

  const deleteTask = (pillar, id) => setTasks(prev => ({...prev, [pillar]: prev[pillar].filter(t => t.id !== id)}));

  const addTask = (pillar, text, priority, type="once") => {
    const item = { id:`u${uid++}`, text, priority, done:false, type };
    setTasks(prev => ({
      ...prev,
      [pillar]: [...prev[pillar], item].sort((a,b) => b.priority - a.priority)
    }));
  };

  const toggleDaily = (id) => {
    setDaily(prev => prev.map(d => {
      if (d.id !== id) return d;
      const wasDone = d.done;
      const newDone = !wasDone;
      const wasYesterday = d.lastDone === new Date(Date.now()-86400000).toDateString();
      const newStreak = newDone ? (wasYesterday ? d.streak + 1 : 1) : Math.max(0, d.streak - 1);
      if (newDone && newStreak >= 3) fireConfetti();
      return { ...d, done: newDone, lastDone: newDone ? today() : d.lastDone, streak: newStreak };
    }));
  };

  // ── MIND DUMP — CLAUDE AI ────────────────────────────────────────────────────
  const [aiLoading, setAiLoading] = useState(false);

  const SYSTEM_PROMPT = `You are the AI brain inside "Volumetric Intentionality" — a personal life OS built for a musician and entrepreneur with ADHD.

The user is a creator running three worlds simultaneously:
- AWNEST (Artists Working New Exciting Songs Together) — label services & music promotion
- A Live Events company
- Their own music career as an artist & performer — this is the North Star

DAILY SCHEDULE (weekdays):
9AM: Wake, shower, Reasonable Doubt walk with Charlie (his dog), burrito
10AM–1PM: Ruthless Execution I — AWNEST & business, no distractions
1PM–2PM: Break — Charlie walk, lunch
2–2:30PM: Clerical (emails, admin, cleaning)
2:30–5PM: Ruthless Execution II — close it out
5PM: THE SHIFT — steam shower, 4mg sativa, lotion, full reset. Earth ends. Heaven begins.
5:30–7PM: Dinner, unwind, Charlie walk 3, decompress
7PM–12AM: Creative hyper focus — music, art, creation
12–1AM: Lights out, relax, vibe
1–9AM: Sleep
Weekends: Fun with Suzie 11AM–2PM, R&R 3–7PM, Heaven mode 7PM–12AM

THREE PILLARS:
- Earth: work, business, AWNEST, deals, money, execution — cold, focused, ruthless
- Heaven: creative work, music, songwriting, recording, artistic vision — the North Star
- Balance: life, health, people, friendships, household, self-care

CURRENT TASKS (context only):
Earth: Blu & Exile tour pricing/dates, AWNEST socials, warm leads follow-up, Scott/Madstone, Isaac automaton, music business top-to-bottom, budget, Barry taxes/invoice
Heaven: Finalize ANDALE, On The Run, God Is; record Because Of You + new Breathe hook; Comp Ride On; album master level (ref HIMR); AWNEST brand voice; nativity set for Bon Anniversaire; content ideas
Balance: Call Jamie, Ryan, Rafy; blackout curtains; phone battery; computer chair; groceries; Charlie x3; haircut; frame art; clear front area; mini fridge; lights; lamp shade; dog toys; cheese + cream

YOUR ROLE:
- Be a direct, warm, brilliant chief of staff and creative partner
- Help them think, plan, prioritize, process stress, brainstorm — anything
- Keep responses tight and clear — ADHD brain needs signal, not noise
- When they dump tasks or to-dos, extract and file them automatically
- Match their energy: sharp during Earth hours, expansive during Heaven hours
- You know their schedule — if they say "I need to do X before my break" you know that means before 1PM

TASK EXTRACTION:
When you identify actionable tasks from what the user says, include this at the END of your response:
<tasks>[{"text":"task","pillar":"earth|heaven|balance","priority":1-10}]</tasks>
Priority: 10=do today, 8-9=this week critical, 6-7=important soon, 4-5=when possible, 1-3=someday
Only include <tasks> for clear actionable items, not for pure conversation or questions.`;

  const addMsg = (role, text, extracted) => {
    setDumpMessages(prev => [...prev, { id:Date.now()+Math.random(), role, text, extracted }]);
  };

  const handleDumpSubmit = async (inputVal) => {
    const val = (inputVal || "").trim();
    if (!val || aiLoading) return;
    addMsg("user", val);
    setAiLoading(true);

    try {
      const history = dumpMessages
        .filter(m => m.role === "user" || m.role === "ai")
        .slice(-20)
        .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      history.push({ role:"user", content: val });

      const res = await fetch("/.netlify/functions/claude", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: SYSTEM_PROMPT,
          messages: history,
        })
      });

      const data = await res.json();
      const raw = data.content?.[0]?.text || "Something went wrong. Try again.";

      // Extract and file tasks
      const taskMatch = raw.match(/<tasks>([\s\S]*?)<\/tasks>/);
      let extracted = [];
      if (taskMatch) {
        try {
          extracted = JSON.parse(taskMatch[1].trim());
          extracted.forEach(t => addTask(t.pillar, t.text, Math.min(10, Math.max(1, t.priority)), t.type||"once"));
          if (extracted.some(t => t.priority >= 8)) fireConfetti();
        } catch {}
      }

      const displayText = raw.replace(/<tasks>[\s\S]*?<\/tasks>/g, "").trim();
      addMsg("ai", displayText, extracted);

    } catch (err) {
      addMsg("ai", "Connection issue — check your API key in settings and try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── ALL TASKS SORTED ─────────────────────────────────────────────────────────
  const sorted = (pillar) => [...(tasks[pillar]||[])].sort((a,b) => b.priority - a.priority);
  const allDone = Object.values(tasks).flat().filter(t=>t.done).length;
  const allTotal = Object.values(tasks).flat().length;
  const pct = allTotal ? Math.round((allDone/allTotal)*100) : 0;

  // ── TASK LIST ────────────────────────────────────────────────────────────────
  const TaskList = ({ pillar }) => {
    const [newText, setNewText] = useState("");
    const [newPri, setNewPri] = useState(5);
    const [newType, setNewType] = useState("once");

    const allPillarTasks = sorted(pillar);
    const dailyTasks = allPillarTasks.filter(t => t.type === "daily");
    const onceTasks = allPillarTasks.filter(t => t.type !== "daily");
    const openOnce = onceTasks.filter(t => !t.done);
    const doneOnce = onceTasks.filter(t => t.done);

    // Daily framework items for this pillar
    const frameworkItems = daily.filter(d => d.pillar === pillar);

    const submit = () => {
      if (!newText.trim()) return;
      addTask(pillar, newText.trim(), newPri, newType);
      setNewText("");
    };

    const DailyCheckbox = ({ item, onToggle }) => {
      const streak = item.streak || 0;
      return (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",marginBottom:4,
          background: item.done ? (isH?"rgba(26,86,219,0.04)":"rgba(0,0,0,0.02)") : "#fff",
          border:`1px solid ${item.done?(isH?"rgba(26,86,219,0.2)":"#ddd"):"#f0f0f0"}`,
          borderRadius:isH?8:0, transition:"all 0.2s", cursor:"pointer"}}
          onClick={onToggle}>
          {/* Ring checkbox for daily */}
          <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${item.done?(isH?"#1a56db":"#111"):"#ddd"}`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",
            background:item.done?(isH?"#1a56db":"#111"):"transparent"}}>
            {item.done && <span style={{fontSize:9,color:"#fff"}}>✓</span>}
          </div>
          <span style={{flex:1,fontSize:12,color:item.done?"#aaa":"#333",textDecoration:item.done?"line-through":"none"}}>{item.text}</span>
          {streak > 0 && (
            <span style={{fontSize:9,color:isH?"#1a56db":"#888",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
              {streak}d 🔥
            </span>
          )}
          <span style={{fontSize:8,color:"#000",letterSpacing:"0.1em",marginLeft:4}}>DAILY</span>
        </div>
      );
    };

    return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Daily Framework for this pillar */}
        {frameworkItems.length > 0 && (
          <div>
            <div className={"section-label " + (isH?"heaven-sl":"earth-sl")} style={{marginBottom:8}}>Daily Framework</div>
            {frameworkItems.map(d => (
              <DailyCheckbox key={d.id} item={d} onToggle={() => toggleDaily(d.id)} />
            ))}
            {/* Daily tasks added by user for this pillar */}
            {dailyTasks.map(t => (
              <DailyCheckbox key={t.id} item={t} onToggle={() => toggleTask(pillar, t.id)} />
            ))}
          </div>
        )}
        {frameworkItems.length === 0 && dailyTasks.length > 0 && (
          <div>
            <div className={"section-label " + (isH?"heaven-sl":"earth-sl")} style={{marginBottom:8}}>Daily</div>
            {dailyTasks.map(t => (
              <DailyCheckbox key={t.id} item={t} onToggle={() => toggleTask(pillar, t.id)} />
            ))}
          </div>
        )}

        {/* One & Done divider */}
        {(frameworkItems.length > 0 || dailyTasks.length > 0) && (
          <div className={"divider " + (isH?"heaven-divider":"earth-divider")} />
        )}

        {/* Add task */}
        <div className={cardA}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input className={iCls} placeholder="Add a task..." value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
            <div style={{display:"flex",gap:6,marginBottom:2}}>
              {[["once","One & Done"],["daily","Daily"]].map(([v,l]) => (
                <button key={v} onClick={()=>setNewType(v)} style={{
                  fontSize:9,padding:"5px 12px",cursor:"pointer",letterSpacing:"0.1em",
                  background:newType===v?(isH?"rgba(26,86,219,0.12)":"#111"):"transparent",
                  color:newType===v?(isH?"#1a56db":"#fff"):"#aaa",
                  border:`1px solid ${newType===v?(isH?"rgba(26,86,219,0.4)":"#111"):"#e8e8e8"}`,
                  borderRadius:isH?20:0,transition:"all 0.15s"
                }}>{l}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,color:"#000",whiteSpace:"nowrap"}}>Priority</span>
                <input className={iCls} type="range" min="1" max="10" value={newPri} onChange={e=>setNewPri(Number(e.target.value))} style={{padding:"4px 0",border:"none",background:"transparent",width:"100%"}} />
                <span style={{fontSize:12,color:ac,width:16,textAlign:"center"}}>{newPri}</span>
              </div>
              <button className={btnS} onClick={submit} style={{whiteSpace:"nowrap"}}>ADD</button>
            </div>
          </div>
        </div>

        {/* Open one-and-done tasks */}
        {openOnce.length === 0 && frameworkItems.length === 0 && dailyTasks.length === 0 && (
          <div style={{textAlign:"center",padding:"24px",fontSize:11,color:"#000"}}>Clear. Use Mind Dump or add above.</div>
        )}
        {openOnce.length > 0 && (
          <div>
            <div className={"section-label " + (isH?"heaven-sl":"earth-sl")} style={{marginBottom:8}}>One & Done</div>
            {openOnce.map(t => (
              <div key={t.id} className={"tr " + trCls} onClick={()=>toggleTask(pillar,t.id)}>
                <div className={"cb " + cbCls} />
                <span className={"pb " + pbCls}>{t.priority}</span>
                <span style={{flex:1,fontSize:12,lineHeight:1.5,fontWeight:500,color:'#000'}}>{t.text}</span>
                <button onClick={e=>{e.stopPropagation();deleteTask(pillar,t.id);}} style={{background:"none",border:"none",color:"#000",cursor:"pointer",fontSize:15,padding:"2px 4px",flexShrink:0}}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Done (archived) */}
        {doneOnce.length > 0 && (
          <>
            <div className={"divider " + (isH?"heaven-divider":"earth-divider")} />
            <div className={"section-label " + (isH?"heaven-sl":"earth-sl")}>Completed</div>
            {doneOnce.map(t => (
              <div key={t.id} className={"tr " + trCls} style={{opacity:0.3}} onClick={()=>toggleTask(pillar,t.id)}>
                <div className={"cb " + cbCls + " done"}><span style={{fontSize:8,color:"#fff"}}>✓</span></div>
                <span style={{flex:1,fontSize:12,textDecoration:"line-through"}}>{t.text}</span>
                <button onClick={e=>{e.stopPropagation();deleteTask(pillar,t.id);}} style={{background:"none",border:"none",color:"#000",cursor:"pointer",fontSize:15,padding:"2px 4px"}}>×</button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  // ── SCREENS ───────────────────────────────────────────────────────────────────
  const DumpScreen = () => {
    const [localInput, setLocalInput] = useState("");
    const submit = () => {
      if (!localInput.trim()) return;
      handleDumpSubmit(localInput);
      setLocalInput("");
    };
    return (
      <div style={{display:"flex",flexDirection:"column",height:"calc(100svh - 190px)"}}>
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 0",display:"flex",flexDirection:"column",gap:16}}>
          {dumpMessages.map(m => (
            <div key={m.id} className={`msg msg-${m.role}`}>
              <div className={`msg-bubble ${isH ? (m.role==="ai"?"heaven-ai-bubble":"heaven-user-bubble") : (m.role==="ai"?"earth-ai-bubble":"earth-user-bubble")}`}
                style={{whiteSpace:"pre-line", lineHeight:1.7}}>
                {m.text}
              </div>
              {m.extracted && m.extracted.length > 0 && (
                <div style={{marginTop:8, display:"flex", flexWrap:"wrap", gap:6}}>
                  {m.extracted.map((t,i) => (
                    <div key={i} style={{fontSize:9, padding:"3px 10px", background: t.pillar==="earth"?"#f0f0f0":t.pillar==="heaven"?"rgba(26,86,219,0.1)":"rgba(0,160,100,0.08)", border:`1px solid ${t.pillar==="earth"?"#ddd":t.pillar==="heaven"?"rgba(26,86,219,0.3)":"rgba(0,160,100,0.2)"}`, color: t.pillar==="earth"?"#000":t.pillar==="heaven"?"#1a56db":"#2a7a50", borderRadius:20, letterSpacing:"0.05em"}}>
                      ✓ {t.pillar} · {t.priority} · {t.text.length > 30 ? t.text.slice(0,30)+"…" : t.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {aiLoading && (
            <div className="msg msg-ai">
              <div className={`msg-bubble ${isH?"heaven-ai-bubble":"earth-ai-bubble"}`}>
                <span style={{letterSpacing:"0.2em",color:"#000"}}>···</span>
              </div>
            </div>
          )}
          <div ref={dumpEndRef} />
        </div>
        <div style={{flexShrink:0,paddingTop:12,paddingBottom:8}}>
          <div style={{display:"flex",gap:8}}>
            <input
              className={iCls}
              placeholder={aiLoading ? "Thinking..." : "Talk to me. Tasks, ideas, stress, anything."}
              value={localInput}
              onChange={e=>setLocalInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              disabled={aiLoading}
              style={{fontSize:16}}
            />
            <button className={btnS} onClick={submit} disabled={aiLoading} style={{whiteSpace:"nowrap",padding:"11px 18px",opacity:aiLoading?0.5:1}}>→</button>
          </div>
          <div style={{fontSize:9,color:"#000",marginTop:6,textAlign:"center",letterSpacing:"0.1em"}}>
            Powered by Claude · Tasks auto-filed to your pillars
          </div>
        </div>
      </div>
    );
  };

  const OverviewScreen = () => (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Time + progress */}
      <div className={cardA}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}>
          <div>
            <div className={`df screen-title ${isH?"heaven-title":"earth-title"}`} style={{fontSize:"clamp(20px,5vw,32px)"}}>
              {currentTime.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </div>
            <div style={{fontSize:10,color:"#000",fontWeight:600,letterSpacing:"0.05em",marginTop:2}}>
              {currentTime.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="df" style={{fontSize:28,fontWeight:300,color:ac}}>{pct}%</div>
            <div style={{fontSize:9,color:"#CC0000",fontWeight:600,letterSpacing:"0.1em"}}>COMPLETE</div>
          </div>
        </div>
        <div className="prog-bar">
          <div className={isH?"heaven-prog-fill":"earth-prog-fill"} style={{width:`${pct}%`}} />
        </div>
        <div style={{fontSize:9,color:"#000",fontWeight:600,marginTop:4}}>{allDone} done · {allTotal-allDone} remaining</div>
      </div>

      {/* 3 pillar previews */}
      {["earth","heaven","balance"].map(pillar => {
        const open = sorted(pillar).filter(t=>!t.done);
        const top3 = open.slice(0,3);
        const labels = {earth:"Earth",heaven:"Heaven",balance:"Balance"};
        const subs = {earth:"Work & Business",heaven:"Creative & Music",balance:"Life, Health & People"};
        return (
          <div key={pillar} className={card} style={{cursor:"pointer"}} onClick={()=>setTab(pillar)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div className="df" style={{fontSize:18,fontWeight:400,color:ac}}>{labels[pillar]}</div>
                <div style={{fontSize:9,color:"#000",fontWeight:700,letterSpacing:"0.08em",marginTop:1}}>{subs[pillar]}</div>
              </div>
              <div style={{fontSize:9,color:"#000",letterSpacing:"0.15em"}}>{open.length} OPEN →</div>
            </div>
            {top3.map(t => (
              <div key={t.id} style={{fontSize:11,color:"#000",padding:"4px 0",borderTop:`1px solid ${isH?"rgba(147,197,253,0.1)":"#f0f0f0"}`,display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#000",width:14,textAlign:"center"}}>{t.priority}</span>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.text}</span>
              </div>
            ))}
            {open.length > 3 && <div style={{fontSize:9,color:"#000",marginTop:6,paddingTop:6,borderTop:`1px solid ${isH?"rgba(147,197,253,0.1)":"#f0f0f0"}`}}>+{open.length-3} more</div>}
          </div>
        );
      })}

      {/* Recent wins */}
      {wins.length > 0 && (
        <div className={card}>
          <div className={`section-label ${isH?"heaven-sl":"earth-sl"}`} style={{marginBottom:10}}>Recent Wins</div>
          {wins.slice(0,4).map((w,i) => (
            <div key={w.id} style={{fontSize:11,color:"#000",padding:"6px 0",borderTop:i>0?`1px solid ${isH?"rgba(147,197,253,0.1)":"#f5f5f5"}`:"none",display:"flex",gap:8}}>
              <span style={{color:ac}}>✓</span>{w.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ScheduleScreen = () => {
    const isWknd = [0,6].includes(currentTime.getDay());
    const sched = isWknd ? [
      {time:"10:00 AM",label:"Wake",detail:"Rest earned.",icon:"☀️"},
      {time:"11:00 AM",label:"Suzie Time",detail:"Something fun. Be present.",icon:"💛"},
      {time:"3:00 PM",label:"R&R",detail:"Recharge.",icon:"🛋️"},
      {time:"7:00 PM",label:"Heaven",detail:"Full creative session.",icon:"✦",block:true},
      {time:"12:00 AM",label:"Wind Down",detail:"Peace.",icon:"🌙"},
    ] : [
      {time:"9:00 AM",label:"Rise & Ritual",detail:"Wake · Shower · Reasonable Doubt · Charlie · Burrito",icon:"🌅",alarm:true},
      {time:"10:00 AM",label:"Execution I",detail:"AWNEST. Full focus.",icon:"⚔️",block:true,alarm:true},
      {time:"1:00 PM",label:"Break",detail:"Charlie · Lunch · Decompress",icon:"🐕",alarm:true},
      {time:"2:00 PM",label:"Clerical",detail:"Emails · Admin · Clean",icon:"📋"},
      {time:"2:30 PM",label:"Execution II",detail:"Close it out.",icon:"⚔️",block:true,alarm:true},
      {time:"5:00 PM",label:"The Shift",detail:"Earth → Heaven. Steam · Reset.",icon:"⚡",shift:true,alarm:true},
      {time:"5:30 PM",label:"Unwind",detail:"Dinner · Charlie 3",icon:"🍽️"},
      {time:"7:00 PM",label:"Creative Focus",detail:"Music · Art · Creation",icon:"✦",block:true,alarm:true},
      {time:"12:00 AM",label:"Lights Out",detail:"Wind down. Vibe.",icon:"🌙",alarm:true},
      {time:"1:00 AM",label:"Sleep",detail:"Rest.",icon:"💤"},
    ];
    const nowMins = currentTime.getHours()*60+currentTime.getMinutes();
    const parseM = str => { const[t,p]=str.split(" "); let[h,m]=t.split(":").map(Number); if(p==="PM"&&h!==12)h+=12; if(p==="AM"&&h===12)h=0; return h*60+(m||0); };
    const currentBlock = sched.find((b,i)=>{ const bm=parseM(b.time); const nx=sched[i+1]; if(!nx)return nowMins>=bm; return nowMins>=bm&&nowMins<parseM(nx.time); });

    return (
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {sched.map((b,i) => {
          const isCurrent = currentBlock?.time===b.time;
          return (
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 14px",background:isCurrent?(isH?"rgba(239,246,255,0.9)":"#f9f9f9"):"transparent",border:isCurrent?`1px solid ${isH?"rgba(26,86,219,0.3)":"#ddd"}`:"1px solid transparent",borderRadius:isH?8:0,transition:"all 0.3s"}}>
              <div style={{width:52,textAlign:"right",flexShrink:0,paddingTop:2}}>
                <span style={{fontSize:9,color:isCurrent?ac:"#bbb",letterSpacing:"0.05em"}}>{b.time}</span>
              </div>
              <div style={{width:1,background:isH?"rgba(147,197,253,0.2)":"#ebebeb",alignSelf:"stretch",marginTop:4,flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13}}>{b.icon}</span>
                  <span style={{fontSize:11,color:isCurrent?ac:b.block?"#333":"#888",fontWeight:b.block?"400":"300",letterSpacing:b.block?"0.05em":"0"}}>{b.label}</span>
                  {b.alarm&&<span style={{fontSize:8,color:"#000",marginLeft:4}}>🔔</span>}
                  {isCurrent&&<span style={{fontSize:8,color:ac,marginLeft:"auto",letterSpacing:"0.15em"}}>NOW</span>}
                </div>
                <div style={{fontSize:9,color:"#000",marginTop:2,paddingLeft:19}}>{b.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TABS = [
    {id:"dump",  label:"Mind Dump"},
    {id:"overview", label:"Overview"},
    {id:"earth", label:"Earth"},
    {id:"heaven",label:"Heaven"},
    {id:"balance",label:"Balance"},
    {id:"schedule",label:"Schedule"},
  ];

  const renderScreen = () => {
    if (tab==="dump")     return <DumpScreen />;
    if (tab==="overview") return <OverviewScreen />;
    if (tab==="earth")    return <TaskList pillar="earth" />;
    if (tab==="heaven")   return <TaskList pillar="heaven" />;
    if (tab==="balance")  return <TaskList pillar="balance" />;
    if (tab==="schedule") return <ScheduleScreen />;
    return null;
  };

  const tabTitles = {dump:"Mind Dump",overview:"Overview",earth:"Earth",heaven:"Heaven",balance:"Balance",schedule:"Schedule"};
  const tabSubs = {dump:"What's on your mind?",overview:"Your empire at a glance",earth:"Work & Business",heaven:"Creative & Music",balance:"Life, Health & People",schedule:"Your daily architecture"};

  return (
    <div className={`app ${isH?"heaven-app":"earth-app"}`}>
      <style>{CSS}</style>

      {/* Heaven background glow */}
      {isH && (
        <div className="heaven-bg-layer">
          <div style={{position:"absolute",top:"-10%",left:"50%",transform:"translateX(-50%)",width:"60vw",height:"60vw",maxWidth:400,maxHeight:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(191,219,254,0.12) 0%,rgba(147,197,253,0.05) 40%,transparent 70%)",animation:"haloBreath 5s ease-in-out infinite"}} />
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(147,197,253,0.06) 1px,transparent 1px)",backgroundSize:"30px 30px"}} />
        </div>
      )}

      {/* Confetti */}
      {confetti && (
        <div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none"}}>
          {[...Array(40)].map((_,i)=>(
            <div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-8px",width:`${4+Math.random()*5}px`,height:`${4+Math.random()*5}px`,background:isH?["#bfdbfe","#93c5fd","#3b82f6","#fff","#dbeafe"][Math.floor(Math.random()*5)]:["#111","#555","#888","#ccc","#333"][Math.floor(Math.random()*5)],borderRadius:Math.random()>0.5?"50%":"1px",animation:`confetti ${1.5+Math.random()*2}s ease-in ${Math.random()*0.5}s forwards`}} />
          ))}
        </div>
      )}

      {/* Alarm overlay */}
      {alarm && (
        <div className="alarm-overlay" onClick={()=>setAlarm(null)}>
          <div className={`alarm-box ${isH?"heaven-alarm":"earth-alarm"}`} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:28,marginBottom:16}}>🔔</div>
            <div className="df" style={{fontSize:22,fontWeight:400,color:ac,marginBottom:10,lineHeight:1.2}}>{alarm.label}</div>
            <div style={{fontSize:12,color:"#000",lineHeight:1.7,marginBottom:24,whiteSpace:"pre-line"}}>{alarm.msg}</div>
            <button className={btnS} onClick={()=>setAlarm(null)} style={{width:"100%"}}>GOT IT</button>
          </div>
        </div>
      )}

      <div style={{position:"relative",zIndex:1}}>
        {/* Header */}
        <div style={{padding:"18px 16px 0",maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div className="df" style={{fontSize:"clamp(11px,2.5vw,14px)",fontWeight:300,letterSpacing:"0.08em",color:isH?"rgba(26,86,219,0.7)":"#aaa"}}>
              Volumetric Intentionality
            </div>
            <div style={{fontSize:9,color:"#000",letterSpacing:"0.15em"}}>
              {currentTime.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} · {isH?"Heaven":"Earth"}
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{maxWidth:680,margin:"12px auto 0",position:"sticky",top:0,zIndex:10,background:isH?"rgba(250,250,248,0.95)":"rgba(255,255,255,0.97)",backdropFilter:"blur(8px)"}}>
          <div className={`nav ${isH?"heaven-nav":"earth-nav"}`}>
            {TABS.map(t => (
              <button key={t.id} className={`ntab ${isH?"heaven-ntab":"earth-ntab"} ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Screen header */}
        <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 0"}}>
          <div className={`df screen-title ${isH?"heaven-title":"earth-title"}`}>{tabTitles[tab]}</div>
          <div style={{fontSize:11,color:"#000",fontWeight:600,marginBottom:16,marginTop:2}}>{tabSubs[tab]}</div>
          <div className={`divider ${isH?"heaven-divider":"earth-divider"}`} />
        </div>

        {/* Content */}
        <div className="screen">
          {renderScreen()}
        </div>
      </div>

      {/* FAB — quick add (not on dump or schedule) */}
      {tab !== "dump" && tab !== "schedule" && (
        <button className={`fab ${isH?"hfab":"efab"}`} onClick={()=>setTab("dump")} title="Mind Dump">
          ✦
        </button>
      )}
    </div>
  );
}
