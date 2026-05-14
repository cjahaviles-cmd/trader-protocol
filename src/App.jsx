import { useState, useEffect } from "react";

const STORAGE_KEY = "trader_checklist_v2";
const getTodayKey = () => new Date().toISOString().split("T")[0];

const premarketSections = [
  {
    id: "mentalidad",
    title: "MENTALIDAD DE APERTURA",
    icon: "🧠",
    items: [
      { id: "no_tiktok", label: "Sin TikTok al despertar", critical: true },
      { id: "no_instagram", label: "Sin Instagram al despertar", critical: true },
      { id: "no_noticias", label: "Sin noticias al despertar", critical: true },
      { id: "no_discord", label: "Sin Discord al despertar", critical: true },
      { id: "no_pnl", label: "Sin revisar PnL", critical: true },
    ],
  },
  {
    id: "cuerpo",
    title: "ACTIVACIÓN FÍSICA",
    icon: "⚡",
    items: [
      { id: "agua", label: "Agua apenas despertar", critical: false },
      { id: "activacion", label: "Activación física 20–40 min", critical: false },
      { id: "respiracion", label: "Respiración / regulación 5–10 min", critical: false },
    ],
  },
  {
    id: "htf",
    title: "CONTEXTO HTF",
    icon: "📊",
    items: [
      { id: "weekly", label: "Weekly — estructura macro", critical: true },
      { id: "daily", label: "Daily — tendencia actual", critical: true },
      { id: "h4", label: "4H — flujo de sesión", critical: true },
      { id: "liquidez", label: "Liquidez importante marcada", critical: true },
      { id: "sesgo", label: "Sesgo del día definido", critical: true },
    ],
  },
  {
    id: "escenarios",
    title: "ESCENARIOS PRE-NY",
    icon: "🎯",
    items: [
      { id: "que_ver", label: "Qué quiero ver (setup)", critical: true },
      { id: "invalida", label: "Qué INVALIDA mi idea", critical: true },
      { id: "no_tradear", label: "Qué NO voy a tradear hoy", critical: true },
    ],
  },
];

const MANTRA_PREMARKET = "Mi trabajo NO es ganar dinero hoy.\nMi trabajo es ejecutar correctamente.";

const AXIOM = "Lento es limpio. Limpio es rápido.";

const duranteSections = [
  {
    id: "ejecucion",
    title: "DURANTE EL TRADING",
    icon: "⚔️",
    color: "#818cf8",
    items: [
      { id: "confirmacion", label: "Esperar confirmación completa — NO anticipar", warn: true },
      { id: "respirar", label: "Respirar antes de entrar", warn: false },
      { id: "no_perseguir", label: "No perseguir velas", warn: true },
      { id: "no_improvisar", label: "No improvisar", warn: true },
      { id: "max_trades", label: "Máximo 2 trades al día", warn: true },
      { id: "riesgo_fijo", label: "Riesgo fijo — NO aumentar por emociones", warn: true },
      { id: "pregunta_post", label: "¿Disciplina o tensión emocional? (post-trade)", warn: false },
    ],
  },
  {
    id: "stop",
    title: "SEÑALES DE PARADA",
    icon: "🛑",
    color: "#f87171",
    items: [
      { id: "urgencia", label: "Siento urgencia → PARAR", warn: true },
      { id: "rabia", label: "Siento rabia → PARAR", warn: true },
      { id: "fomo", label: "Siento FOMO → PARAR", warn: true },
      { id: "recuperar", label: "Necesidad de recuperar → PARAR", warn: true },
      { id: "euforia", label: "Siento euforia → PARAR", warn: true },
    ],
  },
  {
    id: "reglas",
    title: "REGLAS ABSOLUTAS",
    icon: "⛔",
    color: "#fb923c",
    items: [
      { id: "no_revenge", label: "NO revenge trading", warn: true },
      { id: "no_riesgo_perdida", label: "NO aumentar riesgo tras pérdida", warn: true },
      { id: "no_aburrimiento", label: "NO operar por aburrimiento", warn: true },
      { id: "no_dinero", label: "NO mirar dinero constantemente", warn: true },
    ],
  },
  {
    id: "postmarket",
    title: "POST-MARKET",
    icon: "📓",
    color: "#34d399",
    items: [
      { id: "cerrar_plataforma", label: "Cerrar plataforma al terminar", warn: false },
      { id: "journal_sistema", label: "Journal: ¿Seguí mi sistema?", warn: false },
      { id: "journal_senti", label: "Journal: ¿Qué sentí?", warn: false },
      { id: "journal_detonó", label: "Journal: ¿Qué detonó emociones?", warn: false },
      { id: "journal_bien", label: "Journal: ¿Qué hice bien?", warn: false },
      { id: "evaluar_ejecucion", label: "Evaluar ejecución — NO resultado", warn: false },
      { id: "desconectar", label: "Desconectarme del mercado", warn: false },
    ],
  },
];

