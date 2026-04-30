import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight,
  Brain, TrendingUp, Cpu, Users, BookOpen,
  Zap, Target, BarChart3, Layers, Activity,
  CheckCircle2, Star, Clock, Flame, Compass,
  Shield, RefreshCcw, Play, Sparkles, Terminal, Heart,
  Eye, Award, MapPin, Share2, Copy, Check, Keyboard, X
} from 'lucide-react';

// ─────────────────────────────────────────────
// 主题色板
// ─────────────────────────────────────────────
const C = {
  red:'#7F1D1D', redV:'#B91C1C', redL:'#DC2626', wine:'#450A0A',
  black:'#0A0606', charcoal:'#1F2937', cream:'#F4EEE8', paper:'#FFFBF5',
  copper:'#B45309', amber:'#92400E', ink:'#1A1414',
};

// ─────────────────────────────────────────────
// 全局状态
// ─────────────────────────────────────────────
const STATE = {
  startTime: Date.now(),
  pagesVisited: new Set(),
  forcesFlipped: new Set(),
  assetsUnlocked: new Set(),
  timelineExplored: new Set(),
  principlesOpened: new Set(),
  quizCompleted: false,
};

const getVisitCount = () => {
  try {
    const v = parseInt(localStorage.getItem('jaycen_visits') || '0') + 1;
    localStorage.setItem('jaycen_visits', v);
    return v;
  } catch { return 1; }
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ─────────────────────────────────────────────
// 工具：滚动触发淡入
// ─────────────────────────────────────────────
const useFadeIn = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
    }}>{children}</div>
  );
};

// ─────────────────────────────────────────────
// 全局视觉资产：颗粒、光晕、装饰线
// ─────────────────────────────────────────────
const GrainOverlay = ({ opacity = 0.06 }) => (
  <div className="fixed inset-0 pointer-events-none z-[5]" style={{
    opacity, mixBlendMode: 'overlay',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
  }} />
);

// 鼠标红光跟随（深色页）
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isMobile()) return;
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  if (isMobile()) return null;
  return (
    <div className="fixed pointer-events-none z-[3] transition-opacity duration-300" style={{
      left: pos.x - 250, top: pos.y - 250, width: 500, height: 500,
      opacity: hidden ? 0 : 1,
      background: 'radial-gradient(circle, rgba(220,38,38,0.13) 0%, rgba(127,29,29,0.04) 30%, transparent 65%)',
      filter: 'blur(30px)', willChange: 'transform'
    }} />
  );
};

