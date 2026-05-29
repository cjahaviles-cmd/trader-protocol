import { useState, useEffect } from "react";

const STORAGE_KEY = "trader_checklist_v3";
const getTodayKey = () => new Date().toISOString().split("T")[0];

// ─── TAB 1: PRE-MARKET ────────────────────────────────────────────────────────

const premarketSections = [
  {
    id: "mentalidad",
    title: "MENTALIDAD DE APERTURA",
    icon: "🧠",
    items: [
      { id: "no_instagram", label: "Sin Instagram al despertar", critical: true },
      { id: "no_noticias",  label: "Sin noticias al despertar",  critical: true },
      { id: "no_pnl",       label: "Sin revisar PnL",            critical: true },
    ],
  },
  {
    id: "cuerpo",
    title: "ACTIVACIÓN FÍSICA",
    icon: "⚡",
    items: [
      { id: "agua",        label: "Agua apenas despertar",          critical: false },
      { id: "activacion",  label: "Activación física 20–40 min",    critical: false },
      { id: "respiracion", label: "Respiración / regulación 5–10 min", critical: false },
    ],
  },
  {
    id: "htf",
    title: "CONTEXTO HTF",
    icon: "📊",
    items: [
      { id: "weekly",   label: "Weekly — estructura macro",    critical: true },
      { id: "daily",    label: "Daily — tendencia actual",     critical: true },
      { id: "h4",       label: "4H — flujo de sesión",         critical: true },
      { id: "liquidez", label: "Liquidez importante marcada",  critical: true },
      { id: "sesgo",    label: "Sesgo del día definido",       critical: true },
    ],
  },
  {
    id: "escenarios",
    title: "ESCENARIOS PRE-NY",
    icon: "🎯",
    items: [
      { id: "que_ver",    label: "Qué quiero ver (setup)",  critical: true },
      { id: "invalida",   label: "Qué INVALIDA mi idea",    critical: true },
      { id: "no_tradear", label: "Qué NO voy a tradear hoy", critical: true },
    ],
  },
];

const VERSICULO = {
  ref:  "Proverbios 16:32",
  text: "Mejor es ser paciente que poderoso; más vale tener control propio que conquistar una ciudad.",
};

// ─── TAB 2: MINDSET ───────────────────────────────────────────────────────────

const AXIOM = "Lento es limpio. Limpio es rápido.";

const goNoGoItems = [
  { id: "gng_sueno",      label: "Dormí 7h o más",                       group: "ESTADO PERSONAL" },
  { id: "gng_calma",      label: "Estoy calmado (sin ansiedad)",          group: "ESTADO PERSONAL" },
  { id: "gng_prisa",      label: "No tengo prisa por operar",             group: "ESTADO PERSONAL" },
  { id: "gng_traders",    label: "No he visto otros traders hoy",         group: "ESTADO COGNITIVO" },
  { id: "gng_recuperar",  label: "No estoy buscando recuperar pérdidas",  group: "ESTADO COGNITIVO" },
  { id: "gng_analisis",   label: "Siguiendo MI análisis (no noticias)",   group: "ESTADO COGNITIVO" },
  { id: "gng_perder",     label: "Acepto perder el día sin problema",     group: "ESTADO DE CONTROL" },
  { id: "gng_nooperar",   label: "Puedo NO operar aunque haya oportunidad", group: "ESTADO DE CONTROL" },
];

const semaphoreOptions = [
  {
    id: "verde",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    label: "🟢 VERDE",
    sublabel: "OPERAR",
    description: "Mental estable · Sin FOMO · Sin urgencia · Sigues tu plan",
    action: "Puedes operar máx. 2 trades · Stops estrictos · Cierra después del 2do trade",
  },
  {
    id: "amarillo",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    label: "🟡 AMARILLO",
    sublabel: "OBSERVAR",
    description: "Ligeramente ansioso · Dormiste ok pero no óptimo · Presión por aprovechar el día",
    action: "NO operar · Solo mirar · Registra setups sin ejecutar",
  },
  {
    id: "rojo",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    label: "🔴 ROJO",
    sublabel: "PROHIBIDO",
    description: "Cansancio · FOMO fuerte · Ganas de recuperar · Acabas de romper reglas",
    action: "Cerrar plataforma · No mirar charts · 24h sin trading mínimo",
  },
];