const identityPrinciples = [
  "No soy un apostador. Soy un ejecutor profesional.",
  "El mercado recompensa paciencia y destruye urgencia.",
  "Mi ventaja está en la consistencia emocional.",
  "Los retiros son consecuencia de ejecutar bien repetidamente.",
];

export default function TraderProtocol() {
  const [tab, setTab] = useState("premarket");
  const [checks, setChecks] = useState({});
  const [mindsetChecks, setMindsetChecks] = useState({});
  const [todayKey] = useState(getTodayKey());
  const [mantraVisible, setMantraVisible] = useState(false);
  const [streak, setStreak] = useState(0);
  const [identityIndex, setIdentityIndex] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = data[todayKey] || {};
    setChecks(today.premarket || {});
    setMindsetChecks(today.mindset || {});

    let s = 0;
    let d = new Date();
    while (true) {
      d.setDate(d.getDate() - 1);
      const k = d.toISOString().split("T")[0];
      const dayData = data[k];
      if (!dayData) break;
      const allItems = premarketSections.flatMap((sec) => sec.items);
      const completed = allItems.every((it) => dayData.premarket?.[it.id]);
      if (completed) s++;
      else break;
    }
    setStreak(s);
  }, [todayKey]);

  useEffect(() => {
    const t = setInterval(() => {
      setIdentityIndex((i) => (i + 1) % identityPrinciples.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const saveChecks = (pm, ms) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[todayKey] = { premarket: pm, mindset: ms };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setChecks(pm);
    setMindsetChecks(ms);
  };

  const togglePre = (id) => {
    const updated = { ...checks, [id]: !checks[id] };
    saveChecks(updated, mindsetChecks);
  };

  const toggleMindset = (id) => {
    const updated = { ...mindsetChecks, [id]: !mindsetChecks[id] };
    saveChecks(checks, updated);
  };

  const resetDay = () => {
    saveChecks({}, {});
    setMantraVisible(false);
  };

  const allPre = premarketSections.flatMap((s) => s.items);
  const totalPre = allPre.length;
  const donePre = allPre.filter((it) => checks[it.id]).length;
  const progressPre = Math.round((donePre / totalPre) * 100);
  const criticalDone = premarketSections.flatMap(s => s.items).filter(it => it.critical).every(it => checks[it.id]);
  const progressColor = progressPre < 40 ? "#ef4444" : progressPre < 75 ? "#f59e0b" : "#22c55e";

  const allMind = duranteSections.flatMap((s) => s.items);
  const totalMind = allMind.length;
  const doneMind = allMind.filter((it) => mindsetChecks[it.id]).length;
  const progressMind = Math.round((doneMind / totalMind) * 100);

  const dateStr = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div style={st.root}>
      <div style={st.gridBg} />

      <header style={st.header}>
        <div style={st.headerLeft}>
          <span style={st.logo}>◈</span>
          <div>
            <div style={st.appTitle}>TRADER PROTOCOL</div>
            <div style={st.dateStr}>{dateStr}</div>
          </div>
        </div>
        <div style={st.headerRight}>
          {streak > 0 && <div style={st.streakBadge}>🔥 {streak}d</div>}
          <button onClick={resetDay} style={st.resetBtn}>RESET</button>
        </div>
      </header>

      <div style={st.tabBar}>
        <button onClick={() => setTab("premarket")}
          style={{ ...st.tabBtn, ...(tab === "premarket" ? st.tabBtnActive : {}) }}>
          <span>◎</span> PRE-MARKET
          <span style={{ ...st.tabBadge, background: tab === "premarket" ? progressColor : "#1e293b", color: tab === "premarket" ? "#080c10" : "#475569" }}>
            {progressPre}%
          </span>
        </button>
        <button onClick={() => setTab("mindset")}
          style={{ ...st.tabBtn, ...(tab === "mindset" ? st.tabBtnActiveMindset : {}) }}>
          <span>◉</span> MINDSET
          <span style={{ ...st.tabBadge, background: tab === "mindset" ? "#818cf8" : "#1e293b", color: tab === "mindset" ? "#080c10" : "#475569" }}>
            {progressMind}%
          </span>
        </button>
      </div>

      {tab === "premarket" && (
        <div style={st.tabContent}>
          <div style={st.progressSection}>
            <div style={st.progressHeader}>
              <span style={st.progressLabel}>EJECUCIÓN DEL DÍA</span>
              <span style={{ ...st.progressPct, color: progressColor }}>{progressPre}%</span>
            </div>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressFill, width: `${progressPre}%`, background: progressColor, boxShadow: `0 0 12px ${progressColor}80` }} />
            </div>
            <div style={st.progressSub}>
              {donePre}/{totalPre} elementos · {criticalDone ? "✓ Críticos completos" : "⚠ Críticos pendientes"}
            </div>
          </div>

          <div style={st.sections}>
            {premarketSections.map((section) => {
              const secDone = section.items.filter((it) => checks[it.id]).length;
              return (
                <div key={section.id} style={st.card}>
                  <div style={st.cardHeader}>
                    <span style={st.cardIcon}>{section.icon}</span>
                    <div style={st.cardTitleBlock}>
                      <div style={st.cardTitle}>{section.title}</div>
                      <div style={st.cardCount}>{secDone}/{section.items.length}</div>
                    </div>
                  </div>
                  <div style={st.itemList}>
                    {section.items.map((item) => {
                      const done = !!checks[item.id];
                      return (
                        <button key={item.id} onClick={() => togglePre(item.id)}
                          style={{ ...st.item, ...(done ? st.itemDone : {}) }}>
                          <span style={{ ...st.checkbox, ...(done ? st.checkboxDone : {}) }}>{done ? "✓" : ""}</span>
                          <span style={{ ...st.itemLabel, ...(done ? st.itemLabelDone : {}) }}>{item.label}</span>
                          {item.critical && !done && <span style={st.criticalDot} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={st.mantraCard} onClick={() => setMantraVisible(!mantraVisible)}>
            <div style={st.mantraHeader}>
              <span style={st.mantraIcon}>◉</span>
              <span style={st.mantraTitle}>RECORDATORIO MENTAL</span>
              <span style={st.mantraToggle}>{mantraVisible ? "▲" : "▼"}</span>
            </div>
            {mantraVisible && (
              <div style={st.mantraText}>
                {MANTRA_PREMARKET.split("\n").map((line, i) => (
                  <div key={i} style={i === 0 ? st.mantraLine1 : st.mantraLine2}>{line}</div>
                ))}
              </div>
            )}
          </div>

          {progressPre === 100 && (
            <div style={st.doneBanner}>
              <span style={st.doneIcon}>⬡</span>
              <div>
                <div style={st.doneTitle}>PROTOCOLO COMPLETADO</div>
                <div style={st.doneSub}>Ahora ejecuta. El mercado no sabe que llegaste preparado — pero tú sí.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "mindset" && (
        <div style={st.tabContent}>
          <div style={st.axiomHero}>
            <div style={st.axiomLine} />
            <div style={st.axiomText}>{AXIOM}</div>
            <div style={st.axiomLine} />
          </div>

          <div style={st.identityTicker}>
            <span style={st.identityLabel}>IDENTIDAD ·</span>
            <span style={st.identityText}>{identityPrinciples[identityIndex]}</span>
          </div>

          <div style={{ ...st.progressSection, paddingTop: 16 }}>
            <div style={st.progressHeader}>
              <span style={st.progressLabel}>REVISIÓN DE SESIÓN</span>
              <span style={{ ...st.progressPct, color: "#818cf8" }}>{progressMind}%</span>
            </div>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressFill, width: `${progressMind}%`, background: "#818cf8", boxShadow: "0 0 12px #818cf880" }} />
            </div>
            <div style={st.progressSub}>{doneMind}/{totalMind} elementos revisados</div>
          </div>

          <div style={st.sections}>
            {duranteSections.map((section) => {
              const secDone = section.items.filter((it) => mindsetChecks[it.id]).length;
              return (
                <div key={section.id} style={{ ...st.card, border: `1px solid ${section.color}18` }}>
                  <div style={st.cardHeader}>
                    <span style={st.cardIcon}>{section.icon}</span>
                    <div style={st.cardTitleBlock}>
                      <div style={{ ...st.cardTitle, color: section.color }}>{section.title}</div>
                      <div style={st.cardCount}>{secDone}/{section.items.length}</div>
                    </div>
                  </div>
                  <div style={st.itemList}>
                    {section.items.map((item) => {
                      const done = !!mindsetChecks[item.id];
                      return (
                        <button key={item.id} onClick={() => toggleMindset(item.id)}
                          style={{ ...st.item, ...(done ? { ...st.itemDone, background: `${section.color}08`, border: `1px solid ${section.color}20` } : {}) }}>
                          <span style={{ ...st.checkbox, ...(done ? { ...st.checkboxDone, background: section.color, borderColor: section.color } : {}) }}>
                            {done ? "✓" : ""}
                          </span>
                          <span style={{ ...st.itemLabel, ...(done ? st.itemLabelDone : {}) }}>{item.label}</span>
                          {item.warn && !done && <span style={{ ...st.criticalDot, background: section.color, boxShadow: `0 0 6px ${section.color}` }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={st.identityCard}>
            <div style={st.identityCardHeader}>
              <span style={{ fontSize: 14, color: "#818cf8" }}>◈</span>
              <span style={st.identityCardTitle}>IDENTIDAD DEL TRADER</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {identityPrinciples.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#818cf8", fontSize: 12, flexShrink: 0, marginTop: 1 }}>—</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.04em", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "14px 0" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.08em" }}>El día NO importa.</span>
              <span style={{ fontSize: 12, color: "#818cf8", letterSpacing: "0.08em" }}> La muestra estadística sí.</span>
            </div>
          </div>
        </div>
      )}

      <div style={st.bottomBar}>
        <div style={{ ...st.bottomDot, background: tab === "premarket" ? progressColor : "#1e293b" }} />
        <div style={{ ...st.bottomDot, background: tab === "mindset" ? "#818cf8" : "#1e293b" }} />
      </div>
    </div>
  );
}

const st = {
  root: { minHeight: "100vh", background: "#080c10", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", paddingBottom: 80, position: "relative", overflowX: "hidden" },
  gridBg: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  header: { position: "sticky", top: 0, zIndex: 10, background: "rgba(8,12,16,0.96)", borderBottom: "1px solid rgba(34,197,94,0.12)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 26, color: "#22c55e", lineHeight: 1 },
  appTitle: { fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#22c55e" },
  dateStr: { fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "capitalize", marginTop: 2 },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  streakBadge: { fontSize: 11, background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c", padding: "4px 10px", borderRadius: 4, letterSpacing: "0.05em" },
  resetBtn: { fontSize: 10, letterSpacing: "0.15em", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" },
  tabBar: { position: "sticky", top: 53, zIndex: 9, display: "flex", background: "rgba(8,12,16,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 16px", gap: 4 },
  tabBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#475569", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" },
  tabBtnActive: { color: "#22c55e", borderBottom: "2px solid #22c55e" },
  tabBtnActiveMindset: { color: "#818cf8", borderBottom: "2px solid #818cf8" },
  tabBadge: { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.05em", transition: "all 0.3s ease" },
  tabContent: { position: "relative", zIndex: 1 },
  progressSection: { padding: "20px 20px 0" },
  progressHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progressLabel: { fontSize: 10, letterSpacing: "0.2em", color: "#64748b" },
  progressPct: { fontSize: 20, fontWeight: 700, letterSpacing: "0.05em" },
  progressTrack: { height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, transition: "width 0.4s ease" },
  progressSub: { marginTop: 8, fontSize: 10, color: "#475569", letterSpacing: "0.08em" },
  sections: { padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 },
  card: { background: "rgba(15,23,30,0.9)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 8, padding: "14px", backdropFilter: "blur(4px)" },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  cardIcon: { fontSize: 16 },
  cardTitleBlock: { flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8" },
  cardCount: { fontSize: 10, color: "#475569" },
  itemList: { display: "flex", flexDirection: "column", gap: 5 },
  item: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 5, padding: "9px 11px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s ease", width: "100%" },
  itemDone: { background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" },
  checkbox: { width: 17, height: 17, border: "1.5px solid #334155", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#22c55e", flexShrink: 0, transition: "all 0.15s ease" },
  checkboxDone: { background: "#22c55e", borderColor: "#22c55e", color: "#080c10", fontWeight: 700 },
  itemLabel: { fontSize: 11, color: "#94a3b8", flex: 1, letterSpacing: "0.03em", transition: "color 0.15s ease" },
  itemLabelDone: { color: "#334155", textDecoration: "line-through" },
  criticalDot: { width: 5, height: 5, borderRadius: "50%", background: "#ef4444", flexShrink: 0, boxShadow: "0 0 6px #ef4444" },
  mantraCard: { position: "relative", zIndex: 1, margin: "14px 16px 0", background: "rgba(15,23,30,0.9)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: 8, padding: "12px 14px", cursor: "pointer" },
  mantraHeader: { display: "flex", alignItems: "center", gap: 10 },
  mantraIcon: { color: "#fbbf24", fontSize: 13 },
  mantraTitle: { flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#fbbf24" },
  mantraToggle: { fontSize: 10, color: "#64748b" },
  mantraText: { marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(251,191,36,0.08)" },
  mantraLine1: { fontSize: 12, color: "#e2e8f0", letterSpacing: "0.04em", lineHeight: 1.6 },
  mantraLine2: { fontSize: 13, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.05em", marginTop: 4, lineHeight: 1.6 },
  doneBanner: { position: "relative", zIndex: 1, margin: "14px 16px 0", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, padding: "14px", display: "flex", alignItems: "flex-start", gap: 12 },
  doneIcon: { fontSize: 24, color: "#22c55e", lineHeight: 1, flexShrink: 0 },
  doneTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#22c55e", marginBottom: 4 },
  doneSub: { fontSize: 11, color: "#64748b", letterSpacing: "0.03em", lineHeight: 1.6 },
  axiomHero: { margin: "20px 16px 0", display: "flex", alignItems: "center", gap: 12 },
  axiomLine: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)" },
  axiomText: { fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textAlign: "center", whiteSpace: "nowrap" },
  identityTicker: { margin: "10px 16px 0", padding: "8px 12px", background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.1)", borderRadius: 5, display: "flex", gap: 8, alignItems: "flex-start", minHeight: 40 },
  identityLabel: { fontSize: 9, color: "#818cf8", letterSpacing: "0.15em", flexShrink: 0, paddingTop: 1 },
  identityText: { fontSize: 11, color: "#94a3b8", letterSpacing: "0.04em", lineHeight: 1.5 },
  identityCard: { margin: "14px 16px 0", background: "rgba(15,23,30,0.9)", border: "1px solid rgba(129,140,248,0.12)", borderRadius: 8, padding: "16px" },
  identityCardHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  identityCardTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#818cf8" },
  bottomBar: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 20 },
  bottomDot: { width: 6, height: 6, borderRadius: "50%", transition: "background 0.3s ease" },
};