// 标题下划线动画
const AnimatedHeading = ({ children, color = '#DC2626', className = '' }) => {
  const [ref, visible] = useFadeIn(0.4);
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
      <div className="h-[3px] mt-2 origin-left" style={{
        background: color,
        width: visible ? '100%' : '0%',
        transition: 'width 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.2s',
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// 工具：动画数字
// ─────────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 1400 }) => {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const m = String(value).match(/^([^0-9]*)([\d.]+)([^0-9]*)$/);
        if (!m) { setDisplay(String(value)); return; }
        const [, pre, num, post] = m;
        const target = parseFloat(num);
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const cur = (target * eased);
          const formatted = num.includes('.') ? cur.toFixed(1) : Math.floor(cur);
          setDisplay(`${pre}${formatted}${post}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
};

// ─────────────────────────────────────────────
// 浮动分享按钮
// ─────────────────────────────────────────────
const ShareButton = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const text = 'Jaycen · 王嘉恒 · 正在成形中的系统';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const tryNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text: '一份18岁的人物档案', url });
      } catch {}
    } else {
      copyLink();
    }
  };

  return (
    <div className="fixed bottom-3 md:bottom-4 left-3 md:left-4 z-[200]"
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
      {open && (
        <div className="absolute bottom-12 left-0 bg-white border border-black/10 shadow-2xl rounded-sm p-2 min-w-[200px]">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-3 py-2">分享 / SHARE</div>
          <button onClick={tryNativeShare} className="w-full text-left px-3 py-2.5 text-sm hover:bg-red-50 hover:text-[#7F1D1D] flex items-center gap-2 transition-colors">
            <Share2 size={14} /> 系统分享
          </button>
          <button onClick={copyLink} className="w-full text-left px-3 py-2.5 text-sm hover:bg-red-50 hover:text-[#7F1D1D] flex items-center gap-2 transition-colors">
            {copied ? <><Check size={14} color={C.redL}/><span style={{color:C.redL}}>已复制!</span></> : <><Copy size={14}/> 复制链接</>}
          </button>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="w-11 h-11 md:w-10 md:h-10 bg-white border border-black/10 hover:border-[#DC2626] flex items-center justify-center shadow-lg transition-all hover:bg-[#DC2626] active:scale-95 group">
        {open ? <X size={16} className="text-gray-400 group-hover:text-white"/> : <Share2 size={16} className="text-gray-400 group-hover:text-white"/>}
      </button>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 0. LANDING
// ═════════════════════════════════════════════════════════════
const LandingPage = ({ onEnter }) => {
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [n1Sub, setN1Sub] = useState('');
  const [n2Sub, setN2Sub] = useState('');
  const [phase, setPhase] = useState(0);
  const [closed, setClosed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [visitCount] = useState(() => getVisitCount());
  const [mobile] = useState(() => isMobile());
  const containerRef = useRef(null);

  useEffect(() => {
    const typeText = (target, setter, delay = 80) => new Promise(resolve => {
      let i = 0;
      const tick = () => {
        if (i <= target.length) { setter(target.substring(0, i)); i++; setTimeout(tick, delay); }
        else resolve();
      };
      tick();
    });

    const seq = async () => {
      await new Promise(r => setTimeout(r, 800));
      setPhase(1);
      await typeText('把混乱，变成系统。', setN1, 110);
      await new Promise(r => setTimeout(r, 400));
      await typeText('把波动，变成机制。', setN1Sub, 100);
      await new Promise(r => setTimeout(r, 1600));
      setN1(''); setN1Sub('');
      setPhase(2);
      await typeText('不是在做事情，', setN2, 110);
      await new Promise(r => setTimeout(r, 300));
      await typeText('而是试图通过事情来塑造自己。', setN2Sub, 90);
      await new Promise(r => setTimeout(r, 1800));
      setN2(''); setN2Sub('');
      setClosed(true);
      setPhase(3);
      await new Promise(r => setTimeout(r, 2400));
      setPhase(4);
    };
    seq();
  }, []);

  const handleMove = (e) => {
    if (mobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleEnter = () => { setTransitioning(true); setTimeout(onEnter, 1200); };

  // 跳过动画（移动端 / 重复访客）
  const skipToHero = () => {
    setN1(''); setN1Sub(''); setN2(''); setN2Sub('');
    setClosed(true); setPhase(4);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600&display=swap');
        .typewriter::after { content: '|'; animation: blink 1s steps(2) infinite; color: #DC2626; margin-left: 2px; opacity: 0.7; }
        @keyframes blink { 50% { opacity: 0; } }
        .jc-out { transform: scale(2.5) translateY(-3%); opacity: 0; filter: blur(20px); transition: all 1.2s ease-in; }
        .jc-btn:hover { background: rgba(220,38,38,0.15); border-color: #DC2626; color: #fff; letter-spacing: 0.55em; box-shadow: 0 0 40px rgba(220,38,38,0.5); }
        @keyframes flicker { 0%,100% {opacity:1} 47% {opacity:0.92} 50% {opacity:1} 53% {opacity:0.94} }
        .flame-line { animation: flicker 2.4s ease-in-out infinite; }
        @keyframes float-ember {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(40px); opacity: 0; }
        }
        .ember { position: absolute; bottom: 0; width: 2px; height: 2px; background: #DC2626; border-radius: 50%; box-shadow: 0 0 8px #DC2626, 0 0 4px #FCA5A5; animation: float-ember linear infinite; }
        @keyframes orb-drift {
          0%,100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -40px); }
          50% { transform: translate(-20px, -60px); }
          75% { transform: translate(-40px, -20px); }
        }
        .orb { position: absolute; border-radius: 50%; filter: blur(40px); pointer-events: none; }
        @keyframes pulse-counter { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        .pulse-c { animation: pulse-counter 3s ease-in-out infinite; }
        @keyframes skip-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .skip-btn { animation: skip-pulse 2.5s ease-in-out infinite; }
      `}</style>
      <div ref={containerRef} onMouseMove={handleMove}
        className={`h-screen w-full text-[#e0d8d4] relative overflow-hidden ${transitioning ? 'jc-out' : ''}`}
        style={{ background: C.black, fontFamily: "'Noto Serif SC',serif", perspective: '1200px', cursor: mobile ? 'auto' : 'none' }}>

        {/* 鼠标光晕 — 桌面端独有 */}
        {!mobile && (
          <>
            <div className="absolute pointer-events-none transition-transform duration-100 ease-out z-30"
              style={{
                left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, rgba(127,29,29,0.08) 30%, transparent 70%)',
                filter: 'blur(20px)', willChange: 'transform'
              }} />
            <div className="absolute pointer-events-none z-[200] transition-transform duration-75"
              style={{ left: mousePos.x - 4, top: mousePos.y - 4, width: 8, height: 8, borderRadius: '50%', background: '#DC2626', boxShadow: '0 0 12px #DC2626' }} />
          </>
        )}

        {/* 环境漂浮光球 */}
        <div className="orb" style={{ width: 280, height: 280, left: '10%', top: '20%', background: 'radial-gradient(circle, rgba(127,29,29,0.35), transparent 70%)', animation: 'orb-drift 18s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 200, height: 200, right: '15%', top: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.25), transparent 70%)', animation: 'orb-drift 22s ease-in-out infinite reverse' }} />
        <div className="orb" style={{ width: 240, height: 240, left: '40%', bottom: '10%', background: 'radial-gradient(circle, rgba(180,83,9,0.18), transparent 70%)', animation: 'orb-drift 26s ease-in-out infinite' }} />

        {/* 余烬粒子 */}
        {!mobile && Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="ember" style={{ left: `${(i * 7 + 5) % 100}%`, animationDelay: `${i * 1.3}s`, animationDuration: `${8 + (i % 4) * 2}s` }} />
        ))}

        {/* 顶部 */}
        <div className="absolute top-6 md:top-10 left-6 md:left-10 z-[100]">
          <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] md:tracking-[0.5em] text-white/40 uppercase" style={{ fontFamily: "'Cinzel',serif" }}>Jaycen · Wang Jiaheng</div>
          <div className="text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] text-white/20 mt-1 font-mono">Profile v4.0 · 2026</div>
        </div>

        {/* 访客计数 */}
        <div className="absolute top-6 md:top-10 right-6 md:right-10 z-[100] text-right pulse-c">
          <div className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">Visitor</div>
          <div className="text-[20px] md:text-[28px] font-bold mt-1" style={{ color: C.redL, fontFamily: "'Playfair Display',serif" }}>
            #{String(visitCount).padStart(3, '0')}
          </div>
          <div className="text-[9px] md:text-[10px] font-mono text-white/20 mt-1">第 {visitCount} 次访问</div>
        </div>

        {/* 跳过按钮 — 在文案阶段可见 */}
        {phase < 4 && phase > 0 && (
          <button onClick={skipToHero}
            className="skip-btn absolute bottom-20 left-1/2 -translate-x-1/2 z-[100] text-[10px] font-mono tracking-[0.3em] text-white/40 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-all uppercase"
            style={{ cursor: mobile ? 'pointer' : 'none' }}>
            点击跳过 →
          </button>
        )}

        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 text-[10px] md:text-[11px] text-white/30 tracking-[0.1em] z-[100]">把混乱变成系统</div>
        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 text-[10px] md:text-[11px] text-white/30 tracking-[0.1em] z-[100]">深圳 · 18岁</div>

        {/* 门 */}
        <div className="relative w-full h-full flex justify-center" style={{ transformStyle: 'preserve-3d', zIndex: 10 }}>
          <div className="absolute top-[-10%] h-[120%] transition-transform duration-[4200ms] ease-in-out"
            style={{ width: '50.5%', left: 0, transformOrigin: 'left center', transform: closed ? 'rotateY(0deg)' : 'rotateY(32deg)',
              background: 'linear-gradient(92deg,#000 0%,#0a0606 92%,#1a0a0a 100%)',
              boxShadow: 'inset -1px 0 1px rgba(255,200,200,0.06),12px 0 60px rgba(0,0,0,0.95)' }} />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-full z-20 transition-opacity duration-[2000ms] ${closed ? 'flame-line' : ''}`}
            style={{ width: '4px', opacity: closed ? 1 : 0,
              background: 'linear-gradient(180deg,transparent 0%,#7F1D1D 15%,#DC2626 35%,#FCA5A5 50%,#DC2626 65%,#7F1D1D 85%,transparent 100%)',
              boxShadow: '0 0 60px rgba(220,38,38,0.8),0 0 18px rgba(252,165,165,0.7)' }} />
          <div className="absolute top-[-10%] h-[120%] transition-transform duration-[4200ms] ease-in-out"
            style={{ width: '50.5%', right: 0, transformOrigin: 'right center', transform: closed ? 'rotateY(0deg)' : 'rotateY(-32deg)',
              background: 'linear-gradient(-92deg,#000 0%,#0a0606 92%,#1a0a0a 100%)',
              boxShadow: 'inset 1px 0 1px rgba(255,200,200,0.06),-12px 0 60px rgba(0,0,0,0.95)' }} />

          <div className="absolute inset-0 z-[50] flex flex-col justify-center items-center text-center px-6"
            style={{ transform: 'translateZ(50px)', pointerEvents: 'none' }}>
            {phase === 1 && (
              <div className="max-w-3xl">
                <p className="typewriter text-2xl md:text-4xl font-medium tracking-[0.12em] md:tracking-[0.15em] text-[#ddd]" style={{ minHeight: '1.5em' }}>{n1}</p>
                <p className={`mt-4 md:mt-6 text-base md:text-xl text-[#999] tracking-[0.2em] md:tracking-[0.25em] font-light ${n1Sub.length > 0 ? 'typewriter' : ''}`} style={{ minHeight: '1.5em' }}>{n1Sub}</p>
              </div>
            )}
            {phase === 2 && (
              <div className="max-w-3xl">
                <p className="typewriter text-2xl md:text-4xl font-medium tracking-[0.12em] md:tracking-[0.15em] text-[#ddd]" style={{ minHeight: '1.5em' }}>{n2}</p>
                <p className={`mt-4 md:mt-6 text-base md:text-xl text-[#999] tracking-[0.2em] md:tracking-[0.25em] font-light ${n2Sub.length > 0 ? 'typewriter' : ''}`} style={{ minHeight: '1.5em' }}>{n2Sub}</p>
              </div>
            )}
            {phase >= 3 && (
              <div style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 2.5s ease' }}>
                <div className="text-[10px] font-mono tracking-[0.5em] md:tracking-[0.6em] text-white/30 mb-6 uppercase" style={{ fontFamily: "'Cinzel',serif" }}>Wang Jiaheng · Profile</div>
                <h1 style={{
                  fontSize: 'clamp(2.5rem,8vw,6rem)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1.2rem',
                  fontFamily: "'Playfair Display',serif", textShadow: '0 0 50px rgba(220,38,38,0.5)', color: '#fff'
                }}>王嘉恒</h1>
                <p style={{ fontSize: 'clamp(0.8rem,1.4vw,1.1rem)', color: '#a89189', letterSpacing: '0.3em', fontWeight: 300 }}>
                  Jaycen · 正在成形中的系统
                </p>
                <div style={{ marginTop: '3rem', opacity: phase >= 4 ? 1 : 0, transition: 'opacity 1.5s ease', pointerEvents: 'auto' }}>
                  <button onClick={handleEnter} className="jc-btn bg-transparent border text-white/80 px-6 md:px-10 py-3 md:py-4 transition-all duration-500"
                    style={{ borderColor: 'rgba(220,38,38,0.3)', fontFamily: "'Noto Serif SC',serif", fontSize: '0.85rem', letterSpacing: '0.4em', cursor: mobile ? 'pointer' : 'none' }}>
                    进入他的世界 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ═════════════════════════════════════════════════════════════
// 1. DIRECTORY
// ═════════════════════════════════════════════════════════════
const DirectoryPage = ({ onNavigate, completedChapters }) => {
  const [hov, setHov] = useState(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });

  const chapters = [
    { id:'01', mod:'ch01', tag:'WHO', title:'人物总述', sub:'PROFILE / 先给一个总判断', desc:'高度敏感、追求掌控、持续流动——这三股力量同时存在的年轻人。', action:'认识这个人', icon:Brain, size:'hero', color:C.redV, peek:'三股力量 · 翻转卡片 · 合成时刻' },
    { id:'02', mod:'ch02', tag:'TIMELINE', title:'成长时间线', sub:'JOURNEY / 不是直线', desc:'中考前的觉醒、国际路径的折返、荒废期、2025年秋的重建——一条多次折返的曲线。', action:'还原成长路径', icon:Clock, size:'tall', color:C.amber, peek:'6个关键节点 · SVG能量曲线' },
    { id:'03', mod:'ch03', tag:'TRACKS', title:'三条主线', sub:'IP · 量化 · AI', desc:'内容IP已跑40期/20万播放，量化系统30万实盘+10%收益，AI工作流贯穿全链路。', action:'拆解三条主线', icon:Activity, size:'normal', color:C.copper, peek:'真实数据 · 滚动动画' },
    { id:'04', mod:'ch04', tag:'MINDSET', title:'思维与价值观', sub:'SYSTEM / 第一性原理', desc:'身体第一，注意力第二，语言第三——一套从失控感中反向逼出来的操作系统。', action:'理解底层逻辑', icon:Layers, size:'wide', color:C.charcoal, peek:'四层优先级 · 四条思维原则' },
    { id:'05', mod:'ch05', tag:'ASSETS', title:'优势资产', sub:'EDGE / 可复利能力', desc:'高开放度、迭代能力、系统感、表达潜能、人物张力——五类已经具备的可复利资产。', action:'盘点能力资产', icon:Star, size:'normal', color:C.red, peek:'5张解锁卡 · 全解锁庆祝' },
    { id:'06', mod:'final', tag:'FUTURE', title:'未来路线', sub:'VISION / 系统赢', desc:'不是单点赢，而是系统赢。IP × 量化 × AI，当多个模块连成系统，才是真正的护城河。', action:'看他的长期方向', icon:Compass, size:'tall', color:C.redL, peek:'三线联动 · 风险点 · 通关报告' },
  ];

  const liveStats = [
    { label:'内容期数', val:'40+', desc:'财经数字人IP', spark:[10,18,22,28,32,36,40] },
    { label:'全网播放', val:'20万', desc:'累计阅读量', spark:[2,5,8,11,14,17,20] },
    { label:'量化实盘', val:'30万', desc:'阶段收益10%', spark:[27,28,29,28,30,32,33] },
    { label:'社群运营', val:'90天', desc:'拥抱不完美', spark:[15,30,45,60,72,82,90] },
  ];

  // mini sparkline 渲染
  const Sparkline = ({ data, color }) => {
    const w = 80, h = 18;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - ((v-min)/range)*h}`).join(' ');
    return (
      <svg width={w} height={h} className="opacity-70">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx={w} cy={h - ((data[data.length-1]-min)/range)*h} r="2.5" fill={color}/>
      </svg>
    );
  };

  return (
    <div className="min-h-screen text-[#1A1414] font-sans selection:bg-[#DC2626] selection:text-white flex flex-col md:flex-row" style={{ background: C.cream }}>
      {/* 移动端：紧凑顶栏 */}
      <header className="md:hidden bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: C.redL, boxShadow:`0 0 8px ${C.redL}` }} />
            <span className="font-black tracking-tight text-base">Jaycen</span>
            <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">v4.0</span>
          </div>
          <div className="text-[10px] font-mono text-gray-300">深圳 · 高三 · 18岁</div>
        </div>
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth:'none' }}>
          {chapters.map(c => {
            const completed = completedChapters?.has(c.mod);
            return (
              <button key={c.id} onClick={() => onNavigate(c.mod)}
                className="flex-shrink-0 px-3 py-1.5 text-[11px] font-mono font-bold border bg-gray-50 hover:bg-red-50 transition-all flex items-center gap-1.5 active:scale-95"
                style={{ borderColor: completed ? `${C.redL}40` : '#e5e5e5' }}>
                <span className="text-gray-300">{c.id}</span>
                <span className="text-gray-700">{c.title}</span>
                {completed && <CheckCircle2 size={10} style={{ color:C.redL }}/>}
              </button>
            );
          })}
        </div>
      </header>

      {/* 桌面端：完整侧边栏 */}
      <aside className="hidden md:flex w-64 bg-white border-r border-black/5 flex-col md:h-screen md:sticky md:top-0 z-20 flex-shrink-0">
        <div className="p-8 border-b border-black/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: C.redL, boxShadow:`0 0 8px ${C.redL}` }} />
            <span className="font-black tracking-tight text-lg">Jaycen</span>
          </div>
          <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase pl-5">Profile v4.0 · 2026</p>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest mb-4">// 档案目录</p>
            {chapters.map(c => {
              const completed = completedChapters?.has(c.mod);
              return (
                <button key={c.id} onClick={() => onNavigate(c.mod)}
                  className="w-full text-left px-3 py-2.5 text-[11px] font-bold tracking-wide transition-all flex items-center gap-3 rounded-sm hover:bg-red-50 text-gray-400 hover:text-[#7F1D1D]">
                  <span className="font-mono text-gray-200">{c.id}</span>
                  <span className="flex-1">{c.title}</span>
                  {completed && <CheckCircle2 size={12} style={{ color:C.redL }}/>}
                </button>
              );
            })}
          </div>
          <div className="border-t border-black/5 pt-4 mt-4">
            <div className="text-[10px] font-mono text-gray-300">深圳 · 高三 · 18岁</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.redL }} />
              <span className="text-[10px] font-mono" style={{ color: C.redL }}>系统运行中</span>
            </div>
            <div className="text-[9px] font-mono text-gray-300 mt-3 leading-relaxed">
              <kbd className="px-1 bg-gray-50 border border-gray-200">←/→</kbd> 切章节<br/>
              <kbd className="px-1 bg-gray-50 border border-gray-200">Esc</kbd> 回目录
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <FadeIn>
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-black mb-2 tracking-tight">
              人物<span style={{ color: C.redV }}>档案室</span>.
            </h1>
            <p className="text-gray-400 text-sm font-mono">// 一个正在成形的系统 · 一份阶段性的人物底稿</p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {liveStats.map((s, i) => (
              <div key={i} className="bg-white p-5 border-l-2 hover:bg-[#FFF8F5] transition-all relative overflow-hidden group" style={{ borderColor: C.redV }}>
                <div className="flex items-start justify-between mb-1">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{s.label}</div>
                  <Sparkline data={s.spark} color={C.redV}/>
                </div>
                <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: C.redV, fontFamily: "'Playfair Display',serif" }}>
                  <AnimatedNumber value={s.val} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: C.redL }}/>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[300px] gap-5 pb-20">
          {chapters.map((item, i) => {
            const colSpan = item.size === 'wide' ? 'md:col-span-2' : 'md:col-span-1';
            const isH = hov === item.id;
            const completed = completedChapters?.has(item.mod);
            return (
              <FadeIn key={item.id} delay={i*70} className={colSpan}>
                <div onClick={() => onNavigate(item.mod)}
                  onMouseEnter={() => setHov(item.id)}
                  onMouseLeave={() => { setHov(null); setSpot(s => ({ ...s, on: false })); }}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
                  }}
                  className="h-full relative bg-white border border-black/5 cursor-pointer overflow-hidden transition-all duration-400 hover:-translate-y-1 active:scale-[0.98]"
                  style={{ boxShadow: isH ? `0 24px 50px -15px ${item.color}40` : '' }}>
                  {isH && (
                    <div className="absolute pointer-events-none transition-opacity duration-200" style={{
                      left: spot.x - 150, top: spot.y - 150, width: 300, height: 300,
                      background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`, opacity: spot.on ? 1 : 0
                    }} />
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 transition-all duration-500 origin-left" style={{ background: item.color, transform: isH ? 'scaleX(1)' : 'scaleX(0)' }} />
                  {/* 完成标记 */}
                  {completed && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-100">
                        <CheckCircle2 size={10} style={{ color: C.redL }} />
                        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: C.redL }}>已访</span>
                      </div>
                    </div>
                  )}
                  <div className="h-full p-7 flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-1 rounded-sm transition-all"
                          style={{ background: isH ? item.color : C.cream, color: isH ? 'white' : '#999' }}>{item.tag}</span>
                        <span className="text-[10px] font-mono text-gray-300">{item.sub}</span>
                      </div>
                      <span className="font-mono text-3xl font-black text-gray-100">{item.id}</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl mb-3 text-[#1A1414]">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{isH ? item.peek : item.desc}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-black/5 pt-5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full border transition-all duration-300" style={{ background: isH ? item.color : 'white', borderColor: isH ? item.color : '#e5e5e5' }}>
                          <item.icon size={16} color={isH ? 'white' : '#999'} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest transition-opacity" style={{ color: item.color, opacity: isH ? 1 : 0 }}>{item.action}</span>
                      </div>
                      <ArrowUpRight size={15} className="transition-colors" style={{ color: isH ? item.color : '#ddd' }} />
                    </div>
                  </div>
                  <item.icon strokeWidth={1} size={200} className="absolute -bottom-8 -right-8 transition-all duration-700"
                    style={{ color: item.color, opacity: isH ? 0.06 : 0.02, transform: isH ? 'scale(1.15) rotate(8deg)' : 'scale(1)' }} />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 2. CH01 — Profile
// ═════════════════════════════════════════════════════════════
const ProfilePage = ({ onNextModule }) => {
  const [flipped, setFlipped] = useState({});
  const [showSynthesis, setShowSynthesis] = useState(false);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const onScroll = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', onScroll);
    return () => c.removeEventListener('scroll', onScroll);
  }, []);

  const flip = (id) => {
    setFlipped(p => {
      const np = { ...p, [id]: !p[id] };
      const count = Object.values(np).filter(Boolean).length;
      if (count === 3 && !showSynthesis) {
        setTimeout(() => setShowSynthesis(true), 800);
        STATE.forcesFlipped.add('all');
      }
      return np;
    });
    STATE.forcesFlipped.add(id);
  };
  const flippedCount = Object.values(flipped).filter(Boolean).length;

  const forces = [
    { id: 'f1', label: '开放 · 发散 · 变化快', icon: Sparkles, color: C.redL,
      front: '喜欢跳出框架重新定义问题，对新东西有天然的强烈兴趣。',
      back: '一旦被某个方向吸引，会快速切入、快速上手、快速迭代。这是他最强的起步引擎，也是最难收束的力量。' },
    { id: 'f2', label: '系统 · 闭环 · 复利', icon: RefreshCcw, color: C.red,
      front: '天然偏爱规则、回测、闭环机制，不甘心把人生交给情绪和惯性。',
      back: '每当感受到失控或空转，他的第一反应不是更努力，而是找机制——让系统替自己运行，哪怕状态不好的时候。' },
    { id: 'f3', label: '掌控 · 选择权 · 自由', icon: Shield, color: C.wine,
      front: '最厌恶的不是失败，而是"有潜能却被无力感磨成麻木"的状态。',
      back: '对他而言，钱的背后是选择权，选择权的背后是"人生方向盘握在自己手里"的状态。这是他所有努力的底层动机。' },
  ];

  const tags = ['深圳', '高三', '18岁', '量化投资', '内容IP', 'AI工作流', '社群经营', '第一性原理', '长期主义', '复利思维'];

  return (
    <div ref={containerRef} data-scroll-container className="h-screen overflow-y-auto text-[#1A1414] font-sans scroll-smooth selection:bg-[#DC2626] selection:text-white" style={{ background: C.paper }}>
      <style>{`
        .ppersp { perspective: 1200px; }
        .pflip { transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.3,0.7,0.3,1); }
        .pflip.on { transform: rotateY(180deg); }
        .pface { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .pback { transform: rotateY(180deg); }
        @keyframes synth-in { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
        .synth-in { animation: synth-in 1s cubic-bezier(0.2,0.8,0.2,1) forwards; }
        @keyframes synth-glow { 0%,100% { box-shadow: 0 0 60px rgba(220,38,38,0.4); } 50% { box-shadow: 0 0 100px rgba(220,38,38,0.7); } }
        .synth-glow { animation: synth-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width: `${progress * 100}%`, background: C.redL }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-black/5" style={{ background: `${C.paper}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-gray-400" />
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.01 // PROFILE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[10px] font-mono text-gray-400">{flippedCount}/3 力量解锁</span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: flippedCount > i ? C.redL : '#ddd' }} />)}
          </div>
        </div>
      </nav>

      <FadeIn>
        <section className="min-h-screen flex flex-col justify-center px-6 max-w-4xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-[10px] font-mono font-bold mb-8 w-fit" style={{ background: C.redV }}>PROFILE // 人物总述</div>
          <h1 className="text-4xl md:text-7xl font-black font-serif leading-[1.05] mb-10 text-[#1A1414]">
            一个高度敏感、<br />强烈追求<span style={{ color: C.redV }}>掌控感</span>，<br />持续流动的年轻人。
          </h1>
          <div className="border-l-4 pl-6 py-1 text-base md:text-lg text-gray-500 font-serif max-w-2xl leading-relaxed" style={{ borderColor: C.redV }}>
            <p>他不是在做事情，而是试图通过事情来塑造自己；不是在找赛道，而是在找一种更适合自己长期运行的人生方式。</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map(t => <span key={t} className="px-3 py-1 bg-white border border-black/8 text-[11px] font-mono text-gray-500">{t}</span>)}
          </div>
        </section>
      </FadeIn>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <FadeIn>
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <div className="w-px h-8" style={{ background: C.redV }} />
              <h2 className="text-2xl font-serif font-black">三股并存的力量</h2>
              <span className="text-xs font-mono text-gray-400 ml-2">点击翻转，全部翻完会触发"合成时刻"</span>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {forces.map(f => (
                <div key={f.id} className="ppersp h-72 cursor-pointer" onClick={() => flip(f.id)}>
                  <div className={`relative w-full h-full pflip ${flipped[f.id] ? 'on' : ''}`}>
                    <div className="pface absolute inset-0 p-7 border-2 bg-white border-gray-100 hover:border-gray-200 transition-colors flex flex-col">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 bg-gray-50">
                        <f.icon size={18} color={f.color} />
                      </div>
                      <h3 className="font-bold text-sm tracking-wide mb-4" style={{ color: f.color }}>{f.label}</h3>
                      <p className="text-sm leading-relaxed text-gray-500 flex-1">{f.front}</p>
                      <p className="text-xs text-gray-300 mt-4 font-mono">点击翻转 →</p>
                    </div>
                    <div className="pface pback absolute inset-0 p-7 flex flex-col text-white" style={{ background: f.color }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 bg-white/20">
                        <f.icon size={18} color="white" />
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-3 opacity-70">深层逻辑</div>
                      <p className="text-[15px] leading-relaxed flex-1">{f.back}</p>
                      <p className="text-xs opacity-50 mt-4 font-mono">← 点击返回</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showSynthesis && (
              <div className="synth-in mt-8">
                <div className="p-8 md:p-10 text-white relative overflow-hidden synth-glow"
                  style={{ background: `linear-gradient(135deg, ${C.wine} 0%, ${C.redV} 50%, ${C.redL} 100%)` }}>
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Award size={16} color="white" className="opacity-70" />
                    <span className="text-[10px] font-mono opacity-70 tracking-widest uppercase">3/3 SYNTHESIS</span>
                  </div>
                  <div className="relative z-10 max-w-2xl">
                    <div className="text-[11px] font-mono opacity-70 tracking-widest mb-4 uppercase">合成时刻 · The Combined Force</div>
                    <p className="text-xl md:text-3xl font-serif font-bold leading-relaxed mb-6">
                      开放 + 系统 + 掌控 = <br />
                      <span className="opacity-90">一个不甘心被推着走、又不愿被规则压扁的人。</span>
                    </p>
                    <p className="text-sm md:text-base opacity-80 leading-relaxed">
                      这三股力量同时存在不是巧合——每一股都是另一股的反向制衡。开放让他不被系统困住，系统让他不被发散吞噬，掌控感让他不被任一种力量稀释。
                    </p>
                  </div>
                  <div className="absolute -right-12 -bottom-12 opacity-10">
                    <Heart size={280} strokeWidth={1} color="white" />
                  </div>
                </div>
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mb-20">
            <div className="text-white p-8 md:p-14 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.ink} 0%, ${C.wine} 100%)` }}>
              <div className="absolute -right-12 -top-12 opacity-5">
                <Heart size={280} strokeWidth={1} color="white" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-6" style={{ color: C.redL }}>Core Quote // 核心句</div>
                <blockquote className="text-xl md:text-3xl font-serif italic leading-relaxed text-gray-100 mb-8 max-w-3xl">
                  "他真正厌恶的，不只是失败或平庸，而是那种明明有想法、有野心、有潜能，却被无力感和惯性磨成麻木的人的状态。"
                </blockquote>
                <div className="grid md:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                  {[
                    { label: '最厌恶', val: '无力感 · 被推着走' },
                    { label: '最追求', val: '掌控感 · 自己搭路径' },
                    { label: '长期目标', val: '人生方向盘握在自己手里' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">{item.label}</div>
                      <div className="text-white font-bold">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch02')} className="px-6 md:px-8 py-4 text-white font-bold tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-3" style={{ background: C.redV }}>
            成长时间线 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 3. CH02 — Timeline
// ═════════════════════════════════════════════════════════════
const TimelinePage = ({ onNextModule }) => {
  const [activeNode, setActiveNode] = useState(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const fn = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', fn);
    return () => c.removeEventListener('scroll', fn);
  }, []);

  const nodes = [
    { id:'n1', year:'更早', label:'掌控感萌芽', energy:5, color:'#9CA3AF', tone:'#9CA3AF15',
      short:'最早的驱动力不是理想，而是"想要却不能决定"的刺痛。',
      detail:'手机、鞋子、消费品——这些只是表层。更深的痕迹是支配权不足。他对钱的敏感背后，并不只是物欲，而是"选择权和掌控感"的问题。' },
    { id:'n2', year:'中考前', label:'第一次自律觉醒', energy:7, color:C.copper, tone:`${C.copper}15`,
      short:'意识到某些事情的重要性，进入短暂的强自律状态。',
      detail:'这是他第一次主动地想要抓住什么，而不是被推着走。虽然后来因为环境变化而中断，但这次觉醒留下了一个底层印象：原来自己是可以主动发力的。' },
    { id:'n3', year:'高一', label:'国际路径的折返', energy:4, color:C.amber, tone:`${C.amber}15`,
      short:'转入国际体系，路径和环境都发生了较大变化，但这条路后来没有真正走通。',
      detail:'这次折返并不只是学业路线的调整，更是一次自我认知的更新。他开始意识到，路径本身不是问题，问题是"自己到底想要什么，想成为什么样的人"。' },
    { id:'n4', year:'高中期间', label:'混乱与荒废', energy:2, color:'#7C2D12', tone:'#7C2D1225',
      short:'经历了明显的混乱与荒废阶段——不是毫无感知地颓着，而是常常能意识到不对，但又拉不回来。',
      detail:'白天被A股波动牵引，晚上被短视频吞噬。短期兴奋与长期空虚交替，身体、关系、事业三条线都不理想。这段时间后来成为他重新搭系统的重要起点。' },
    { id:'n5', year:'2025.8—10', label:'关键转折', energy:7, color:C.redL, tone:`${C.redL}15`,
      short:'对"注意力没有投进会复利的地方"有了极深刻的体会，开始真正重建系统。',
      detail:'这不只是一次"痛改前非"。这次他更清楚地知道自己要什么——不是更努力，而是找到机制，让事情在自己状态好坏不同的时候都能持续运转。量化训练营、Python入门、策略回测——他用一个月把从0到1的链路跑通了。' },
    { id:'n6', year:'2025.10至今', label:'系统逐渐成形', energy:9, color:C.redV, tone:`${C.redV}15`,
      short:'量化实盘、内容IP、AI工作流——三条主线同时运转。不再是想法，而是真正跑起来的东西。',
      detail:'30万量化实盘阶段性收益10%，40期内容全网20万播放，量化社区22期打赏变现约1万。这些数字不是终局，而是"闭环已经形成"的证明。' },
  ];

  const W = 800, H = 200, PAD = 40;
  const points = nodes.map((n, i) => ({
    x: PAD + (i / (nodes.length - 1)) * (W - PAD * 2),
    y: H - PAD - (n.energy / 10) * (H - PAD * 2)
  }));
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) * 0.5;
    const cx2 = p.x - (p.x - prev.x) * 0.5;
    return `${acc} C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`;
  }, '');
  const fillD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  return (
    <div ref={containerRef} data-scroll-container className="h-screen overflow-y-auto font-sans scroll-smooth selection:bg-[#DC2626] selection:text-white relative" style={{ background: C.black, color: '#d8d0cc' }}>
      <CursorGlow />
      <GrainOverlay opacity={0.08} />
      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width: `${progress * 100}%`, background: C.redL }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-white/5" style={{ background: `${C.black}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-500" /><span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-500">CH.02 // TIMELINE</span>
        </div>
        <span className="hidden md:inline text-[10px] font-mono" style={{ color: C.redL }}>不是直线，而是多次折返与重组</span>
      </nav>

      <FadeIn>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="text-[10px] font-mono text-gray-600 tracking-[0.4em] md:tracking-[0.5em] uppercase mb-8">Archive 002 // Growth Timeline</div>
          <h1 className="text-4xl md:text-7xl font-black font-serif text-white leading-[1.05] mb-8">
            不是直线，<br />而是<span style={{ color: C.redL }}>折返与重组</span>。
          </h1>
          <p className="text-gray-500 max-w-xl leading-relaxed mb-10 px-2">每一次荒废，都不是空白；每一次折返，都带着新的东西回来。</p>

          <div className="w-full max-w-4xl bg-white/[0.02] border border-white/5 p-4 md:p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[11px] font-mono font-bold tracking-widest uppercase" style={{ color: C.redL }}>能量状态曲线</div>
              <div className="text-[10px] font-mono text-gray-600">Energy / Time</div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.redL} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={C.redL} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map(g => (
                <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} stroke="#ffffff08" strokeDasharray="2,4" />
              ))}
              <path d={fillD} fill="url(#energyGrad)" />
              <path d={pathD} fill="none" stroke={C.redL} strokeWidth="2.5" />
              {points.map((p, i) => (
                <g key={i} className="cursor-pointer" onClick={() => setActiveNode(activeNode === nodes[i].id ? null : nodes[i].id)}>
                  <circle cx={p.x} cy={p.y} r={activeNode === nodes[i].id ? 7 : 4} fill={nodes[i].color} stroke={C.black} strokeWidth="2"
                    style={{ filter: activeNode === nodes[i].id ? `drop-shadow(0 0 8px ${nodes[i].color})` : '', transition: 'r 0.3s, filter 0.3s' }} />
                  <text x={p.x} y={H - 8} fontSize="9" fill="#666" textAnchor="middle" fontFamily="monospace">{nodes[i].year}</text>
                </g>
              ))}
            </svg>
            <div className="text-[10px] font-mono text-gray-600 text-center mt-2">点击节点 · 与下方时间线联动</div>
          </div>

          <div className="mt-12 animate-bounce text-gray-700 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest">SCROLL</span><ChevronDown size={18} />
          </div>
        </section>
      </FadeIn>

      <section className="max-w-3xl mx-auto px-4 md:px-6 pb-32 relative">
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent 0%, #ffffff10 5%, #ffffff10 95%, transparent 100%)' }} />
        <div className="absolute left-4 md:left-6 top-0 w-px transition-all duration-300" style={{ height: `${progress * 100}%`, background: `linear-gradient(180deg, ${C.redL} 0%, ${C.copper} 100%)`, boxShadow: `0 0 12px ${C.redL}80` }} />
        <div className="space-y-5 relative">
          {nodes.map((node) => (
            <FadeIn key={node.id}>
              <div className="relative pl-10 md:pl-12">
                <div className="absolute left-[12px] md:left-[18px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer z-10"
                  style={{ background: activeNode === node.id ? node.color : '#333', borderColor: C.black, boxShadow: activeNode === node.id ? `0 0 18px ${node.color}, 0 0 0 4px ${node.tone}` : '' }}
                  onClick={() => { setActiveNode(activeNode === node.id ? null : node.id); STATE.timelineExplored.add(node.id); }} />
                <div className={`border transition-all duration-400 cursor-pointer overflow-hidden ${activeNode === node.id ? 'border-white/20' : 'border-white/5 hover:border-white/10'}`}
                  style={{ background: activeNode === node.id ? node.tone : '#ffffff03' }}
                  onClick={() => { setActiveNode(activeNode === node.id ? null : node.id); STATE.timelineExplored.add(node.id); }}>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono px-2 py-1 font-bold" style={{ background: `${node.color}25`, color: node.color }}>{node.year}</span>
                        <h3 className="font-bold text-white text-base">{node.label}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-mono text-gray-600 hidden md:inline">能量</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="w-1 h-3 rounded-sm" style={{ background: i < node.energy ? node.color : '#ffffff10' }} />
                          ))}
                        </div>
                        <ChevronRight size={14} className="text-gray-600 transition-transform ml-2" style={{ transform: activeNode === node.id ? 'rotate(90deg)' : '' }} />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{node.short}</p>
                    {activeNode === node.id && (
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <p className="text-gray-300 text-sm leading-relaxed">{node.detail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-16 p-6 md:p-8 border bg-white/[0.03]" style={{ borderColor: `${C.redL}30` }}>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-4" style={{ color: C.redL }}>阶段总结</div>
            <p className="text-gray-300 font-serif text-lg leading-relaxed">"这不是一路很稳的人，而是在推倒重来中，逐渐长出方法论和秩序的人。"</p>
          </div>
        </FadeIn>

        <div className="mt-10 flex justify-end">
          <button onClick={() => onNextModule('ch03')} className="px-6 md:px-8 py-4 border font-bold tracking-widest hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] transition-all text-sm flex items-center gap-3"
            style={{ borderColor: `${C.redL}50`, color: C.redL }}>
            三条主线 <ArrowUpRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 4. CH03 — Tracks
// ═════════════════════════════════════════════════════════════
const TracksPage = ({ onNextModule }) => {
  const [activeTrack, setActiveTrack] = useState('ip');
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const fn = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', fn);
    return () => c.removeEventListener('scroll', fn);
  }, []);

  // 切换tab时滚回顶部 + 重置进度条
  const switchTrack = (k) => {
    setActiveTrack(k);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setProgress(0);
  };

  const tracks = {
    ip: { label:'个人IP', tag:'CONTENT', color:C.redV, icon:BookOpen,
      headline:'不是单纯发内容，而是把人生过程资产化。',
      desc:'他把内容理解成一种认知外化和过程资产化工具。不想包装成完美的人，而愿意把"怎么从混乱里搭系统"的过程记录下来。',
      stats:[
        { label:'财经数字人', val:'40期+', sub:'2026年3月起号' },
        { label:'全网播放量', val:'~20万', sub:'持续更新中' },
        { label:'全网粉丝', val:'3000+', sub:'跨平台积累' },
        { label:'量化社区发布', val:'22期', sub:'打赏变现约1万' },
      ],
      insight:'逼自己把混乱讲清楚，把短暂经历变成可复利的数字资产——这本身就是他人物结构的一部分。'
    },
    quant: { label:'量化投资', tag:'SYSTEM', color:C.red, icon:BarChart3,
      headline:'第一次真正把"闭环"体验成现实。',
      desc:'量化对他意义极大，不是普通项目，而像一次深层人格经验。他用约一个月时间把从Python入门、策略研究、回测、实盘、自动交易这整条链路从0到1跑通。',
      stats:[
        { label:'实盘资金规模', val:'~30万', sub:'小市值策略' },
        { label:'阶段性收益率', val:'~10%', sub:'即约3万元' },
        { label:'建设周期', val:'约1个月', sub:'0→1完整链路' },
        { label:'系统类型', val:'全自动', sub:'24小时运行' },
      ],
      insight:'他把市场的混乱外包给规则，让自己从"盯着波动的人"变成"优化系统的人"。'
    },
    ai: { label:'AI第二大脑', tag:'AMPLIFIER', color:C.copper, icon:Cpu,
      headline:'不是聊天工具，而是认知放大器。',
      desc:'AI在他这里是一个更宏观的命题：能不能把AI真正接到自己的学习、写作、复盘、整理和工作流里，让它成为一个外置大脑和生产系统。',
      stats:[
        { label:'核心定位', val:'外置大脑', sub:'不只是工具' },
        { label:'使用场景', val:'4大场景', sub:'写/学/复盘/生产' },
        { label:'与IP协同', val:'内容加速', sub:'脚本/框架/整理' },
        { label:'与量化协同', val:'策略辅助', sub:'代码/文档/分析' },
      ],
      insight:'AI对他最重要的，不是替代，而是放大：放大认知整理能力、放大内容生成效率、放大系统化思考。'
    }
  };

  const t = tracks[activeTrack];

  return (
    <div ref={containerRef} data-scroll-container className="h-screen overflow-y-auto text-[#1A1414] font-sans scroll-smooth selection:bg-[#DC2626] selection:text-white" style={{ background: C.paper }}>
      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width: `${progress * 100}%`, background: t.color }} />
      <nav className="fixed top-0 w-full px-4 md:px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-black/5" style={{ background: `${C.paper}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.03</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(tracks).map(([k, v]) => (
            <button key={k} onClick={() => switchTrack(k)}
              className="px-2 md:px-3 py-1.5 text-[10px] font-mono font-bold transition-all"
              style={{ background: activeTrack === k ? v.color : 'transparent', color: activeTrack === k ? 'white' : '#999', border: `1px solid ${activeTrack === k ? v.color : '#e5e5e5'}` }}>
              {v.tag}
            </button>
          ))}
        </div>
      </nav>

      <FadeIn>
        <section className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-[10px] font-mono font-bold mb-8 w-fit" style={{ background: t.color }}>
            <t.icon size={12} /><span>{t.label.toUpperCase()} // {t.tag}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif leading-[1.1] mb-8 text-[#1A1414]">{t.headline}</h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl font-serif">{t.desc}</p>
        </section>
      </FadeIn>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <FadeIn>
          <section className="mb-16">
            <h2 className="text-xl font-serif font-black mb-6 text-[#1A1414]">关键数据</h2>
            <div key={activeTrack} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {t.stats.map((s, i) => (
                <div key={`${activeTrack}-${i}`} className="bg-white p-5 md:p-6 border border-black/5 hover:border-black/10 transition-all hover:-translate-y-0.5">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">{s.label}</div>
                  <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: t.color, fontFamily: "'Playfair Display',serif" }}>
                    <AnimatedNumber value={s.val} />
                  </div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 mb-16 relative overflow-hidden" style={{ background: t.color }}>
            <div className="absolute -right-8 -top-8 opacity-10">
              <t.icon size={200} strokeWidth={1} color="white" />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 mb-4">核心洞察</div>
              <p className="text-white font-serif text-lg md:text-xl leading-relaxed">"{t.insight}"</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="text-white p-6 md:p-10 mb-10 relative overflow-hidden" style={{ background: C.ink }}>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">三条线的协同关系</div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-8">不是三个项目<span style={{ color: C.redL }}>·</span>是一个<span style={{ color: C.redL }}>系统</span></h3>

            {/* Venn 图 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="relative w-full md:w-1/2 max-w-md">
                <svg viewBox="0 0 400 320" className="w-full h-auto">
                  <defs>
                    <radialGradient id="g_ip" cx="50%" cy="50%">
                      <stop offset="0%" stopColor={C.redV} stopOpacity="0.55"/>
                      <stop offset="100%" stopColor={C.redV} stopOpacity="0.18"/>
                    </radialGradient>
                    <radialGradient id="g_quant" cx="50%" cy="50%">
                      <stop offset="0%" stopColor={C.red} stopOpacity="0.55"/>
                      <stop offset="100%" stopColor={C.red} stopOpacity="0.18"/>
                    </radialGradient>
                    <radialGradient id="g_ai" cx="50%" cy="50%">
                      <stop offset="0%" stopColor={C.copper} stopOpacity="0.55"/>
                      <stop offset="100%" stopColor={C.copper} stopOpacity="0.18"/>
                    </radialGradient>
                  </defs>
                  {/* 三圆 */}
                  <circle cx="150" cy="130" r="100" fill="url(#g_ip)" stroke={activeTrack==='ip'?C.redV:`${C.redV}40`} strokeWidth={activeTrack==='ip'?2:1} className="cursor-pointer transition-all"
                    onClick={()=>switchTrack('ip')}/>
                  <circle cx="250" cy="130" r="100" fill="url(#g_quant)" stroke={activeTrack==='quant'?C.red:`${C.red}40`} strokeWidth={activeTrack==='quant'?2:1} className="cursor-pointer transition-all"
                    onClick={()=>switchTrack('quant')}/>
                  <circle cx="200" cy="210" r="100" fill="url(#g_ai)" stroke={activeTrack==='ai'?C.copper:`${C.copper}40`} strokeWidth={activeTrack==='ai'?2:1} className="cursor-pointer transition-all"
                    onClick={()=>switchTrack('ai')}/>
                  {/* 标签 */}
                  <text x="80" y="80" fill={C.redV} fontSize="14" fontWeight="700" fontFamily="monospace" letterSpacing="2">IP</text>
                  <text x="298" y="80" fill={C.red} fontSize="14" fontWeight="700" fontFamily="monospace" letterSpacing="2">QUANT</text>
                  <text x="180" y="298" fill={C.copper} fontSize="14" fontWeight="700" fontFamily="monospace" letterSpacing="2">AI</text>
                  {/* 中心 */}
                  <circle cx="200" cy="160" r="38" fill={C.redL} opacity="0.85"/>
                  <text x="200" y="158" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="'Noto Serif SC'">系统赢</text>
                  <text x="200" y="174" textAnchor="middle" fill="#fff" fontSize="9" opacity="0.7" fontFamily="monospace" letterSpacing="2">SYSTEM</text>
                </svg>
              </div>

              {/* 右边交集说明 */}
              <div className="flex-1 w-full space-y-3">
                {[
                  { from:'IP × QUANT', to:'内容→流量→社区→变现 + 量化策略可信度反哺', col: C.redV },
                  { from:'QUANT × AI', to:'AI辅助策略代码、回测分析、文档生产', col: C.red },
                  { from:'AI × IP', to:'AI批量生成内容草稿、选题、剪辑、复盘', col: C.copper },
                  { from:'三者相交', to:'认知 → 内容 → 系统 → 收益的复利闭环', col: C.redL, hl:true },
                ].map((it, i) => (
                  <div key={i} className={`p-3 md:p-4 border ${it.hl?'border-white/20 bg-white/5':'border-white/5'}`}>
                    <div className="text-[10px] font-mono font-bold mb-1" style={{ color: it.col }}>{it.from}</div>
                    <div className="text-xs md:text-sm text-gray-300">{it.to}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-xs md:text-sm font-mono border-t border-white/5 pt-6">
              点击圆圈切换 · 三个圆的交集，才是真正的护城河
            </div>
          </div>
        </FadeIn>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch04')} className="px-6 md:px-8 py-4 text-white font-bold tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-3"
            style={{ background: t.color }}>
            思维与价值观 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 5. CH04 — Mindset
// ═════════════════════════════════════════════════════════════
const MindsetPage = ({ onNextModule }) => {
  const [openItem, setOpenItem] = useState(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const fn = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', fn);
    return () => c.removeEventListener('scroll', fn);
  }, []);

  const os = [
    { rank:'01', label:'身体线', sub:'睡眠 · 饮食 · 运动', color:C.redL, scale:1.03, desc:'身体是电池。每当他陷入低能量、失控感，真正能把他拉回来的不是抽象激励，而是先把身体照顾好。这是底盘。' },
    { rank:'02', label:'注意力', sub:'燃料管理', color:C.red, scale:1.0, desc:'注意力是燃料，一旦被A股、短视频、信息流大量消耗，其他一切都会垮掉。他现在对"注意力有没有投进会复利的地方"极度敏感。' },
    { rank:'03', label:'语言', sub:'表达 · 组织世界', color:C.copper, scale:0.97, desc:'语言是他输出和组织世界的中介。逼自己把混乱讲清楚，把阶段感悟讲成别人能吸收的东西，这本身就是他人物结构的一部分。' },
    { rank:'04', label:'影响力 · 财富 · 成就', sub:'外显结果层', color:'#9CA3AF', scale:0.94, desc:'这些是结果，而不是底盘。只有前三层稳了，这层才能持续产出。' },
  ];

  const principles = [
    { id:'p1', title:'第一性原理', desc:'不满足于"这是惯例"，喜欢把问题放回更高维的坐标系重新定义。', insight:'哪怕是父亲用主观交易的方式，他也会问：有没有更系统化、更可测量的路径？' },
    { id:'p2', title:'复利思维', desc:'不问"我今天做了什么"，而问"这件事会不会随时间增值"。', insight:'他对投资、IP、AI感兴趣的原因相同：这三件事的回报都会随着时间累积而放大。' },
    { id:'p3', title:'拒绝绝对化', desc:'天然反感非黑即白。很多事都要看边界条件、看场景、看视角。', insight:'这让他容纳复杂现实的能力更强，但同时也要求他在行动层面刻意练习聚焦。' },
    { id:'p4', title:'规则外包', desc:'不是让自己更拼命，而是找机制，让事情在状态不好时也能持续运转。', insight:'量化是最直接的实践：把市场的混乱外包给规则，从"盯着波动"变成"优化系统"。' },
  ];

  return (
    <div ref={containerRef} data-scroll-container className="h-screen overflow-y-auto font-sans scroll-smooth selection:bg-[#DC2626] selection:text-white" style={{ background: C.paper }}>
      <style>{`
        @media (min-width: 768px) {
          .prio-row { transform: scale(var(--s, 1)); }
        }
      `}</style>
      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width: `${progress * 100}%`, background: C.redL }} />
      <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-black/5" style={{ background: `${C.paper}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">CH.04 // MINDSET</span>
        </div>
      </nav>

      <FadeIn>
        <section className="min-h-screen flex flex-col justify-center px-6 max-w-4xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-[10px] font-mono font-bold mb-8 w-fit" style={{ background: C.charcoal }}><Layers size={12} /> MINDSET // 操作系统</div>
          <h1 className="text-4xl md:text-6xl font-black font-serif leading-[1.1] mb-8 text-[#1A1414]">
            不是被情绪推着走，<br />而是<span style={{ color: C.redV }}>让系统运行</span>。
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-serif leading-relaxed max-w-2xl">身体第一，注意力第二，语言第三——一套从失控感中反向逼出来的人生操作系统雏形。</p>
        </section>
      </FadeIn>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <FadeIn>
          <section className="mb-20">
            <h2 className="text-xl font-serif font-black text-[#1A1414] mb-2">优先级排序</h2>
            <p className="text-sm text-gray-400 mb-8">从底盘到外显结果——视觉上越靠下越基础</p>
            <div className="space-y-3">
              {os.map((item) => (
                <div key={item.rank} className="prio-row flex gap-3 md:gap-5 items-stretch transition-all" style={{ '--s': item.scale }}>
                  <div className="w-10 md:w-12 flex-shrink-0 flex items-center justify-center text-2xl font-black font-mono" style={{ color: item.color, opacity: 0.3 }}>{item.rank}</div>
                  <div className="flex-1 bg-white border border-black/5 p-5 md:p-6 flex gap-4 md:gap-6 items-start">
                    <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-[#1A1414]">{item.label}</span>
                        <span className="text-[10px] font-mono text-gray-400">{item.sub}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mb-20">
            <h2 className="text-xl font-serif font-black text-[#1A1414] mb-2">思维原则</h2>
            <p className="text-sm text-gray-400 mb-8">点击展开每条原则背后的具体体现</p>
            <div className="grid md:grid-cols-2 gap-4">
              {principles.map(p => (
                <div key={p.id} onClick={() => { setOpenItem(openItem === p.id ? null : p.id); STATE.principlesOpened.add(p.id); }}
                  className="bg-white border border-black/5 cursor-pointer hover:border-[#7F1D1D]/30 transition-all">
                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#1A1414]">{p.title}</h3>
                      <ChevronRight size={14} className="text-gray-300 transition-transform" style={{ transform: openItem === p.id ? 'rotate(90deg)' : '' }} />
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                    {openItem === p.id && (
                      <div className="mt-4 pt-4 border-t -mx-5 -mb-5 md:-mx-6 md:-mb-6 px-5 md:px-6 pb-5 md:pb-6" style={{ borderColor: `${C.redV}20`, background: `${C.redV}08` }}>
                        <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: C.redV }}>实际体现</div>
                        <p className="text-sm text-gray-600 leading-relaxed">{p.insight}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <div className="text-white p-6 md:p-10 mb-10" style={{ background: C.ink }}>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-6" style={{ color: C.redL }}>关于父亲的影响</div>
            <p className="text-gray-300 font-serif text-base md:text-lg leading-relaxed mb-6">父亲同时扮演了三个角色：引路人（投资启蒙）、现实参照物（资源与视角）、以及他既受影响又想超越的对象。</p>
            <div className="grid md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {['认同并借力', '看到局限', '想走得更远'].map((r, i) => (
                <div key={i} className="p-4 border border-white/5">
                  <div className="text-[10px] font-mono font-bold mb-2" style={{ color: C.redL }}>0{i + 1}</div>
                  <div className="text-white text-sm font-bold">{r}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('ch05')} className="px-6 md:px-8 py-4 text-white font-bold tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-3" style={{ background: C.charcoal }}>
            优势资产 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 6. CH05 — Assets
// ═════════════════════════════════════════════════════════════
const AssetsPage = ({ onNextModule }) => {
  const [unlocked, setUnlocked] = useState([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const fn = () => setProgress(c.scrollTop / (c.scrollHeight - c.clientHeight));
    c.addEventListener('scroll', fn);
    return () => c.removeEventListener('scroll', fn);
  }, []);

  const handleUnlock = (id) => {
    if (unlocked.includes(id)) return;
    const newUnlocked = [...unlocked, id];
    setUnlocked(newUnlocked);
    setRecentlyUnlocked(id);
    STATE.assetsUnlocked.add(id);
    setTimeout(() => setRecentlyUnlocked(null), 800);
    if (newUnlocked.length === 5) setTimeout(() => setShowCelebration(true), 600);
  };

  const assets = [
    { id:'a1', icon:Zap, color:C.redL, label:'高开放度 & 学习欲',
      short:'对新东西有天然强烈兴趣，且不排斥从零重新开始。',
      detail:'无论是量化编程、内容生产、AI工作流、直播表达还是社群尝试，他都表现出较高的上手意愿。这是他最强的起步引擎。' },
    { id:'a2', icon:RefreshCcw, color:C.red, label:'行动后的迭代能力',
      short:'不是第一次不好就退缩，而是一边做、一边观察、一边调整。',
      detail:'他最强的地方不是一开始就完美，而是愿意把东西先跑起来。内容从0到40期、量化从0到自动交易——这些都是迭代能力的直接体现。' },
    { id:'a3', icon:Target, color:C.copper, label:'系统感',
      short:'天然会想闭环、复利、回测、规则外包、工作流这些概念。',
      detail:'并不是每个18岁的人都会自然去想"数字资产""闭环""复利"这些概念，而他不仅会想，还已经在现实里部分实现。' },
    { id:'a4', icon:BookOpen, color:C.amber, label:'表达潜能',
      short:'已经在持续输出、直播、镜头表达、连麦等方面完成明显突破。',
      detail:'表达力一旦继续打磨，会成为他非常关键的杠杆——因为它能让他的认知与行动成果被更多人看见、理解、放大。' },
    { id:'a5', icon:Flame, color:C.redV, label:'人物张力',
      short:'高三、深圳、量化、IP、AI、社群——元素叠加形成天然吸引力。',
      detail:'有没有吸引力，不只看做了多少事，还看其身上是否有"成长中的矛盾感"。他既有野心和系统感，又保留了感受力和生命力。' },
  ];

  return (
    <div ref={containerRef} data-scroll-container className="h-screen overflow-y-auto font-sans scroll-smooth selection:bg-[#DC2626] selection:text-white relative" style={{ background: C.black, color: '#d8d0cc' }}>
      <CursorGlow />
      <GrainOverlay opacity={0.08} />
      <style>{`
        @keyframes flash { 0% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } 30% { box-shadow: 0 0 70px 10px rgba(220,38,38,0.7); } 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } }
        .flash { animation: flash 0.8s ease-out; }
        @keyframes burst { 0% { transform: scale(0.5); opacity: 0; } 40% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .burst { animation: burst 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(400px) rotate(360deg); opacity: 0; } }
        .confetti { position: absolute; width: 6px; height: 6px; animation: confetti 2.5s ease-out forwards; }
      `}</style>

      <div className="fixed top-0 left-0 h-1 z-50 transition-all" style={{ width: `${progress * 100}%`, background: C.redL }} />
      <nav className="fixed top-0 w-full px-4 md:px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-white/5" style={{ background: `${C.black}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-500" /><span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-500">CH.05</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-[10px] font-mono" style={{ color: C.redL }}>{unlocked.length}/5</div>
          <div className="w-20 md:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-700" style={{ width: `${(unlocked.length / 5) * 100}%`, background: `linear-gradient(90deg, ${C.red}, ${C.redL})`, boxShadow: `0 0 10px ${C.redL}80` }} />
          </div>
        </div>
      </nav>

      <FadeIn>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="text-[10px] font-mono text-gray-600 tracking-[0.4em] md:tracking-[0.5em] uppercase mb-8">Archive 005 // Competitive Assets</div>
          <h1 className="text-4xl md:text-7xl font-black font-serif text-white leading-[1.05] mb-8">
            五类<span style={{ color: C.redL }}>可复利</span><br />的资产。
          </h1>
          <p className="text-gray-500 max-w-xl">不是零散特质，而是已经具备的、能随时间增值的能力资本。点击每张卡片解锁详细说明。</p>
        </section>
      </FadeIn>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {assets.map(asset => {
            const isOpen = unlocked.includes(asset.id);
            const flashing = recentlyUnlocked === asset.id;
            return (
              <FadeIn key={asset.id}>
                <div onClick={() => handleUnlock(asset.id)}
                  className={`cursor-pointer border-2 transition-all duration-400 ${isOpen ? 'border-transparent' : 'border-white/5 hover:bg-white/[0.04]'} ${flashing ? 'flash' : ''}`}
                  style={{ background: isOpen ? `${asset.color}18` : '#ffffff03' }}>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4 md:gap-5 mb-5">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${asset.color}25` }}>
                        <asset.icon size={20} color={asset.color} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-2">{asset.label}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{asset.short}</p>
                      </div>
                      {!isOpen && <div className="text-[10px] font-mono text-gray-700 flex-shrink-0 mt-1 hidden md:block">点击解锁 →</div>}
                    </div>
                    {isOpen && (
                      <div className="border-t pt-5" style={{ borderColor: `${asset.color}40` }}>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: asset.color }}>深层逻辑</div>
                        <p className="text-gray-300 text-sm leading-relaxed">{asset.detail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {showCelebration && (
          <div className="burst relative border p-6 md:p-10 mb-10 overflow-hidden" style={{ borderColor: `${C.redL}50`, background: `linear-gradient(135deg, ${C.redL}10 0%, ${C.wine}30 100%)` }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 30}%`, background: [C.redL, C.copper, C.amber, C.red][i % 4], animationDelay: `${i * 0.05}s` }} />
            ))}
            <div className="relative z-10 flex items-start gap-4 md:gap-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${C.redL}30` }}>
                <Award size={26} color={C.redL} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: C.redL }}>5/5 ALL UNLOCKED · 综合判断</div>
                <p className="text-white font-serif text-xl md:text-2xl leading-relaxed mb-4">
                  "他未来最值得下注的，不一定是单点赢，而是<span style={{ color: C.redL }}>系统赢</span>——当多个能力模块逐渐连成一套系统，才是真正的护城河。"
                </p>
                <p className="text-gray-400 text-sm">这五个不是孤立的，而是会互相强化——开放度让他敢起步，迭代力让他不放弃，系统感让他能复利，表达力让他被看见，张力让他被记住。</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={() => onNextModule('final')} className="px-6 md:px-8 py-4 text-white font-bold tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-3" style={{ background: C.redL }}>
            未来路线 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 7. FINAL — Future
// ═════════════════════════════════════════════════════════════
const FuturePage = ({ onNextModule }) => {
  const [openRisk, setOpenRisk] = useState(null);

  const directions = [
    { icon:BookOpen, color:C.redV, label:'个人IP', role:'外显载体', desc:'以内容为外显机制，把认知和成长过程资产化，持续积累数字资产和人物势能。' },
    { icon:BarChart3, color:C.red, label:'量化投资', role:'长期硬核能力', desc:'以系统和规则替代情绪，持续优化策略，让资产以复利方式自动增长。' },
    { icon:Cpu, color:C.copper, label:'AI工作流', role:'放大层', desc:'把AI深度接入学习、写作、复盘全链路，成为连接IP与量化的效率中间层。' },
  ];

  const risks = [
    { id:'r1', label:'想法 > 承载能力', desc:'思维跨度大，容易同时启动多个方向。如果没有足够强的收束机制，会重新滑回"想得多做得少"的旧模式。' },
    { id:'r2', label:'情绪拉扯仍存在', desc:'碰到学业、父母预期、关系等不可控部分时，能量仍会出现明显回落。' },
    { id:'r3', label:'过高自我预期', desc:'已经比很多同龄人更早接触了一些事，很容易形成"我必须尽快做得很不一样"的压力。' },
    { id:'r4', label:'关系系统尚未成熟', desc:'长期关系与情绪稳定器仍有拉扯。未来成长不只取决于项目推进速度，也取决于能否建立更成熟的关系能力。' },
  ];

  return (
    <div className="min-h-screen text-[#1A1414] font-sans overflow-y-auto selection:bg-[#DC2626] selection:text-white" style={{ background: C.paper }}>
      <nav className="sticky top-0 w-full px-6 py-4 flex justify-between items-center z-40 backdrop-blur-md border-b border-black/5" style={{ background: `${C.paper}E0` }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNextModule('directory')}>
          <ArrowLeft size={15} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-gray-400">FINAL // FUTURE</span>
        </div>
        <span className="hidden md:inline text-[10px] font-mono text-gray-400">不是单点赢，而是系统赢</span>
      </nav>

      <FadeIn>
        <section className="min-h-[80vh] flex flex-col justify-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-[10px] font-mono font-bold mb-8 w-fit" style={{ background: C.ink }}><Compass size={12} /> VISION // 长期方向</div>
          <h1 className="text-4xl md:text-6xl font-black font-serif leading-[1.1] mb-8">
            不是单点赢，<br />而是<span style={{ color: C.redV }}>系统赢</span>。
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-serif leading-relaxed max-w-2xl">
            当IP、量化、AI三个模块联动起来，他就不再只是某个赛道里的参与者，而会形成自己的独特组合优势。初期不够稳定，但上限更高。
          </p>
        </section>
      </FadeIn>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <FadeIn>
          <section className="mb-20">
            <h2 className="text-xl font-serif font-black mb-8">三线联动架构</h2>
            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {directions.map(d => (
                <div key={d.label} className="bg-white border border-black/5 p-6 md:p-8 hover:-translate-y-1 transition-all hover:shadow-[0_20px_40px_-15px_rgba(127,29,29,0.15)]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: `${d.color}15` }}>
                    <d.icon size={18} color={d.color} />
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: d.color }}>{d.role}</div>
                  <h3 className="font-black text-lg mb-3 font-serif">{d.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
            {/* 三线汇流可视化 */}
            <div className="text-white p-6 md:p-10 relative overflow-hidden" style={{ background: C.ink }}>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6 text-center">三线汇流公式 · The Convergence</div>
              <svg viewBox="0 0 600 200" className="w-full h-auto max-w-3xl mx-auto">
                <defs>
                  <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.redV}/><stop offset="100%" stopColor={C.redL}/>
                  </linearGradient>
                  <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={C.red}/><stop offset="100%" stopColor={C.redL}/>
                  </linearGradient>
                  <linearGradient id="flow3" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={C.copper}/><stop offset="100%" stopColor={C.redL}/>
                  </linearGradient>
                </defs>

                {/* 三条流 */}
                <path d="M 30 40 Q 250 40, 300 100" fill="none" stroke="url(#flow1)" strokeWidth="2.5"/>
                <path d="M 30 100 L 300 100" fill="none" stroke="url(#flow2)" strokeWidth="2.5"/>
                <path d="M 30 160 Q 250 160, 300 100" fill="none" stroke="url(#flow3)" strokeWidth="2.5"/>

                {/* 汇流后向右四个产出 */}
                <path d="M 300 100 Q 380 100, 430 50" fill="none" stroke={C.redL} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
                <path d="M 300 100 L 430 90" fill="none" stroke={C.redL} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
                <path d="M 300 100 L 430 130" fill="none" stroke={C.redL} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
                <path d="M 300 100 Q 380 100, 430 170" fill="none" stroke={C.redL} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>

                {/* 输入节点 */}
                <g><circle cx="30" cy="40" r="6" fill={C.redV}/><text x="42" y="44" fill={C.redV} fontSize="13" fontWeight="700" fontFamily="monospace">IP</text></g>
                <g><circle cx="30" cy="100" r="6" fill={C.red}/><text x="42" y="104" fill={C.red} fontSize="13" fontWeight="700" fontFamily="monospace">QUANT</text></g>
                <g><circle cx="30" cy="160" r="6" fill={C.copper}/><text x="42" y="164" fill={C.copper} fontSize="13" fontWeight="700" fontFamily="monospace">AI</text></g>

                {/* 中心汇流 */}
                <circle cx="300" cy="100" r="22" fill={C.redL}/>
                <text x="300" y="98" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="'Noto Serif SC'">系统</text>
                <text x="300" y="111" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="'Noto Serif SC'">闭环</text>

                {/* 产出 */}
                {[
                  { y:50,t:'认知整理'},
                  { y:90,t:'内容资产'},
                  { y:130,t:'量化收益'},
                  { y:170,t:'人物势能'},
                ].map((o,i)=>(
                  <g key={i}>
                    <circle cx="430" cy={o.y} r="4" fill="#fff" opacity="0.6"/>
                    <text x="445" y={o.y+4} fill="#aaa" fontSize="11" fontFamily="'Noto Serif SC'">{o.t}</text>
                  </g>
                ))}

                {/* 最终复利箭头 */}
                <path d="M 540 100 L 580 100" stroke={C.redL} strokeWidth="2" markerEnd="url(#ar)"/>
                <defs>
                  <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={C.redL}/>
                  </marker>
                </defs>
                <text x="588" y="98" fill={C.redL} fontSize="12" fontWeight="700" fontFamily="'Noto Serif SC'">复</text>
                <text x="588" y="112" fill={C.redL} fontSize="12" fontWeight="700" fontFamily="'Noto Serif SC'">利</text>
              </svg>
              <div className="mt-6 text-center text-gray-500 text-xs font-mono">三条线汇成一个系统 · 系统输出复利</div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mb-20">
            <h2 className="text-xl font-serif font-black mb-2">当前风险点</h2>
            <p className="text-sm text-gray-400 mb-8">不是没潜力，而是需要更稳定的承载系统</p>
            <div className="space-y-3">
              {risks.map(r => (
                <div key={r.id} onClick={() => setOpenRisk(openRisk === r.id ? null : r.id)}
                  className="bg-white border border-black/5 cursor-pointer hover:border-gray-200 transition-all">
                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: C.copper }} />
                        <span className="font-bold text-sm text-[#1A1414]">{r.label}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 transition-transform" style={{ transform: openRisk === r.id ? 'rotate(90deg)' : '' }} />
                    </div>
                    {openRisk === r.id && <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-black/5 pt-4">{r.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <div className="text-white p-8 md:p-12 mb-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.ink} 0%, ${C.wine} 100%)` }}>
            <div className="absolute -right-12 -bottom-12 opacity-5">
              <Flame size={280} strokeWidth={1} color="white" />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-8" style={{ color: C.redL }}>最终判断</div>
              <div className="space-y-6 max-w-2xl">
                {[
                  '这不是一个已经完成的人，而是一个正在成形的系统。',
                  '他已经明显地知道自己不想活成什么样，也越来越知道自己想争取什么样的人生状态。',
                  '他真正想争的，不只是结果，而是人生的方向盘。',
                ].map((q, i) => (
                  <p key={i} className={`font-serif leading-relaxed ${i === 2 ? 'text-xl md:text-2xl font-bold' : 'text-base md:text-lg text-gray-300'}`}
                    style={i === 2 ? { color: C.redL } : {}}>
                    {i !== 2 && <span className="font-black text-4xl mr-3 align-top leading-none" style={{ color: `${C.redL}40` }}>"</span>}{q}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="flex justify-end">
          <button onClick={() => onNextModule('outro')} className="px-6 md:px-8 py-4 text-white font-bold tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-3" style={{ background: C.redL }}>
            尾声 · 通关报告 <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// 8. OUTRO — 通关报告 + 相似度测试
// ═════════════════════════════════════════════════════════════
const OutroPage = ({ onRestart }) => {
  const [visible, setVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [quizMode, setQuizMode] = useState('intro'); // intro / playing / done
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => setStatsVisible(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const minutesSpent = Math.max(1, Math.floor((Date.now() - STATE.startTime) / 60000));
  const totalInteractions = STATE.forcesFlipped.size + STATE.assetsUnlocked.size + STATE.timelineExplored.size + STATE.principlesOpened.size;
  const completionRate = Math.min(100, Math.floor(((STATE.forcesFlipped.size / 3 + STATE.assetsUnlocked.size / 5 + STATE.timelineExplored.size / 6 + STATE.principlesOpened.size / 4) / 4) * 100));

  // 相似度测试题目
  const quizQuestions = [
    {
      q:'面对失控感时，你的第一反应是？',
      options:[
        { text:'更努力，逼自己拉回来', score:5 },
        { text:'找一个机制，让事情自己运转', score:20 },
        { text:'接受这是常态，先休息', score:10 },
        { text:'做点别的事转移注意力', score:0 },
      ]
    },
    {
      q:'你更愿意把"成长"理解成？',
      options:[
        { text:'不断学新东西', score:10 },
        { text:'把多个能力连成系统', score:20 },
        { text:'在某个领域做到顶尖', score:5 },
        { text:'体验更多种生活', score:0 },
      ]
    },
    {
      q:'关于钱，你最在意的是？',
      options:[
        { text:'越多越好', score:0 },
        { text:'选择权和自由', score:20 },
        { text:'安全感', score:5 },
        { text:'帮助别人', score:10 },
      ]
    },
    {
      q:'你做事的节奏更像？',
      options:[
        { text:'计划好再开始', score:5 },
        { text:'先跑起来再调整', score:20 },
        { text:'看时机出手', score:10 },
        { text:'长期慢慢做', score:0 },
      ]
    },
    {
      q:'你最厌恶哪种状态？',
      options:[
        { text:'失败和被否定', score:0 },
        { text:'有潜能却被无力感磨成麻木', score:20 },
        { text:'重复和无聊', score:10 },
        { text:'被孤立', score:5 },
      ]
    },
  ];

  const answerQuiz = (score) => {
    const newAns = [...quizAnswers, score];
    setQuizAnswers(newAns);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizMode('done');
      STATE.quizCompleted = true;
    }
  };

  const similarity = quizAnswers.reduce((a, b) => a + b, 0); // 0-100
  const interpretation = similarity >= 80 ? { label:'高度相似', color:C.redL,
    desc:'你和Jaycen底层非常像——都在用系统对抗失控，都在追求"方向盘握在自己手里"的状态。',
    line:`我和Jaycen的相似度是${similarity}%——都在用系统对抗失控。` } :
    similarity >= 60 ? { label:'相似', color:C.red,
    desc:'你们有相似的底层动机，但路径未必相同。可能你也偏爱掌控，但用不同的方式实现。',
    line:`我和Jaycen的相似度是${similarity}%——同向但不同路。` } :
    similarity >= 40 ? { label:'部分相似', color:C.copper,
    desc:'你们的生活态度更互补而不是相似。你或许更看重Jaycen不那么在意的东西。',
    line:`我和Jaycen的相似度是${similarity}%——互补而非相似。` } :
    { label:'非常不同', color:C.amber,
    desc:'你和Jaycen是非常不同的两种人。但人物的差异本身就有价值——不是每种人都该是同一个模子。',
    line:`我和Jaycen的相似度是${similarity}%——是两种人。` };

  const journeyStats = [
    { label:'阅读时长', val:`${minutesSpent}`, suffix:' 分钟', icon:Clock },
    { label:'互动次数', val:totalInteractions, suffix:' 次', icon:Activity },
    { label:'完成度', val:completionRate, suffix:'%', icon:Award },
  ];

  const shareLine = `${interpretation.line} 完整档案 → ${typeof window !== 'undefined' ? window.location.href : ''}`;
  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10" style={{ background: C.black }}>
      <CursorGlow />
      <GrainOverlay opacity={0.08} />
      <style>{`
        .outro-in { opacity: 0; transform: translateY(20px); transition: all 1.5s ease; }
        .outro-in.show { opacity: 1; transform: translateY(0); }
        .stat-in { opacity: 0; transform: translateY(15px); transition: all 0.8s cubic-bezier(0.2,0.8,0.2,1); }
        .stat-in.show { opacity: 1; transform: translateY(0); }
        .quiz-in { animation: quiz-fade 0.6s ease forwards; }
        @keyframes quiz-fade { from {opacity:0;transform:translateY(8px)} to {opacity:1;transform:translateY(0)} }
      `}</style>
      <div className={`outro-in ${visible ? 'show' : ''} text-center px-6 relative z-10 max-w-3xl w-full`}>
        <div className="text-[10px] font-mono text-white/20 tracking-[0.5em] md:tracking-[0.6em] uppercase mb-12" style={{ fontFamily: "'Cinzel',serif" }}>
          JAYCEN · WANG JIAHENG · 2026
        </div>
        <h1 className="text-3xl md:text-6xl font-black font-serif text-white mb-6 md:mb-8 tracking-wide leading-tight"
          style={{ textShadow: `0 0 60px ${C.redL}70` }}>
          正在成形中的系统
        </h1>
        <p className="text-white/40 text-base md:text-lg tracking-[0.15em] md:tracking-[0.2em] mb-4">仍在变化 · 仍会波动 · 仍保有火与感受力</p>
        <div className="w-16 h-px mx-auto my-8 opacity-50" style={{ background: C.redL }} />

        <div className={`stat-in ${statsVisible ? 'show' : ''}`}>
          <div className="text-[10px] font-mono tracking-[0.4em] md:tracking-[0.5em] uppercase mb-6" style={{ color: C.redL, opacity: 0.6 }}>Your Journey · 通关报告</div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
            {journeyStats.map((s, i) => (
              <div key={i} className="border border-white/10 p-3 md:p-5 bg-white/[0.02]">
                <div className="flex items-center justify-center mb-2" style={{ color: C.redL, opacity: 0.5 }}>
                  <s.icon size={14} />
                </div>
                <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: C.redL, fontFamily: "'Playfair Display',serif" }}>
                  {s.val}<span className="text-xs md:text-sm font-normal text-white/40 ml-1">{s.suffix}</span>
                </div>
                <div className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 相似度测试 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-10 text-left">
            {quizMode === 'intro' && (
              <div className="text-center">
                <div className="text-[10px] font-mono tracking-[0.4em] uppercase mb-3" style={{ color: C.redL, opacity: 0.6 }}>互动测试 · Personality Match</div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3">你和 Jaycen 有几分像？</h3>
                <p className="text-white/50 text-sm mb-6">5道题 · 大约30秒 · 测出底层相似度</p>
                <button onClick={() => setQuizMode('playing')}
                  className="px-8 py-3 border text-white hover:bg-[#DC2626] hover:border-[#DC2626] transition-all text-sm font-mono tracking-widest"
                  style={{ borderColor: `${C.redL}50` }}>
                  开始测试 →
                </button>
              </div>
            )}

            {quizMode === 'playing' && (
              <div className="quiz-in" key={quizStep}>
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[10px] font-mono text-white/40 tracking-widest">Q{quizStep + 1} / {quizQuestions.length}</div>
                  <div className="flex gap-1">
                    {quizQuestions.map((_, i) => (
                      <div key={i} className="w-6 h-1" style={{ background: i <= quizStep ? C.redL : '#ffffff15' }} />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl text-white mb-6 font-serif">{quizQuestions[quizStep].q}</h3>
                <div className="space-y-3">
                  {quizQuestions[quizStep].options.map((opt, i) => (
                    <button key={i} onClick={() => answerQuiz(opt.score)}
                      className="w-full text-left px-5 py-4 border border-white/10 hover:border-[#DC2626] hover:bg-[#DC2626]/5 transition-all text-white/80 hover:text-white text-sm flex items-center gap-3 group">
                      <span className="text-[10px] font-mono text-white/30 group-hover:text-[#DC2626] transition-colors">{String.fromCharCode(65 + i)}</span>
                      <span className="flex-1">{opt.text}</span>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-[#DC2626] transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizMode === 'done' && (
              <div className="quiz-in text-center">
                <div className="text-[10px] font-mono tracking-[0.4em] uppercase mb-4" style={{ color: interpretation.color, opacity: 0.7 }}>测试结果</div>
                <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: interpretation.color, fontFamily: "'Playfair Display',serif" }}>
                  {similarity}<span className="text-2xl md:text-3xl">%</span>
                </div>
                <div className="text-lg md:text-xl font-bold text-white mb-4">{interpretation.label}</div>
                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md mx-auto">{interpretation.desc}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={copyShare}
                    className="px-5 py-2.5 border text-white hover:bg-[#DC2626] hover:border-[#DC2626] transition-all text-xs font-mono tracking-widest flex items-center gap-2"
                    style={{ borderColor: `${C.redL}50` }}>
                    {copied ? <><Check size={12}/> 已复制</> : <><Copy size={12}/> 复制结果</>}
                  </button>
                  <button onClick={() => { setQuizMode('intro'); setQuizStep(0); setQuizAnswers([]); }}
                    className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-mono tracking-widest">
                    再测一次
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 text-white/30 text-sm font-mono mb-12">
            <p>IP · 量化 · AI · 系统赢</p>
            <p>身体第一 · 注意力第二 · 语言第三</p>
          </div>

          <button onClick={onRestart}
            className="px-8 py-4 border text-white/70 hover:text-white hover:border-[#DC2626] hover:bg-[#DC2626]/10 transition-all text-xs font-mono tracking-[0.3em] md:tracking-[0.4em] uppercase"
            style={{ borderColor: 'rgba(220,38,38,0.3)' }}>
            重新进入档案室
          </button>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${C.redL}0F 0%, transparent 65%)` }} />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// App Router
// ═════════════════════════════════════════════════════════════
const App = () => {
  const [current, setCurrent] = useState('landing');
  const [completedChapters, setCompletedChapters] = useState(() => {
    try {
      const stored = localStorage.getItem('jaycen_chapters');
      return new Set(stored ? JSON.parse(stored) : []);
    } catch { return new Set(); }
  });

  const navOrder = ['directory', 'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'final'];

  useEffect(() => {
    // 切页面时强制滚到顶部（修复移动端跳到底部的bug）
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // 兼容老浏览器
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // 重置所有内部滚动容器
      requestAnimationFrame(() => {
        document.querySelectorAll('[data-scroll-container]').forEach(el => { el.scrollTop = 0; });
      });
    } catch {}
    STATE.pagesVisited.add(current);
    if (current !== 'landing' && current !== 'outro') {
      setCompletedChapters(prev => {
        const next = new Set(prev);
        next.add(current);
        try { localStorage.setItem('jaycen_chapters', JSON.stringify([...next])); } catch {}
        return next;
      });
    }
  }, [current]);

  // 键盘导航
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (current === 'landing') return;
      const idx = navOrder.indexOf(current);
      if (e.key === 'Escape') setCurrent('directory');
      else if (e.key === 'ArrowRight' && idx >= 0 && idx < navOrder.length - 1) setCurrent(navOrder[idx + 1]);
      else if (e.key === 'ArrowLeft' && idx > 0) setCurrent(navOrder[idx - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current]);

  const nav = (page) => setCurrent(page);

  const pages = {
    landing: <LandingPage onEnter={() => nav('directory')} />,
    directory: <DirectoryPage onNavigate={nav} completedChapters={completedChapters} />,
    ch01: <ProfilePage onNextModule={nav} />,
    ch02: <TimelinePage onNextModule={nav} />,
    ch03: <TracksPage onNextModule={nav} />,
    ch04: <MindsetPage onNextModule={nav} />,
    ch05: <AssetsPage onNextModule={nav} />,
    final: <FuturePage onNextModule={nav} />,
    outro: <OutroPage onRestart={() => nav('landing')} />,
  };

  const navItems = [
    { id: 'directory', label: '目录' },
    { id: 'ch01', label: '01' },
    { id: 'ch02', label: '02' },
    { id: 'ch03', label: '03' },
    { id: 'ch04', label: '04' },
    { id: 'ch05', label: '05' },
    { id: 'final', label: '终' },
  ];

  return (
    <div className="relative" key={current}>
      <style>{`
        @keyframes page-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .page-anim { animation: page-fade-in 0.5s cubic-bezier(0.2,0.8,0.2,1); }
      `}</style>
      {current !== 'landing' && current !== 'outro' && (
        <>
          <div className="fixed bottom-3 md:bottom-4 right-3 md:right-4 z-[200] flex gap-1 md:gap-1 bg-white/85 backdrop-blur-sm px-1.5 py-1.5 md:px-1 md:py-0 rounded-sm shadow-lg md:shadow-none md:bg-transparent md:backdrop-blur-none"
            style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => nav(item.id)}
                className={`w-10 h-10 md:w-8 md:h-8 text-[11px] md:text-[10px] font-mono font-bold transition-all border ${current === item.id ? 'text-white' : 'bg-white/95 text-gray-500 border-gray-200 hover:text-[#7F1D1D]'} active:scale-95`}
                style={current === item.id ? { background: C.redV, borderColor: C.redV } : { borderColor: '#e5e5e5' }}
                onMouseEnter={(e) => { if (current !== item.id) e.currentTarget.style.borderColor = C.redV; }}
                onMouseLeave={(e) => { if (current !== item.id) e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                {item.label}
              </button>
            ))}
          </div>
          <ShareButton />
        </>
      )}
      <div className="page-anim">
        {pages[current] || <DirectoryPage onNavigate={nav} completedChapters={completedChapters} />}
      </div>
    </div>
  );
};

export default App;