const duranteSections = [
  {
    id: "ejecucion",
    title: "DURANTE EL TRADING",
    icon: "⚔️",
    color: "#818cf8",
    items: [
      { id: "confirmacion",  label: "Esperar confirmación completa — NO anticipar", warn: true },
      { id: "respirar",      label: "Respirar antes de entrar",                      warn: false },
      { id: "no_perseguir",  label: "No perseguir velas",                            warn: true },
      { id: "no_improvisar", label: "No improvisar",                                 warn: true },
      { id: "max_trades",    label: "Máximo 2 trades al día",                        warn: true },
      { id: "riesgo_fijo",   label: "Riesgo fijo — NO aumentar por emociones",       warn: true },
      { id: "pregunta_post", label: "¿Disciplina o tensión emocional? (post-trade)", warn: false },
    ],
  },
  {
    id: "reglas",
    title: "REGLAS ABSOLUTAS",
    icon: "⛔",
    color: "#fb923c",
    items: [
      { id: "no_revenge",        label: "NO revenge trading",                    warn: true },
      { id: "no_riesgo_perdida", label: "NO aumentar riesgo tras pérdida",       warn: true },
      { id: "no_aburrimiento",   label: "NO operar por aburrimiento",            warn: true },
      { id: "no_dinero",         label: "NO mirar dinero constantemente",        warn: true },
    ],
  },
  {
    id: "postmarket",
    title: "POST-MARKET",
    icon: "📓",
    color: "#34d399",
    items: [
      { id: "cerrar_plataforma", label: "Cerrar plataforma al terminar",          warn: false },
      { id: "journal_sistema",   label: "Journal: ¿Seguí mi sistema?",            warn: false },
      { id: "journal_senti",     label: "Journal: ¿Qué sentí?",                   warn: false },
      { id: "journal_detonó",    label: "Journal: ¿Qué detonó emociones?",        warn: false },
      { id: "journal_bien",      label: "Journal: ¿Qué hice bien?",               warn: false },
      { id: "evaluar_ejecucion", label: "Evaluar ejecución — NO resultado",       warn: false },
      { id: "desconectar",       label: "Desconectarme del mercado",              warn: false },
    ],
  },
];

