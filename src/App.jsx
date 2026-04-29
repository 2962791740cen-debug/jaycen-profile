import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight,
  Brain, TrendingUp, Cpu, Users, BookOpen,
  Zap, Target, BarChart3, Layers, Activity,
  CheckCircle2, Star, Clock, Flame, Compass,
  Shield, RefreshCcw, Play, Sparkles, Terminal
} from 'lucide-react';

// ─────────────────────────────────────────────
// 0. LANDING
// ─────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const [n1, setN1] = useState(false);
  const [n2, setN2] = useState(false);
  const [closed, setClosed] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [entryVisible, setEntryVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setN1(true), 600);
    const t2 = setTimeout(() => setN1(false), 3600);
    const t3 = setTimeout(() => setN2(true), 4200);
    const t4 = setTimeout(() => setN2(false), 7200);
    const t5 = setTimeout(() => { setClosed(true); setHeroVisible(true); }, 7800);
    const t6 = setTimeout(() => setEntryVisible(true), 11000);
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, []);

  const handleEnter = () => { setTransitioning(true); setTimeout(onEnter, 1200); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600&display=swap');
        .jc-n { font-size:clamp(1.3rem,2.8vw,1.9rem); color:#c8c8c8; font-weight:400; letter-spacing:0.18em; line-height:1.9; position:absolute; opacity:0; transform:translateZ(-80px); transition:all 1.1s cubic-bezier(0.2,0.8,0.2,1); max-width:760px; }
        .jc-n.on { opacity:1; transform:translateZ(0); }
        .jc-hero { opacity:0; transition:opacity 3s ease; }
        .jc-entry { margin-top:4rem; opacity:0; transition:opacity 1.5s ease; }
        .jc-entry.on { opacity:1; }
        .jc-out { transform:scale(3) translateY(-5%); opacity:0; filter:blur(25px); transition:all 1.2s ease-in; }
        .jc-btn:hover { background:rgba(255,255,255,0.06); letter-spacing:0.55em; }
      `}</style>
      <div className={`h-screen w-full bg-[#03030A] text-[#e0ddd8] relative overflow-hidden ${transitioning ? 'jc-out' : ''}`}
        style={{ fontFamily:"'Noto Serif SC',serif", perspective:'1200px' }}>

        {/* 顶部 */}
        <div className="absolute top-10 left-10 z-[100]">
          <div className="text-[11px] font-mono tracking-[0.5em] text-white/40 uppercase" style={{ fontFamily:"'Cinzel',serif" }}>Jaycen · Wang Jiaheng</div>
          <div className="text-[10px] tracking-[0.3em] text-white/20 mt-1 font-mono">Profile v1.0 · 2026</div>
        </div>
        <div className="absolute bottom-10 left-10 text-[11px] text-white/30 tracking-[0.12em] z-[100]">把混乱变成系统 · 把波动变成机制</div>
        <div className="absolute bottom-10 right-10 text-[11px] text-white/30 tracking-[0.12em] z-[100]">深圳 · 18岁 · 仍在成形</div>

        {/* 门 */}
        <div className="relative w-full h-full flex justify-center" style={{ transformStyle:'preserve-3d', zIndex:10 }}>
          <div className="absolute top-[-10%] h-[120%] transition-transform duration-[4200ms] ease-in-out"
            style={{ width:'50.5%', left:0, transformOrigin:'left center', transform:closed?'rotateY(0deg)':'rotateY(32deg)',
              background:'linear-gradient(92deg,#000 0%,#04040E 92%,#08081A 100%)',
              boxShadow:'inset -1px 0 1px rgba(255,255,255,0.06),12px 0 60px rgba(0,0,0,0.9)' }} />
          {/* 门缝 — 青蓝冷光 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full z-20 transition-opacity duration-[2000ms]"
            style={{ width:'3px', opacity:closed?1:0,
              background:'linear-gradient(180deg,transparent 0%,#0EA5E9 20%,#38BDF8 50%,#0EA5E9 80%,transparent 100%)',
              boxShadow:'0 0 35px rgba(14,165,233,0.7),0 0 12px rgba(56,189,248,0.5)' }} />
          <div className="absolute top-[-10%] h-[120%] transition-transform duration-[4200ms] ease-in-out"
            style={{ width:'50.5%', right:0, transformOrigin:'right center', transform:closed?'rotateY(0deg)':'rotateY(-32deg)',
              background:'linear-gradient(-92deg,#000 0%,#04040E 92%,#08081A 100%)',
              boxShadow:'inset 1px 0 1px rgba(255,255,255,0.06),-12px 0 60px rgba(0,0,0,0.9)' }} />

          {/* 文案层 */}
          <div className="absolute inset-0 z-[50] flex flex-col justify-center items-center text-center"
            style={{ transform:'translateZ(50px)', pointerEvents:'none' }}>
            <div className={`jc-n ${n1?'on':''}`}>
              把混乱，变成系统。<br/>
              <span style={{ fontWeight:300, fontSize:'0.65em', opacity:0.6, display:'block', marginTop:'14px', letterSpacing:'0.3em' }}>把波动，变成机制。</span>
            </div>
            <div className={`jc-n ${n2?'on':''}`}>
              不是在做事情，<br/>
              <span style={{ fontWeight:300, fontSize:'0.65em', opacity:0.6, display:'block', marginTop:'14px' }}>而是试图通过事情来塑造自己。</span>
            </div>
            <div className={`jc-hero ${heroVisible?'visible':''}`} style={{ opacity: heroVisible?1:0 }}>
              <div className="text-[10px] font-mono tracking-[0.6em] text-white/30 mb-6 uppercase" style={{ fontFamily:"'Cinzel',serif" }}>Wang Jiaheng · Profile</div>
              <h1 style={{ fontSize:'clamp(3rem,6vw,6rem)', fontWeight:700, letterSpacing:'0.15em', marginBottom:'1.2rem',
                fontFamily:"'Playfair Display',serif", textShadow:'0 0 30px rgba(14,165,233,0.3)' }}>
                王嘉恒
              </h1>
              <p style={{ fontSize:'clamp(0.85rem,1.4vw,1.1rem)', color:'#888', letterSpacing:'0.35em', fontWeight:300 }}>
                Jaycen · 正在成形中的系统
              </p>
              <div className={`jc-entry ${entryVisible?'on':''}`} style={{ pointerEvents:'auto' }}>
                <button onClick={handleEnter} className="jc-btn bg-transparent border border-white/20 text-white/80 px-10 py-4 transition-all duration-500"
                  style={{ fontFamily:"'Noto Serif SC',serif", fontSize:'0.9rem', letterSpacing:'0.45em', pointerEvents:'auto', cursor:'pointer' }}>
                  进入他的世界 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// 1. DIRECTORY
// ─────────────────────────────────────────────
const DirectoryPage = ({ onNavigate }) => {
  const [hov, setHov] = useState(null);

  const chapters = [
    { id:'01', mod:'ch01', tag:'WHO', title:'人物总述', sub:'PROFILE / 先给一个总判断', desc:'高度敏感、追求掌控、持续流动——这三股力量同时存在的年轻人。', action:'认识这个人', icon:Brain, size:'hero', color:'#0EA5E9' },
    { id:'02', mod:'ch02', tag:'TIMELINE', title:'成长时间线', sub:'JOURNEY / 不是直线', desc:'中考前的觉醒、国际路径的折返、荒废期、2025年秋的重建——一条多次折返的曲线。', action:'还原成长路径', icon:Clock, size:'tall', color:'#8B5CF6' },
    { id:'03', mod:'ch03', tag:'TRACKS', title:'三条主线', sub:'IP · 量化 · AI', desc:'内容IP已跑40期/20万播放，量化系统30万实盘+10%收益，AI工作流贯穿全链路。', action:'拆解三条主线', icon:Activity, size:'normal', color:'#10B981' },
    { id:'04', mod:'ch04', tag:'MINDSET', title:'思维与价值观', sub:'SYSTEM / 第一性原理', desc:'身体第一，注意力第二，语言第三——一套从失控感中反向逼出来的操作系统。', action:'理解底层逻辑', icon:Layers, size:'wide', color:'#F59E0B' },
    { id:'05', mod:'ch05', tag:'ASSETS', title:'优势资产', sub:'EDGE / 可复利能力', desc:'高开放度、迭代能力、系统感、表达潜能、人物张力——五类已经具备的可复利资产。', action:'盘点能力资产', icon:Star, size:'normal', color:'#EC4899' },
    { id:'06', mod:'final', tag:'FUTURE', title:'未来路线', sub:'VISION / 系统赢', desc:'不是单点赢，而是系统赢。IP × 量化 × AI，当多个模块连成系统，才是真正的护城河。', action:'看他的长期方向', icon:Compass, size:'tall', color:'#0EA5E9' },
  ];

  return (
    <div className="min-h-screen bg-[#F2F1EE] text-[#1A1A1A] font-sans selection:bg-[#0EA5E9] selection:text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-black/5 flex flex-col h-auto md:h-screen sticky top-0 z-20 flex-shrink-0">
        <div className="p-8 border-b border-black/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
            <span className="font-black tracking-tight text-lg">Jaycen</span>
          </div>
          <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase pl-5">Profile v1.0 · 2026</p>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest mb-4">// 档案目录</p>
            {chapters.map(c => (
              <button key={c.id} onClick={() => onNavigate(c.mod)}
                className="w-full text-left px-3 py-2.5 text-[11px] font-bold tracking-wide transition-all flex items-center gap-3 rounded-sm hover:bg-gray-50 text-gray-400 hover:text-[#1A1A1A]">
                <span className="font-mono text-gray-200">{c.id}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-black/5 pt-4 mt-4">
            <div className="text-[10px] font-mono text-gray-300">深圳 · 高三 · 18岁</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-mono text-[#10B981]">系统运行中</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-black mb-2 tracking-tight">
            人物<span className="text-[#0EA5E9]">档案室</span>.
          </h1>
          <p className="text-gray-400 text-sm font-mono">// 一个正在成形的系统 · 一份阶段性的人物底稿</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-5 pb-20">
          {chapters.map(item => {
            const colSpan = item.size === 'wide' ? 'md:col-span-2' : 'md:col-span-1';
            const isH = hov === item.id;
            return (
              <div key={item.id} onClick={() => onNavigate(item.mod)}
                onMouseEnter={() => setHov(item.id)} onMouseLeave={() => setHov(null)}
                className={`${colSpan} relative bg-white border border-black/5 cursor-pointer overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.12)]`}>
                <div className="absolute top-0 left-0 w-full h-1 transition-all duration-500 origin-left" style={{ background:item.color, transform:isH?'scaleX(1)':'scaleX(0)' }} />
                <div className="h-full p-7 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-1 rounded-sm"
                        style={{ background:isH?item.color:'#F2F1EE', color:isH?'white':'#999' }}>{item.tag}</span>
                      <span className="text-[10px] font-mono text-gray-300">{item.sub}</span>
                    </div>
                    <span className="font-mono text-3xl font-black text-gray-100">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl mb-3 text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-black/5 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full border transition-all duration-300" style={{ background:isH?item.color:'white', borderColor:isH?item.color:'#e5e5e5' }}>
                        <item.icon size={16} color={isH?'white':'#999'} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:item.color, opacity:isH?1:0 }}>{item.action}</span>
                    </div>
                    <ArrowUpRight size={15} className="transition-colors" style={{ color:isH?item.color:'#ddd' }} />
                  </div>
                </div>
                <item.icon strokeWidth={1} size={200} className="absolute -bottom-8 -right-8 transition-all duration-700"
                  style={{ color:item.color, opacity:isH?0.06:0.02, transform:isH?'scale(1.15) rotate(8deg)':'scale(1)' }} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// ─────────────────────────────────────────────
// 2. CH01 — 人物总述
// ─────────────────────────────────────────────
const ProfilePage = ({ onNextModule }) => {
  const [revealed, setRevealed] = useState([]);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', onScroll);
    return () => c.removeEventListener('scroll', onScroll);
  }, []);

  const reveal = (id) => setRevealed(p => p.includes(id)?p:[...p,id]);

  const forces = [
    { id:'f1', label:'开放 · 发散 · 变化快', icon:Sparkles, color:'#0EA5E9',
      front:'喜欢跳出框架重新定义问题，对新东西有天然的强烈兴趣。',
      back:'一旦被某个方向吸引，会快速切入、快速上手、快速迭代。这是他最强的起步引擎，也是最难收束的力量。' },
    { id:'f2', label:'系统 · 闭环 · 复利', icon:RefreshCcw, color:'#8B5CF6',
      front:'天然偏爱规则、回测、闭环机制，不甘心把人生交给情绪和惯性。',
      back:'每当感受到失控或空转，他的第一反应不是更努力，而是找机制——让系统替自己运行，哪怕状态不好的时候。' },
    { id:'f3', label:'掌控 · 选择权 · 自由', icon:Shield, color:'#10B981',
      front:'最厌恶的不是失败，而是"有潜能却被无力感磨成麻木"的状态。',
      back:'对他而言，钱的背后是选择权，选择权的背后是"人生方向盘握在自己手里"的状态。这是他所有努力的底层动机。' },
  ];

  const tags = ['深圳','高三','18岁','量化投资','内容IP','AI工作流','社群经营','第一性原理','长期主义','复利思维'];

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-[#F8F7F4] text-[#1A1A1A] font-sans scroll-smooth">
      <div className="fixed top-0 left-0 h-1 bg-[#0EA5E9] z-50 transition-all" style={{ width:`${progress*100}%` }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#F8F7F4]/85 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-gray-400" />
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.01 // PROFILE</span>
        </div>
        <div className="flex gap-1">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:revealed.length>i?'#0EA5E9':'#ddd' }} />)}
        </div>
      </nav>

      <section className="min-h-screen flex flex-col justify-center px-6 max-w-4xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0EA5E9] text-white text-[10px] font-mono font-bold mb-8 w-fit">PROFILE // 人物总述</div>
        <h1 className="text-5xl md:text-7xl font-black font-serif leading-[1.05] mb-10 text-[#1A1A1A]">
          一个高度敏感、<br/>强烈追求<span className="text-[#0EA5E9]">掌控感</span>，<br/>持续流动的年轻人。
        </h1>
        <div className="border-l-4 border-[#0EA5E9] pl-6 py-1 text-lg text-gray-500 font-serif max-w-2xl leading-relaxed">
          <p>他不是在做事情，而是试图通过事情来塑造自己；不是在找赛道，而是在找一种更适合自己长期运行的人生方式。</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map(t => <span key={t} className="px-3 py-1 bg-white border border-black/8 text-[11px] font-mono text-gray-500">{t}</span>)}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-px h-8 bg-[#0EA5E9]" />
            <h2 className="text-2xl font-serif font-black">三股并存的力量</h2>
            <span className="text-xs font-mono text-gray-400 ml-2">点击每张卡片揭开深层逻辑</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {forces.map(f => (
              <div key={f.id} onClick={() => reveal(f.id)} className="cursor-pointer group">
                <div className={`p-7 border-2 transition-all duration-400 ${revealed.includes(f.id)?'border-transparent text-white':'border-gray-100 bg-white hover:border-gray-200'}`}
                  style={{ background:revealed.includes(f.id)?f.color:'' }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-5 ${revealed.includes(f.id)?'bg-white/20':'bg-gray-50'}`}>
                    <f.icon size={18} color={revealed.includes(f.id)?'white':f.color} />
                  </div>
                  <h3 className="font-bold text-sm tracking-wide mb-4" style={{ color:revealed.includes(f.id)?'rgba(255,255,255,0.8)':f.color }}>{f.label}</h3>
                  <p className={`text-sm leading-relaxed ${revealed.includes(f.id)?'text-white/90':'text-gray-500'}`}>
                    {revealed.includes(f.id)?f.back:f.front}
                  </p>
                  {!revealed.includes(f.id) && <p className="text-xs text-gray-300 mt-4">点击揭开 →</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="bg-[#1A1A1A] text-white p-10 md:p-14">
            <div className="text-[#0EA5E9] text-[10px] font-mono font-bold uppercase tracking-widest mb-6">Core Quote // 核心句</div>
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-gray-100 mb-8 max-w-3xl">
              "他真正厌恶的，不只是失败或平庸，而是那种明明有想法、有野心、有潜能，却被无力感和惯性磨成麻木的人的状态。"
            </blockquote>
            <div className="grid md:grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { label:'最厌恶', val:'无力感 · 被推着走' },
                { label:'最追求', val:'掌控感 · 自己搭路径' },
                { label:'长期目标', val:'人生方向盘握在自己手里' },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">{item.label}</div>
                  <div className="text-white font-bold">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch02')} className="px-8 py-4 bg-[#0EA5E9] text-white font-bold tracking-widest hover:bg-[#0284c7] transition-all text-sm flex items-center gap-3">
            成长时间线 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 3. CH02 — 成长时间线
// ─────────────────────────────────────────────
const TimelinePage = ({ onNextModule }) => {
  const [activeNode, setActiveNode] = useState(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const fn = () => setProgress(c.scrollTop/(c.scrollHeight-c.clientHeight));
    c.addEventListener('scroll',fn);
    return ()=>c.removeEventListener('scroll',fn);
  },[]);

  const nodes = [
    { id:'n1', year:'更早', label:'掌控感萌芽', color:'#94A3B8',
      short:'最早的驱动力不是理想，而是"想要却不能决定"的刺痛。',
      detail:'手机、鞋子、消费品——这些只是表层。更深的痕迹是支配权不足。他对钱的敏感背后，并不只是物欲，而是"选择权和掌控感"的问题。这成为他后来被投资和系统深深吸引的底层原因。' },
    { id:'n2', year:'中考前', label:'第一次自律觉醒', color:'#8B5CF6',
      short:'意识到某些事情的重要性，进入短暂的强自律状态。',
      detail:'这是他第一次主动地想要抓住什么，而不是被推着走。虽然后来因为环境变化而中断，但这次觉醒留下了一个底层印象：原来自己是可以主动发力的。' },
    { id:'n3', year:'高一', label:'国际路径的折返', color:'#F59E0B',
      short:'转入国际体系，路径和环境都发生了较大变化，但这条路后来没有真正走通。',
      detail:'这次折返并不只是学业路线的调整，更是一次自我认知的更新。他开始意识到，路径本身不是问题，问题是"自己到底想要什么，想成为什么样的人"。' },
    { id:'n4', year:'高中期间', label:'混乱与荒废', color:'#EF4444',
      short:'经历了明显的混乱与荒废阶段——不是毫无感知地颓着，而是常常能意识到不对，但又拉不回来。',
      detail:'白天被A股波动牵引，晚上被短视频吞噬。短期兴奋与长期空虚交替，身体、关系、事业三条线都不理想。这段时间后来成为他重新搭系统的重要起点——因为他真正体会到了"温水煮青蛙"的感觉。' },
    { id:'n5', year:'2025.8—10', label:'关键转折：重建时刻', color:'#0EA5E9',
      short:'对"注意力没有投进会复利的地方"有了极深刻的体会，开始真正重建系统。',
      detail:'这不只是一次"痛改前非"。这次他更清楚地知道自己要什么——不是更努力，而是找到机制，让事情在自己状态好坏不同的时候都能持续运转。量化训练营、Python入门、策略回测——他用一个月把从0到1的链路跑通了。' },
    { id:'n6', year:'2025.10至今', label:'系统逐渐成形', color:'#10B981',
      short:'量化实盘、内容IP、AI工作流——三条主线同时运转。不再是想法，而是真正跑起来的东西。',
      detail:'30万量化实盘阶段性收益10%，40期内容全网20万播放，量化社区22期打赏变现约1万。这些数字不是终局，而是"闭环已经形成"的证明——他第一次真切体会到，原来很多事真的可以靠系统运行，而不是靠情绪撑。' },
  ];

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-[#050510] text-gray-200 font-sans scroll-smooth">
      <div className="fixed top-0 left-0 h-1 bg-[#8B5CF6] z-50 transition-all" style={{ width:`${progress*100}%` }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#050510]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-500" /><span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-500">CH.02 // TIMELINE</span>
        </div>
        <span className="text-[10px] font-mono text-[#8B5CF6]">不是直线，而是多次折返与重组</span>
      </nav>

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <div className="text-[10px] font-mono text-gray-600 tracking-[0.5em] uppercase mb-8">Archive 002 // Growth Timeline</div>
        <h1 className="text-5xl md:text-7xl font-black font-serif text-white leading-[1.05] mb-8">
          不是直线，<br/>而是<span className="text-[#8B5CF6]">折返与重组</span>。
        </h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">每一次荒废，都不是空白；每一次折返，都带着新的东西回来。</p>
        <div className="mt-12 animate-bounce text-gray-700 flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest">SCROLL</span><ChevronDown size={18}/>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-32 relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
        <div className="space-y-6">
          {nodes.map((node, i) => (
            <div key={node.id} className="relative pl-12">
              <div className="absolute left-[18px] top-6 w-3 h-3 rounded-full border-2 border-[#050510] transition-all duration-300 cursor-pointer"
                style={{ background:activeNode===node.id?node.color:'#333', boxShadow:activeNode===node.id?`0 0 16px ${node.color}`:'' }}
                onClick={() => setActiveNode(activeNode===node.id?null:node.id)} />
              <div className={`border transition-all duration-400 cursor-pointer ${activeNode===node.id?'border-white/20 bg-white/5':'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}
                onClick={() => setActiveNode(activeNode===node.id?null:node.id)}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-1 font-bold" style={{ background:`${node.color}20`, color:node.color }}>{node.year}</span>
                      <h3 className="font-bold text-white text-base">{node.label}</h3>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 transition-transform" style={{ transform:activeNode===node.id?'rotate(90deg)':'' }}/>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{node.short}</p>
                  {activeNode===node.id && (
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">{node.detail}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 border border-[#8B5CF6]/30 bg-[#8B5CF6]/5">
          <div className="text-[#8B5CF6] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">阶段总结</div>
          <p className="text-gray-300 font-serif text-lg leading-relaxed">"这不是一路很稳的人，而是在推倒重来中，逐渐长出方法论和秩序的人。"</p>
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={() => onNextModule('ch03')} className="px-8 py-4 border border-[#8B5CF6]/40 text-[#8B5CF6] font-bold tracking-widest hover:bg-[#8B5CF6] hover:text-white transition-all text-sm flex items-center gap-3">
            三条主线 <ArrowUpRight size={15}/>
          </button>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────
// 4. CH03 — 三条主线
// ─────────────────────────────────────────────
const TracksPage = ({ onNextModule }) => {
  const [activeTrack, setActiveTrack] = useState('ip');
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const fn = () => setProgress(c.scrollTop/(c.scrollHeight-c.clientHeight));
    c.addEventListener('scroll',fn);
    return ()=>c.removeEventListener('scroll',fn);
  },[]);

  const tracks = {
    ip: {
      label:'个人IP', tag:'CONTENT', color:'#10B981', icon:BookOpen,
      headline:'不是单纯发内容，而是把人生过程资产化。',
      desc:'他把内容理解成一种认知外化和过程资产化工具。不想包装成完美的人，而愿意把"怎么从混乱里搭系统"的过程记录下来。内容不是结果展示，而是成长中的一部分生产机制。',
      stats:[
        { label:'财经数字人', val:'40期+', sub:'2026年3月起号' },
        { label:'全网播放量', val:'~20万', sub:'持续更新中' },
        { label:'全网粉丝', val:'3000+', sub:'跨平台积累' },
        { label:'量化社区发布', val:'22期', sub:'打赏变现约1万' },
        { label:'公众号+小红书', val:'33期+', sub:'多平台布局' },
      ],
      insight:'逼自己把混乱讲清楚，把阶段感悟讲成人能吸收的东西，把短暂经历变成可复利的数字资产——这本身就是他人物结构的一部分。'
    },
    quant: {
      label:'量化投资', tag:'SYSTEM', color:'#0EA5E9', icon:BarChart3,
      headline:'第一次真正把"闭环"体验成现实。',
      desc:'量化对他意义极大，不是普通项目，而像一次深层人格经验。他用约一个月时间把从Python入门、策略研究、回测、实盘、自动交易这整条链路从0到1跑通，真切体会到"原来很多事情真的可以靠系统运行"。',
      stats:[
        { label:'实盘资金规模', val:'~30万', sub:'小市值策略' },
        { label:'阶段性收益率', val:'~10%', sub:'即约3万元' },
        { label:'建设周期', val:'约1个月', sub:'0→1完整链路' },
        { label:'系统类型', val:'全自动', sub:'24小时运行' },
      ],
      insight:'过去会被市场信息、盘中波动、情绪涨跌大量消耗注意力；而量化之后，他把市场的混乱外包给规则，让自己从"盯着波动的人"变成"优化系统的人"。'
    },
    ai: {
      label:'AI第二大脑', tag:'AMPLIFIER', color:'#F59E0B', icon:Cpu,
      headline:'不是聊天工具，而是认知放大器。',
      desc:'AI在他这里是一个更宏观的命题：能不能把AI真正接到自己的学习、写作、复盘、整理和工作流里，让它成为一个外置大脑和生产系统，而不是停留在聊天和搜答案层面。',
      stats:[
        { label:'核心定位', val:'外置大脑', sub:'不只是工具' },
        { label:'使用场景', val:'4大场景', sub:'写/学/复盘/生产' },
        { label:'与IP协同', val:'内容加速', sub:'脚本/框架/整理' },
        { label:'与量化协同', val:'策略辅助', sub:'代码/文档/分析' },
      ],
      insight:'AI对他最重要的，不是替代，而是放大：放大认知整理能力、放大内容生成效率、放大系统化思考、放大人物资产积累速度。'
    }
  };

  const t = tracks[activeTrack];

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-[#F8F7F4] text-[#1A1A1A] font-sans scroll-smooth">
      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width:`${progress*100}%`, background:t.color }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform"/>
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.03 // TRACKS</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(tracks).map(([k,v]) => (
            <button key={k} onClick={() => setActiveTrack(k)}
              className="px-3 py-1.5 text-[10px] font-mono font-bold transition-all"
              style={{ background:activeTrack===k?v.color:'transparent', color:activeTrack===k?'white':'#999', border:`1px solid ${activeTrack===k?v.color:'#e5e5e5'}` }}>
              {v.tag}
            </button>
          ))}
        </div>
      </nav>

      <section className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-[10px] font-mono font-bold mb-8 w-fit" style={{ background:t.color }}>
          <t.icon size={12}/><span>{t.label.toUpperCase()} // {t.tag}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black font-serif leading-[1.1] mb-8 text-[#1A1A1A]">{t.headline}</h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl font-serif">{t.desc}</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <section className="mb-16">
          <h2 className="text-xl font-serif font-black mb-6 text-[#1A1A1A]">关键数据</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.stats.map((s,i) => (
              <div key={i} className="bg-white p-6 border border-black/5">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">{s.label}</div>
                <div className="text-3xl font-black mb-1" style={{ color:t.color }}>{s.val}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="p-10 mb-16" style={{ background:t.color }}>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 mb-4">核心洞察</div>
          <p className="text-white font-serif text-xl leading-relaxed">"{t.insight}"</p>
        </div>

        <div className="bg-[#1A1A1A] text-white p-8 mb-10">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">三条线的关系</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { k:'ip', label:'个人IP', role:'外显载体', color:'#10B981' },
              { k:'quant', label:'量化投资', role:'长期硬核能力', color:'#0EA5E9' },
              { k:'ai', label:'AI工作流', role:'中间层放大器', color:'#F59E0B' },
            ].map(item => (
              <div key={item.k} className={`p-5 border transition-all cursor-pointer ${activeTrack===item.k?'border-white/30 bg-white/10':'border-white/5'}`}
                onClick={() => setActiveTrack(item.k)}>
                <div className="text-[10px] font-mono font-bold mb-2" style={{ color:item.color }}>{item.label}</div>
                <div className="text-gray-400 text-sm">{item.role}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-gray-600 text-sm font-mono">IP × 量化 × AI → 当多个模块联动，才形成真正的护城河</div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch04')} className="px-8 py-4 text-white font-bold tracking-widest transition-all text-sm flex items-center gap-3"
            style={{ background:t.color }}>
            思维与价值观 <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 5. CH04 — 思维与价值观
// ─────────────────────────────────────────────
const MindsetPage = ({ onNextModule }) => {
  const [openItem, setOpenItem] = useState(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const fn = () => setProgress(c.scrollTop/(c.scrollHeight-c.clientHeight));
    c.addEventListener('scroll',fn);
    return ()=>c.removeEventListener('scroll',fn);
  },[]);

  const os = [
    { rank:'01', label:'身体线', sub:'睡眠 · 饮食 · 运动', color:'#F59E0B', desc:'身体是电池。每当他陷入低能量、失控感，真正能把他拉回来的不是抽象激励，而是先把身体照顾好。这是底盘。' },
    { rank:'02', label:'注意力', sub:'燃料管理', color:'#0EA5E9', desc:'注意力是燃料，一旦被A股、短视频、信息流大量消耗，其他一切都会垮掉。他现在对"注意力有没有投进会复利的地方"极度敏感。' },
    { rank:'03', label:'语言', sub:'表达 · 组织世界', color:'#8B5CF6', desc:'语言是他输出和组织世界的中介。逼自己把混乱讲清楚，把阶段感悟讲成别人能吸收的东西，这本身就是他人物结构的一部分。' },
    { rank:'04', label:'影响力 · 财富 · 成就', sub:'外显结果层', color:'#10B981', desc:'这些是结果，而不是底盘。只有前三层稳了，这层才能持续产出。他已经不再只追结果，而开始意识到承载结果的底层介质。' },
  ];

  const principles = [
    { id:'p1', title:'第一性原理', desc:'不满足于"这是惯例"，喜欢把问题放回更高维的坐标系重新定义。', insight:'哪怕是父亲用主观交易的方式，他也会问：有没有更系统化、更可测量的路径？' },
    { id:'p2', title:'复利思维', desc:'不问"我今天做了什么"，而问"这件事会不会随时间增值"。', insight:'他对投资、IP、AI感兴趣的原因相同：这三件事的回报都会随着时间累积而放大。' },
    { id:'p3', title:'拒绝绝对化', desc:'天然反感非黑即白。很多事都要看边界条件、看场景、看视角。', insight:'这让他容纳复杂现实的能力更强，但同时也要求他在行动层面刻意练习聚焦。' },
    { id:'p4', title:'规则外包', desc:'不是让自己更拼命，而是找机制，让事情在状态不好时也能持续运转。', insight:'量化是最直接的实践：把市场的混乱外包给规则，从"盯着波动"变成"优化系统"。' },
  ];

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-[#F8F7F4] font-sans scroll-smooth">
      <div className="fixed top-0 left-0 h-1 bg-[#F59E0B] z-50 transition-all" style={{ width:`${progress*100}%` }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform"/>
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.04 // MINDSET</span>
        </div>
      </nav>

      <section className="min-h-screen flex flex-col justify-center px-6 max-w-4xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-mono font-bold mb-8 w-fit"><Layers size={12}/> MINDSET // 操作系统</div>
        <h1 className="text-5xl md:text-6xl font-black font-serif leading-[1.1] mb-8 text-[#1A1A1A]">
          不是被情绪推着走，<br/>而是<span className="text-[#F59E0B]">让系统运行</span>。
        </h1>
        <p className="text-gray-500 text-lg font-serif leading-relaxed max-w-2xl">身体第一，注意力第二，语言第三——一套从失控感中反向逼出来的人生操作系统雏形。</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <section className="mb-20">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A] mb-2">优先级排序</h2>
          <p className="text-sm text-gray-400 mb-8">不是抽象口号，而是从切身的失控感中反向逼出来的结论</p>
          <div className="space-y-3">
            {os.map((item,i) => (
              <div key={item.rank} className="flex gap-5 items-stretch">
                <div className="w-12 flex-shrink-0 flex items-center justify-center text-2xl font-black font-mono" style={{ color:item.color, opacity:0.3 }}>{item.rank}</div>
                <div className="flex-1 bg-white border border-black/5 p-6 flex gap-6 items-start">
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background:item.color }}/>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-[#1A1A1A]">{item.label}</span>
                      <span className="text-[10px] font-mono text-gray-400">{item.sub}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A] mb-2">思维原则</h2>
          <p className="text-sm text-gray-400 mb-8">点击展开每条原则背后的具体体现</p>
          <div className="grid md:grid-cols-2 gap-4">
            {principles.map(p => (
              <div key={p.id} onClick={() => setOpenItem(openItem===p.id?null:p.id)}
                className="bg-white border border-black/5 cursor-pointer hover:border-[#F59E0B]/40 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-[#1A1A1A]">{p.title}</h3>
                    <ChevronRight size={14} className="text-gray-300 transition-transform" style={{ transform:openItem===p.id?'rotate(90deg)':'' }}/>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  {openItem===p.id && (
                    <div className="mt-4 pt-4 border-t border-[#F59E0B]/20 bg-[#F59E0B]/5 -mx-6 -mb-6 px-6 pb-6">
                      <div className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-widest mb-2">实际体现</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{p.insight}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-[#1A1A1A] text-white p-10 mb-10">
          <div className="text-[#F59E0B] text-[10px] font-mono font-bold uppercase tracking-widest mb-6">关于父亲的影响</div>
          <p className="text-gray-300 font-serif text-lg leading-relaxed mb-6">父亲同时扮演了三个角色：引路人（投资启蒙）、现实参照物（资源与视角）、以及他既受影响又想超越的对象。</p>
          <div className="grid md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {['认同并借力','看到局限','想走得更远'].map((r,i) => (
              <div key={i} className="p-4 border border-white/5">
                <div className="text-[#F59E0B] text-[10px] font-mono font-bold mb-2">0{i+1}</div>
                <div className="text-white text-sm font-bold">{r}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch05')} className="px-8 py-4 bg-[#F59E0B] text-white font-bold tracking-widest hover:bg-[#D97706] transition-all text-sm flex items-center gap-3">
            优势资产 <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 6. CH05 — 优势资产
// ─────────────────────────────────────────────
const AssetsPage = ({ onNextModule }) => {
  const [unlocked, setUnlocked] = useState([]);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const fn = () => setProgress(c.scrollTop/(c.scrollHeight-c.clientHeight));
    c.addEventListener('scroll',fn);
    return ()=>c.removeEventListener('scroll',fn);
  },[]);

  const assets = [
    { id:'a1', icon:Zap, color:'#EC4899', label:'高开放度 & 学习欲',
      short:'对新东西有天然强烈兴趣，且不排斥从零重新开始。',
      detail:'无论是量化编程、内容生产、AI工作流、直播表达还是社群尝试，他都表现出较高的上手意愿。这是他最强的起步引擎，让他能在别人还在观望时已经跑起来。' },
    { id:'a2', icon:RefreshCcw, color:'#0EA5E9', label:'行动后的迭代能力',
      short:'不是第一次不好就退缩，而是一边做、一边观察、一边调整。',
      detail:'他最强的地方不是一开始就完美，而是愿意把东西先跑起来。内容从0到40期、量化从0到自动交易——这些都是迭代能力的直接体现。' },
    { id:'a3', icon:Target, color:'#10B981', label:'系统感',
      short:'天然会想闭环、复利、回测、规则外包、工作流这些概念，且已经部分实现。',
      detail:'并不是每个18岁的人都会自然去想"数字资产""闭环""复利"这些概念，而他不仅会想，还已经在现实里部分实现。长期竞争力很可能来自把多个模块连成系统。' },
    { id:'a4', icon:BookOpen, color:'#F59E0B', label:'表达潜能',
      short:'已经在持续输出、直播、镜头表达、连麦等方面完成明显突破。',
      detail:'表达力一旦继续打磨，会成为他非常关键的杠杆——因为它能让他的认知与行动成果被更多人看见、理解、放大。内容IP就是这个杠杆最直接的外显。' },
    { id:'a5', icon:Flame, color:'#8B5CF6', label:'人物张力',
      short:'高三、深圳、量化、IP、AI、社群——这些元素叠在一起天然形成吸引力。',
      detail:'一个人有没有吸引力，不只看做了多少事，还看其身上是否有"成长中的矛盾感"和"正在发生变化的力量感"。他既有野心和系统感，又保留了很强的感受力和生命力。这种组合很少见。' },
  ];

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-[#050510] text-gray-200 font-sans scroll-smooth">
      <div className="fixed top-0 left-0 h-1 bg-[#EC4899] z-50 transition-all" style={{ width:`${progress*100}%` }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#050510]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-500"/><span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-500">CH.05 // ASSETS</span>
        </div>
        <div className="text-[10px] font-mono text-[#EC4899]">{unlocked.length}/5 解锁</div>
      </nav>

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <div className="text-[10px] font-mono text-gray-600 tracking-[0.5em] uppercase mb-8">Archive 005 // Competitive Assets</div>
        <h1 className="text-5xl md:text-7xl font-black font-serif text-white leading-[1.05] mb-8">
          五类<span className="text-[#EC4899]">可复利</span><br/>的资产。
        </h1>
        <p className="text-gray-500 max-w-xl">不是零散特质，而是已经具备的、能随时间增值的能力资本。点击每张卡片解锁详细说明。</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {assets.map(asset => (
            <div key={asset.id} onClick={() => setUnlocked(p => p.includes(asset.id)?p:[...p,asset.id])}
              className={`cursor-pointer border-2 transition-all duration-400 ${unlocked.includes(asset.id)?'border-transparent':'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}
              style={{ background:unlocked.includes(asset.id)?`${asset.color}15`:'' }}>
              <div className="p-8">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:`${asset.color}20` }}>
                    <asset.icon size={20} color={asset.color}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{asset.label}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{asset.short}</p>
                  </div>
                  {!unlocked.includes(asset.id) && <div className="text-[10px] font-mono text-gray-700 flex-shrink-0 mt-1">点击解锁 →</div>}
                </div>
                {unlocked.includes(asset.id) && (
                  <div className="border-t pt-5" style={{ borderColor:`${asset.color}30` }}>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color:asset.color }}>深层逻辑</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{asset.detail}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {unlocked.length === 5 && (
          <div className="border border-[#EC4899]/30 bg-[#EC4899]/5 p-10 mb-10">
            <div className="text-[#EC4899] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">全部解锁 · 综合判断</div>
            <p className="text-white font-serif text-xl leading-relaxed">"他未来最值得下注的，不一定是单点赢，而是系统赢——当多个能力模块逐渐连成一套系统，才是真正的护城河。"</p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={() => onNextModule('final')} className="px-8 py-4 bg-[#EC4899] text-white font-bold tracking-widest hover:bg-[#DB2777] transition-all text-sm flex items-center gap-3">
            未来路线 <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 7. FINAL — 未来路线
// ─────────────────────────────────────────────
const FuturePage = ({ onNextModule }) => {
  const [openRisk, setOpenRisk] = useState(null);

  const directions = [
    { icon:BookOpen, color:'#10B981', label:'个人IP', role:'外显载体', desc:'以内容为外显机制，把认知和成长过程资产化，持续积累数字资产和人物势能。' },
    { icon:BarChart3, color:'#0EA5E9', label:'量化投资', role:'长期硬核能力', desc:'以系统和规则替代情绪，持续优化策略，让资产以复利方式自动增长。' },
    { icon:Cpu, color:'#F59E0B', label:'AI工作流', role:'放大层', desc:'把AI深度接入学习、写作、复盘全链路，成为连接IP与量化的效率中间层。' },
  ];

  const risks = [
    { id:'r1', label:'想法 > 承载能力', desc:'思维跨度大，容易同时启动多个方向。如果没有足够强的收束机制，会重新滑回"想得多做得少"的旧模式。' },
    { id:'r2', label:'情绪拉扯仍存在', desc:'碰到学业、父母预期、关系等不可控部分时，能量仍会出现明显回落。底层仍存在对失控感的高度敏感。' },
    { id:'r3', label:'过高自我预期', desc:'已经比很多同龄人更早接触了一些事，很容易形成"我必须尽快做得很不一样"的压力，可能让表达失去亲和力。' },
    { id:'r4', label:'关系系统尚未成熟', desc:'长期关系与情绪稳定器仍有拉扯。未来成长不只取决于项目推进速度，也取决于能否建立更成熟的关系能力。' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-sans overflow-y-auto">
      <nav className="sticky top-0 w-full px-6 py-4 flex justify-between items-center z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform"/>
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">FINAL // FUTURE</span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">不是单点赢，而是系统赢</span>
      </nav>

      <section className="min-h-[80vh] flex flex-col justify-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] font-mono font-bold mb-8 w-fit"><Compass size={12}/> VISION // 长期方向</div>
        <h1 className="text-5xl md:text-6xl font-black font-serif leading-[1.1] mb-8">
          不是单点赢，<br/>而是<span className="text-[#0EA5E9]">系统赢</span>。
        </h1>
        <p className="text-gray-500 text-lg font-serif leading-relaxed max-w-2xl">
          当IP、量化、AI三个模块联动起来，他就不再只是某个赛道里的参与者，而会形成自己的独特组合优势。初期不够稳定，但上限更高。
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <section className="mb-20">
          <h2 className="text-xl font-serif font-black mb-8">三线联动架构</h2>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {directions.map(d => (
              <div key={d.label} className="bg-white border border-black/5 p-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background:`${d.color}15` }}>
                  <d.icon size={18} color={d.color}/>
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color:d.color }}>{d.role}</div>
                <h3 className="font-black text-lg mb-3 font-serif">{d.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#1A1A1A] text-center py-5 text-gray-500 text-sm font-mono">
            IP × 量化 × AI &nbsp;→&nbsp; 认知 · 内容 · 系统 · 收益 · 人物资产 · 复利
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-xl font-serif font-black mb-2">当前风险点</h2>
          <p className="text-sm text-gray-400 mb-8">不是没潜力，而是需要更稳定的承载系统</p>
          <div className="space-y-3">
            {risks.map(r => (
              <div key={r.id} onClick={() => setOpenRisk(openRisk===r.id?null:r.id)}
                className="bg-white border border-black/5 cursor-pointer hover:border-gray-200 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400"/>
                      <span className="font-bold text-sm text-[#1A1A1A]">{r.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 transition-transform" style={{ transform:openRisk===r.id?'rotate(90deg)':'' }}/>
                  </div>
                  {openRisk===r.id && <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-black/5 pt-4">{r.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-[#1A1A1A] text-white p-12 mb-16">
          <div className="text-[#0EA5E9] text-[10px] font-mono font-bold uppercase tracking-widest mb-8">最终判断</div>
          <div className="space-y-6 max-w-2xl">
            {[
              '这不是一个已经完成的人，而是一个正在成形的系统。',
              '他已经明显地知道自己不想活成什么样，也越来越知道自己想争取什么样的人生状态。',
              '他真正想争的，不只是结果，而是人生的方向盘。',
            ].map((q,i) => (
              <p key={i} className={`font-serif leading-relaxed ${i===2?'text-2xl font-bold text-[#0EA5E9]':'text-lg text-gray-300'}`}>
                {i!==2 && <span className="text-[#0EA5E9]/30 font-black text-4xl mr-3 align-top leading-none">"</span>}{q}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('outro')} className="px-8 py-4 bg-[#0EA5E9] text-white font-bold tracking-widest hover:bg-[#0284c7] transition-all text-sm flex items-center gap-3">
            尾声 <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 8. OUTRO
// ─────────────────────────────────────────────
const OutroPage = ({ onRestart }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div onClick={onRestart} className="h-screen w-full bg-[#03030A] flex items-center justify-center cursor-pointer relative overflow-hidden">
      <style>{`
        .outro-in { opacity:0; transform:translateY(20px); transition:all 1.5s ease; }
        .outro-in.show { opacity:1; transform:translateY(0); }
      `}</style>
      <div className={`outro-in ${visible?'show':''} text-center px-8 relative z-10`}>
        <div className="text-[10px] font-mono text-white/20 tracking-[0.6em] uppercase mb-12" style={{ fontFamily:"'Cinzel',serif" }}>
          JAYCEN · WANG JIAHENG · 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-serif text-white mb-8 tracking-wide leading-tight"
          style={{ textShadow:'0 0 40px rgba(14,165,233,0.3)' }}>
          正在成形中的系统
        </h1>
        <p className="text-white/40 text-lg tracking-[0.2em] mb-4">仍在变化 · 仍会波动 · 仍保有火与感受力</p>
        <div className="w-16 h-px bg-[#0EA5E9] mx-auto my-8 opacity-40"/>
        <div className="space-y-2 text-white/25 text-sm font-mono">
          <p>IP · 量化 · AI · 系统赢</p>
          <p>身体第一 · 注意力第二 · 语言第三</p>
        </div>
        <p className="mt-16 text-white/20 text-xs tracking-widest font-mono animate-pulse">点击任意位置重新进入</p>
      </div>
      <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center, rgba(14,165,233,0.04) 0%, transparent 65%)' }}/>
    </div>
  );
};

// ─────────────────────────────────────────────
// App Router
// ─────────────────────────────────────────────
const App = () => {
  const [current, setCurrent] = useState('landing');
  const nav = (page) => setCurrent(page);

  const pages = {
    landing:   <LandingPage onEnter={() => nav('directory')} />,
    directory: <DirectoryPage onNavigate={nav} />,
    ch01:      <ProfilePage onNextModule={nav} />,
    ch02:      <TimelinePage onNextModule={nav} />,
    ch03:      <TracksPage onNextModule={nav} />,
    ch04:      <MindsetPage onNextModule={nav} />,
    ch05:      <AssetsPage onNextModule={nav} />,
    final:     <FuturePage onNextModule={nav} />,
    outro:     <OutroPage onRestart={() => nav('landing')} />,
  };

  const navItems = [
    {id:'directory',label:'目录'},
    {id:'ch01',label:'01'},
    {id:'ch02',label:'02'},
    {id:'ch03',label:'03'},
    {id:'ch04',label:'04'},
    {id:'ch05',label:'05'},
    {id:'final',label:'终'},
  ];

  return (
    <div className="relative">
      {current !== 'landing' && current !== 'outro' && (
        <div className="fixed bottom-4 right-4 z-[200] flex gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => nav(item.id)}
              className={`w-8 h-8 text-[10px] font-mono font-bold transition-all border ${current===item.id?'bg-[#0EA5E9] text-white border-[#0EA5E9]':'bg-white/90 text-gray-400 border-gray-200 hover:border-[#0EA5E9] hover:text-[#0EA5E9]'}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      {pages[current] || <DirectoryPage onNavigate={nav}/>}
    </div>
  );
};

export default App;
