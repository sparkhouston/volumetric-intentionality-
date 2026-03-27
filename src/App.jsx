import { useState, useEffect, useRef } from "react";

const SK = "vi_v8";
const load = () => { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } };
const save = (s) => { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} };

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
    { id:"h1", text:'Finalize "ANDALE"', priority:10, done:false, type:"once" },
    { id:"h2", text:'Finalize "On The Run"', priority:10, done:false, type:"once" },
    { id:"h3", text:'Finalize "God Is"', priority:10, done:false, type:"once" },
    { id:"h4", text:"Guitar / lyrics / woods world-building completion", priority:9, done:false, type:"once" },
    { id:"h5", text:"Finalize the AWNEST brand voice", priority:8, done:false, type:"once" },
    { id:"h6", text:'Record "Because Of You"', priority:8, done:false, type:"once" },
    { id:"h7", text:"Find consistent master level for album (reference HIMR)", priority:7, done:false, type:"once" },
    { id:"h8", text:'Record new "Breathe" hook', priority:7, done:false, type:"once" },
    { id:"h9", text:'Comp "Ride On"', priority:6, done:false, type:"once" },
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

const DAILY_FRAMEWORK = [
  { id:"df1", pillar:"balance", text:"Wake · Shower · Reasonable Doubt walk", icon:"🌅", time:"9:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df2", pillar:"balance", text:"Walk Charlie (morning)", icon:"🐕", time:"9:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df3", pillar:"balance", text:"Burrito", icon:"🌯", time:"9:30 AM", done:false, lastDone:null, streak:0 },
  { id:"df4", pillar:"earth", text:"Ruthless Execution I", icon:"⚔️", time:"10:00 AM", done:false, lastDone:null, streak:0 },
  { id:"df5", pillar:"balance", text:"Walk Charlie (midday) + Lunch", icon:"🐕", time:"1:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df6", pillar:"earth", text:"Clerical block", icon:"📋", time:"2:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df7", pillar:"earth", text:"Ruthless Execution II", icon:"⚔️", time:"2:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df8", pillar:"balance", text:"The Shift — steam, shower, reset", icon:"⚡", time:"5:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df9", pillar:"balance", text:"Dinner + unwind", icon:"🍽️", time:"5:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df10", pillar:"balance", text:"Walk Charlie (evening)", icon:"🐕", time:"6:30 PM", done:false, lastDone:null, streak:0 },
  { id:"df11", pillar:"heaven", text:"Creative hyper focus", icon:"✦", time:"7:00 PM", done:false, lastDone:null, streak:0 },
  { id:"df12", pillar:"balance", text:"Lights out · vibe · wind down", icon:"🌙", time:"12:00 AM", done:false, lastDone:null, streak:0 },
];

const ALARMS = [
  { h:9, m:0, label:"Rise & Ritual", msg:"Time to wake up. Shower. Reasonable Doubt. Charlie. Burrito. Let's go." },
  { h:10, m:0, label:"Execution I", msg:"10AM. Ruthless Execution begins. Lock in. No mercy." },
  { h:13, m:0, label:"Break Time", msg:"1PM. Take the break. Walk Charlie. Eat. You earned it." },
  { h:14, m:30, label:"Execution II", msg:"2:30PM. Back to work. Close it out." },
  { h:17, m:0, label:"The Shift", msg:"5PM. Earth is done. The Shift begins. Steam. Reset. Heaven awaits." },
  { h:19, m:0, label:"Creative Begins", msg:"7PM. Heaven hours. Create. This is your North Star." },
  { h:0, m:0, label:"Lights Out", msg:"Midnight. Wind down. Lights out. Rest." },
];

const SEED_GOALS = [
  { id:"goal1", text:"AWNEST becomes a consistent revenue-generating company", pillar:"earth", horizon:"1year", progress:10, notes:"Focus: artists, promo, consistency, deals" },
  { id:"goal2", text:"Release my album — fully mastered, distributed, promoted", pillar:"heaven", horizon:"6month", progress:35, notes:"3 tracks left to finalize" },
  { id:"goal3", text:"Blu & Exile tour fully executed", pillar:"earth", horizon:"3month", progress:15, notes:"Pricing and dates TBD" },
  { id:"goal4", text:"Guitar / Lyrics / Woods project complete", pillar:"heaven", horizon:"6month", progress:25, notes:"World-building in progress" },
  { id:"goal5", text:"Live Events company books 10+ shows", pillar:"earth", horizon:"1year", progress:5, notes:"" },
];