const identityPrinciples = [
  "No soy un apostador. Soy un ejecutor profesional.",
  "El mercado recompensa paciencia y destruye urgencia.",
  "Mi ventaja está en la consistencia emocional.",
  "Los retiros son consecuencia de ejecutar bien repetidamente.",
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function TraderProtocol() {
  const [tab, setTab]                   = useState("premarket");
  const [checks, setChecks]             = useState({});
  const [mindsetChecks, setMindsetChecks] = useState({});
  const [goNoGo, setGoNoGo]             = useState({});
  const [semaphore, setSemaphore]       = useState(null);
  const [todayKey]                      = useState(getTodayKey());
  const [mantraVisible, setMantraVisible] = useState(false);
  const [streak, setStreak]             = useState(0);
  const [identityIndex, setIdentityIndex] = useState(0);

  useEffect(() => {
    const raw  = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = data[todayKey] || {};
    setChecks(today.premarket  || {});
    setMindsetChecks(today.mindset || {});
    setGoNoGo(today.gonogo    || {});
    setSemaphore(today.semaphore || null);

    let s = 0, d = new Date();
    while (true) {
      d.setDate(d.getDate() - 1);
      const k = d.toISOString().split("T")[0];
      const dd = data[k];
      if (!dd) break;
      const all = premarketSections.flatMap(sec => sec.items);
      if (all.every(it => dd.premarket?.[it.id])) s++; else break;
    }
    setStreak(s);
  }, [todayKey]);

  useEffect(() => {
    const t = setInterval(() => setIdentityIndex(i => (i + 1) % identityPrinciples.length), 8000);
    return () => clearInterval(t);
  }, []);

  const save = (pm, ms, gng, sem) => {
    const raw  = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[todayKey] = { premarket: pm, mindset: ms, gonogo: gng, semaphore: sem };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setChecks(pm); setMindsetChecks(ms); setGoNoGo(gng); setSemaphore(sem);
  };

  const togglePre     = id => save({ ...checks, [id]: !checks[id] }, mindsetChecks, goNoGo, semaphore);
  const toggleMindset = id => save(checks, { ...mindsetChecks, [id]: !mindsetChecks[id] }, goNoGo, semaphore);
  const toggleGoNoGo  = id => save(checks, mindsetChecks, { ...goNoGo, [id]: !goNoGo[id] }, semaphore);
  const pickSemaphore = id => save(checks, mindsetChecks, goNoGo, semaphore === id ? null : id);
  const resetDay      = () => { save({}, {}, {}, null); setMantraVisible(false); };

  // Pre-market progress
  const allPre       = premarketSections.flatMap(s => s.items);
  const donePre      = allPre.filter(it => checks[it.id]).length;
  const progressPre  = Math.round((donePre / allPre.length) * 100);
  const criticalDone = premarketSections.flatMap(s => s.items).filter(it => it.critical).every(it => checks[it.id]);
  const pColor       = progressPre < 40 ? "#ef4444" : progressPre < 75 ? "#f59e0b" : "#22c55e";

  // Mindset progress
  const allMind      = duranteSections.flatMap(s => s.items);
  const doneMind     = allMind.filter(it => mindsetChecks[it.id]).length;
  const progressMind = Math.round((doneMind / allMind.length) * 100);

  // GO / NO GO
  const gngFails     = goNoGoItems.filter(it => !goNoGo[it.id]);
  const gngGo        = gngFails.length === 0;
  const gngGroups    = [...new Set(goNoGoItems.map(it => it.group))];

  const dateStr = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={st.root}>
      <div style={st.gridBg} />

      {/* HEADER */}
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

      {/* TABS */}
      <div style={st.tabBar}>
        <button onClick={() => setTab("premarket")}
          style={{ ...st.tabBtn, ...(tab === "premarket" ? st.tabBtnActive : {}) }}>
          ◎ PRE-MARKET
          <span style={{ ...st.tabBadge, background: tab === "premarket" ? pColor : "#1e293b", color: tab === "premarket" ? "#080c10" : "#475569" }}>
            {progressPre}%
          </span>
        </button>
        <button onClick={() => setTab("mindset")}
          style={{ ...st.tabBtn, ...(tab === "mindset" ? st.tabBtnActiveMindset : {}) }}>
          ◉ MINDSET
          <span style={{ ...st.tabBadge, background: tab === "mindset" ? "#818cf8" : "#1e293b", color: tab === "mindset" ? "#080c10" : "#475569" }}>
            {progressMind}%
          </span>
        </button>
      </div>

      {/* ══════════ TAB 1: PRE-MARKET ══════════ */}
      {tab === "premarket" && (
        <div style={st.tabContent}>
          <div style={st.progressSection}>
            <div style={st.progressHeader}>
              <span style={st.progressLabel}>EJECUCIÓN DEL DÍA</span>
              <span style={{ ...st.progressPct, color: pColor }}>{progressPre}%</span>
            </div>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressFill, width: `${progressPre}%`, background: pColor, boxShadow: `0 0 12px ${pColor}80` }} />
            </div>
            <div style={st.progressSub}>
              {donePre}/{allPre.length} elementos · {criticalDone ? "✓ Críticos completos" : "⚠ Críticos pendientes"}
            </div>
          </div>

          <div style={st.sections}>
            {premarketSections.map(section => {
              const secDone = section.items.filter(it => checks[it.id]).length;
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
                    {section.items.map(item => {
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

          {/* Versículo */}
          <div style={st.mantraCard} onClick={() => setMantraVisible(!mantraVisible)}>
            <div style={st.mantraHeader}>
              <span style={st.mantraIcon}>✦</span>
              <span style={st.mantraTitle}>RECORDATORIO MENTAL</span>
              <span style={st.mantraToggle}>{mantraVisible ? "▲" : "▼"}</span>
            </div>
            {mantraVisible && (
              <div style={st.mantraText}>
                <div style={st.versiculoText}>"{VERSICULO.text}"</div>
                <div style={st.versiculoRef}>— {VERSICULO.ref}</div>
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

      {/* ══════════ TAB 2: MINDSET ══════════ */}
      {tab === "mindset" && (
        <div style={st.tabContent}>

          {/* Axiom */}
          <div style={st.axiomHero}>
            <div style={st.axiomLine} />
            <div style={st.axiomText}>{AXIOM}</div>
            <div style={st.axiomLine} />
          </div>

          {/* ── GO / NO GO ── */}
          <div style={st.sectionBlock}>
            <div style={st.sectionBlockHeader}>
              <span style={st.sectionBlockIcon}>⚡</span>
              <div>
                <div style={st.sectionBlockTitle}>GO / NO GO</div>
                <div style={st.sectionBlockSub}>Evalúa antes de abrir gráficos · 1 ✘ = NO trading</div>
              </div>
              <div style={{
                ...st.gngBadge,
                background: gngGo ? "rgba(34,197,94,0.12)" : gngFails.length <= 2 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${gngGo ? "rgba(34,197,94,0.3)" : gngFails.length <= 2 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: gngGo ? "#22c55e" : gngFails.length <= 2 ? "#f59e0b" : "#ef4444",
              }}>
                {gngGo ? "GO ✔" : `NO GO (${gngFails.length}✘)`}
              </div>
            </div>

            {gngGroups.map(group => (
              <div key={group} style={st.gngGroup}>
                <div style={st.gngGroupLabel}>{group}</div>
                {goNoGoItems.filter(it => it.group === group).map(item => {
                  const ok = !!goNoGo[item.id];
                  return (
                    <button key={item.id} onClick={() => toggleGoNoGo(item.id)}
                      style={{ ...st.gngItem, ...(ok ? st.gngItemOk : st.gngItemFail) }}>
                      <span style={{ ...st.gngBox, ...(ok ? st.gngBoxOk : st.gngBoxFail) }}>
                        {ok ? "✔" : "✘"}
                      </span>
                      <span style={{ ...st.itemLabel, color: ok ? "#64748b" : "#94a3b8", ...(ok ? { textDecoration: "line-through" } : {}) }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}

            <div style={st.gngRule}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>Si hay 1 ✘ → NO trading</span>
              {"  ·  "}
              <span style={{ color: "#22c55e" }}>Todo ✔ → máx. 2 trades</span>
            </div>
          </div>

          {/* ── SEMÁFORO ── */}
          <div style={st.sectionBlock}>
            <div style={{ ...st.sectionBlockHeader, marginBottom: 12 }}>
              <span style={st.sectionBlockIcon}>🚦</span>
              <div>
                <div style={st.sectionBlockTitle}>SEMÁFORO PSICOLÓGICO</div>
                <div style={st.sectionBlockSub}>¿En qué estado estás ahora mismo?</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {semaphoreOptions.map(opt => {
                const active = semaphore === opt.id;
                return (
                  <button key={opt.id} onClick={() => pickSemaphore(opt.id)}
                    style={{
                      ...st.semCard,
                      background: active ? opt.bg : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active ? opt.border : "rgba(255,255,255,0.04)"}`,
                      boxShadow: active ? `0 0 16px ${opt.color}20` : "none",
                    }}>
                    <div style={st.semTop}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ ...st.semLabel, color: opt.color }}>{opt.label}</span>
                        <span style={{ ...st.semSublabel, color: opt.color }}>{opt.sublabel}</span>
                      </div>
                      <div style={{ ...st.semDot, background: active ? opt.color : "#1e293b", boxShadow: active ? `0 0 8px ${opt.color}` : "none" }} />
                    </div>
                    {active && (
                      <>
                        <div style={{ ...st.semDesc, color: "#94a3b8" }}>{opt.description}</div>
                        <div style={{ ...st.semAction, color: opt.color, borderTop: `1px solid ${opt.border}` }}>
                          → {opt.action}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Identity ticker */}
          <div style={st.identityTicker}>
            <span style={st.identityLabel}>IDENTIDAD ·</span>
            <span style={st.identityText}>{identityPrinciples[identityIndex]}</span>
          </div>

          {/* Mindset progress */}
          <div style={{ ...st.progressSection, paddingTop: 16 }}>
            <div style={st.progressHeader}>
              <span style={st.progressLabel}>REVISIÓN DE SESIÓN</span>
              <span style={{ ...st.progressPct, color: "#818cf8" }}>{progressMind}%</span>
            </div>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressFill, width: `${progressMind}%`, background: "#818cf8", boxShadow: "0 0 12px #818cf880" }} />
            </div>
            <div style={st.progressSub}>{doneMind}/{allMind.length} elementos revisados</div>
          </div>

          {/* Durante / Reglas / Post */}
          <div style={st.sections}>
            {duranteSections.map(section => {
              const secDone = section.items.filter(it => mindsetChecks[it.id]).length;
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
                    {section.items.map(item => {
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

          {/* Identity card */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.08em" }}>El día NO importa. </span>
              <span style={{ fontSize: 12, color: "#818cf8", letterSpacing: "0.08em" }}>La muestra estadística sí.</span>
            </div>
          </div>

        </div>
      )}

      <div style={st.bottomBar}>
        <div style={{ ...st.bottomDot, background: tab === "premarket" ? pColor : "#1e293b" }} />
        <div style={{ ...st.bottomDot, background: tab === "mindset" ? "#818cf8" : "#1e293b" }} />
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const st = {
  root:            { minHeight: "100vh", background: "#080c10", color: "#e2e8f0", fontFamily: "'IBM Plex Mono','Courier New',monospace", paddingBottom: 80, position: "relative", overflowX: "hidden" },
  gridBg:          { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  header:          { position: "sticky", top: 0, zIndex: 10, background: "rgba(8,12,16,0.96)", borderBottom: "1px solid rgba(34,197,94,0.12)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)" },
  headerLeft:      { display: "flex", alignItems: "center", gap: 12 },
  logo:            { fontSize: 26, color: "#22c55e", lineHeight: 1 },
  appTitle:        { fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#22c55e" },
  dateStr:         { fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "capitalize", marginTop: 2 },
  headerRight:     { display: "flex", alignItems: "center", gap: 10 },
  streakBadge:     { fontSize: 11, background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c", padding: "4px 10px", borderRadius: 4, letterSpacing: "0.05em" },
  resetBtn:        { fontSize: 10, letterSpacing: "0.15em", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" },
  tabBar:          { position: "sticky", top: 53, zIndex: 9, display: "flex", background: "rgba(8,12,16,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 16px", gap: 4 },
  tabBtn:          { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#475569", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" },
  tabBtnActive:    { color: "#22c55e", borderBottom: "2px solid #22c55e" },
  tabBtnActiveMindset: { color: "#818cf8", borderBottom: "2px solid #818cf8" },
  tabBadge:        { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.05em", transition: "all 0.3s ease" },
  tabContent:      { position: "relative", zIndex: 1 },
  progressSection: { padding: "20px 20px 0" },
  progressHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progressLabel:   { fontSize: 10, letterSpacing: "0.2em", color: "#64748b" },
  progressPct:     { fontSize: 20, fontWeight: 700, letterSpacing: "0.05em" },
  progressTrack:   { height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" },
  progressFill:    { height: "100%", borderRadius: 2, transition: "width 0.4s ease" },
  progressSub:     { marginTop: 8, fontSize: 10, color: "#475569", letterSpacing: "0.08em" },
  sections:        { padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 },
  card:            { background: "rgba(15,23,30,0.9)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 8, padding: "14px", backdropFilter: "blur(4px)" },
  cardHeader:      { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  cardIcon:        { fontSize: 16 },
  cardTitleBlock:  { flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle:       { fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8" },
  cardCount:       { fontSize: 10, color: "#475569" },
  itemList:        { display: "flex", flexDirection: "column", gap: 5 },
  item:            { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 5, padding: "9px 11px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s ease", width: "100%" },
  itemDone:        { background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" },
  checkbox:        { width: 17, height: 17, border: "1.5px solid #334155", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#22c55e", flexShrink: 0, transition: "all 0.15s ease" },
  checkboxDone:    { background: "#22c55e", borderColor: "#22c55e", color: "#080c10", fontWeight: 700 },
  itemLabel:       { fontSize: 11, color: "#94a3b8", flex: 1, letterSpacing: "0.03em", transition: "color 0.15s ease" },
  itemLabelDone:   { color: "#334155", textDecoration: "line-through" },
  criticalDot:     { width: 5, height: 5, borderRadius: "50%", background: "#ef4444", flexShrink: 0, boxShadow: "0 0 6px #ef4444" },
  mantraCard:      { position: "relative", zIndex: 1, margin: "14px 16px 0", background: "rgba(15,23,30,0.9)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: 8, padding: "12px 14px", cursor: "pointer" },
  mantraHeader:    { display: "flex", alignItems: "center", gap: 10 },
  mantraIcon:      { color: "#fbbf24", fontSize: 13 },
  mantraTitle:     { flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#fbbf24" },
  mantraToggle:    { fontSize: 10, color: "#64748b" },
  mantraText:      { marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(251,191,36,0.08)" },
  versiculoText:   { fontSize: 12, color: "#e2e8f0", fontStyle: "italic", letterSpacing: "0.03em", lineHeight: 1.7 },
  versiculoRef:    { fontSize: 11, color: "#fbbf24", fontWeight: 700, letterSpacing: "0.1em", marginTop: 8 },
  doneBanner:      { position: "relative", zIndex: 1, margin: "14px 16px 0", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, padding: "14px", display: "flex", alignItems: "flex-start", gap: 12 },
  doneIcon:        { fontSize: 24, color: "#22c55e", lineHeight: 1, flexShrink: 0 },
  doneTitle:       { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#22c55e", marginBottom: 4 },
  doneSub:         { fontSize: 11, color: "#64748b", letterSpacing: "0.03em", lineHeight: 1.6 },
  axiomHero:       { margin: "20px 16px 0", display: "flex", alignItems: "center", gap: 12 },
  axiomLine:       { flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(129,140,248,0.3),transparent)" },
  axiomText:       { fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textAlign: "center", whiteSpace: "nowrap" },
  sectionBlock:    { margin: "16px 16px 0", background: "rgba(15,23,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "14px" },
  sectionBlockHeader: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  sectionBlockIcon:{ fontSize: 16, flexShrink: 0, marginTop: 2 },
  sectionBlockTitle:{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#94a3b8" },
  sectionBlockSub: { fontSize: 9, color: "#475569", letterSpacing: "0.08em", marginTop: 2 },
  gngBadge:        { marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.05em", flexShrink: 0 },
  gngGroup:        { marginBottom: 10 },
  gngGroupLabel:   { fontSize: 9, color: "#475569", letterSpacing: "0.18em", marginBottom: 6, paddingLeft: 2 },
  gngItem:         { display: "flex", alignItems: "center", gap: 10, borderRadius: 5, padding: "8px 10px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%", marginBottom: 4, transition: "all 0.15s ease", border: "1px solid transparent" },
  gngItemOk:       { background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.1)" },
  gngItemFail:     { background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" },
  gngBox:          { width: 17, height: 17, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, transition: "all 0.15s ease" },
  gngBoxOk:        { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" },
  gngBoxFail:      { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
  gngRule:         { marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 10, letterSpacing: "0.06em", color: "#64748b", textAlign: "center" },
  semCard:         { borderRadius: 7, padding: "12px 14px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%", transition: "all 0.2s ease" },
  semTop:          { display: "flex", justifyContent: "space-between", alignItems: "center" },
  semLabel:        { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" },
  semSublabel:     { fontSize: 9, letterSpacing: "0.15em", opacity: 0.7 },
  semDot:          { width: 10, height: 10, borderRadius: "50%", transition: "all 0.2s ease" },
  semDesc:         { fontSize: 10, letterSpacing: "0.03em", lineHeight: 1.6, marginTop: 10 },
  semAction:       { fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginTop: 10, paddingTop: 10, lineHeight: 1.6 },
  identityTicker:  { margin: "14px 16px 0", padding: "8px 12px", background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.1)", borderRadius: 5, display: "flex", gap: 8, alignItems: "flex-start", minHeight: 40 },
  identityLabel:   { fontSize: 9, color: "#818cf8", letterSpacing: "0.15em", flexShrink: 0, paddingTop: 1 },
  identityText:    { fontSize: 11, color: "#94a3b8", letterSpacing: "0.04em", lineHeight: 1.5 },
  identityCard:    { margin: "14px 16px 0", background: "rgba(15,23,30,0.9)", border: "1px solid rgba(129,140,248,0.12)", borderRadius: 8, padding: "16px" },
  identityCardHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  identityCardTitle:  { fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#818cf8" },
  bottomBar:       { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 20 },
  bottomDot:       { width: 6, height: 6, borderRadius: "50%", transition: "background 0.3s ease" },
};