const HORIZONS = [
  {id:"1month",label:"1 Month"},
  {id:"3month",label:"3 Months"},
  {id:"6month",label:"6 Months"},
  {id:"1year",label:"1 Year"},
  {id:"3year",label:"3 Years"},
];

const getModeByHour = (h) => h >= 17 ? "heaven" : "earth";
const today = () => new Date().toDateString();
let uid = 5000;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#fff; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#ddd; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes alarmIn { 0%{opacity:0;transform:translateY(-20px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(540deg);opacity:0} }
  .app { font-family:'DM Mono',monospace; min-height:100vh; }
  .earth-app { background:#fff; color:#000; font-weight:500; }
  .heaven-app { background:#fff; color:#000; font-weight:500; }
  .df { font-family:'Cormorant Garamond',serif; }
  .nav { display:flex; border-bottom:1px solid; padding:0 16px; overflow-x:auto; scrollbar-width:none; }
  .nav::-webkit-scrollbar { display:none; }
  .earth-nav { border-color:#000; background:#fff; }
  .heaven-nav { border-color:#dbeafe; background:#fff; }
  .ntab { background:none; border:none; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.2em; padding:14px 14px; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; white-space:nowrap; text-transform:uppercase; }
  .earth-ntab { color:#000; font-weight:500; }
  .earth-ntab.active { color:#CC0000; border-bottom-color:#CC0000; font-weight:600; }
  .heaven-ntab { color:#000; }
  .heaven-ntab:hover { color:#1a56db; }
  .heaven-ntab.active { color:#1a56db; border-bottom-color:#1a56db; font-weight:600; }
  .ec { background:#fff; border:1px solid #ddd; padding:18px; }
  .eca { background:#f5f5f5; border:1px solid #ccc; padding:18px; }
  .hc { background:#fff; border:1px solid #dbeafe; border-radius:12px; padding:18px; }
  .hca { background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:18px; }
  .eb { background:#fff; border:1px solid #ccc; color:#000; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.15s; }
  .eb:hover { border-color:#000; }
  .ebs { background:#000; border:1px solid #000; color:#fff; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.15s; }
  .ebs:hover { background:#333; }
  .hb { background:transparent; border:1px solid #1a56db; color:#1a56db; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.2s; border-radius:4px; }
  .hbs { background:#1a56db; border:1px solid #1a56db; color:#fff; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; padding:9px 18px; cursor:pointer; text-transform:uppercase; transition:all 0.2s; border-radius:4px; }
  .hbs:hover { background:#1240b0; }
  input, select, textarea { font-family:'DM Mono',monospace; font-size:16px; padding:11px 14px; outline:none; width:100%; transition:border 0.2s; }
  .ei { background:#fff; border:1px solid #ccc; color:#000; font-weight:500; }
  .ei:focus { border-color:#000; }
  .hi { background:#fff; border:1px solid #bfdbfe; color:#000; border-radius:6px; }
  .hi:focus { border-color:#1a56db; }
  select option { background:#fff; color:#000; }
  .tr { display:flex; align-items:center; gap:10px; padding:12px 14px; margin-bottom:4px; transition:all 0.15s; cursor:pointer; }
  .etr { border-left:2px solid #eee; background:#fff; }
  .etr:hover { border-left-color:#CC0000; background:#fff8f8; }
  .htr { border-left:2px solid #bfdbfe; background:#fff; border-radius:0 6px 6px 0; }
  .htr:hover { border-left-color:#1a56db; background:#eff6ff; }
  .cb { width:15px; height:15px; border:1px solid; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .ecb { border-color:#000; }
  .ecb.done { background:#000; border-color:#000; }
  .hcb { border-color:#1a56db; border-radius:50%; }
  .hcb.done { background:#1a56db; border-color:#1a56db; }
  .pb { font-size:9px; letter-spacing:0.1em; padding:2px 7px; flex-shrink:0; }
  .epb { border:1px solid #CC0000; color:#CC0000; font-weight:700; }
  .hpb { border:1px solid #1a56db; color:#1a56db; border-radius:10px; font-weight:700; }
  .fab { position:fixed; bottom:24px; right:20px; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; border:none; z-index:50; transition:all 0.2s; }
  .efab { background:#000; color:#fff; box-shadow:0 2px 16px rgba(0,0,0,0.15); }
  .hfab { background:#1a56db; color:#fff; box-shadow:0 2px 24px rgba(26,86,219,0.3); }
  .alarm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; }
  .alarm-box { max-width:360px; width:100%; padding:36px 28px; text-align:center; animation:alarmIn 0.4s ease; }
  .earth-alarm { background:#fff; border:2px solid #000; }
  .heaven-alarm { background:#fff; border:2px solid #1a56db; border-radius:16px; }
  .msg { max-width:85%; }
  .msg-ai { align-self:flex-start; }
  .msg-user { align-self:flex-end; }
  .msg-bubble { padding:12px 16px; font-size:13px; line-height:1.6; }
  .earth-ai-bubble { background:#f5f5f5; color:#000; }
  .earth-user-bubble { background:#000; color:#fff; }
  .heaven-ai-bubble { background:#eff6ff; border:1px solid #bfdbfe; color:#000; border-radius:0 12px 12px 12px; }
  .heaven-user-bubble { background:#1a56db; color:#fff; border-radius:12px 0 12px 12px; }
  .screen { padding:20px 16px 80px; max-width:680px; margin:0 auto; }
  .prog-bar { height:2px; background:#eee; margin:8px 0; }
  .earth-prog-fill { background:#CC0000; height:100%; transition:width 0.6s ease; }
  .heaven-prog-fill { background:linear-gradient(90deg,#1a56db,#60a5fa); height:100%; transition:width 0.6s ease; }
  .screen-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,7vw,42px); font-weight:300; letter-spacing:-0.01em; margin-bottom:4px; }
  .earth-title { color:#000; font-weight:700; }
  .heaven-title { color:#1240b0; font-weight:700; }
  .divider { height:1px; margin:16px 0; }
  .earth-divider { background:#eee; }
  .heaven-divider { background:#dbeafe; }
  .section-label { font-size:8px; letter-spacing:0.3em; text-transform:uppercase; margin-bottom:10px; }
  .earth-sl { color:#CC0000; font-weight:700; letter-spacing:0.25em; }
  .heaven-sl { color:#1a56db; font-weight:700; letter-spacing:0.25em; }
`;

export default function App() {
  const saved = load();
  const nowH = new Date().getHours();
  const [mode, setMode] = useState(getModeByHour(nowH));
  const [tab, setTab] = useState("dump");
  const [tasks, setTasks] = useState(saved?.tasks || SEED);
  const [wins, setWins] = useState(saved?.wins || []);
  const [goals, setGoals] = useState(saved?.goals || SEED_GOALS);
  const [daily, setDaily] = useState(() => {
    const savedDaily = saved?.daily;
    if (savedDaily) {
      const lastDay = saved?.lastDay;
      if (lastDay !== new Date().toDateString()) {
        return savedDaily.map(d => ({...d, done:false}));
      }
      return savedDaily;
    }
    return DAILY_FRAMEWORK;
  });
  const [alarm, setAlarm] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [shownAlarms, setShownAlarms] = useState(saved?.shownAlarms || []);
  const [dumpMessages, setDumpMessages] = useState([
    { id:1, role:"ai", text:"What's on your mind? I know your world — just talk to me." }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
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
  const ac = isH ? "#1a56db" : "#CC0000";

  useEffect(() => { save({ tasks, wins, shownAlarms, daily, goals, lastDay: new Date().toDateString() }); }, [tasks, wins, shownAlarms, daily, goals]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("SW registered");
      }).catch(err => console.log("SW failed", err));
    }
    scheduleNotifications();
  }, []);

  const scheduleNotifications = async () => {
    if (!("Notification" in window)) return;
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return;
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({ type: "SCHEDULE_ALARMS", alarms: ALARMS });
      }
    }
    const now = new Date();
    ALARMS.forEach(alarm => {
      const alarmTime = new Date();
      alarmTime.setHours(alarm.h, alarm.m, 0, 0);
      const diff = alarmTime - now;
      if (diff > 0 && diff < 86400000) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification(alarm.label, { body: alarm.msg, icon: "/icon-192.png", tag: alarm.label });
          }
        }, diff);
      }
    });
  };

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

  useEffect(() => { dumpEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [dumpMessages]);

  const playAlarmSound = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = delay === 0.3 ? 660 : 528;
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
          const newDone = !t.done;
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
      }
      return {...prev
